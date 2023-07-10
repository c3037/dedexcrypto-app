import React, { useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';

import { useConnect } from 'wagmi';

const ConnectButtons: React.FC = () => {
    const { connectAsync, connectors } = useConnect();

    const [info, setInfo] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleConnect = async (connectorID: number) => {
        try {
            setInfo('Connecting ...');
            setError('');
            await connectAsync({
                chainId: connectors[connectorID].chains[0].id,
                connector: connectors[connectorID],
            });
        } catch (error: any | unknown) {
            switch (true) {
                case error instanceof Error:
                    setError('Unable to connect: ' + error.message);
                    break;
                default:
                    setError('Unable to connect: unknown error');
                    console.log(error);
                    break;
            }
        } finally {
            setInfo('');
        }
    };

    return (
        <Row className="bg-light border-bottom">
            <Container>
                <Row className="mt-3 mb-3 b-5">
                    <Col className="text-center">
                        <Button
                            onClick={async () => {
                                await handleConnect(0);
                            }}
                        >
                            Connect (BrowserExtension)
                        </Button>
                    </Col>
                    <Col className="text-center">
                        <Button
                            onClick={async () => {
                                await handleConnect(1);
                            }}
                        >
                            Connect (WalletConnect)
                        </Button>
                    </Col>
                </Row>
                {info !== '' || error !== '' ? (
                    <Row className="mt-3 mb-3">
                        <Col>
                            <Alert
                                variant={
                                    (info !== '' ? 'primary' : 'danger') +
                                    ' mb-0 text-center'
                                }
                            >
                                {info !== '' ? info : error}
                            </Alert>
                        </Col>
                    </Row>
                ) : null}
            </Container>
        </Row>
    );
};

export default ConnectButtons;
