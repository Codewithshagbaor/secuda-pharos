
"use client";

import { WagmiProvider, createConfig, fallback, http, webSocket } from "wagmi";
import { eduChainTestnet,eduChain } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";

const config = createConfig(
  getDefaultConfig({
    appName: "Secuda",
    chains: [eduChainTestnet,eduChain],
    walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
    // Optional App Info
    appDescription: "Secure your document With Blockchain Technology",
    appUrl: "https://www.secuda.xyz", // your app's url
    transports: {
      [eduChainTestnet.id]: fallback([
        http("https://rpc.open-campus-codex.gelato.digital"),
        http("https://open-campus-codex-sepolia.drpc.org"),
        webSocket("wss://open-campus-codex-sepolia.drpc.org")
      ]),
    },
  }),
);

const queryClient = new QueryClient();

import { ReactNode } from "react";

export const Web3Provider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ConnectKitProvider>{children}</ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
