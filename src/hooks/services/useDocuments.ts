import { useState, useEffect, useCallback } from 'react'
import { useGetDocuments } from '@/hooks/read/useGetDocuments'
import { toast } from 'react-hot-toast'

// Define document type based on your table component
export type Document = {
  name: string
  date: string
  type: string
  size: string
  status: string
  tokenId?: number
  uri?: string
}

// Define the expected structure from your contract
interface DocumentData {
  name: string
  timestamp?: string | number
  fileType?: string
  fileSize?: string | number
  tokenId?: string | number
  uri?: string
  key: string
}

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { userDocuments, isLoadingUserDocs, getUserNFTs } = useGetDocuments()
  
  // Format documents from blockchain data
  const formatDocuments = useCallback((nfts: DocumentData[] | null | undefined) => {
    if (!nfts || nfts.length === 0) return []
    
    return nfts.map((nft: DocumentData) => {
      // Parse the date from timestamp if available
      const date = new Date(nft.timestamp ? Number(nft.timestamp) * 1000 : Date.now())
      const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
      
      return {
        name: nft.name || "Unnamed Document",
        date: formattedDate,
        type: nft.fileType || "Unknown",
        size: nft.fileSize ? `${(Number(nft.fileSize) / (1024 * 1024)).toFixed(1)} MB` : "Unknown",
        status: "Minted", // These are always minted since they come from the blockchain
        tokenId: nft.tokenId ? Number(nft.tokenId) : undefined,
        uri: nft.uri || ""
      }
    })
  }, [])
  
    const loadDocuments = useCallback(async () => {
        setIsLoading(true);
        
        try {
        // Debug what's happening
        console.log("Trying to fetch NFTs...");
        const nfts = await getUserNFTs();
        console.log("Raw NFTs data:", nfts); // Check exactly what format you're getting
        if (!Array.isArray(userDocuments)) {
            console.error("getUserDocuments returned non-array data:", userDocuments);
            return;
        }
        
        // Add more type safety with proper checking
        if (!nfts || !Array.isArray(nfts) || nfts.length === 0) {
            console.log("No documents found or invalid data format");
            setDocuments([]);
            return;
        }
        
        const formatted = formatDocuments(nfts as DocumentData[]);
        console.log("Formatted documents:", formatted);
        setDocuments(formatted);
        } catch (error) {
        console.error("Error loading documents:", error);
        toast.error("Failed to load your documents");
        setDocuments([]);
        } finally {
        setIsLoading(false);
        }
    }, [getUserNFTs, formatDocuments, userDocuments]);
  
  // React to automatic data updates from the hook
  useEffect(() => {
    if (!isLoadingUserDocs && userDocuments) {
      const formattedDocs = formatDocuments(userDocuments as DocumentData[])
      setDocuments(formattedDocs)
      setIsLoading(false)
    }
  }, [userDocuments, isLoadingUserDocs, formatDocuments])
  
  // Initial load
  useEffect(() => {
    if (isLoadingUserDocs) {
      setIsLoading(true)
    }
  }, [isLoadingUserDocs])
  
  return {
    documents,
    isLoading: isLoading || isLoadingUserDocs,
    loadDocuments,
  }
}