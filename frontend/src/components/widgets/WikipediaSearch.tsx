// src/components/widgets/WikipediaSearch.tsx
import React, {useState, useEffect, useRef} from 'react';
import {Form, ListGroup, Spinner, Alert, Card, Button} from 'react-bootstrap';
import {useDispatch, useSelector} from 'react-redux';
import {
    clearSearchResults
} from '../../redux/wikipedia/wikipediaSlice';
import styled from 'styled-components';
import {RootState} from '../../types/state';

const SearchContainer = styled.div`
    position: relative;
    margin-bottom: 20px;
`;

const ResultsContainer = styled(ListGroup)`
    position: absolute;
    width: 100%;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1000;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ResultItem = styled(ListGroup.Item)`
    cursor: pointer;

    &:hover {
        background-color: #f8f9fa;
    }
`;

const ContentPreview = styled.div`
    max-height: 300px;
    overflow-y: auto;
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #eaeaea;
`;

const TabButton = styled(Button)<{ active: boolean }>`
    background-color: ${props => props.active ? '#050d2d' : '#f8f9fa'};
    color: ${props => props.active ? 'white' : '#050d2d'};
    border: 1px solid #eaeaea;
    margin-right: 10px;
    margin-bottom: 10px;

    &:hover {
        background-color: #050d2d;
        color: white;
    }
`;

interface WikipediaSearchProps {
    onSelectPage?: (title: string) => void;
}

const WikipediaSearch: React.FC<WikipediaSearchProps> = ({onSelectPage}) => {
    const dispatch = useDispatch();
    const {
        searchResults,
        selectedPage,
        selectedTalkPage,
        loading,
        error
    } = useSelector((state: RootState) => state.wikipedia);

    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [activeTab, setActiveTab] = useState<'page' | 'talk'>('page');
    const searchTimeout = useRef<NodeJS.Timeout | null>(null);
    const searchContainerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Cleanup search results when unmounting
    useEffect(() => {
        return () => {
            if (searchTimeout.current) {
                clearTimeout(searchTimeout.current);
            }
            dispatch(clearSearchResults());
        };
    }, [dispatch]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        setShowResults(true);

        // Clear previous timeout
        if (searchTimeout.current) {
            clearTimeout(searchTimeout.current);
        }

        // Only search if at least 3 characters are entered
        if (value.length >= 3) {
            searchTimeout.current = setTimeout(() => {
                dispatch(searchWikipedia(value));
            }, 300);
        }
    };

    const handleSelectResult = (title: string) => {
        // Fetch both page and talk page data
        dispatch(getWikipediaPage(title));
        dispatch(getWikipediaTalkPage(title));

        setSearchTerm(title);
        setShowResults(false);

        if (onSelectPage) {
            onSelectPage(title);
        }
    };

    const renderSearchResults = () => {
        if (!showResults || searchTerm.length < 3) {
            return null;
        }

        if (loading) {
            return (
                <ResultsContainer>
                    <ResultItem className="d-flex justify-content-center py-3">
                        <Spinner animation="border" role="status" size="sm"/>
                        <span className="ms-2">Searching...</span>
                    </ResultItem>
                </ResultsContainer>
            );
        }

        if (error) {
            return (
                <ResultsContainer>
                    <ResultItem className="text-danger">
                        Error: {error}
                    </ResultItem>
                </ResultsContainer>
            );
        }

        if (searchResults.length === 0) {
            return (
                <ResultsContainer>
                    <ResultItem>No results found</ResultItem>
                </ResultsContainer>
            );
        }

        return (
            <ResultsContainer>
                {searchResults.map((result, index) => (
                    <ResultItem
                        key={index}
                        onClick={() => handleSelectResult(result.title)}
                    >
                        <div className="fw-bold">{result.title}</div>
                        <div dangerouslySetInnerHTML={{__html: result.snippet}}/>
                    </ResultItem>
                ))}
            </ResultsContainer>
        );
    };

    const renderContentPreview = () => {
        if (!selectedPage && !selectedTalkPage) {
            return null;
        }

        const activeContent = activeTab === 'page'
            ? selectedPage?.content
            : selectedTalkPage?.content;

        if (!activeContent) {
            return <Alert variant="info">No content available</Alert>;
        }

        return (
            <div>
                <div className="mb-3">
                    <TabButton
                        active={activeTab === 'page'}
                        onClick={() => setActiveTab('page')}
                    >
                        Page Content
                    </TabButton>
                    <TabButton
                        active={activeTab === 'talk'}
                        onClick={() => setActiveTab('talk')}
                    >
                        Talk Page
                    </TabButton>
                </div>

                <Card>
                    <Card.Header>
                        <h5>{activeTab === 'page' ? selectedPage?.title : `Talk: ${selectedTalkPage?.title}`}</h5>
                    </Card.Header>
                    <Card.Body>
                        <ContentPreview>
                            {activeContent}
                        </ContentPreview>
                    </Card.Body>
                </Card>
            </div>
        );
    };

    return (
        <div>
            <h4 className="mb-3">Wikipedia Integration</h4>

            <SearchContainer ref={searchContainerRef}>
                <Form.Group className="mb-3">
                    <Form.Label>Search Wikipedia</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Type at least 3 characters to search..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onClick={() => setShowResults(true)}
                    />
                    {renderSearchResults()}
                </Form.Group>
            </SearchContainer>

            {renderContentPreview()}

            {(selectedPage || selectedTalkPage) && (
                <Button
                    variant="primary"
                    className="mt-3"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Spinner animation="border" size="sm" className="me-2"/>
                            Processing...
                        </>
                    ) : (
                        "Import Thread"
                    )}
                </Button>
            )}
        </div>
    );
};

export default WikipediaSearch;