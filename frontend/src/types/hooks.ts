import { NetworkNodeResponse, NetworkLinkResponse, WikipediaPage } from './api';
import { AnalysisParams } from './state';

/**
 * Return type for useNetworkAnalysis hook
 */
export interface UseNetworkAnalysisReturn {
  networkData: {
    nodes: NetworkNodeResponse[];
    links: NetworkLinkResponse[];
  } | null;
  loading: boolean;
  error: string | null;
  analyzeNetwork: (filename: string, params: Partial<AnalysisParams>) => Promise<void>;
  resetNetworkData: () => void;
  calculateMetrics: () => NetworkMetrics | null;
  filterNodes: (searchTerm: string) => NetworkNodeResponse[];
  filterLinks: (nodes: NetworkNodeResponse[]) => NetworkLinkResponse[];
  toggleStrongConnections: () => void;
  strongConnectionsActive: boolean;
}

/**
 * Network metrics calculation result
 */
export interface NetworkMetrics {
  density: number;
  diameter: number;
  reciprocity: number;
  clusteringCoefficient: number;
  centralityDistribution: {
    betweenness: Record<string, number>;
    closeness: Record<string, number>;
    eigenvector: Record<string, number>;
    pagerank: Record<string, number>;
  };
  degreeCentrality: {
    inDegree: Record<string, number>;
    outDegree: Record<string, number>;
  };
  communities: number;
}

/**
 * Return type for useResearch hook
 */
export interface UseResearchReturn {
  currentResearch: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    messageLimit: number;
    fileName: string;
    anonymize: boolean;
  };
  loading: boolean;
  error: string | null;
  saveResearch: () => Promise<string | undefined>;
  updateResearchField: <K extends keyof UseResearchReturn['currentResearch']>(
    field: K,
    value: UseResearchReturn['currentResearch'][K]
  ) => void;
  resetResearch: () => void;
}

/**
 * Return type for useWikipedia hook
 */
export interface UseWikipediaReturn {
  searchResults: Array<{
    title: string;
    snippet: string;
  }>;
  selectedPage: WikipediaPage | null;
  selectedTalkPage: WikipediaPage | null;
  loading: boolean;
  error: string | null;
  searchWikipedia: (query: string) => Promise<void>;
  selectPage: (title: string) => Promise<void>;
  createThread: (title: string, description: string) => Promise<string | undefined>;
}

/**
 * Return type for useFileUpload hook
 */
export interface UseFileUploadReturn {
  uploadedFile: string | null;
  fileList: string[];
  uploading: boolean;
  error: string | null;
  uploadFile: (file: File) => Promise<string | undefined>;
  deleteFile: (filename: string) => Promise<boolean>;
  listFiles: () => Promise<void>;
}

/**
 * Return type for useAuth hook
 */
export interface UseAuthReturn {
  isAuthenticated: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  } | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  updateProfile: (data: { name?: string; email?: string; avatar?: File }) => Promise<boolean>;
}