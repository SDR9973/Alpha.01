from typing import Dict, Any, List, Optional
import networkx as nx
from datetime import datetime

from domain.entities.network import Node, Link, NetworkGraph
from domain.repositories.thread_repository import ThreadRepository
from application.dtos.network_dto import NetworkAnalysisRequestDTO, NetworkGraphDTO, NodeDTO, LinkDTO


class WikipediaNetworkService:
    """Service for analyzing Wikipedia thread networks"""

    def __init__(self, thread_repository: ThreadRepository):
        self.thread_repository = thread_repository

    async def analyze_wikipedia_thread(self, thread_id: str,
                                       params: Optional[NetworkAnalysisRequestDTO] = None) -> NetworkGraphDTO:
        """
        Analyze a Wikipedia discussion thread and generate a network graph

        Args:
            thread_id: ID of the Wikipedia thread to analyze
            params: Optional analysis parameters for filtering

        Returns:
            NetworkGraphDTO: Network graph representation of the thread
        """
        # Get thread data and messages
        thread = await self.thread_repository.get_thread_by_id(thread_id)
        if not thread:
            raise ValueError(f"Thread with ID {thread_id} not found")

        messages = await self.thread_repository.get_messages_by_thread_id(thread_id)

        # Filter messages based on parameters
        if params:
            messages = self._filter_messages(messages, params)

        # Build graph
        G = nx.Graph()
        sender_message_count = {}
        sender_connections = {}

        # Add nodes and track message counts
        for message in messages:
            sender = message.get("sender")
            if params and params.anonymize:
                # Apply anonymization if needed
                sender = f"User_{hash(sender) % 1000}"

            G.add_node(sender)
            sender_message_count[sender] = sender_message_count.get(sender, 0) + 1

        # Add edges based on message replies
        for i, message in enumerate(messages):
            if i > 0:
                current_sender = message.get("sender")
                if params and params.anonymize:
                    current_sender = f"User_{hash(current_sender) % 1000}"

                # Check previous messages to see if this is a reply
                # Simple heuristic: consider a message a reply to the previous message
                previous_sender = messages[i - 1].get("sender")
                if params and params.anonymize:
                    previous_sender = f"User_{hash(previous_sender) % 1000}"

                if current_sender != previous_sender:
                    # Create edge key (always sort to ensure undirected uniqueness)
                    edge = tuple(sorted([current_sender, previous_sender]))

                    # Increment edge weight
                    if edge in sender_connections:
                        sender_connections[edge] += 1
                    else:
                        sender_connections[edge] = 1

                    # Add or update edge in graph
                    G.add_edge(edge[0], edge[1], weight=sender_connections[edge])

        # Calculate network metrics
        degree_centrality = nx.degree_centrality(G)
        betweenness_centrality = nx.betweenness_centrality(G)
        closeness_centrality = nx.closeness_centrality(G)
        eigenvector_centrality = {}
        pagerank_centrality = {}

        try:
            eigenvector_centrality = nx.eigenvector_centrality(G)
            pagerank_centrality = nx.pagerank(G)
        except:
            # For small or disconnected graphs, these algorithms might not converge
            for node in G.nodes():
                eigenvector_centrality[node] = 0.0
                pagerank_centrality[node] = 0.0

        # Create network graph
        nodes = []
        for node_id in G.nodes():
            nodes.append(NodeDTO(
                id=node_id,
                messages=sender_message_count.get(node_id, 0),
                degree=round(degree_centrality.get(node_id, 0), 4),
                betweenness=round(betweenness_centrality.get(node_id, 0), 4),
                closeness=round(closeness_centrality.get(node_id, 0), 4),
                eigenvector=round(eigenvector_centrality.get(node_id, 0), 4),
                pagerank=round(pagerank_centrality.get(node_id, 0), 4)
            ))

        links = []
        for (source, target), weight in sender_connections.items():
            links.append(LinkDTO(
                source=source,
                target=target,
                weight=weight
            ))

        return NetworkGraphDTO(nodes=nodes, links=links)

    def _filter_messages(self, messages: List[Dict[str, Any]], params: NetworkAnalysisRequestDTO) -> List[
        Dict[str, Any]]:
        """Filter messages based on analysis parameters"""
        filtered_messages = []

        for message in messages:
            # Apply time filters if provided
            if params.start_date:
                message_timestamp = message.get("timestamp")
                start_datetime = self._parse_datetime(params.start_date, params.start_time)

                if start_datetime and message_timestamp < start_datetime:
                    continue

            if params.end_date:
                message_timestamp = message.get("timestamp")
                end_datetime = self._parse_datetime(params.end_date, params.end_time)

                if end_datetime and message_timestamp > end_datetime:
                    continue

            # Apply content filters
            if params.min_length or params.max_length:
                content = message.get("content", "")
                content_length = len(content)

                if params.min_length and content_length < params.min_length:
                    continue

                if params.max_length and content_length > params.max_length:
                    continue

            # Apply keyword filter
            if params.keywords:
                content = message.get("content", "").lower()
                keywords = [k.strip().lower() for k in params.keywords.split(",")]

                if not any(keyword in content for keyword in keywords):
                    continue

            # Apply username filter
            if params.username:
                sender = message.get("sender", "")
                if params.username.lower() not in sender.lower():
                    continue

            filtered_messages.append(message)

        # Apply limit if specified
        if params.limit:
            if params.limit_type == "first":
                filtered_messages = filtered_messages[:params.limit]
            elif params.limit_type == "last":
                filtered_messages = filtered_messages[-params.limit:]

        return filtered_messages

    def _parse_datetime(self, date: Optional[str], time: Optional[str]) -> Optional[datetime]:
        """Parse date and time strings into datetime object"""
        if not date:
            return None

        if time and len(time) == 5:
            time += ":00"
        elif not time:
            time = "00:00:00"

        try:
            return datetime.strptime(f"{date} {time}", "%Y-%m-%d %H:%M:%S")
        except ValueError:
            return None