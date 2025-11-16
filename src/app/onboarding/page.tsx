"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle, Loader } from "lucide-react"

export default function OnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    experience_level: "mid",
    target_role: "",
    industry: "",
    current_skills: [] as string[],
    preparation_timeline_weeks: 12,
    company_name: "",
    notes: "",
  })

  const timelineOptions = [
    { label: "1-2 weeks", value: 2 },
    { label: "1 month", value: 4 },
    { label: "2-3 months", value: 12 },
    { label: "3-6 months", value: 20 },
    { label: "6+ months", value: 26 },
  ]

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [extractedJDInfo, setExtractedJDInfo] = useState<{
    role_title: string
    key_skills: string[]
    domains: string[]
    suggested_subjects: string[]
    experience_level: string
    key_responsibilities: string[]
  } | null>(null)
  const [extractingJD, setExtractingJD] = useState(false)

  const resolveUserId = () => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem("interview_prep_user_id") : null
    if (storedId) return storedId
    const generatedId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "00000000-0000-0000-0000-000000000000"
    if (typeof window !== "undefined") {
      localStorage.setItem("interview_prep_user_id", generatedId)
    }
    return generatedId
  }

  useEffect(() => {
    const jdDataStr = typeof window !== "undefined" ? localStorage.getItem("jd_data") : null
    if (jdDataStr) {
      const jdData = JSON.parse(jdDataStr)
      if (jdData.jd_text) {
        extractJDInfo(jdData.jd_text)
      }
    }
  }, [])

  const extractJDInfo = async (jdText: string) => {
    setExtractingJD(true)
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      const response = await fetch(`${backendUrl}/api/interview-prep/extract-jd`, {
        method: "POST",
        headers: {
          "X-User-Id": resolveUserId(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_description: jdText,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setExtractedJDInfo(data)
        
        setFormData((prev) => ({
          ...prev,
          target_role: data.role_title || prev.target_role,
          current_skills: data.key_skills || prev.current_skills,
          experience_level: data.experience_level || prev.experience_level,
        }))
      }
    } catch (err) {
      console.error("Failed to extract JD info:", err)
    } finally {
      setExtractingJD(false)
    }
  }

  const experienceLevels = [
    { value: "entry", label: "Entry (0-2 years)", description: "Just starting out" },
    { value: "mid", label: "Mid (2-5 years)", description: "Some experience" },
    { value: "senior", label: "Senior (5+ years)", description: "Extensive experience" },
    { value: "career-change", label: "Career Change", description: "Switching fields" },
  ]

  const industries = [
    "FinTech",
    "Technology",
    "Healthcare",
    "E-commerce",
    "Manufacturing",
    "Retail",
    "Finance",
    "Other",
  ]

  const availableSkills = [
    "SQL",
    "Python",
    "Excel",
    "Power BI",
    "Tableau",
    "Statistics",
    "R",
    "JavaScript",
    "Data Analysis",
    "Machine Learning",
    "Cloud (AWS/GCP/Azure)",
    "Communication",
  ]

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      current_skills: prev.current_skills.includes(skill)
        ? prev.current_skills.filter((s) => s !== skill)
        : [...prev.current_skills, skill],
    }))
  }

  const getHeaders = (includeJson = false) => {
    const headers: Record<string, string> = { "X-User-Id": resolveUserId() }
    if (includeJson) headers["Content-Type"] = "application/json"
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      
      const response = await fetch(`${backendUrl}/api/interview-prep/profile`, {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify({
          ...formData,
          preparation_timeline_weeks: Number(formData.preparation_timeline_weeks) || 12,
          current_skills: formData.current_skills ?? [],
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save profile")
      }

      const profileData = await response.json()
      
      const jdDataStr = localStorage.getItem("jd_data")
      
      if (jdDataStr) {
        const jdData = JSON.parse(jdDataStr)
        
        const planResponse = await fetch(`${backendUrl}/api/interview-prep/plan/generate`, {
          method: "POST",
          headers: getHeaders(true),
          body: JSON.stringify({
            profile_id: profileData.id,
            jd_id: jdData.jd_id,
          }),
        })

        if (!planResponse.ok) {
          throw new Error("Failed to generate plan")
        }

        const plan = await planResponse.json()
        
        localStorage.removeItem("jd_data")
        
        router.push(`/plan?planId=${plan.id}`)
      } else {
        router.push(`/upload-jd?profileId=${profileData.id}`)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold mb-3">Tell Us About Yourself</h1>
            <p className="text-muted-foreground text-lg">
              Help us tailor your preparation plan
            </p>
          </div>

          {extractingJD && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
              <Loader className="h-5 w-5 text-blue-600 animate-spin" />
              <span className="text-blue-900">Analyzing job description...</span>
            </div>
          )}

          {extractedJDInfo && (
            <Card className="mb-8 border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-900">
                  <CheckCircle2 className="h-5 w-5" />
                  JD Analysis Complete
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm font-semibold text-green-900 mb-2">Extracted Information:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-green-800 font-medium">Role Title</p>
                      <p className="text-sm font-semibold text-green-900">{extractedJDInfo.role_title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-green-800 font-medium">Experience Level</p>
                      <p className="text-sm font-semibold text-green-900 capitalize">{extractedJDInfo.experience_level}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-green-800 font-medium mb-2">Suggested Domains</p>
                  <div className="flex flex-wrap gap-2">
                    {extractedJDInfo.domains.map((domain) => (
                      <Badge key={domain} variant="secondary" className="bg-green-100 text-green-900">
                        {domain}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-green-800 font-medium mb-2">Suggested Topics</p>
                  <div className="flex flex-wrap gap-2">
                    {extractedJDInfo.suggested_subjects.map((subject) => (
                      <Badge key={subject} variant="default" className="bg-green-700 text-white">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-green-800 font-medium mb-2">Key Responsibilities</p>
                  <ul className="text-sm text-green-900 space-y-1">
                    {extractedJDInfo.key_responsibilities.map((resp, idx) => (
                      <li key={idx} className="list-disc list-inside">{resp}</li>
                    ))}
                  </ul>
                </div>

                <p className="text-xs text-green-800 font-medium">
                  💡 Feel free to modify the skills and other details below to match your profile
                </p>
              </CardContent>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              {/* Experience Level */}
              <Card className="border-border bg-white/70 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg">Current Experience Level *</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {experienceLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, experience_level: level.value })
                        }
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          formData.experience_level === level.value
                            ? "border-primary bg-primary/5"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        <div className="font-medium text-sm">{level.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {level.description}
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Target Role & Industry */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border bg-white/70 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg">Target Role *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="text"
                      placeholder="e.g., Data Analyst"
                      value={formData.target_role}
                      onChange={(e) =>
                        setFormData({ ...formData, target_role: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background/50"
                      required
                    />
                  </CardContent>
                </Card>

                <Card className="border-border bg-white/70 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg">Industry *</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      value={formData.industry}
                      onChange={(e) =>
                        setFormData({ ...formData, industry: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background/50"
                      required
                    >
                      <option value="">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>
              </div>

              {/* Current Skills */}
              <Card className="border-border bg-white/70 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg">Current Skills</CardTitle>
                  <CardDescription>
                    Select skills you already have
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {availableSkills.map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleSkillToggle(skill)}
                        className={`px-3 py-1 rounded-full text-sm transition-all ${
                          formData.current_skills.includes(skill)
                            ? "bg-primary text-white"
                            : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                        }`}
                      >
                        {skill}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Timeline, Company, Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="border-border bg-white/70 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <select
                      value={formData.preparation_timeline_weeks}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          preparation_timeline_weeks: Number(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background/50"
                    >
                      {timelineOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </CardContent>
                </Card>

                <Card className="border-border bg-white/70 backdrop-blur">
                  <CardHeader>
                    <CardTitle className="text-lg">Company Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <input
                      type="text"
                      placeholder="e.g., Acme Corp"
                      value={formData.company_name}
                      onChange={(e) =>
                        setFormData({ ...formData, company_name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-border rounded-md bg-background/50"
                    />
                  </CardContent>
                </Card>
              </div>

              {/* Notes */}
              <Card className="border-border bg-white/70 backdrop-blur">
                <CardHeader>
                  <CardTitle className="text-lg">Additional Notes</CardTitle>
                  <CardDescription>
                    Any details or instructions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    placeholder="Any additional details or instructions..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-border rounded-md bg-background/50 h-24 resize-none"
                  />
                </CardContent>
              </Card>

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading || !formData.target_role || !formData.industry}
                className="w-full h-12 text-base font-semibold bg-primary hover:bg-primary/90"
              >
                {loading ? "Saving..." : "Save Details & Generate Plan"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}