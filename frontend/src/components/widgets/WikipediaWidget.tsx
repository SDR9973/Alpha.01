// src/components/widgets/WikipediaWidget.jsx
import React, {useState, useEffect, useRef} from 'react';
import {Card, Form, Button, Spinner, Alert, ListGroup} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {searchWikipedia} from '../../redux/wikipedia/asyncThunks.ts';

const WikipediaWidget = () => {
    const dispatch = useDispatch();
    const {searchResults, loading, error} = useSelector(state => state.wikipedia);
    const [searchTerm, setSearchTerm] = useState('');
    const searchTimeoutRef = useRef(null);

    const handleSearch = (e) => {
        if (e) e.preventDefault();

        if (!searchTerm.trim() || searchTerm.length < 3) return;

        dispatch(searchWikipedia(searchTerm));
    };

    // Debounced search while typing
    useEffect(() => {
        if (searchTerm.length >= 3) {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                handleSearch();
            }, 500);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchTerm, dispatch]);

    return (
        <Card className="research-card mb-4">
            <Card.Header>
                <h4 className="fw-bold">Wikipedia Research</h4>
            </Card.Header>
            <Card.Body>
                <Form onSubmit={handleSearch}>
                    <Form.Group className="mb-3">
                        <Form.Label className="research-label">Search Wikipedia:</Form.Label>
                        <Form.Control
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Type to search Wikipedia..."
                            className="research-input"
                        />
                    </Form.Group>
                    <Button
                        type="submit"
                        className="filter-btn"
                        disabled={loading || !searchTerm.trim() || searchTerm.length < 3}
                    >
                        {loading ? (
                            <>
                                <Spinner animation="border" size="sm" className="me-2"/>
                                Searching...
                            </>
                        ) : (
                            'Search'
                        )}
                    </Button>
                </Form>

                {error && (
                    <Alert variant="danger" className="mt-3">
                        {error}
                    </Alert>
                )}

                {searchResults && searchResults.length > 0 && (
                    <div className="mt-4">
                        <h5>Search Results:</h5>
                        <ListGroup>
                            {searchResults.map((result, index) => (
                                <ListGroup.Item key={index}>
                                    <h6>{result.title}</h6>
                                    <div dangerouslySetInnerHTML={{__html: result.snippet}}/>
                                    <div className="d-flex mt-2">
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="me-2"
                                            onClick={() => {
                                                window.open(`https://en.wikipedia.org/wiki/${encodeURIComponent(result.title)}`, '_blank');
                                            }}
                                        >
                                            View on Wikipedia
                                        </Button>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => {
                                                console.log("Import article:", result.title);
                                                // Add code to handle importing the article
                                            }}
                                        >
                                            Import
                                        </Button>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default WikipediaWidget;