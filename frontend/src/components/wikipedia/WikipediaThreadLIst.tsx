import React, {useEffect, useState} from 'react';
import {Card, ListGroup, Button, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useDispatch} from 'react-redux';
import {listWikipediaThreads} from '../../redux/wikipedia/asyncThunks';
import {AppDispatch} from '../../redux/store';

interface WikipediaThreadListProps {
    researchId?: string;
}

const WikipediaThreadList: React.FC<WikipediaThreadListProps> = ({researchId}) => {
    const dispatch = useDispatch<AppDispatch>();
    const [threads, setThreads] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchThreads = async () => {
            setLoading(true);
            try {
                const result = await dispatch(listWikipediaThreads({researchId})).unwrap();
                setThreads(result);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load threads');
            } finally {
                setLoading(false);
            }
        };

        fetchThreads();
    }, [dispatch, researchId]);

    if (loading) {
        return (
            <Card>
                <Card.Body className="text-center py-5">
                    <Spinner animation="border"/>
                    <p className="mt-2">Loading Wikipedia threads...</p>
                </Card.Body>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <Card.Body>
                    <p className="text-danger">{error}</p>
                    <Button
                        variant="outline-primary"
                        onClick={() => dispatch(listWikipediaThreads({researchId}))}
                    >
                        Try Again
                    </Button>
                </Card.Body>
            </Card>
        );
    }

    if (threads.length === 0) {
        return (
            <Card>
                <Card.Header>
                    <h4>Wikipedia Threads</h4>
                </Card.Header>
                <Card.Body>
                    <p>No Wikipedia threads have been imported yet.</p>
                    <Link
                        to={researchId ? `/research/${researchId}/wikipedia` : '/wikipedia'}
                        className="btn btn-primary"
                    >
                        Import Wikipedia Thread
                    </Link>
                </Card.Body>
            </Card>
        );
    }

    return (
        <Card>
            <Card.Header>
                <h4>Wikipedia Threads</h4>
            </Card.Header>
            <ListGroup variant="flush">
                {threads.map(thread => (
                    <ListGroup.Item key={thread.thread_id}>
                        <div className="d-flex justify-content-between align-items-start">
                            <div>
                                <h5>{thread.wikipedia_title}</h5>
                                <p className="text-muted mb-1">{thread.description || 'No description'}</p>
                            </div>
                            <div>
                                <Link
                                    to={`/wikipedia/thread/${thread.thread_id}`}
                                    className="btn btn-outline-primary btn-sm me-2"
                                >
                                    View
                                </Link>
                                <Link
                                    to={`/wikipedia/thread/${thread.thread_id}/network`}
                                    className="btn btn-primary btn-sm"
                                >
                                    Analyze
                                </Link>
                            </div>
                        </div>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </Card>
    );
};

export default WikipediaThreadList;