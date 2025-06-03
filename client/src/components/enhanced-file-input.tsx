"use client"

import type React from "react"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Upload, X, File, ImageIcon, Video, FileText, Download, Eye } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"

interface FileWithPreview extends File {
  preview?: string
}

interface UploadedFile {
  name: string
  originalName: string
  size: number
  uploadDate: string
}

export function EnhancedFileInput() {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isDragOver, setIsDragOver] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(true)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Fetch uploaded files on component mount
  useEffect(() => {
    fetchUploadedFiles()
  }, [])

  const fetchUploadedFiles = async () => {
    try {
      setIsLoadingFiles(true)
      const response = await fetch("/api/files")
      if (response.ok) {
        const data = await response.json()
        setUploadedFiles(data.files || [])
      }
    } catch (error) {
      console.error("Error fetching files:", error)
    } finally {
      setIsLoadingFiles(false)
    }
  }

  const handleFiles = useCallback((newFiles: FileList | null) => {
    if (!newFiles) return

    const fileArray = Array.from(newFiles).map((file) => {
      const fileWithPreview = file as FileWithPreview

      // Create preview for images
      if (file.type.startsWith("image/")) {
        fileWithPreview.preview = URL.createObjectURL(file)
      }

      return fileWithPreview
    })

    setFiles((prev) => [...prev, ...fileArray])
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      handleFiles(e.dataTransfer.files)
    },
    [handleFiles],
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      handleFiles(e.target.files)
    },
    [handleFiles],
  )

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const newFiles = [...prev]
      const removedFile = newFiles[index]

      // Revoke object URL to prevent memory leaks
      if (removedFile.preview) {
        URL.revokeObjectURL(removedFile.preview)
      }

      newFiles.splice(index, 1)
      return newFiles
    })
  }, [])

  const getFileIcon = (file: File) => {
    if (file.type === "application/pdf") return <FileText className="h-4 w-4" />
    if (file.type.startsWith("image/")) return <ImageIcon className="h-4 w-4" />
    if (file.type.startsWith("video/")) return <Video className="h-4 w-4" />
    if (file.type.includes("text/") || file.type.includes("document")) return <File className="h-4 w-4" />
    return <File className="h-4 w-4" />
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const hasPdfFiles = useMemo(() => {
    return files.some((file) => file.type === "application/pdf")
  }, [files])

  const uploadFiles = async () => {
    if (!hasPdfFiles) return

    setIsUploading(true)

    try {
      const formData = new FormData()

      // Add all PDF files to FormData
      files.forEach((file, index) => {
        if (file.type === "application/pdf") {
          formData.append(`file-${index}`, file)
        }
      })

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`)
      }

      const result = await response.json()
      console.log("Upload successful:", result)

      // Clear files after successful upload
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      setFiles([])

      // Show success toast
      toast({
        title: "Upload Successful! 🎉",
        description: `${result.count} PDF file${result.count > 1 ? "s" : ""} uploaded successfully.`,
      })

      // Refresh the uploaded files list
      await fetchUploadedFiles()
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Upload Failed ❌",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCancel = () => {
    // Clean up any previews to prevent memory leaks
    files.forEach((file) => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])

    // Show cancel toast
    toast({
      title: "Upload Cancelled",
      description: "Selected files have been cleared.",
    })
  }

  const handleDownload = (filename: string) => {
    const link = document.createElement("a")
    link.href = `/uploads/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handlePreview = (filename: string) => {
    window.open(`/uploads/${filename}`, "_blank")
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Upload Section */}
      <div className="space-y-4">
        <Label htmlFor="file-upload" className="text-sm font-medium">
          Upload Files
        </Label>

        {/* Drag and Drop Zone */}
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ease-in-out cursor-pointer group",
            isDragOver
              ? "border-primary bg-primary/5 scale-105"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50",
            "focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20",
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <Input
            ref={fileInputRef}
            id="file-upload"
            type="file"
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleInputChange}
            accept="application/pdf"
          />

          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <div
              className={cn(
                "p-3 rounded-full transition-all duration-200",
                isDragOver
                  ? "bg-primary text-primary-foreground scale-110"
                  : "bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
              )}
            >
              <Upload className="h-6 w-6" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragOver ? "Drop files here" : "Click to upload or drag and drop"}
              </p>
              <p className="text-xs text-muted-foreground">PDF documents up to 10MB</p>
            </div>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selected Files ({files.length})</Label>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {files.map((file, index) => (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg border transition-all duration-200 hover:bg-muted/70 group"
                >
                  {/* File Preview or Icon */}
                  <div className="flex-shrink-0">
                    {file.preview ? (
                      <img
                        src={file.preview || "/placeholder.svg"}
                        alt={file.name}
                        className="h-10 w-10 object-cover rounded border"
                      />
                    ) : (
                      <div className="h-10 w-10 bg-background border rounded flex items-center justify-center">
                        {getFileIcon(file)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>

                  {/* Remove Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      removeFile(index)
                    }}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button onClick={uploadFiles} disabled={isUploading || !hasPdfFiles} className="flex-1">
                {isUploading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload PDF{files.length > 1 ? "s" : ""}
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={!hasPdfFiles} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* My Resumes Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">My Resumes</h2>
          <Button variant="ghost" size="sm" onClick={fetchUploadedFiles} disabled={isLoadingFiles}>
            {isLoadingFiles ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
            ) : (
              "Refresh"
            )}
          </Button>
        </div>

        {isLoadingFiles ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        ) : uploadedFiles.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No resumes uploaded yet</p>
            <p className="text-sm">Upload your first PDF resume above</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full">
            {uploadedFiles.map((file, index) => (
              <AccordionItem key={file.name} value={`item-${index}`}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-3 text-left">
                    <FileText className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium">{file.originalName}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)} • {formatDate(file.uploadDate)}
                      </p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">File Size:</span> {formatFileSize(file.size)}
                      </div>
                      <div>
                        <span className="font-medium">Uploaded:</span> {formatDate(file.uploadDate)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handlePreview(file.name)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDownload(file.name)}>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  )
}
