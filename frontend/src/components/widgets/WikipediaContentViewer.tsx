// src/components/widgets/WikiContentViewer.tsx
import React, {useState, useEffect} from 'react';
import {Card, Nav, Spinner, Alert, Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {
    getWikipediaPage,
    getWikipediaTalkPage,
    uploadWikipediaThread
} from '../../redux/wikipedia/wikipediaSlice';
import styled from 'styled-components';
import {RootState} from '../../types/state';

const ContentContainer = styled.div`
    max-height: 500px;
    overflow-y: auto;
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 15px;
    background-color: #f8f9fa;
    border: 1px solid #eaeaea;
    border-radius: 8px;
    white-space: pre-wrap;
`;

const ActionButton = styled(Button)`
    margin-right: 10px;
`;

interface WikiContentViewerProps {
    title: string;
    onImportSuccess?: (threadId: string) => void;
    showImportButton?: boolean;
    researchId?: string;
}

const WikiContentViewer: React.FC<WikiContentViewerProps> = ({
                                                                 title,
                                                                 onImportSuccess,
                                                                 showImportButton = true,
                                                                 researchId
                                                             }) => {
    const dispatch = useDispatch();
    const {
        selectedPage,
        selectedTalkPage,
        loading,
        error
    } = useSelector((state: RootState) => state.wikipedia);

    const [activeTab, setActiveTab] = useState<'page' | 'talk'>('page');
    const [description, setDescription] = useState('');
    const [importStatus, setImportStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    useEffect(() => {
        // Fetch both page types when title changes
        if (title) {
            dispatch(getWikipediaPage(title));
            dispatch(getWikipediaTalkPage(title));
        }
    }, [title, dispatch]);

    const handleImportThread = async () => {
        if (!title) return;

        setImportStatus('loading');
        try {
            const result = await dispatch(uploadWikipediaThread({
                title,
                description: description || `Imported from Wikipedia: ${title}`
            })).unwrap();

            setImportStatus('success');

            if (onImportSuccess) {
                onImportSuccess(result.thread_id);
            }
        } catch (error) {
            setImportStatus('error');
            console.error('Failed to import thread:', error);
        }
    };

    // Determine which content to display
    const renderContent = () => {
        if (loading) {
            return (
                <div className="d-flex justify-content-center py-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            );
        }

        if (error) {
            return (
                <Alert variant="danger">
                    {error}
                </Alert>
            );
        }

        const content = activeTab === 'page'
            ? selectedPage?.content
            : selectedTalkPage?.content;

        if (!content) {
            return (
                <Alert variant="info">
                    No content available for {activeTab === 'page' ? 'article' : 'talk page'}
                </Alert>
            );
        }

        return (
            <ContentContainer>
                {content}
            </ContentContainer>
        );
    };

    return (
        <Card className="mb-4">
            <Card.Header>
                <div className="d-flex justify-content-between align-items-center">
                    <h5>{title}</h5>
                    {showImportButton && (
                        <ActionButton
                            variant="primary"
                            size="sm"
                            disabled={loading || importStatus === 'loading'}
                            onClick={handleImportThread}
                        >
                            {importStatus === 'loading' ? (
                                <>
                                    <Spinner animation="border" size="sm" className="me-1"/>
                                    Importing...
                                </>
                            ) : (
                                "Import Thread"
                            )}
                        </ActionButton>
                    )}
                </div>
            </Card.Header>

            <Card.Body>
                <Nav variant="tabs" className="mb-3">
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'page'}
                            onClick={() => setActiveTab('page')}
                        >
                            Article
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link
                            active={activeTab === 'talk'}
                            onClick={() => setActiveTab('talk')}
                        >
                            Talk Page
                        </Nav.Link>
                    </Nav.Item>
                </Nav>

                {importStatus === 'success' && (
                    <Alert variant="success" className="mb-3">
                        Thread imported successfully!
                    </Alert>
                )}

                {importStatus === 'error' && (
                    <Alert variant="danger" className="mb-3">
                        Failed to import thread. Please try again.
                    </Alert>
                )}

                {renderContent()}
            </Card.Body>
        </Card>
    );
};

export default WikiContentViewer;