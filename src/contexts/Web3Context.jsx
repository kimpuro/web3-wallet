'use client';

import { createContext, useContext, useState } from 'react';
import { ethers } from 'ethers';

// Web3 관련 상태와 함수를 공유하기 위한 Context 생성
const Web3Context = createContext(null);

// Web3Provider 컴포넌트 정의
export const Web3Provider = ({ children }) => {
    // 현재 연결된 MetaMask 계정 주소를 저장하는 상태
    const [account, setAccount] = useState(null);
    // 현재 계정의 ETH 잔액을 저장하는 상태
    const [balance, setBalance] = useState(null);

    // MetaMask 지갑 연결 함수
    const connectWallet = async () => {
        // MetaMask가 설치되어 있는지 확인
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask를 설치해주세요!');
            return;
        }

        try {
            // MetaMask에 계정 연결 요청
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            // 첫 번째 계정 주소를 상태에 저장
            setAccount(accounts[0]);

            // ethers.js를 사용하여 Web3 프로바이더 생성
            const provider = new ethers.BrowserProvider(window.ethereum);
            // 계정의 ETH 잔액 조회
            const balance = await provider.getBalance(accounts[0]);
            // Wei 단위의 잔액을 ETH 단위로 변환하여 상태에 저장
            setBalance(ethers.formatEther(balance));
        } catch (error) {
            // 연결 실패 시 에러 로깅
            console.error('지갑 연결 실패:', error);
        }
    };

    // ETH 송금 함수
    const sendTransaction = async (to, amount) => {
        // 계정이 연결되어 있는지 확인
        if (!account) {
            alert('먼저 지갑을 연결해주세요!');
            return;
        }

        try {
            // ethers.js를 사용하여 Web3 프로바이더 생성
            const provider = new ethers.BrowserProvider(window.ethereum);
            // 트랜잭션 서명을 위한 signer 객체 생성
            const signer = await provider.getSigner();

            // ETH 송금 트랜잭션 생성 및 전송
            const tx = await signer.sendTransaction({
                to,  // 수신자 주소
                value: ethers.parseEther(amount)  // ETH 단위를 Wei 단위로 변환
            });

            // 트랜잭션 완료 대기
            await tx.wait();
            alert('송금이 완료되었습니다!');
        } catch (error) {
            // 송금 실패 시 에러 로깅
            console.error('송금 실패:', error);
            alert('송금에 실패했습니다.');
        }
    };

    // Context Provider를 통해 상태와 함수를 자식 컴포넌트에 제공
    return (
        <Web3Context.Provider value={{ account, balance, connectWallet, sendTransaction }}>
            {children}
        </Web3Context.Provider>
    );
};

// Web3 Context를 사용하기 위한 커스텀 훅
export const useWeb3 = () => {
    // Context에서 값 가져오기
    const context = useContext(Web3Context);
    // Context가 없을 경우 에러 발생
    if (!context) {
        throw new Error('useWeb3 must be used within a Web3Provider');
    }
    return context;
}; 