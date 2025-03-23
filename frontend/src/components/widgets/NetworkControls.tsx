// src/components/NetworkControls.tsx
import React from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setAnalysisParam, analyzeNetwork } from '../../redux/network/networkSlice.ts';
import { AnalysisParams, RootState } from '../../types/state.ts';

interface NetworkControlsProps {
  filename: string | null;
}

const NetworkControls: React.FC<NetworkControlsProps> = ({ filename }) => {
  const dispatch = useDispatch();
  const { analysisParams, loading } = useSelector((state: RootState) => state.network);
  const { token } = useSelector((state: RootState) => state.user);

  const handleParamChange = (param: keyof AnalysisParams) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    let value: string | number | boolean = e.target.value;

    // Convert numeric values
    if (
      ['messageLimit', 'minMessageLength', 'maxMessageLength', 'minMessages', 'maxMessages', 'activeUsers']
        .includes(param) &&
      value !== ''
    ) {
      value = Number(value);
    }

    // Handle boolean for anonymized
    if (param === 'isAnonymized' && e.target.type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked;
    }

    dispatch(setAnalysisParam({ param, value }));
  };

  const handleAnalyze = () => {
    if (!filename || !token) return;

    dispatch(analyzeNetwork({
      filename,
      params: analysisParams,
      token
    }));
  };

  return (
    <div>
      <h4 className="fw-bold">Network Analysis Controls</h4>

      <Row>
        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Start Date</Form.Label>
            <Form.Control
              type="date"
              value={analysisParams.startDate}
              onChange={handleParamChange('startDate')}
            />
          </Form.Group>
        </Col>

        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>End Date</Form.Label>
            <Form.Control
              type="date"
              value={analysisParams.endDate}
              onChange={handleParamChange('endDate')}
            />
          </Form.Group>
        </Col>

        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Message Limit</Form.Label>
            <Form.Control
              type="number"
              min={1}
              value={analysisParams.messageLimit}
              onChange={handleParamChange('messageLimit')}
            />
          </Form.Group>
        </Col>

        <Col md={6} lg={4}>
          <Form.Group className="mb-3">
            <Form.Label>Limit Type</Form.Label>
            <Form.Select
              value={analysisParams.limitType}
              onChange={handleParamChange('limitType')}
            >
              <option value="first">First Messages</option>
              <option value="last">Last Messages</option>
              <option value="all">All Messages</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Button
        onClick={handleAnalyze}
        disabled={loading || !filename}
        className="filter-btn"
      >
        {loading ? 'Analyzing...' : 'Analyze Network'}
      </Button>
    </div>
  );
};

export default NetworkControls;