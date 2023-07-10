import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Button,
    Alert,
    ListGroup,
    ListGroupItem,
} from 'react-bootstrap';

import { useAccount, useDisconnect, useNetwork } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { Chain } from 'viem/chains';

const StatusHeader: React.FC = () => {
    const { connector, address: connectedAccount = '0x0' } = useAccount();
    const { chain: activeChain, chains } = useNetwork();
    const { disconnectAsync } = useDisconnect();

    const [isSwitchingNetwork, setIsSwitchingNetwork] =
        useState<boolean>(false);
    const [info, setInfo] = useState<string>('');
    const [error, setError] = useState<string>('');

    const [connectorSupportedChains, setConnectorSupportedChains] = useState<
        Chain[]
    >([]);

    useEffect(() => {
        if (!connector || !connector.id) {
            return;
        }
        (async () => {
            let _chains = chains;
            if (connector instanceof WalletConnectConnector) {
                const provider = await connector.getProvider();
                const sessionChains = (
                    provider?.session?.namespaces?.['eip155']?.accounts ?? []
                )
                    /* account format is 'eip155:chainId:address' */
                    .map((account) => {
                        const parts = account.toUpperCase().split(':');
                        if (
                            parts.length === 3 &&
                            parts[2] === connectedAccount.toUpperCase()
                        ) {
                            return +parts[1];
                        }
                        return null;
                    })
                    .filter((chainId) => chainId !== null);
                _chains = _chains.filter((chain) =>
                    sessionChains.includes(chain.id)
                );
            }
            setConnectorSupportedChains(_chains);
        })();
    }, [connector?.id, connectedAccount]);

    const handleDisconnect = async () => {
        try {
            setInfo('Disconnecting ...');
            setError('');
            await disconnectAsync();
        } catch (error: any | unknown) {
            switch (true) {
                case error instanceof Error:
                    setError('Unable to disconnect: ' + error.message);
                    break;
                default:
                    setError('Unable to disconnect: unknown error');
                    console.log(error);
                    break;
            }
        } finally {
            setInfo('');
        }
    };

    const handleSwitchNetwork = async (id: number) => {
        try {
            setIsSwitchingNetwork(true);
            setInfo('Switching network ...');
            setError('');
            await connector?.switchChain?.(id);
        } catch (error: any | unknown) {
            switch (true) {
                case error instanceof Error:
                    setError('Unable to switch network: ' + error.message);
                    break;
                default:
                    setError('Unable to switch network: unknown error');
                    console.log(error);
                    break;
            }
        } finally {
            setInfo('');
            setIsSwitchingNetwork(false);
        }
    };

    let connectorType = 'unknown';
    switch (true) {
        case connector instanceof InjectedConnector:
            connectorType = 'BrowserExtension';
            break;
        case connector instanceof WalletConnectConnector:
            connectorType = 'WalletConnect';
            break;
    }

    return (
        <Row className="bg-light border-bottom">
            <Container>
                <Row className="mt-3 mb-3 b-5">
                    <Col className="ver">
                        <b>Connector type:</b>
                        <br />
                        {connectorType}
                    </Col>
                    <Col>
                        <b>
                            Active chain:{' '}
                            {activeChain && !activeChain.unsupported // supported by dapp
                                ? activeChain.name
                                : 'unsupported'}
                        </b>
                        {connector && connector.switchChain && (
                            <ListGroup className="mt-3">
                                {connectorSupportedChains.map((chain) => (
                                    <ListGroupItem
                                        disabled={
                                            chain.id === activeChain?.id ||
                                            isSwitchingNetwork
                                        }
                                        action
                                        key={chain.id}
                                        onClick={async () => {
                                            await handleSwitchNetwork(chain.id);
                                        }}
                                    >
                                        {chain.name}
                                    </ListGroupItem>
                                ))}
                            </ListGroup>
                        )}
                    </Col>
                    <Col>
                        <b>Address:</b>
                        <br />
                        {connectedAccount}
                    </Col>
                    <Col>
                        <Button onClick={async () => await handleDisconnect()}>
                            Disconnect
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

export default StatusHeader;
