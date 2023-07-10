import { Routes, Route } from 'react-router-dom';

import * as HomePage from './HomePage.tsx';

const Pages: React.FC = () => {
    return (
        <Routes>
            <Route path={HomePage.URL}>
                <Route index element={<HomePage.Element />} />
            </Route>
        </Routes>
    );
};

export default Pages;
