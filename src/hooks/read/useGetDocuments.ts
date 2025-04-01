import { useCallback, useState } from 'react'
import { useReadContract, useAccount } from 'wagmi'
import SECUDA_ABI from "@/constants/abis/Secuda.json"
import { SECUDA_CONTRACT } from '@/constants/addresses/Secuda-contract'

export function useGetDocuments() {
  const { address } = useAccount()
  const [currentTokenId, setCurrentTokenId] = useState<number | null>(null)
  
  // Hook to get user documents
  const { data: userDocuments, isPending: isLoadingUserDocs, refetch: refetchUserDocs } = useReadContract({
    address: SECUDA_CONTRACT,
    abi: SECUDA_ABI,
    functionName: 'getUserDocuments',
    args: [address],
    query: {
      enabled: !!address,
    }
  })
  
  // Hook to get metadata for a specific token
  const { data: tokenMetadata, isPending: isLoadingMetadata, refetch: refetchMetadata } = useReadContract({
    address: SECUDA_CONTRACT,
    abi: SECUDA_ABI,
    functionName: 'getDocumentMetadata',
    args: currentTokenId !== null ? [currentTokenId] : undefined,
    query: {
      enabled: currentTokenId !== null,
    }
  })
  
  // Get user NFTs
    const getUserNFTs = useCallback(async () => {
        try {
        if (!address) {
            console.log("No wallet address available");
            return null;
        }
        
        console.log("Fetching documents for address:", address);
        console.log("Contract address:", SECUDA_CONTRACT);
        const { data } = await refetchUserDocs();
        console.log("Raw contract data received:", data);
        return data;
        } catch (error) {
        console.error('Error fetching user documents:', error);
        return null;
        }
    }, [address, refetchUserDocs]);
  
  // Get NFT metadata
  const getNFTMetadata = useCallback(async (tokenId: number) => {
    try {
      if (!address) return null
      
      // Set the token ID to trigger the metadata hook
      setCurrentTokenId(tokenId)
      
      // Force a refetch with the new token ID
      const { data } = await refetchMetadata()
      
      // Clear the token ID after fetching
      setCurrentTokenId(null)
      
      return data
    } catch (error) {
      console.error('Error fetching document metadata:', error)
      setCurrentTokenId(null)
      return null
    }
  }, [address, refetchMetadata])
  
  return {
    userDocuments,
    isLoadingUserDocs,
    getUserNFTs,
    getNFTMetadata,
    currentTokenMetadata: tokenMetadata,
    isLoadingMetadata
  }
}