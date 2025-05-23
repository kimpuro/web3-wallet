'use client';

import { useState } from 'react';
import { useSnapshot } from 'valtio';
import { state, web3Store } from '../store/web3Store';
import Link from 'next/link';

export default function Home() {
    // Valtio store의 스냅샷을 구독
    const { account, balance } = useSnapshot(state);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    const handleSend = async (e) => {
        e.preventDefault();
        if (!recipient || !amount) {
            alert('수신자 주소와 금액을 입력해주세요!');
            return;
        }
        await web3Store.sendTransaction(recipient, amount);
        setRecipient('');
        setAmount('');
    };

    return (
        <main className="min-h-screen p-8">
            <div className="max-w-md mx-auto">
                <h1 className="text-2xl font-bold mb-6">Web3 지갑</h1>
                <p>두 개의 지갑 모두 EIP-1193 표준을 따르기 때문에 window.ethereum 객체를 통해 접근</p>
                <p>window.ethereum 객체는 설치된 지갑이 한 개일 때는 그 지갑을</p>
                <p>설치된 지갑이 여러 개일 때는 기본으로 설정된 지갑을 사용</p>

                {!account ? (
                    <div className="flex flex-col gap-2">
                    <button
                        onClick={() => web3Store.connectWallet('metamask')}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        MetaMask 연결
                    </button>
                                        <button
                                        onClick={() => web3Store.connectWallet('trust')}
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        Trust Wallet 연결
                                    </button>
                                    </div>
                    
                ) : (
                    <div className="space-y-4">
                        <div className="p-4 bg-gray-100 rounded">
                            <p className="font-semibold">계정 주소:</p>
                            <p className="break-all">{account}</p>
                            <p className="font-semibold mt-2">잔액:</p>
                            <p>{balance} ETH</p>
                        </div>

                        <form onSubmit={handleSend} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    수신자 주소
                                </label>
                                <input
                                    type="text"
                                    value={recipient}
                                    onChange={(e) => setRecipient(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0x..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    송금할 금액 (ETH)
                                </label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="0.1"
                                    step="0.000000000000000001"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                            >
                                송금하기
                            </button>
                        </form>
                    </div>
                )}
                      <Link href="https://github.com/kimpuro/web3-wallet/commits/main/" target="_blank"
        className="rounded bg-cyan-600 px-2 py-1 text-xs font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
      >
        깃허브 커밋 로그
        </Link>
            </div>
        </main>
    );
} 