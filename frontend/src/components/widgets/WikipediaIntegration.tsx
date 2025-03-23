// src/pages/WikipediaIntegration.tsx
import React from 'react';
import {Container, Row, Col, Card} from 'react-bootstrap';
import WikipediaImport from './WikipediaImport.tsx';

const WikipediaIntegration: React.FC = () => {
    return (
        <Container fluid className="mt-4">
            <Row>
                <Col>
                    <Card className="mb-4">
                        <Card.Header>
                            <h3>Wikipedia Integration</h3>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                This tool allows you to import Wikipedia discussion threads for network analysis.
                                Search for a Wikipedia article, view its content or talk page, and import the
                                discussion for analysis.
                            </p>
                        </Card.Body>
                    </Card>

                    <WikipediaImport/>

                    <Card>
                        <Card.Header>
                            <h4>Recent Imports</h4>
                        </Card.Header>
                        <Card.Body>
                            {/* This would be populated with a list of recently imported threads */}
                            <p>No recent imports to display.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default WikipediaIntegration;