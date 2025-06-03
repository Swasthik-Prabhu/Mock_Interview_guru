import { EnhancedFileInput } from "@/components/enhanced-file-input"
import { Toaster } from "@/components/ui/toaster"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Resume Manager</h1>
          <p className="text-muted-foreground">Upload and manage your PDF resumes</p>
        </div>

        <div className="bg-card border rounded-xl p-6 shadow-lg">
          <EnhancedFileInput />
        </div>

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-2">Features:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Upload multiple PDF resumes at once</li>
            <li>• Preview and download your uploaded resumes</li>
            <li>• Automatic file organization with timestamps</li>
            <li>• Toast notifications for all actions</li>
          </ul>
        </div>
      </div>
      <Toaster />
    </div>
  )
}
