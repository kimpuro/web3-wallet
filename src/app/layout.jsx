import { Inter } from 'next/font/google';
import './globals.css';
import { Web3Provider } from './contexts/Web3Context';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
    title: 'Web3 Wallet',
    description: 'MetaMask 지갑 연결 및 송금 서비스',
};

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body className={inter.className}>
                <Web3Provider>
                    {children}
                </Web3Provider>
            </body>
        </html>
    );
} 