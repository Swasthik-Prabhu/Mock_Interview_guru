import { type NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const uploadedFiles: string[] = []

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads")
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Process each file in the FormData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file-") && value instanceof File) {
        const file = value as File

        // Validate file type
        if (file.type !== "application/pdf") {
          return NextResponse.json(
            { error: `Invalid file type: ${file.type}. Only PDF files are allowed.` },
            { status: 400 },
          )
        }

        // Validate file size (10MB limit)
        const maxSize = 10 * 1024 * 1024 // 10MB in bytes
        if (file.size > maxSize) {
          return NextResponse.json({ error: `File ${file.name} is too large. Maximum size is 10MB.` }, { status: 400 })
        }

        // Generate unique filename
        const timestamp = Date.now()
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filename = `${timestamp}_${sanitizedName}`
        const filepath = path.join(uploadsDir, filename)

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        await writeFile(filepath, buffer)

        uploadedFiles.push(filename)
        console.log(`File saved: ${filename}`)
      }
    }

    if (uploadedFiles.length === 0) {
      return NextResponse.json({ error: "No valid PDF files found in the request." }, { status: 400 })
    }

    return NextResponse.json({
      message: "Files uploaded successfully",
      files: uploadedFiles,
      count: uploadedFiles.length,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Internal server error during file upload." }, { status: 500 })
  }
}
