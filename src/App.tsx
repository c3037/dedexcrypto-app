import React from 'react';
import { RecoilRoot } from 'recoil';
import { HashRouter } from 'react-router-dom';

import WagmiRoot from './wagmi/Root.tsx';
import Pages from './pages/index.tsx';

import './App.scss';

const App: React.FC = () => {
    return (
        <RecoilRoot>
            <WagmiRoot>
                <HashRouter>
                    <Pages />
                </HashRouter>
            </WagmiRoot>
        </RecoilRoot>
    );
};

export default App;
