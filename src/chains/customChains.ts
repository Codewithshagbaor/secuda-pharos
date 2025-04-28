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
    default: { http: ["https://devnet.dplabs-internal.com/"] },
  },
  blockExplorers: {
    default: { name: "PharosDevnet", url: "https://pharosscan.xyz/" },
  },
  testnet: true,
};