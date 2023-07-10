import React from 'react';
import { Container } from 'react-bootstrap';
import { useAccount } from 'wagmi';

import ConnectButtons from '../components/ConnectButtons.tsx';
import StatusHeader from '../components/StatusHeader.tsx';
import Contracts from '../components/Contracts.tsx';
import BalanceInfo from '../components/BalanceInfo.tsx';

export const URL = '/';

export const Element: React.FC = () => {
    const { isConnected } = useAccount();

    return (
        <Container>
            {!isConnected ? (
                <ConnectButtons />
            ) : (
                <>
                    <StatusHeader />
                    <Contracts />
                    <BalanceInfo />
                </>
            )}
        </Container>
    );
};
