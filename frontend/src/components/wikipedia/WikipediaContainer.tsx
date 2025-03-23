import React, {useState} from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import WikipediaSearch from '../widgets/WikipediaSearch.tsx';
import WikipediaContentViewer from '../widgets/WikipediaContentViewer.tsx';
import WikipediaThreadImporter from './WikipediaThreadImporter.tsx';

interface WikipediaContainerProps {
    inResearchMode?: boolean;
    researchId?: string;
    onImportSuccess?: (threadId: string) => void;
}

const WikipediaContainer: React.FC<WikipediaContainerProps> = ({
                                                                   inResearchMode = false,
                                                                   researchId,
                                                                   onImportSuccess
                                                               }) => {
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);

    const handleTitleSelect = (title: string) => {
        setSelectedTitle(title);
    };

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header>
                            <h3>Wikipedia Integration</h3>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                This tool allows you to search Wikipedia, view articles and their discussion pages,
                                and import discussion threads for network analysis.
                            </p>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4">
                        <Card.Header>
                            <h4>Search Wikipedia</h4>
                        </Card.Header>
                        <Card.Body>
                            <WikipediaSearch onSelectTitle={handleTitleSelect}/>
                        </Card.Body>
                    </Card>

                    {selectedTitle && (
                        <>
                            <WikipediaContentViewer
                                title={selectedTitle}
                                showImportButton={inResearchMode}
                                researchId={researchId}
                                onImportSuccess={onImportSuccess}
                            />

                            {inResearchMode && (
                                <WikipediaThreadImporter
                                    title={selectedTitle}
                                    researchId={researchId}
                                    onImportSuccess={onImportSuccess}
                                />
                            )}
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default WikipediaContainer;