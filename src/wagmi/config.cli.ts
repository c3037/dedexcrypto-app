import { defineConfig } from '@wagmi/cli';
import { fetch, react } from '@wagmi/cli/plugins';

const contractsToFetch = [
    {
        name: 'ERC20Token',
        url: 'https://raw.githubusercontent.com/dedexcrypto/core/main/abi/IDAOToken.sol/IDAOToken.json',
    },
];

export default defineConfig({
    out: 'src/wagmi/generated.ts',
    plugins: [
        ...contractsToFetch.map((v) => {
            return fetch({
                contracts: [{ name: v.name }],
                request() {
                    return { url: v.url };
                },
            });
        }),
        react(),
    ],
});
