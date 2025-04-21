import { proxy } from 'valtio';
import { ethers } from 'ethers';

// Web3 상태를 관리하는 store 생성
const web3Store = proxy({
    account: null,
    balance: null,

    // 지갑 연결 함수
    async connectWallet() {
        if (typeof window.ethereum === 'undefined') {
            alert('MetaMask를 설치해주세요!');
            return;
        }

        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            this.account = accounts[0];

            const provider = new ethers.BrowserProvider(window.ethereum);
            const balance = await provider.getBalance(accounts[0]);
            this.balance = ethers.formatEther(balance);
        } catch (error) {
            console.error('지갑 연결 실패:', error);
        }
    },

    // 송금 함수
    async sendTransaction(to, amount) {
        if (!this.account) {
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
});

export default web3Store; 