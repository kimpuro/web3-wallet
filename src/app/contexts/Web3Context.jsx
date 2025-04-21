'use client';

import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

const Web3Context = createContext(null);

export const Web3Provider = ({ children }) => {
    const [account, setAccount] = useState(null);
    const [balance, setBalance] = useState(null);

    const connectWallet = async () => {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask를 설치해주세요!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0]);
            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(accounts[0]);
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error('지갑 연결 실패:', error);
        }
    };

    const sendTransaction = async (to, amount) => {
        if (!account) {
            alert('먼저 지갑을 연결해주세요!');
            return;
        }

        try {
            const provider = new ethers.BrowserProvider(window.ethereum);
            const signer = await provider.getSigner();
            const tx = await signer.sendTransaction({
                to,
                value: ethers.parseEther(amount)
            });
            await tx.wait();
            alert('송금이 완료되었습니다!');
        } catch (error) {
            console.error('송금 실패:', error);
            alert('송금에 실패했습니다.');
        }
    };

    return (
        <Web3Context.Provider value={{ account, balance, connectWallet, sendTransaction }}>
            {children}
        </Web3Context.Provider>
    );
};

export const useWeb3 = () => {
    const context = useContext(Web3Context);
    if (!context) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}; 