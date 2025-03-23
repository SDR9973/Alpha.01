import React, { useState } from 'react';
import { Button, Form, Card, Spinner, Alert } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { uploadWikipediaThread } from '../../redux/wikipedia/asyncThunks';
import { AppDispatch } from '../../redux/store';

interface WikipediaThreadImporterProps {
  title: string;
  researchId?: string;
  onImportSuccess?: (threadId: string) => void;
}

const WikipediaThreadImporter: React.FC<WikipediaThreadImporterProps> = ({
  title,
  researchId,
  onImportSuccess
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [description, setDescription] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleImport = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await dispatch(uploadWikipediaThread({
        title,
        description,
        researchId
      })).unwrap();

      setSuccess(true);
      setDescription('');

      if (onImportSuccess && result.thread_id) {
        onImportSuccess(result.thread_id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to import thread');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mb-4">
      <Card.Header>
        <h4>Import Discussion Thread</h4>
      </Card.Header>
      <Card.Body>
        {success && (
          <Alert variant="success" className="mb-3">
            Thread imported successfully!
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="mb-3">
            {error}
          </Alert>
        )}

        <p>
          Import the discussion thread from the Wikipedia talk page for "{title}" into your research
          for network analysis.
        </p>

        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Thread Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for this discussion thread..."
            />
          </Form.Group>

          <Button
            variant="primary"
            onClick={handleImport}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Importing...
              </>
            ) : 'Import Discussion Thread'}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default WikipediaThreadImporter;