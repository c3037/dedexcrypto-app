import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { Container, Row, Col } from 'react-bootstrap';

import { usePublicClient, useAccount } from 'wagmi';
import { erc20TokenABI } from '../wagmi/generated.ts';

import * as State from '../state.ts';

const BalanceInfo: React.FC = () => {
    const activeContractAddress = useRecoilValue(
        State.contractAddress
    ) as `0x${string}`;
    const [balance, setBalance] = useState<string>('');

    const publicClient = usePublicClient();
    const { address: connectedAccount = '0x0' } = useAccount();

    useEffect(() => {
        (async () => {
            try {
                setBalance('Loading ...');
                if (activeContractAddress.length === 0) {
                    return;
                }

                // @docs https://viem.sh/docs/contract/readContract.html
                const contract = {
                    address: activeContractAddress,
                    abi: erc20TokenABI,
                };
                const _balance = await publicClient.readContract({
                    ...contract,
                    functionName: 'balanceOf',
                    args: [connectedAccount],
                });
                const _decimals = await publicClient.readContract({
                    ...contract,
                    functionName: 'decimals',
                });

                let intPart, fractionalPart;
                if (_balance !== BigInt(0)) {
                    intPart = _balance.toString().slice(0, -1 * _decimals);
                    fractionalPart = _balance.toString().slice(-1 * _decimals);
                } else {
                    intPart = '0';
                    fractionalPart = '0';
                }
                setBalance(intPart + '.' + fractionalPart);
            } catch (e) {
                setBalance('unable to fetch: ' + e);
            }
        })();
    }, [activeContractAddress]);

    if (activeContractAddress.length === 0) {
        return null;
    }

    return (
        <Row className="bg-light border-bottom p-3">
            <Container>
                <Row>
                    <Col>
                        <b>Balance:</b> {balance}
                    </Col>
                </Row>
            </Container>
        </Row>
    );
};

export default BalanceInfo;
