import { pharosdevnet, educhain } from "@/chains/customChains";
import { createConfig, http } from "wagmi";
import { webSocket } from '@wagmi/core'
import { getDefaultConfig } from "connectkit";

export const config = createConfig(
    getDefaultConfig({
      // Your dApp's chains
      chains: [pharosdevnet, educhain],
      transports: {
        [pharosdevnet.id]: http(pharosdevnet.rpcUrls.default.http[0]),
        [pharosdevnet.id]: webSocket("wss://devnet.dplabs-internal.com"),
        [educhain.id]: http(educhain.rpcUrls.default.http[0]),
        [educhain.id]: webSocket("wss://open-campus-codex-sepolia.drpc.org"),
      },
      // Required API Keys
      walletConnectProjectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  
      // Required App Info
      appName: "Secuda",
  
      appDescription: "Secure your document With Blockchain Technology",
      appUrl: "https://www.secuda.xyz", // your app's url
    })
  );
