import { useState, useCallback, useEffect } from 'react'
import { useWriteContract, useAccount, useWaitForTransactionReceipt } from 'wagmi'
import { PinataSDK } from 'pinata-web3'
import { toast } from 'react-hot-toast'
import SECUDA_ABI from "@/constants/abis/Secuda.json"
import { SECUDA_CONTRACT } from '@/constants/addresses/Secuda-contract'
import { supabase } from '@/utils/supabase';

// Type for upload options
type UploadType = 'upload' | 'mint'

export function useDocumentUpload() {
  const { address } = useAccount()
  const { writeContract, isPending, isSuccess, error, data: hash } = useWriteContract()
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  })
  
  const [isUploading, setIsUploading] = useState(false)
  const [IsStored, setIsStored] = useState(false)

  
  // Pinata setup
  const pinataCloudGateway = process.env.NEXT_PUBLIC_GATEWAY
  const pinata = new PinataSDK({
    pinataJwt: process.env.NEXT_PUBLIC_JWT_SECRET,
    pinataGateway: pinataCloudGateway
  })
  
  // Handle transaction states
  useEffect(() => {
    let toastId = null;
    
    // Handle the pending state
    if (isPending) {
      toastId = toast.loading("Please confirm in your wallet")
    }
    
    // Handle success (transaction sent)
    if (isSuccess && hash) {
      if (toastId) {
        toast.dismiss(toastId)
      }
      
      toastId = toast.loading("Transaction submitted, waiting for confirmation...")
    }
    
    // Handle confirmation
    if (isConfirmed) {
      if (toastId) {
        toast.dismiss(toastId)
      }
      
      toast.success("Document successfully minted")
      
      // Add explorer link if you have the URL
      const explorerURL = process.env.NEXT_PUBLIC_EXPLORER_URL
      if (explorerURL && hash) {
        toast.success(`View transaction: ${explorerURL}/tx/${hash}`)
      }
      
      setIsUploading(false)
    }
    
    // Handle error - this includes wallet rejection
    if (error) {
      if (toastId) {
        toast.dismiss(toastId)
      }
      
      // Check if the user rejected the transaction
      if (error.message?.toLowerCase().includes('user rejected') || 
          error.message?.toLowerCase().includes('rejected') ||
          error.message?.toLowerCase().includes('declined')) {
        toast.error("Transaction was rejected in your wallet")
      } else {
        toast.error(error.message || "Transaction failed")
      }
      
      setIsUploading(false)
    }
    
    // Clean up the toast when component unmounts
    return () => {
      if (toastId) {
        toast.dismiss(toastId)
      }
    }
  }, [isPending, isSuccess, isConfirmed, error, hash])
  
  // Mint document function
  const mintDocument = useCallback(
    async (documentHash: string, documentURI: string, documentName: string, documentType: string, documentSize: string) => {
      try {
        if (!address) {
          toast.error("No wallet connected")
          return false
        }
        
        // Use writeContract from wagmi hook
        writeContract({
          abi: SECUDA_ABI,
          address: SECUDA_CONTRACT,
          functionName: 'storeDocument',
          args: [documentHash, documentURI, documentName, documentType, documentSize]
        })

        await storeDocument(address, documentHash, documentURI, documentName, documentType, documentSize, "MINTED")
        
        return true
      } catch (mintDocumentError) {
        toast.error(String(mintDocumentError))
        setIsUploading(false)
        return false
      }
    }, 
    [address, writeContract]
  )
  
  const storeDocument = useCallback(
    async (address: string, documentHash: string, documentURI: string, documentName: string, documentType: string, documentSize: string, status: string) => {
      try {
        if (!address) {
          toast.error("No wallet connected")
          return false
        }
        
        // Store uploaded IPFS document details to Supabase
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { data, error } = await supabase
          .from('documents')
          .insert([
            {
              owner_address: address,
              document_hash: documentHash,
              document_uri: documentURI,
              document_name: documentName,
              document_type: documentType,
              document_size: documentSize,
              status: status,
              created_at: new Date().toISOString()
            }
          ])

          setIsStored(true)

          
        
        if (error) {
          console.error("Supabase storage error:", error)
          toast.error(`Failed to store document metadata: ${error.message}`)
          return false
        }
        
        toast.success(`Document metadata stored successfully`)
        return true
      } catch (storeDocumentError) {
        console.error("storeDocumentError", storeDocumentError)
        toast.error(String(storeDocumentError))
        setIsUploading(false)
        setIsStored(false)
        return false
      }
    }, 
    [address]
  )
  
  
  // Upload to IPFS function
  const uploadToIpfs = useCallback(
    async (
      file: File, 
      documentName: string, 
      uploadType: UploadType
    ) => {
      if (!address) {
        toast.error("Connect your wallet first")
        return false
      }
      
      if (!file) {
        toast.error("Select a document to proceed")
        return false
      }
      
      if (!documentName) {
        toast.error("Enter document name to proceed")
        return false
      }
      
      setIsUploading(true)
      
      try {
        // eslint-disable-next-line prefer-const
        let uploadToast = toast.loading(`Uploading ${documentName} to IPFS!`)
        
        const upload = await pinata.upload.file(file)
        
        toast.dismiss(uploadToast)
        setIsUploading(false)
        
        toast.success(
          uploadType === 'mint'
            ? `Document uploaded to IPFS for minting: ${documentName}`
            : `Document uploaded to IPFS: ${documentName}`
        )
        
        // Extract file details
        const fileExtension = file.name.split('.').pop() || ''
        const fileUrl = `https://${pinataCloudGateway}/ipfs/${upload.IpfsHash}`
        const fileSize = file.size.toString()
        
        // Prepare metadata for the document
        const metadata = {
          name: documentName,
          description: `Document uploaded via Secuda`,
          image: fileUrl,
          properties: {
            type: fileExtension,
            size: file.size.toString(),
            hash: upload.IpfsHash
          }
        }
        
        // Upload metadata to IPFS if minting
        const metadataUpload = await pinata.upload.json(metadata)
        const metadataUrl = `https://${pinataCloudGateway}/ipfs/${metadataUpload.IpfsHash}`

        if (uploadType === 'upload') {
          return storeDocument(address, upload.IpfsHash, metadataUrl, documentName, fileExtension, fileSize, "NOT MINTED")
        }
          
        // Call mint function if upload type is 'mint'
        console.log(`The uploaded file hash is ${upload.IpfsHash}, Metadata: ${metadataUrl}, Document name: ${documentName}, File type: ${fileExtension} and file size: ${fileSize}`)
        return mintDocument(upload.IpfsHash, metadataUrl, documentName, fileExtension, fileSize)
        
      } catch (uploadToIpfsError) {
        console.error("uploadToIpfsError", uploadToIpfsError)
        
        toast.error(String(uploadToIpfsError))
        setIsUploading(false)
        return false
      }
    },
    [address, mintDocument, storeDocument, pinata.upload, pinataCloudGateway]
  )
  
  return {
    uploadToIpfs,
    mintDocument,
    isUploading,
    isPending,
    isConfirming,
    isConfirmed,
    IsStored,
    error,
    hash
  }
}