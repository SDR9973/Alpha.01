from collections import defaultdict
from datetime import datetime
from typing import Optional

import networkx as nx

from application.dtos.network_dto import NetworkAnalysisRequestDTO, NetworkGraphDTO, NodeDTO, LinkDTO
from domain.entities.network import Node, Link, NetworkGraph
from domain.repositories.file_repository import FileRepository


class NetworkService:
    """Application service for network analysis"""

    def __init__(self, storage_service: FileRepository):
        self.storage_service = storage_service

    async def analyze_network(self, filename: str, params: NetworkAnalysisRequestDTO) -> NetworkGraphDTO:
        """Analyze chat file and generate network graph"""
        # Get file content
        content_bytes = await self.storage_service.get_content(filename)
        if not content_bytes:
            raise ValueError(f"File {filename} not found")

        content = content_bytes.decode('utf-8')
        lines = content.splitlines()

        # Parse dates and times
        start_datetime = self._parse_datetime(params.start_date, params.start_time)
        end_datetime = self._parse_datetime(params.end_date, params.end_time)

        # Parse data from chat
        nodes = set()
        user_message_count = defaultdict(int)
        edges_counter = defaultdict(int)
        previous_sender = None
        anonymized_map = {}

        # Filter lines by date/time first
        filtered_lines = []
        for line in lines:
            if line.startswith("[") and "]" in line:
                date_part = line.split("] ")[0].strip("[]")
                try:
                    current_datetime = datetime.strptime(date_part, "%d.%m.%Y, %H:%M:%S")
                except ValueError:
                    continue

                if ((start_datetime and current_datetime >= start_datetime) or not start_datetime) and \
                        ((end_datetime and current_datetime <= end_datetime) or not end_datetime):
                    filtered_lines.append(line)

        # Apply message limit if specified
        if params.limit and params.limit_type == "first":
            selected_lines = filtered_lines[:params.limit]
        elif params.limit and params.limit_type == "last":
            selected_lines = filtered_lines[-params.limit:]
        else:
            selected_lines = filtered_lines

        # Parse selected lines
        keywords = params.keywords.split(",") if params.keywords else []
        selected_users = params.selected_users.split(",") if params.selected_users else []

        for line in selected_lines:
            if line.startswith("[") and "]" in line and ": " in line:
                _, message_part = line.split("] ", 1)
                parts = message_part.split(":", 1)
                sender = parts[0].strip("~").replace("\u202a", "").strip()
                message_content = parts[1].strip() if len(parts) > 1 else ""

                message_length = len(message_content)

                # Apply filters
                if (params.min_length and message_length < params.min_length) or \
                        (params.max_length and message_length > params.max_length):
                    continue

                if params.username and sender.lower() != params.username.lower():
                    continue

                if keywords and not any(kw in message_content.lower() for kw in keywords):
                    continue

                # Count messages per user
                user_message_count[sender] += 1

                if sender:
                    # Apply anonymization if needed
                    if params.anonymize:
                        if sender.startswith("\u202a+972") or sender.startswith("+972"):
                            anon_name = f"Phone_{len(anonymized_map) + 1}"
                        else:
                            anon_name = f"User_{len(anonymized_map) + 1}"

                        if sender not in anonymized_map:
                            anonymized_map[sender] = anon_name

                        sender = anonymized_map[sender]

                    # Add node and edge
                    nodes.add(sender)
                    if previous_sender and previous_sender != sender:
                        edge = tuple(sorted([previous_sender, sender]))
                        edges_counter[edge] += 1

                    previous_sender = sender

        # Filter users based on message count and active users
        filtered_users = user_message_count.copy()

        if params.min_messages:
            filtered_users = {user: count for user, count in filtered_users.items()
                              if count >= params.min_messages}

        if params.max_messages:
            filtered_users = {user: count for user, count in filtered_users.items()
                              if count <= params.max_messages}

        if params.active_users:
            sorted_users = sorted(filtered_users.items(), key=lambda x: x[1], reverse=True)[:params.active_users]
            filtered_users = dict(sorted_users)

        if selected_users:
            selected_lower = [u.lower() for u in selected_users]
            filtered_users = {user: count for user, count in filtered_users.items()
                              if user.lower() in selected_lower or
                              (params.anonymize and anonymized_map.get(user, "").lower() in selected_lower)}

        # Get final node list
        if params.anonymize:
            filtered_nodes = {anonymized_map.get(node, node) for node in filtered_users.keys()}
        else:
            filtered_nodes = set(filtered_users.keys())

        # Create NetworkX graph for computing metrics
        g = nx.Graph()
        g.add_nodes_from(filtered_nodes)

        # Create links
        links = []
        for (source, target), weight in edges_counter.items():
            anon_source = anonymized_map.get(source, source) if params.anonymize else source
            anon_target = anonymized_map.get(target, target) if params.anonymize else target

            if anon_source in filtered_nodes and anon_target in filtered_nodes:
                g.add_edge(anon_source, anon_target, weight=weight)
                links.append(Link(source=anon_source, target=anon_target, weight=weight))

        # Calculate metrics
        degree_centrality = nx.degree_centrality(g)
        betweenness_centrality = nx.betweenness_centrality(g, weight="weight", normalized=True)

        if nx.is_connected(g):
            closeness_centrality = nx.closeness_centrality(g)
            eigenvector_centrality = nx.eigenvector_centrality(g, max_iter=1000)
            pagerank_centrality = nx.pagerank(g, alpha=0.85)
        else:
            # For disconnected graphs, calculate metrics on the largest component
            largest_cc = max(nx.connected_components(g), key=len)
            g_subgraph = g.subgraph(nodes=[largest_cc]).copy()

            closeness_centrality = {}
            eigenvector_centrality = {}
            pagerank_centrality = {}

            # Calculate for the largest component
            sub_closeness = nx.closeness_centrality(g_subgraph)
            sub_eigenvector = nx.eigenvector_centrality(g_subgraph, max_iter=1000)
            sub_pagerank = nx.pagerank(g_subgraph, alpha=0.85)

            # Initialize all nodes with zero values
            for node in g.nodes():
                closeness_centrality[node] = 0.0
                eigenvector_centrality[node] = 0.0
                pagerank_centrality[node] = 0.0

            # Update with values from the largest component
            closeness_centrality.update(sub_closeness)
            eigenvector_centrality.update(sub_eigenvector)
            pagerank_centrality.update(sub_pagerank)

        # Create nodes with metrics
        nodes_list = []
        for node_id in filtered_nodes:
            nodes_list.append(Node(
                node_id=node_id,
                messages=user_message_count.get(node_id, 0),
                degree=round(degree_centrality.get(node_id, 0), 4),
                betweenness=round(betweenness_centrality.get(node_id, 0), 4),
                closeness=round(closeness_centrality.get(node_id, 0), 4),
                eigenvector=round(eigenvector_centrality.get(node_id, 0), 4),
                pagerank=round(pagerank_centrality.get(node_id, 0), 4)
            ))

        # Create network graph
        graph = NetworkGraph(nodes=nodes_list, links=links)

        # Convert to DTO
        return NetworkGraphDTO(
            nodes=[NodeDTO(
                id=node.id,
                messages=node.messages,
                degree=node.degree,
                betweenness=node.betweenness,
                closeness=node.closeness,
                eigenvector=node.eigenvector,
                pagerank=node.pagerank
            ) for node in nodes_list],
            links=[LinkDTO(
                source=link.source,
                target=link.target,
                weight=link.weight
            ) for link in graph.links]
        )

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
