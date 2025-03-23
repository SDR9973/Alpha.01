// src/types/api.ts

/**
 * Standard API error response
 */
export interface ApiError {
  detail: string;
  status?: number;
}

/**
 * Authentication token response
 */
export interface TokenResponse {
  access_token: string;
  user: UserResponse;
  token_type: string;
}

/**
 * User profile data
 */
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

/**
 * Login credentials
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Registration data
 */
export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

/**
 * User profile update data
 */
export interface UserUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

/**
 * Network node data
 */
export interface NetworkNodeResponse {
  id: string;
  messages: number;
  degree: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  pagerank: number;
  [key: string]: any; // For dynamic properties
}

/**
 * Network link data
 */
export interface NetworkLinkResponse {
  source: string | {id: string; [key: string]: any};
  target: string | {id: string; [key: string]: any};
  weight: number;
}

/**
 * Complete network analysis data
 */
export interface NetworkAnalysisResponse {
  nodes: NetworkNodeResponse[];
  links: NetworkLinkResponse[];
}

/**
 * Research project data
 */
export interface ResearchResponse {
  id: string;
  name: string;
  description: string;
  user_id: string;
  created_at: string;
  start_date?: string;
  end_date?: string;
  message_limit?: number;
  file_name?: string;
  anonymized: boolean;
}

/**
 * File upload response
 */
export interface FileUploadResponse {
  filename: string;
  message: string;
}

/**
 * Response for file operations
 */
export interface FileOperationResponse {
  success: boolean;
  message: string;
}

/**
 * Wikipedia search result
 */
export interface WikipediaSearchResult {
  title: string;
  snippet: string;
  pageid?: number;
  wordcount?: number;
  size?: number;
  timestamp?: string;
}

/**
 * Wikipedia page content
 */
export interface WikipediaPage {
  title: string;
  content: string;
  error?: string;
}

/**
 * Thread creation response
 */
export interface WikipediaThreadResponse {
  thread_id: string;
  message: string;
}

/**
 * Message in a Wikipedia thread
 */
export interface WikipediaThreadMessage {
  message_id: number;
  thread_id: string;
  timestamp: string;
  sender: string;
  content: string;
}

/**
 * Thread metadata
 */
export interface WikipediaThread {
  thread_id: string;
  user_id: string;
  wikipedia_title: string;
  description: string;
  research_id?: string;
  messages?: WikipediaThreadMessage[];
}

/**
 * Summary statistics for network analysis
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
 * Avatar upload response
 */
export interface AvatarUploadResponse {
  avatarUrl: string;
  message?: string;
}

/**
 * Research creation/update form data
 */
export interface ResearchFormRequest {
  name: string;
  description: string;
  start_date?: string;
  end_date?: string;
  message_limit?: number;
  file_name?: string;
  anonymize?: boolean;
}