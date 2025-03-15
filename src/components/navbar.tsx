"use client"

import { useState, useRef } from "react"
import Button from "./button"
import { Upload, Search, FileText } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const pathname = usePathname()
  const isDocumentsPage = pathname === "/documents"
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadStep, setUploadStep] = useState(0) 
  interface SelectedFile {
    file: File;
    name: string;
    size: string;
  }
  
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null)
  const [uploadType, setUploadType] = useState("upload") // "upload" or "mint"
  const [isProcessing, setIsProcessing] = useState(false)

  const handleUploadClick = () => {
    setUploadStep(1)
  }

  const handleFileInputClick = () => {
    fileInputRef.current?.click()
  }

  interface FileChangeEvent extends React.ChangeEvent<HTMLInputElement> {
    target: HTMLInputElement & EventTarget;
  }

  const handleFileChange = (e: FileChangeEvent) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile({
        file: e.target.files[0],
        name: e.target.files[0].name,
        size: (e.target.files[0].size / 1024 / 1024).toFixed(2)
      })
      setUploadStep(2)
    }
  }

  interface DropEvent extends React.DragEvent<HTMLDivElement> {
    dataTransfer: DataTransfer & {
      files: FileList;
    };
  }

  const handleDrop = (e: DropEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files[0]) {
      setSelectedFile({
        file: e.dataTransfer.files[0],
        name: e.dataTransfer.files[0].name,
        size: (e.dataTransfer.files[0].size / 1024 / 1024).toFixed(2)
      })
      setUploadStep(2)
    }
  }

  const handleDragOver: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault()
  }

  const handleUploadSubmit = async () => {
    setUploadStep(3)
    setIsProcessing(true)
    
    // Simulate processing(checking this)
    setTimeout(() => {
      setIsProcessing(false)
      setTimeout(() => {
        closeUploadDialog()
      }, 2500)
    }, 3000)
  }

  const closeUploadDialog = () => {
    setUploadStep(0)
    setSelectedFile(null)
    setUploadType("upload")
    setIsProcessing(false)
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
          <Button
            variant="primary"
            className="h-9 text-sm font-medium bg-[#2B9DDA] hover:bg-[#2589c2] truncate rounded-full"
          >
            Hello! 0xe...0009
          </Button>
        </div>
      </header>

      {/* Upload */}
      {uploadStep > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#040E24] border border-[#1e2d47] rounded-lg w-full max-w-3xl mx-4">
            <div className="p-8">
              <h2 className="text-white text-center text-lg mb-2">
                {uploadStep === 3 
                  ? uploadType === "mint" 
                    ? "Minting your document" 
                    : "Uploading your document"
                  : "Upload your document securely to the blockchain, choose a document type and set your privacy preferences."}
              </h2>
              
              {uploadStep === 1 && (
                <div 
                  className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-6 p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-white text-center mb-8">
                      Select your file or drag and drop here
                    </p>
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
                  className="border-2 border-dashed border-[#3A4358] bg-[#0C2A49D4] rounded-lg mt-6 p-12"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-white text-center mb-8">
                      Select your file or drag and drop here
                    </p>
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
                  <div className="bg-[#0a1830] p-4 rounded-lg flex items-center">
                    <div className="text-[#2B9DDA] mr-3">
                      <FileText size={24} />
                    </div>
                    <div>
                      <div className="text-[#00D966] font-medium">File selected</div>
                      <div className="text-white">{selectedFile.name}</div>
                      <div className="text-gray-400 text-sm">{selectedFile.size} MB</div>
                    </div>
                  </div>
                  
                  <input 
                    type="text"
                    placeholder="Enter a name for your document"
                    className="w-full bg-transparent border border-[#3A4358] rounded-3xl px-4 py-3 mt-4 text-white focus:outline-none focus:border-[#2B9DDA]"
                  />
                  
                  <div className="mt-4">
                    <p className="text-white mb-2">Select upload type:</p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="uploadType"
                          value="upload"
                          checked={uploadType === "upload"}
                          onChange={() => setUploadType("upload")}
                          className="mr-2"
                        />
                        <span className="text-white">Upload only</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="uploadType"
                          value="mint"
                          checked={uploadType === "mint"}
                          onChange={() => setUploadType("mint")}
                          className="mr-2"
                        />
                        <span className="text-white">Upload and mint as NFT</span>
                      </label>
                    </div>
                  </div>
                  
                  <div className="mt-8 flex justify-center">
                    <Button
                      variant="primary"
                      className="bg-[#fff] text-[#000] hover:bg-[#2589c2] hover:text-[#fff] rounded-full px-8 py-2"
                      onClick={handleUploadSubmit}
                    >
                      Upload to blockchain
                    </Button>
                  </div>
                </div>
              )}
              
              {uploadStep === 3 && (
                <div className="border border-dashed border-[#3A4358] rounded-lg mt-6 p-12">
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-white text-center mb-4">
                      {uploadType === "mint" 
                        ? "Your document is being minted as an NFT, please relax a little" 
                        : "Your document is being uploaded to the blockchain, please relax a little"}
                    </p>
                    
                    <div className="relative w-full h-8 flex items-center justify-center">
                      <div 
                        className={`absolute h-4 w-4 bg-[#2B9DDA] rounded-full ${isProcessing ? "animate-spin" : ""}`} 
                        style={{
                          left: isProcessing ? "50%" : "90%",
                          transition: "left 30s ease-in-out",
                          transform: "translateX(-50%)"
                        }}
                      />
                    </div>

                    {!isProcessing && (
                      <p className="text-[#00D966] text-center mt-6">
                        {uploadType === "mint" 
                          ? "Upload complete! You can check your NFT in the minting pane." 
                          : "Upload complete! You can check your document in the documents pane."}
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