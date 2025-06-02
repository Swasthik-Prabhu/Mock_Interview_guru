import { NextResponse } from "next/server"
import { readdir, stat } from "fs/promises"
import path from "path"

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads")

    try {
      const files = await readdir(uploadsDir)
      const fileDetails = await Promise.all(
        files
          .filter((file) => file.endsWith(".pdf"))
          .map(async (file) => {
            const filePath = path.join(uploadsDir, file)
            const stats = await stat(filePath)

            // Extract original name (remove timestamp prefix)
            const originalName = file.replace(/^\d+_/, "")

            return {
              name: file,
              originalName: originalName,
              size: stats.size,
              uploadDate: stats.birthtime.toISOString(),
            }
          }),
      )

      // Sort by upload date (newest first)
      fileDetails.sort((a, b) => new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime())

      return NextResponse.json({
        files: fileDetails,
        count: fileDetails.length,
      })
    } catch (error) {
      // Directory doesn't exist or is empty
      return NextResponse.json({
        files: [],
        count: 0,
      })
    }
  } catch (error) {
    console.error("Error reading files:", error)
    return NextResponse.json({ error: "Failed to read files" }, { status: 500 })
  }
}
