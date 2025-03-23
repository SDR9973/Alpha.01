export interface ApiError {
  detail: string;
  status?: number;
}

export interface TokenResponse {
  access_token: string;
  user: UserResponse;
  token_type: string;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  created_at: string;
}

export interface NetworkNodeResponse {
  id: string;
  messages: number;
  degree: number;
  betweenness: number;
  closeness: number;
  eigenvector: number;
  pagerank: number;
}

export interface NetworkLinkResponse {
  source: string;
  target: string;
  weight: number;
}

export interface NetworkAnalysisResponse {
  nodes: NetworkNodeResponse[];
  links: NetworkLinkResponse[];
}

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