// src/types/models.ts
/**
 * User model representing application user
 */
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: Date;
  isActive: boolean;
}

/**
 * Research project model
 */
export interface Research {
  id: string;
  name: string;
  description: string;
  userId: string;
  createdAt: Date;
  startDate?: string;
  endDate?: string;
  messageLimit?: number;
  fileName?: string;
  anonymized: boolean;
}

/**
 * Network graph model
 */
export interface NetworkGraph {
  nodes: Node[];
  links: Link[];
  statistics: NetworkStatistics;
}

/**
 * Node in network analysis
 */
export interface Node {
  id: string;
  messages: number;
  degree: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  pagerank: number;
  x?: number;
  y?: number;
  color?: string;
}

/**
 * Link in network analysis
 */
export interface Link {
  source: string | Node;
  target: string | Node;
  weight: number;
}

/**
 * Network statistics
 */
export interface NetworkStatistics {
  nodeCount: number;
  edgeCount: number;
  density: number;
  diameter: number;
  reciprocity: number;
  averageDegree: number;
  clusteringCoefficient: number;
}

/**
 * Message model
 */
export interface Message {
  id: string;
  threadId: string;
  timestamp: Date;
  sender: string;
  content: string;
}

/**
 * Thread model
 */
export interface Thread {
  id: string;
  userId: string;
  wikipediaTitle: string;
  description: string;
  uploadDate: Date;
  messages: Message[];
}

/**
 * Chat message from WhatsApp analysis
 */
export interface ChatMessage {
  timestamp: Date;
  sender: string;
  content: string;
  length: number;
}

/**
 * Research result containing analysis data
 */
export interface ResearchResult {
  id: string;
  researchId: string;
  createdAt: Date;
  networkGraph?: NetworkGraph;
  statistics?: NetworkStatistics;
  messageCount?: number;
  topContributors?: {sender: string; count: number}[];
  keywords?: {word: string; count: number}[];
}

/**
 * Report generation options
 */
export interface ReportOptions {
  includeGraphVisualization: boolean;
  includeStatistics: boolean;
  includeTopContributors: boolean;
  includeMessageTimeline: boolean;
  includeKeywordAnalysis: boolean;
  includeRecommendations: boolean;
  format: 'pdf' | 'html' | 'docx';
}

/**
 * Filter configuration for data analysis
 */
export interface FilterConfig {
  startDate?: Date;
  endDate?: Date;
  minMessageLength?: number;
  maxMessageLength?: number;
  keywords?: string[];
  participantFilter?: string[];
  messageCountMin?: number;
  messageCountMax?: number;
  includeOnlyTopUsers?: number;
}