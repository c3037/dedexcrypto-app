import React, { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { Row, Alert, ListGroup, ListGroupItem } from 'react-bootstrap';

import { useAccount, useNetwork } from 'wagmi';

import Config from '../config.ts';
import * as State from '../state.ts';

const Contracts: React.FC = () => {
    const { connector, address: connectedAccount = '0x0' } = useAccount();
    const { chain: activeChain } = useNetwork();

    const connectorID = connector?.id ?? -1;
    const activeChainID = activeChain?.id ?? -1;

    const [activeContractAddress, setActiveContractAddress] = useRecoilState(
        State.contractAddress
    );
    useEffect(() => {
        setActiveContractAddress('');
    }, [connectorID, activeChainID, connectedAccount]);

    const contractsPerNetwork = Config.contractsPerNetwork();

    let content;
    if (activeChainID in contractsPerNetwork === false) {
        content = (
            <Alert variant="danger mb-0 text-center">
                Selected network does not have any contracts
            </Alert>
        );
    } else {
        const contracts =
            contractsPerNetwork[
                activeChainID as keyof typeof contractsPerNetwork
            ];
        content = (
            <ListGroup className="mt-3">
                {Object.keys(contracts).map((name: string) => {
                    const address = contracts[name as keyof typeof contracts];

                    return (
                        <ListGroupItem
                            disabled={address === activeContractAddress}
                            action
                            key={address}
                            onClick={async () => {
                                setActiveContractAddress(address);
                            }}
                        >
                            {name}: {address}
                        </ListGroupItem>
                    );
                })}
            </ListGroup>
        );
    }

    return <Row className="bg-light border-bottom p-3">{content}</Row>;
};

export default Contracts;
