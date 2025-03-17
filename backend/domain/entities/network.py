from typing import List


class Node:
    """Network node entity"""

    def __init__(
            self,
            node_id: str,
            messages: int = 0,
            degree: float = 0.0,
            betweenness: float = 0.0,
            closeness: float = 0.0,
            eigenvector: float = 0.0,
            pagerank: float = 0.0
    ):
        self.id = node_id
        self.messages = messages
        self.degree = degree
        self.betweenness = betweenness
        self.closeness = closeness
        self.eigenvector = eigenvector
        self.pagerank = pagerank


class Link:
    """Network link entity"""

    def __init__(
            self,
            source: str,
            target: str,
            weight: int = 1
    ):
        self.source = source
        self.target = target
        self.weight = weight


class NetworkGraph:
    """Network graph entity"""

    def __init__(
            self,
            nodes: List[Node],
            links: List[Link]
    ):
        self.nodes = nodes
        self.links = links