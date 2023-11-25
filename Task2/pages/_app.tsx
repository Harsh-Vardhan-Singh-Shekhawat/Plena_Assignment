import '../styles/globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  sepolia
} from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [sepolia],
  [publicProvider()]
);



const { connectors } = getDefaultWallets({
  appName: 'RainbowKit App',
  projectId:'af39ef2276c33fa0fcc8fed95774eb17',
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
