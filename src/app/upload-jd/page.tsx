"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, FileText, ArrowLeft, File, Type } from "lucide-react"
import { apiPostFormData, apiPost } from "@/lib/api-client"

export default function UploadJDPage() {
  const router = useRouter()

  const [uploadMethod, setUploadMethod] = useState<"file" | "paste" | null>(null)
  const [jdText, setJdText] = useState("")
  const [fileName, setFileName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
  }

  const resolveUserId = () => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem("interview_prep_user_id") : null
    if (storedId) return storedId
    const generatedId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "00000000-0000-0000-0000-000000000000"
    if (typeof window !== "undefined") {
      localStorage.setItem("interview_prep_user_id", generatedId)
    }
    return generatedId
  }

  const getHeaders = (includeJson = false) => {
    const headers: Record<string, string> = { "X-User-Id": resolveUserId() }
    if (includeJson) headers["Content-Type"] = "application/json"
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  const handleAnalyzeJD = async () => {
    if (uploadMethod === "file" && !fileName) {
      setError("Please select a file")
      return
    }

    if (uploadMethod === "paste" && !jdText.trim()) {
      setError("Please provide a job description")
      return
    }

    setLoading(true)
    setError("")

    try {
      let savedJD

      if (uploadMethod === "file") {
        const fileInput = fileInputRef.current
        if (!fileInput?.files?.[0]) {
          throw new Error("No file selected")
        }

        const formData = new FormData()
        formData.append("file", fileInput.files[0])

        savedJD = await apiPostFormData<{ id: string }>(
          "/api/interview-prep/jd/upload-file",
          formData,
          { "X-User-Id": resolveUserId() }
        )
      } else {
        savedJD = await apiPost<{ id: string }>(
          "/api/interview-prep/jd/upload",
          {
            job_description: jdText,
            source_type: "paste",
          },
          getHeaders(true)
        )
      }

      if (!savedJD?.id) {
        throw new Error("Missing job description identifier")
      }

      const jdAnalysis = await apiPost(
        `/api/interview-prep/jd/${savedJD.id}/analyze`,
        {},
        getHeaders()
      )

      localStorage.setItem("jd_data", JSON.stringify({
        jd_id: savedJD.id,
        jd_text: uploadMethod === "file" ? fileName : jdText,
        jd_analysis: jdAnalysis,
      }))

      router.push("/onboarding")
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header with Back Button */}
          {uploadMethod && (
            <button
              onClick={() => setUploadMethod(null)}
              className="flex items-center gap-2 text-primary hover:text-primary/80 mb-8 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Choose another method</span>
            </button>
          )}

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3">Upload Job Description</h1>
            <p className="text-muted-foreground text-lg">
              Provide the JD to personalize your preparation
            </p>
          </div>

          {/* Method Selection Screen */}
          {!uploadMethod ? (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {/* Upload File Option */}
                <Card
                  onClick={() => setUploadMethod("file")}
                  className="border-border bg-white/70 backdrop-blur cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                >
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <File className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Upload JD File</h3>
                    <p className="text-muted-foreground mb-4">
                      Upload a PDF, TXT, or DOCX file containing your job description
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Supported formats: PDF, TXT, DOCX
                    </p>
                  </CardContent>
                </Card>

                {/* Paste Text Option */}
                <Card
                  onClick={() => setUploadMethod("paste")}
                  className="border-border bg-white/70 backdrop-blur cursor-pointer hover:border-primary hover:shadow-lg transition-all"
                >
                  <CardContent className="pt-12 pb-12 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-primary/10 rounded-full">
                        <Type className="h-10 w-10 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Paste JD Text</h3>
                    <p className="text-muted-foreground mb-4">
                      Copy and paste your job description directly into a text field
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Quick and convenient
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Info */}
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>Tip:</strong> A detailed job description will help us create a more
                  personalized interview preparation plan with relevant domains, KPIs, and
                  case studies for your target role.
                </p>
              </div>
            </div>
          ) : uploadMethod === "file" ? (
            // File Upload Form
            <div>
              <Card className="border-border bg-white/70 backdrop-blur mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Upload JD File</CardTitle>
                  <CardDescription>
                    Select a PDF, TXT, or DOCX file from your computer
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer hover:border-primary/50 transition-colors"
                  >
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="font-medium mb-2">Click to choose file</p>
                    <p className="text-sm text-muted-foreground">
                      or drag and drop
                    </p>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.txt,.docx"
                    onChange={handleFileUpload}
                    className="hidden"
                  />

                  {fileName && (
                    <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">{fileName}</span>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleAnalyzeJD}
                disabled={loading || !fileName}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                {loading ? "Analyzing & Generating Plan..." : "Analyze JD"}
              </Button>
            </div>
          ) : (
            // Paste Text Form
            <div>
              <Card className="border-border bg-white/70 backdrop-blur mb-8">
                <CardHeader>
                  <CardTitle className="text-lg">Paste JD Text</CardTitle>
                  <CardDescription>
                    Copy and paste your job description below
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Paste your job description here..."
                    value={jdText}
                    onChange={(e) => setJdText(e.target.value)}
                    autoFocus
                    className="w-full px-4 py-3 border border-border rounded-md bg-background/50 h-96 resize-none font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                onClick={handleAnalyzeJD}
                disabled={loading || !jdText.trim()}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                {loading ? "Analyzing & Generating Plan..." : "Analyze JD"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}