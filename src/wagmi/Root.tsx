import React from 'react';

import { WagmiConfig, createConfig, configureChains } from 'wagmi';
import { sepolia, arbitrum, polygon } from 'wagmi/chains';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { publicProvider } from 'wagmi/providers/public';

import Config from '../config.ts';

const { chains, publicClient, webSocketPublicClient } = configureChains(
    [sepolia, arbitrum, polygon],
    [publicProvider()] // todo: add more providers
);

const config = createConfig({
    autoConnect: true,
    connectors: [
        new InjectedConnector({
            chains,
        }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: Config.walletConnectProjectID(),
                showQrModal: true,
            },
        }),
    ],
    publicClient,
    webSocketPublicClient,
});

interface RootProps {
    children?: React.ReactNode;
}

const Root: React.FC<RootProps> = ({ children }) => {
    return <WagmiConfig config={config}>{children}</WagmiConfig>;
};

export default Root;
