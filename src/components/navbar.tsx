"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Button from "./button"
import { Upload, Search, FileText, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import ConnectWalletButton from "@/components/ConnectWeb3Wallet"
import ChainSelector from "./ChainSelector";
import { useDocumentUpload } from '@/hooks/write/useMintDocument'
import { toast } from 'react-hot-toast'

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const isDocumentsPage = pathname === "/documents"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStep, setUploadStep] = useState(0)


  // Import the document upload hook with all needed properties
  const { 
    uploadToIpfs, 
    isPending, 
    isConfirming,
    isConfirmed,
    IsStored,
    isUploading,
    error 
  } = useDocumentUpload()

  interface SelectedFile {
    file: File
    name: string
    size: string
  }

  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [documentName, setDocumentName] = useState("")
  const [uploadType, setUploadType] = useState<'upload' | 'mint'>("upload")
  const [redirectPath, setRedirectPath] = useState("")

  // Update useEffect to handle upload status and redirect after confirmation
  useEffect(() => {
    if (isConfirmed && redirectPath) {
      const timer = setTimeout(() => {
        closeUploadDialog()
        router.push(redirectPath)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [isConfirmed, redirectPath, router])

  useEffect(() => {
    if (IsStored && redirectPath && uploadType === "upload") {
      const timer = setTimeout(() => {
        closeUploadDialog()
        router.push(redirectPath)
      }, 2500)

      return () => clearTimeout(timer)
    }
  }, [IsStored, redirectPath, uploadType, router])

  // Monitor transaction states and update UI accordingly
  useEffect(() => {
    // If we're in step 3 and the transaction is confirmed, show success message
    if (uploadStep === 3 && isConfirmed) {
      // Success is already handled by the redirect effect
    }
    
    // If there was an error, go back to step 2 to allow retry
    if (error && uploadStep === 3) {
      setUploadStep(2)
      toast.error(`Transaction failed: ${error.message || "Unknown error"}`)
    }
  }, [isConfirmed, error, uploadStep])

  const handleUploadClick = () => {
    setUploadStep(1)
    setRedirectPath("")
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  // Helper function to get file name without extension
  const getFileNameWithoutExtension = (fileName: string) => {
    return fileName.replace(/\.[^/.]+$/, "")
  }

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget
  }

  const handleFileChange = (e: FileChangeEvent) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      const fileNameWithoutExt = getFileNameWithoutExtension(file.name)

      setSelectedFile({
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })

      // Set the document name without extension
      setDocumentName(fileNameWithoutExt)
      setUploadStep(2)
    }
  }

  interface DropEvent extends React.DragEvent<HTMLDivElement> {
    dataTransfer: DataTransfer & {
      files: FileList
    }
  }

  const handleDrop = (e: DropEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const fileNameWithoutExt = getFileNameWithoutExtension(file.name)

      setSelectedFile({
        file: file,
        name: file.name,
        size: (file.size / 1024 / 1024).toFixed(2),
      })

      // Set the document name without extension
      setDocumentName(fileNameWithoutExt)
      setUploadStep(2)
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }

  // Modified upload submit to use uploadToIpfs and handle transaction states
  const handleUploadSubmit = async (type: 'upload' | 'mint', path: string) => {
    if (!selectedFile) {
      toast.error("No file selected")
      return
    }

    if (!documentName.trim()) {
      toast.error("Please enter a document name")
      return
    }

    // Set the upload type and redirect path
    setUploadType(type)
    setRedirectPath(path)
    
    // Move to the uploading state
    setUploadStep(3)

    try {
      // Call the uploadToIpfs function with the specified type
      uploadToIpfs(
        selectedFile.file, 
        documentName, 
        type  // Use the passed type directly instead of the state
      )
      console.log(`Upload type is: ${type}`)
      console.log(`Redirect path is: ${path}`)
      
      // will be monitored by the useEffect hooks
    } catch (err) {
      console.error("Upload error:", err)
      setUploadStep(2) // Go back to form step
      toast.error("An error occurred during upload")
    }
  }

  const closeUploadDialog = () => {
    setUploadStep(0)
    setSelectedFile(null)
    setDocumentName("")
    // Don't reset uploadType and redirectPath here to preserve the selection
  }

  // Get the current process status for display
  const getProcessStatus = () => {
    if (isUploading) return "Uploading to IPFS..."
    if (isPending) return "Confirm in your wallet..."
    if (isConfirming) return "Transaction confirming..."
    if (isConfirmed) return "Upload complete!"
    return uploadType === "mint" 
      ? "Minting your document" 
      : "Uploading your document"
  }

  function setSelectedChainId(id: number): void {
    console.log(`Selected chain ID: ${id}`);
    // You can add additional logic here if needed, such as updating state or context
  }
  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-[#040E24] border-b border-[#1e2d47]">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/img/logo.png" alt="DataBank" width={200} height={200} className="h-6 w-auto" />
          </Link>
          {isDocumentsPage && (
            <div className="hidden sm:flex justify-start items-center border border-[#3A4358] rounded-full sm:pr-24 px-4 py-1.5 sm:ml-32">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search Document"
                className="bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none ml-2 w-full"
              />
            </div>
          )}
        </div>
        <div className="flex justify-start items-center gap-2 sm:gap-3">
          <Button
            variant="outline"
            className="h-9 text-sm font-medium border-[#3A4358] hover:bg-[#0c1a36] hidden sm:flex rounded-full"
            onClick={handleUploadClick}
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
          {/* Mobile upload button */}
          <Button
            variant="outline"
            className="h-9 w-9 p-0 flex items-center justify-center sm:hidden border-[#3A4358] hover:bg-[#0c1a36] rounded-full"
            onClick={handleUploadClick}
          >
            <Upload className="h-4 w-4" />
            <span className="sr-only">Upload Document</span>
          </Button>
          <ChainSelector setSelectedChainId={setSelectedChainId} />
          <ConnectWalletButton />
        </div>
      </header>
      {/* Upload Modal */}
      {uploadStep > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#040E24] border border-[#1e2d47] rounded-lg w-full max-w-3xl relative">
            <button
              onClick={closeUploadDialog}
              className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-full hover:bg-[#1e2d47] transition-colors"
              aria-label="Close"
              disabled={uploadStep === 3 && !isConfirmed}
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-4 sm:p-8">
              <h2 className="text-white text-center text-lg mb-2 pr-8">
                {uploadStep === 3
                  ? getProcessStatus()
                  : "Upload your document securely to the blockchain."}
              </h2>

              {/* Existing upload steps remain the same */}
              {uploadStep === 1 && (
                <div
                  className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-6 p-6 sm:p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {/* File upload input */}
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-white text-center mb-8">Select your file or drag and drop here</p>
                    <Button
                      variant="primary"
                      className="bg-[#2B9DDA] hover:bg-[#2589c2] rounded-full"
                      onClick={handleFileInputClick}
                    >
                      <Image src="/img/cloud-upload.png" alt="Upload" width={24} height={24} className="h-6 w-6 mr-2" />
                      Upload document
                    </Button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </div>
                </div>
              )}

              {uploadStep === 2 && selectedFile && (
                <div className="mt-6">
                  <div
                    className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-6 p-6 sm:p-12"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    {/* Existing file selection UI */}
                    <div className="flex flex-col items-center justify-center">
                      <p className="text-sm text-white text-center mb-8">Select your file or drag and drop here</p>
                      <Button
                        variant="primary"
                        className="bg-[#2B9DDA] hover:bg-[#2589c2] rounded-full"
                        onClick={handleFileInputClick}
                      >
                        <Image
                          src="/img/cloud-upload.png"
                          alt="Upload"
                          width={24}
                          height={24}
                          className="h-6 w-6 mr-2"
                        />
                        Re-upload document
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      />
                    </div>
                  </div>
                  
                  {/* Selected file details */}
                  <div className="bg-[#0a1830] p-4 rounded-lg flex items-center">
                    <div className="text-[#2B9DDA] mr-3">
                      <FileText size={24} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-[#00D966] font-medium">File selected</div>
                      <div className="text-white truncate">{selectedFile.name}</div>
                      <div className="text-gray-400 text-sm">{selectedFile.size} MB</div>
                    </div>
                  </div>

                  {/* Document name input */}
                  <input
                    type="text"
                    placeholder="Enter a name for your document"
                    className="w-full bg-transparent border border-[#3A4358] rounded-3xl px-4 py-3 mt-4 text-white focus:outline-none focus:border-[#2B9DDA]"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                  />

                  {/* Upload type selection - FIXED */}
                  <div className="mt-4">
                    <p className="text-white mb-4 text-center sm:text-left">Select upload type:</p>
                    <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center">
                      <button
                        type="button"
                        className={`rounded-full px-6 py-2 ${
                          uploadType === "upload"
                            ? "bg-[#2B9DDA] text-white"
                            : "bg-[#0C2A49] text-white border border-[#3A4358]"
                        }`}
                        onClick={() => handleUploadSubmit("upload", "/documents")}
                      >
                        Upload only
                      </button>
                      <button
                        type="button"
                        className={`rounded-full px-6 py-2 ${
                          uploadType === "mint"
                            ? "bg-[#2B9DDA] text-white"
                            : "bg-[#0C2A49] text-white border border-[#3A4358]"
                        }`}
                        onClick={() => handleUploadSubmit("mint", "/nft-minting")}
                      >
                        Upload and mint as NFT
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {uploadStep === 3 && (
                <div className="border border-dashed border-[#3A4358] rounded-lg mt-6 p-6 sm:p-12">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-center mb-6">
                      {getProcessStatus()}
                    </p>

                    <div className="">
                      <Image src="/img/load.gif" alt="Loading" height={200} width={200} className="object-contain" />
                    </div>

                    {isConfirmed && (
                      <p className="text-[#00D966] text-center mt-6">
                        {uploadType === "mint"
                          ? `Upload complete! Redirecting to NFT page...`
                          : `Upload complete! Redirecting to documents page...`}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}