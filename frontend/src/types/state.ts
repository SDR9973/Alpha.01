// src/types/state.ts
import {
  UserResponse,
  NetworkAnalysisResponse,
  ResearchResponse
} from './api';

export interface RootState {
  user: UserState;
  file: FileState;
  network: NetworkState;
  ui: UIState;
  research: ResearchState;
}

export interface UserState {
  currentUser: UserResponse | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export interface FileState {
  uploadedFile: string | null;
  files: string[];
  loading: boolean;
  error: string | null;
}

export interface NetworkState {
  networkData: NetworkAnalysisResponse | null;
  originalData: NetworkAnalysisResponse | null;
  analysisParams: AnalysisParams;
  selectedMetric: string | null;
  strongConnectionsActive: boolean;
  loading: boolean;
  error: string | null;
}

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

export interface UIState {
  showFilters: boolean;
  showMetrics: boolean;
  showNetworkStats: boolean;
  showDensity: boolean;
  showDiameter: boolean;
  sidebarOpen: boolean;
}

export interface ResearchState {
  researches: ResearchResponse[];
  currentResearch: ResearchFormData;
  loading: boolean;
  error: string | null;
}

export interface ResearchFormData {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  messageLimit: number;
  fileName: string;
  anonymize: boolean;
}