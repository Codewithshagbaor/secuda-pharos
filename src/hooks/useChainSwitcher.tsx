// useChainSwitcher.tsx
import { useSwitchChain, useChainId } from "wagmi";

export function useChainSwitcher() {
  const currentChainId = useChainId();
  const { switchChain } = useSwitchChain();
  
  const switchToChain = async (chainId: number) => {
    // Compare with the current chain ID instead of the address
    if (currentChainId === chainId) {
      console.log("Already on the selected chain");
      return;
    }

    try {
      await switchChain({ chainId });
      console.log(`Switched to chain ID: ${chainId}`);
    } catch (error) {
      console.error("Failed to switch chain:", error);
    }
  };

  // Create a current chain object with just the ID for consistency
  const currentChain = { id: currentChainId };
  
  return { 
    switchToChain, 
    currentChain
  };
}