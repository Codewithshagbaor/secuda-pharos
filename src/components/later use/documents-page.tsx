"use client"

import { useDocuments } from "@/hooks/services/useDocuments"
import DocumentTable from "./document-table"
import { useEffect } from "react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"

export default function DocumentsPage() {
  const { address } = useAccount()
  const { documents, isLoading, loadDocuments } = useDocuments()
  
  // Reload documents when wallet changes
  useEffect(() => {
    if (address) {
      loadDocuments()
    }
  }, [address, loadDocuments])
  useEffect(() => {
    console.log("Wallet address changed:", address);
    if (address) {
      console.log("Loading documents for:", address);
      loadDocuments();
    } else {
      console.log("No wallet connected");
    }
  }, [address, loadDocuments]);
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Documents</h1>
        <Button 
          onClick={() => loadDocuments()}
          disabled={isLoading}
          variant="outline"
          size="sm"
        >
          Refresh
        </Button>
      </div>
      
      {!address ? (
        <div className="bg-[#071A32A3] border border-[#242D40] rounded-xl p-8 text-center">
          <h2 className="text-xl font-medium text-white mb-4">Connect your wallet to view documents</h2>
          <p className="text-gray-400">Your minted documents will appear here once you connect your wallet.</p>
        </div>
      ) : (
        <DocumentTable 
          documents={documents}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}