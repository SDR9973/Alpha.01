// src/pages/Home.tsx
import React, { useState, useRef, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Container,
  Row,
  Col,
  Form,
  Table,
  Button,
  Card,
} from "react-bootstrap";
import {
  Upload,
  Save,
  Trash,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "react-bootstrap-icons";
import { ForceGraph2D, ForceGraphInstance } from "react-force-graph";
import "./Home.css";
// Import custom styles
import { AlertBox, GraphContainer } from "./Form.style";
import AnonymizationToggle from "../components/AnonymizationToggle";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  uploadFile,
  deleteFile,
  analyzeNetwork
} from "../redux/file/fileSlice";
import {
  setResearchFormData,
  saveResearch
} from "../redux/research/researchSlice";
import {
  setNetworkFilter,
  toggleStrongConnections,
  setSelectedMetric
} from "../redux/network/networkSlice";
import {
  toggleFilters,
  toggleMetrics,
  toggleNetworkStats
} from "../redux/ui/uiSlice";
import { NetworkNodeResponse, NetworkLinkResponse } from "../types/api";
import { AnalysisParams } from "../types/state";

const Home: React.FC = () => {
  const dispatch = useAppDispatch();

  // Select from Redux store
  const { uploadedFile} = useAppSelector(state => state.file);
  const { networkData, selectedMetric, strongConnectionsActive } = useAppSelector(state => state.network);
  const { showFilters, showMetrics, showNetworkStats } = useAppSelector(state => state.ui);
  const { currentResearch } = useAppSelector(state => state.research);

  // Local component state (consider moving these to Redux too)
  const [message, setMessage] = useState<string>("");
  const [filter, setFilter] = useState<string>("");
  const [showDensity, setShowDensity] = useState<boolean>(false);
  const [densityValue, setDensityValue] = useState<number>(0);
  const [showDiameter, setShowDiameter] = useState<boolean>(false);
  const [diameterValue, setDiameterValue] = useState<number>(0);
  const [networkStats, setNetworkStats] = useState<{
    numNodes: number;
    numEdges: number;
    reciprocity: string;
    inDegreeMap: Record<string, number>;
    outDegreeMap: Record<string, number>;
  }>({
    numNodes: 0,
    numEdges: 0,
    reciprocity: "0",
    inDegreeMap: {},
    outDegreeMap: {},
  });

  // Form state (consider consolidating in Redux)
  const [name, setName] = useState<string>(currentResearch.name || "");
  const [description, setDescription] = useState<string>(currentResearch.description || "");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [messageLimit, setMessageLimit] = useState<number>(50);
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [limitType, setLimitType] = useState<string>("first");
  const [minMessageLength, setMinMessageLength] = useState<number>(10);
  const [maxMessageLength, setMaxMessageLength] = useState<number>(100);
  const [keywords, setKeywords] = useState<string>("");
  const [usernameFilter, setUsernameFilter] = useState<string>("");
  const [minMessages, setMinMessages] = useState<string>("");
  const [maxMessages, setMaxMessages] = useState<string>("");
  const [activeUsers, setActiveUsers] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string>("");
  const [isAnonymized, setIsAnonymized] = useState<boolean>(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const forceGraphRef = useRef<ForceGraphInstance | null>(null);
  const [inputKey, setInputKey] = useState<number>(Date.now());

  const graphMetrics = [
    "Degree Centrality",
    "Betweenness Centrality",
    "Closeness Centrality",
    "Eigenvector Centrality",
    "PageRank Centrality",
    "Density",
    "Diameter",
  ];

  useEffect(() => {
    if (!uploadedFile) {
      resetFormState();
    }
    if (networkData) {
      calculateNetworkStats();
    }
  }, [uploadedFile, showMetrics, networkData]);

  const resetFormState = () => {
    setName("");
    setDescription("");
    setFilter("");
    setStartDate("");
    setEndDate("");
    setMessageLimit(50);
    setKeywords("");
    setInputKey(Date.now());
    if (forceGraphRef.current) {
      forceGraphRef.current.zoomToFit(400, 100);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    // Dispatch to Redux thunk
    dispatch(uploadFile(selectedFile))
      .unwrap()
      .then(() => {
        setMessage("File uploaded successfully!");
      })
      .catch((error: string) => {
        setMessage(`Error: ${error}`);
      });
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleInputChange = <T extends unknown>(
    setter: React.Dispatch<React.SetStateAction<T>>
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value as unknown as T);
  };

  const handleDelete = async () => {
    if (!uploadedFile) {
      setMessage("No file selected to delete.");
      return;
    }

    dispatch(deleteFile(uploadedFile))
      .unwrap()
      .then(() => {
        setMessage("File deleted successfully!");
        resetFormState();
      })
      .catch((error: string) => {
        setMessage(`Error: ${error}`);
      });
  };

  const formatTime = (time: string): string => {
    return time && time.length === 5 ? `${time}:00` : time;
  };

  const handleNetworkAnalysis = () => {
    if (!uploadedFile) {
      setMessage("No file uploaded yet.");
      return;
    }

    const params: AnalysisParams = {
      startDate,
      endDate,
      startTime: formatTime(startTime),
      endTime: formatTime(endTime),
      messageLimit,
      limitType: limitType as 'first' | 'last' | 'all',
      minMessageLength,
      maxMessageLength,
      keywords,
      usernameFilter,
      minMessages,
      maxMessages,
      activeUsers,
      selectedUsers,
      isAnonymized
    };

    dispatch(analyzeNetwork({ filename: uploadedFile, params }))
      .unwrap()
      .then(() => {
        setMessage("Network analysis completed!");
      })
      .catch((error: string) => {
        setMessage(`Error: ${error}`);
      });
  };

  const handleSaveToDB = () => {
    if (!name || !description) {
      setMessage("Please fill in all required fields.");
      return;
    }

    const researchData = {
      name,
      description,
      startDate,
      endDate,
      messageLimit,
      fileName: uploadedFile || "",
      anonymize: isAnonymized
    };

    dispatch(saveResearch(researchData))
      .unwrap()
      .then(() => {
        setMessage("Research saved successfully!");
      })
      .catch((error: string) => {
        setMessage(`Error: ${error}`);
      });
  };

  const calculateNetworkStats = () => {
    if (!networkData) return;

    const { nodes, links } = networkData;
    const numNodes = nodes.length;
    const numEdges = links.length;
    const inDegreeMap: Record<string, number> = {};
    const outDegreeMap: Record<string, number> = {};
    let reciprocalEdges = 0;

    links.forEach((link) => {
      const target = typeof link.target === 'string' ? link.target : link.target.id;
      const source = typeof link.source === 'string' ? link.source : link.source.id;

      inDegreeMap[target] = (inDegreeMap[target] || 0) + 1;
      outDegreeMap[source] = (outDegreeMap[source] || 0) + 1;

      // Check for reciprocal edges
      const hasReciprocal = links.some((l) => {
        const lSource = typeof l.source === 'string' ? l.source : l.source.id;
        const lTarget = typeof l.target === 'string' ? l.target : l.target.id;
        return lSource === target && lTarget === source;
      });

      if (hasReciprocal) {
        reciprocalEdges++;
      }
    });

    const reciprocity = numEdges > 0 ? (reciprocalEdges / numEdges).toFixed(2) : "0";

    setNetworkStats({
      numNodes,
      numEdges,
      reciprocity,
      inDegreeMap,
      outDegreeMap,
    });
  };

  const handleToggleMetric = (metric: string) => {
    dispatch(setSelectedMetric(selectedMetric === metric ? null : metric));

    if (metric === "Density") {
      handleDensityMetric();
    }

    if (metric === "Diameter") {
      handleDiameterMetric();
    }
  };

  const handleDensityMetric = () => {
    if (!networkData) return;

    const density = calculateDensity(networkData.nodes, networkData.links);
    setDensityValue(density);
    setShowDensity(!showDensity);
  };

  const calculateDensity = (
    nodes: NetworkNodeResponse[],
    links: NetworkLinkResponse[]
  ): number => {
    const n = nodes.length;
    const m = links.length;
    if (n < 2) return 0;
    return (2 * m) / (n * (n - 1));
  };

  const calculateDiameter = (
    nodes: NetworkNodeResponse[],
    links: NetworkLinkResponse[]
  ): number => {
    if (nodes.length < 2) return 0;

    const distances: Record<string, Record<string, number>> = {};
    nodes.forEach((node) => {
      distances[node.id] = {};
      nodes.forEach(
        (n) => (distances[node.id][n.id] = node.id === n.id ? 0 : Infinity)
      );
    });

    // Convert links to ensure we're working with string IDs
    const normalizedLinks = links.map(link => ({
      source: typeof link.source === 'string' ? link.source : link.source.id,
      target: typeof link.target === 'string' ? link.target : link.target.id,
      weight: link.weight
    }));

    normalizedLinks.forEach((link) => {
      distances[link.source][link.target] = 1;
      distances[link.target][link.source] = 1; // Assuming undirected graph
    });

    // Floyd-Warshall algorithm
    nodes.forEach((k) => {
      nodes.forEach((i) => {
        nodes.forEach((j) => {
          if (
            distances[i.id][j.id] >
            distances[i.id][k.id] + distances[k.id][j.id]
          ) {
            distances[i.id][j.id] =
              distances[i.id][k.id] + distances[k.id][j.id];
          }
        });
      });
    });

    let maxDistance = 0;
    nodes.forEach((i) => {
      nodes.forEach((j) => {
        if (distances[i.id][j.id] !== Infinity) {
          maxDistance = Math.max(maxDistance, distances[i.id][j.id]);
        }
      });
    });

    return maxDistance;
  };

  const handleDiameterMetric = () => {
    setShowDiameter(!showDiameter);
    if (!showDiameter && networkData) {
      const diameter = calculateDiameter(networkData.nodes, networkData.links);
      setDiameterValue(diameter);
    }
  };

  const handleStrongConnections = () => {
    dispatch(toggleStrongConnections());
  };

  // Filter nodes and links based on search criteria
  const filteredNodes = networkData
    ? networkData.nodes.filter((node) =>
        node.id.toLowerCase().includes(filter.toLowerCase())
      )
    : [];

  const filteredLinks = networkData
    ? networkData.links.filter((link) => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;

        return filteredNodes.some((node) => node.id === sourceId) &&
               filteredNodes.some((node) => node.id === targetId);
      })
    : [];

  return (
    <Container fluid className="upload-section">
      {/* Research Upload */}
      <Card className="research-card">
        <Form>
          <Row className="align-items-center justify-content-between">
            <Col>
              <h4 className="fw-bold">New Research</h4>
            </Col>
            <Col className="text-end">
              <Button className="action-btn me-2" onClick={handleSaveToDB}>
                <Save size={16} /> Save
              </Button>
              <Button onClick={handleDelete} className="action-btn delete-btn">
                <Trash size={16} /> Delete File
              </Button>
            </Col>
          </Row>
          <Row className="mt-3 align-items-center">
            <Col lg={8} md={12}>
              <Form.Group className="mb-3">
                <Form.Label className="research-label">
                  Research Name:
                </Form.Label>
                <Form.Control
                  type="text"
                  id="name"
                  value={name}
                  placeholder="Enter the name of your research"
                  onChange={(e) => setName(e.target.value)}
                  className="research-input"
                />
              </Form.Group>
              <Form.Group>
                <Form.Label className="research-label">Description:</Form.Label>
                <Form.Control
                  type="text"
                  id="description"
                  value={description}
                  placeholder="Enter a short description"
                  onChange={(e) => setDescription(e.target.value)}
                  className="research-input"
                />
              </Form.Group>
              <div>
                <AnonymizationToggle
                  isAnonymized={isAnonymized}
                  setIsAnonymized={setIsAnonymized}
                />
              </div>
            </Col>
            <Col
              lg={4}
              md={12}
              className="d-flex flex-column align-items-center mt-3 mt-lg-0"
            >
              <Button className="upload-btn" onClick={handleUploadClick}>
                <Upload size={16} /> Upload File
              </Button>
              <Form.Control
                type="file"
                accept=".txt"
                ref={fileInputRef}
                onChange={handleFileChange}
                key={inputKey}
                style={{ display: "none" }}
              />
              {message && (
                <AlertBox success={message.includes("successfully")}>
                  {message}
                </AlertBox>
              )}
            </Col>
          </Row>
        </Form>
      </Card>

      {/* Render the research filters and network visualization */}
      {uploadedFile && (
        <div>
          {/* Research Filters */}
          <Card className="research-card">
            <h4 className="fw-bold d-flex justify-content-between align-items-center">
              Research Filters
              <Button
                variant="link"
                className="toggle-btn"
                onClick={() => dispatch(toggleFilters())}
              >
                {showFilters ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </Button>
            </h4>
            {showFilters && (
              <div>
                {/* Date and time filters */}
                <Row className="mt-3">
                  <Col lg={4} md={4} className="mb-3">
                    <Form.Group>
                      <Form.Label className="research-label">
                        From Date:
                      </Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="research-input"
                      />
                    </Form.Group>
                  </Col>
                  {/* Additional filter inputs would be here */}
                </Row>

                {/* Apply filters button */}
                <Row className="align-items-center justify-content-between">
                  <Col>
                    <Button
                      onClick={handleNetworkAnalysis}
                      className="filter-btn"
                    >
                      Apply Filters
                    </Button>
                  </Col>
                </Row>
              </div>
            )}
          </Card>

          {/* Network visualization */}
          <Row className="mt-4">
            {/* Metrics panel */}
            <Col
              lg={3}
              md={12}
              className={`mb-3 metrics-panel ${
                showMetrics ? "open" : "closed"
              }`}
            >
              <Card className="metrics-card">
                <h4 className="fw-bold d-flex justify-content-between align-items-center">
                  {showMetrics && "Graph Metrics"}
                  <Button
                    variant="link"
                    className="metrics-toggle"
                    onClick={() => dispatch(toggleMetrics())}
                  >
                    {showMetrics ? (
                      <ChevronLeft size={20} />
                    ) : (
                      <ChevronRight size={20} />
                    )}
                  </Button>
                </h4>
                {showMetrics && (
                  <div className="mt-2">
                    {graphMetrics.map((metric) => (
                      <Button
                        key={metric}
                        className={`metrics-item ${
                          selectedMetric === metric ? "active" : ""
                        }`}
                        onClick={() => handleToggleMetric(metric)}
                      >
                        {metric}
                      </Button>
                    ))}

                    <Button
                      className={`metrics-item ${
                        strongConnectionsActive ? "active" : ""
                      }`}
                      onClick={handleStrongConnections}
                    >
                      {strongConnectionsActive
                        ? "Show All Connections"
                        : "Strongest Connections"}
                    </Button>
                  </div>
                )}
              </Card>

              {/* Network statistics */}
              <Card className="metrics-card">
                <h4 className="fw-bold d-flex justify-content-between align-items-center">
                  Network Metrics
                  <Button
                    variant="link"
                    onClick={() => dispatch(toggleNetworkStats())}
                  >
                    {showNetworkStats ? (
                      <ChevronUp size={20} />
                    ) : (
                      <ChevronDown size={20} />
                    )}
                  </Button>
                </h4>
                {showNetworkStats && (
                  <div className="mt-2">
                    <p>
                      <strong>Nodes:</strong> {networkStats.numNodes}
                    </p>
                    <p>
                      <strong>Edges:</strong> {networkStats.numEdges}
                    </p>
                    <p>
                      <strong>Reciprocity:</strong> {networkStats.reciprocity}
                    </p>
                    {/* Network statistics table */}
                  </div>
                )}
              </Card>
            </Col>

            {/* Graph display */}
            <Col lg={9} md={12} className="graph-area">
              {(showDensity || showDiameter) && (
                <Card className="density-card">
                  {showDensity && (
                    <h5 className="fw-bold">Graph Density: {densityValue.toFixed(4)}</h5>
                  )}
                  {showDiameter && (
                    <h5 className="fw-bold">
                      Graph Diameter: {diameterValue}
                    </h5>
                  )}
                </Card>
              )}

              <Card className="graph-card">
                <div className="graph-placeholder">
                  {networkData && (
                    <GraphContainer>
                      <ForceGraph2D
                        ref={forceGraphRef}
                        graphData={{
                          nodes: filteredNodes,
                          links: filteredLinks
                        }}
                        width={showMetrics ? 1200 : 1500}
                        height={500}
                        nodeAutoColorBy="id"
                        linkWidth={(link) => Math.sqrt(link.weight || 1)}
                        linkColor={() => "gray"}
                        nodeCanvasObject={(node, ctx, globalScale) => {
                          // Node rendering logic...
                          const fontSize = 12 / globalScale;
                          const radius = 10;
                          ctx.beginPath();
                          ctx.arc(node.x!, node.y!, radius, 0, 2 * Math.PI);
                          ctx.fill();

                          ctx.fillStyle = "black";
                          ctx.textAlign = "center";
                          ctx.textBaseline = "middle";
                          ctx.font = `${fontSize}px Sans-Serif`;
                          ctx.fillText(node.id, node.x!, node.y! + 15);
                        }}
                      />
                    </GraphContainer>
                  )}
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      )}
    </Container>
  );
};

export default Home;