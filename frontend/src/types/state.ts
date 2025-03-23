// src/types/state.ts
import {
  UserResponse,
  NetworkAnalysisResponse,
  ResearchResponse,
  WikipediaSearchResult,
  WikipediaPage,
  WikipediaThread
} from './api';

/**
 * Root state interface for the entire Redux store
 */
export interface RootState {
  user: UserState;
  file: FileState;
  network: NetworkState;
  ui: UIState;
  research: ResearchState;
  wikipedia: WikipediaState;
}

/**
 * User authentication and profile state
 */
export interface UserState {
  currentUser: UserResponse | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

/**
 * File upload and management state
 */
export interface FileState {
  uploadedFile: string | null;
  files: string[];
  loading: boolean;
  error: string | null;
}

/**
 * Network analysis state and parameters
 */
export interface NetworkState {
  networkData: NetworkAnalysisResponse | null;
  originalData: NetworkAnalysisResponse | null;
  analysisParams: AnalysisParams;
  selectedMetric: string | null;
  strongConnectionsActive: boolean;
  loading: boolean;
  error: string | null;
}

/**
 * Parameters for network analysis filtering
 */
export interface AnalysisParams {
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  messageLimit: number;
  limitType: 'first' | 'last' | 'all';
  minMessageLength: number;
  maxMessageLength: number;
  keywords: string;
  usernameFilter: string;
  minMessages: string;
  maxMessages: string;
  activeUsers: string;
  selectedUsers: string;
  isAnonymized: boolean;
}

/**
 * UI state for controlling components visibility
 */
export interface UIState {
  showFilters: boolean;
  showMetrics: boolean;
  showNetworkStats: boolean;
  showDensity: boolean;
  showDiameter: boolean;
  sidebarOpen: boolean;
}

/**
 * Research project data management
 */
export interface ResearchState {
  researches: ResearchResponse[];
  currentResearch: ResearchFormData;
  loading: boolean;
  error: string | null;
}

/**
 * Form data for creating/editing research projects
 */
export interface ResearchFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  messageLimit: number;
  fileName: string;
  anonymize: boolean;
}

/**
 * Wikipedia integration state
 */
export interface WikipediaState {
  searchResults: WikipediaSearchResult[];
  selectedPage: WikipediaPage | null;
  selectedTalkPage: WikipediaPage | null;
  threads: WikipediaThread[];
  currentThread: WikipediaThread | null;
  loading: boolean;
  error: string | null;
}

/**
 * Network metrics data
 */
export interface NetworkMetrics {
  density: number;
  diameter: number;
  reciprocity: number;
  nodeCount: number;
  edgeCount: number;
  topNodes: TopNodeData[];
}

/**
 * Data for nodes with highest centrality
 */
export interface TopNodeData {
  id: string;
  inDegree: number;
  outDegree: number;
  betweenness?: number;
  closeness?: number;
  eigenvector?: number;
  pagerank?: number;
}