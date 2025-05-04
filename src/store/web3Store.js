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
        if (typeof window.ethereum === 'undefined') {
            alert(`${walletType === 'metamask' ? 'MetaMask' : 'Trust Wallet'}를 설치해주세요!`);
            return;
        }

        try {
            // 여러 지갑이 설치된 경우 처리
            let targetProvider = window.ethereum;

            // providers가 있는 경우 (여러 지갑이 설치된 경우)
            if (window.ethereum.providers) {
                targetProvider = window.ethereum.providers.find(provider => {
                    if (walletType === 'metamask') {
                        return provider.isMetaMask;
                    } else if (walletType === 'trust') {
                        return provider.isTrust;
                    }
                    return false;
                });

                if (!targetProvider) {
                    alert(`${walletType === 'metamask' ? 'MetaMask' : 'Trust Wallet'}를 찾을 수 없습니다.`);
                    return;
                }
            }

            // 지갑 연결 요청
            const accounts = await targetProvider.request({ method: 'eth_requestAccounts' });
            if (!accounts || accounts.length === 0) {
                alert('계정을 선택해주세요!');
                return;
            }

            // 계정 설정
            this.setAccount(accounts[0]);

            // 잔액 조회
            const provider = new ethers.BrowserProvider(targetProvider);
            const balance = await provider.getBalance(accounts[0]);
            this.setBalance(ethers.formatEther(balance));

        } catch (error) {
            console.error('지갑 연결 실패:', error);
            if (error.code === 4001) {
                alert('지갑 연결이 거부되었습니다.');
            } else {
                alert('지갑 연결에 실패했습니다. 다시 시도해주세요.');
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