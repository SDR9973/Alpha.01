// src/components/widgets/WikipediaImport.tsx
import React, {useState} from 'react';
import {
    Card,
    Form,
    Button,
    Alert,
    Spinner,
    Modal
} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {
    clearSelectedPages,

} from '../../redux/wikipedia/wikipediaSlice';
import {RootState} from '../../types/state';
import WikipediaSearch from './WikipediaSearch';

const WikipediaImport: React.FC = () => {
    const dispatch = useDispatch();
    const {
        selectedPage,
        selectedTalkPage,
        loading,
        error
    } = useSelector((state: RootState) => state.wikipedia);

    const [description, setDescription] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [threadId, setThreadId] = useState<string | null>(null);

    const handleImportThread = async () => {
        if (!selectedPage?.title) return;

        try {
            const result = await dispatch(uploadWikipediaThread({
                title: selectedPage.title,
                description
            })).unwrap();

            setThreadId(result.thread_id);
            setShowSuccessModal(true);
        } catch (error) {
            console.error('Failed to import thread:', error);
        }
    };

    const handleCloseModal = () => {
        setShowSuccessModal(false);
        dispatch(clearSelectedPages());
        setDescription('');
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <h4>Import Wikipedia Discussion</h4>
            </Card.Header>
            <Card.Body>
                <WikipediaSearch/>

                {(selectedPage || selectedTalkPage) && (
                    <Form className="mt-4">
                        <Form.Group className="mb-3">
                            <Form.Label>Description (Optional)</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Enter a description for this thread..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Form.Group>

                        {error && (
                            <Alert variant="danger" className="mb-3">
                                {error}
                            </Alert>
                        )}

                        <Button
                            variant="primary"
                            onClick={handleImportThread}
                            disabled={loading || !selectedPage?.title}
                        >
                            {loading ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-2"/>
                                    Importing...
                                </>
                            ) : (
                                "Import Thread"
                            )}
                        </Button>
                    </Form>
                )}

                {/* Success Modal */}
                <Modal show={showSuccessModal} onHide={handleCloseModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Thread Imported Successfully</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>The Wikipedia discussion thread has been successfully imported.</p>
                        <p><strong>Thread ID:</strong> {threadId}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Close
                        </Button>
                        <Button
                            variant="primary"
                            onClick={() => {
                                // Navigate to thread or research page
                                handleCloseModal();
                            }}
                        >
                            View Research
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Card.Body>
        </Card>
    );
};

export default WikipediaImport;