import { sepolia, arbitrum, polygon } from 'wagmi/chains';

function chain<T>(
    list: [fetcher: () => T, checker: (v: T) => boolean][],
    _default: T
): T {
    for (const item of list) {
        const res = item[0]();
        if (item[1](res) === true) {
            return res;
        }
    }
    return _default;
}

const notEmptyString = (v: string) => v !== '';

class Config {
    private _walletConnectProjectID: string | undefined = undefined;

    walletConnectProjectID(): string {
        if (this._walletConnectProjectID === undefined) {
            this._walletConnectProjectID = chain<string>(
                [
                    [
                        () =>
                            (import.meta.env
                                .VITE_WALLET_CONNECT_PROJECT_ID as string) ??
                            '',
                        notEmptyString,
                    ],
                    [
                        () =>
                            window.prompt(
                                'Please enter WalletConnect ProjectID'
                            ) ?? '',
                        notEmptyString,
                    ],
                ],
                ''
            );
        }

        return this._walletConnectProjectID;
    }

    contractsPerNetwork() {
        return {
            [sepolia.id]: {
                USDC: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
                USDT: '0xaa8e23fb1079ea71e0a56f48a2aa51851d8433d0',
            },

            [arbitrum.id]: {
                USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
                USDT: '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
            },
            [polygon.id]: {
                aUSDC: '0x625E7708f30cA75bfd92586e17077590C60eb4cD',
                aUSDT: '0x6ab707Aca953eDAeFBc4fD23bA73294241490620',
            },
        };
    }
}

const instance = new Config();

export default instance;
