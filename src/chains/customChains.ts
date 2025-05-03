import { type Chain } from "viem";

export const pharosdevnet: Chain = {
  id: 50002,
  name: "Pharos Devnet",
  nativeCurrency: {
    decimals: 18,
    name: "Pharos Devnet",
    symbol: "PTT",
  },
  rpcUrls: {
    default: { http: ['/api/pharos'] },
  },
  blockExplorers: {
    default: { name: "PharosDevnet", url: "https://pharosscan.xyz/" },
  },
  testnet: true,
};

export const educhain: Chain = {
  id: 656476,
  name: "Edu Chain",
  nativeCurrency: {
    decimals: 18,
    name: "Edu Token",
    symbol: "EDU",
  },
  rpcUrls: {
    default: { 
      http: ["https://rpc.open-campus-codex.gelato.digital	"], 
    },
  },
  blockExplorers: {
    default: { name: "EduScan", url: "https://opencampus-codex.blockscout.com/" },
  },
  testnet: true,
};