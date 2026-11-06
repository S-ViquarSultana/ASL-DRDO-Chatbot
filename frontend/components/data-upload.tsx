"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/context/data-context"
import { uploadData } from "@/lib/api"

interface DataUploadProps {
  onUploadComplete: () => void
}

export default function DataUpload({ onUploadComplete }: DataUploadProps) {
  const { toast } = useToast()
  const { setData } = useData()
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "text/csv") {
        setError("Please upload a CSV file")
        setFile(null)
        return
      }

      setFile(selectedFile)
      setError(null)

      // Read file for preview
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string
          const rows = text.split("\n").slice(0, 6) // Get header + 5 rows
          const parsedData = rows.map((row) => row.split(","))
          setPreview(parsedData)
        } catch (err) {
          setError("Error parsing CSV file")
          console.error(err)
        }
      }
      reader.readAsText(selectedFile)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setProgress(0)

    try {
      // Update progress
      setProgress(30)

      // Upload file to backend
      const result = await uploadData(file)
      
      // Update progress
      setProgress(80)

      // Update data in context
      setData(result.data)
      
      // Final progress
      setProgress(100)
      
      // Notify upload complete
      onUploadComplete()
      toast({
        title: "Success",
        description: "File uploaded successfully",
        variant: "default",
      })
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to upload file")
      console.error("Upload error:", error)
    } finally {
      setLoading(false)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Data Upload
          </CardTitle>
          <CardDescription>Upload your 2D data in CSV format for analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              error
                ? "border-destructive bg-destructive/10"
                : "border-muted-foreground/20 hover:border-primary/50 hover:bg-muted/50"
            }`}
            onClick={triggerFileInput}
          >
            <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} ref={fileInputRef} />
            <div className="flex flex-col items-center justify-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <h3 className="text-lg font-medium">{file ? file.name : "Click to upload or drag and drop"}</h3>
              <p className="text-sm text-muted-foreground">CSV files only (max 10MB)</p>
              {error && (
                <div className="flex items-center gap-2 text-destructive mt-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </div>

          {loading && (
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          {preview.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Data Preview</h3>
              <div className="border rounded-md overflow-auto max-h-64">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {preview[0].map((header: string, i: number) => (
                        <TableHead key={i}>{header}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preview.slice(1).map((row, i: number) => (
                      <TableRow key={i}>
                        {row.map((cell: string, j: number) => (
                          <TableCell key={j}>{cell}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}

          <div className="mt-6">
            <Button onClick={handleUpload} disabled={!file || loading} className="w-full">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  {file ? <CheckCircle className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
                  {file ? "Start Analysis" : "Upload CSV File"}
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
