import { proxy } from 'valtio';
import { ethers } from 'ethers';

// 상태로 관리할 값만 proxy로 감싸기
const state = proxy({
    account: null,
    balance: null
});

// 일반 객체로 함수들을 정의
const web3Store = {
    // 상태 업데이트 함수
    setAccount(account) {
        state.account = account;
    },

    setBalance(balance) {
        state.balance = balance;
    },

    // 지갑 연결 함수
    async connectWallet(walletType) {
        if (walletType === 'metamask') {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask를 설치해주세요!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setAccount(accounts[0]);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(accounts[0]);
            this.setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error('지갑 연결 실패:', error);
        }
    }
    if (walletType === 'trust') {
        if (typeof window.ethereum === 'undefined') {
            alert('Trust Wallet을 설치해주세요!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.setAccount(accounts[0]);

            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(accounts[0]);
            this.setBalance(ethers.formatEther(balance));
        } catch (error) {
            console.error('지갑 연결 실패:', error);
        }
    }
    },

    // 송금 함수
    async sendTransaction(to, amount) {
        if (!state.account) {
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
    }
};

export { state, web3Store };