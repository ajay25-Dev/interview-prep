"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  ChevronDown,
  BookOpen,
  Target,
  FileText,
  TrendingUp,
  Loader,
} from "lucide-react"

interface KPI {
  name: string
  description: string
  importance: string
}

interface Domain {
  title: string
  description: string
  core_topics: string[]
  kpis: KPI[]
}

interface CaseStudy {
  title: string
  business_problem: string
  solution_outline: string
  key_learnings: string[]
}

interface CaseStudyQuestion {
  question_number: number
  question: string
  expected_approach: string
  difficulty: string
  sample_input?: string
  sample_output?: string
}

interface SubjectCaseStudy {
  title: string
  description: string
  dataset_overview: string
  problem_statement: string
  questions: CaseStudyQuestion[]
  estimated_time_minutes: number
  dataset_schema?: string
  sample_data?: string
}

interface SubjectPrepData {
  subject: string
  case_studies: SubjectCaseStudy[]
  key_learning_points: string[]
  common_mistakes: string[]
}

interface PlanContent {
  domains: Domain[]
  case_studies: CaseStudy[]
  subject_prep?: Record<string, SubjectPrepData>
  subjects_covered?: string[]
  summary?: string
  estimated_hours?: number
}

export default function PlanPage() {
  const searchParams = useSearchParams()
  const planId = searchParams.get("planId")

  const [plan, setPlan] = useState<PlanContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null)
  const [expandedCase, setExpandedCase] = useState<string | null>(null)
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)
  const [expandedSubjectCase, setExpandedSubjectCase] = useState<string | null>(null)

  const resolveUserId = () => {
    const storedId = typeof window !== "undefined" ? localStorage.getItem("interview_prep_user_id") : null
    if (storedId) return storedId
    const generatedId = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "00000000-0000-0000-0000-000000000000"
    if (typeof window !== "undefined") {
      localStorage.setItem("interview_prep_user_id", generatedId)
    }
    return generatedId
  }

  const getHeaders = () => {
    const headers: Record<string, string> = { "X-User-Id": resolveUserId() }
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null
    if (token) headers.Authorization = `Bearer ${token}`
    return headers
  }

  useEffect(() => {
    const fetchPlan = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
        const response = await fetch(
          `${backendUrl}/api/interview-prep/plan/${planId || ""}`,
          {
            headers: getHeaders(),
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch plan")
        }

        const data = await response.json()
        const planContent = data.plan_content || data
        console.log("Plan data received:", planContent)
        console.log("Subjects covered:", planContent?.subjects_covered)
        console.log("Subject prep keys:", planContent?.subject_prep ? Object.keys(planContent.subject_prep) : "none")
        setPlan(planContent)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      } finally {
        setLoading(false)
      }
    }

    if (planId) {
      fetchPlan()
    }
  }, [planId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading your personalized interview prep plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>No plan data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Your Personalized Interview Prep Plan</h1>
          <p className="text-muted-foreground text-lg">
            Tailored by AI based on your skills, domain, and role
          </p>
        </div>

        {/* Domain Knowledge Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Domain Knowledge + KPIs</h2>
          </div>

          <div className="space-y-4">
            {plan.domains && plan.domains.length > 0 ? (
              plan.domains.map((domain, idx) => (
                <Card
                  key={idx}
                  className="border-border bg-white/70 backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    setExpandedDomain(expandedDomain === domain.title ? null : domain.title)
                  }
                >
                  <div className="flex items-center justify-between p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{domain.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {domain.description}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform ${
                        expandedDomain === domain.title ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {expandedDomain === domain.title && (
                    <CardContent className="border-t border-border pt-6">
                      {/* Core Topics */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-sm mb-3">Core Topics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {domain.core_topics.map((topic, i) => (
                            <Badge key={i} variant="secondary">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* KPIs */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">KPIs:</h4>
                        <div className="space-y-3">
                          {domain.kpis.map((kpi, i) => (
                            <div
                              key={i}
                              className="p-3 bg-primary/5 rounded-lg border border-primary/20"
                            >
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-sm">{kpi.name}</p>
                                <Badge
                                  className="text-xs"
                                  variant={
                                    kpi.importance === "high" ? "default" : "secondary"
                                  }
                                >
                                  {kpi.importance}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1">
                                {kpi.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No domain knowledge available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Subject-Specific Prep Section - Grid Layout */}
        {plan.subjects_covered && plan.subjects_covered.length > 0 ? (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-8">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">Subject-Specific Interview Preparation</h2>
            </div>

            {plan.subjects_covered.map((subject) => {
              const subjectData = plan.subject_prep?.[subject]
              if (!subjectData) return null

              const subjectColorMap: Record<string, { bg: string; border: string; badge: string; title: string }> = {
                SQL: { bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-500", title: "text-blue-900" },
                Python: { bg: "bg-green-50", border: "border-green-200", badge: "bg-green-500", title: "text-green-900" },
                "Power BI": { bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-500", title: "text-orange-900" },
                "Guess Estimate": { bg: "bg-red-50", border: "border-red-200", badge: "bg-red-500", title: "text-red-900" },
                Statistics: { bg: "bg-indigo-50", border: "border-indigo-200", badge: "bg-indigo-500", title: "text-indigo-900" },
              }

              const colors = subjectColorMap[subject] || {
                bg: "bg-purple-50",
                border: "border-purple-200",
                badge: "bg-purple-500",
                title: "text-purple-900",
              }

              return (
                <div key={subject} className="mb-16">
                  {/* Topic Header */}
                  <div className={`p-6 rounded-t-lg border-2 ${colors.border} ${colors.bg}`}>
                    <div className="flex items-center gap-3">
                      <Badge className={`${colors.badge} text-white text-lg px-3 py-1`}>
                        {subject}
                      </Badge>
                      <h2 className={`text-3xl font-bold ${colors.title}`}>
                        {subject} Mastery
                      </h2>
                    </div>
                  </div>

                  {/* Main Content */}
                  <Card className={`border-2 border-t-0 ${colors.border} rounded-t-none`}>
                    <CardContent className="pt-8">
                      {/* Case Study Sections */}
                      <div className="mb-10">
                        <h3 className="text-xl font-bold mb-6">Case Studies & Practice Questions</h3>

                        {subjectData.case_studies.map((caseStudy, caseIdx) => (
                          <div key={caseIdx} className="mb-10 last:mb-0">
                            {/* Case Study Header */}
                            <div
                              className={`p-4 rounded-lg border-2 ${colors.border} cursor-pointer hover:shadow-md transition-shadow`}
                              onClick={() =>
                                setExpandedSubjectCase(
                                  expandedSubjectCase === `${subject}-${caseIdx}`
                                    ? null
                                    : `${subject}-${caseIdx}`
                                )
                              }
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-lg font-semibold mb-2">{caseStudy.title}</h4>
                                  <p className="text-sm text-gray-600 mb-2">{caseStudy.description}</p>
                                  <div className="flex gap-2">
                                    <Badge variant="outline" className="text-xs">
                                      {caseStudy.questions.length} Questions
                                    </Badge>
                                    <Badge variant="outline" className="text-xs">
                                      ~{caseStudy.estimated_time_minutes} min
                                    </Badge>
                                  </div>
                                </div>
                                <ChevronDown
                                  className={`h-5 w-5 transition-transform flex-shrink-0 ${
                                    expandedSubjectCase === `${subject}-${caseIdx}` ? "rotate-180" : ""
                                  }`}
                                />
                              </div>
                            </div>

                            {/* Expanded Content */}
                            {expandedSubjectCase === `${subject}-${caseIdx}` && (
                              <div className="mt-4 p-6 bg-gray-50 rounded-lg border border-gray-200 space-y-6">
                                {/* Problem Statement */}
                                <div>
                                  <h5 className="font-semibold text-sm mb-2">📋 Problem Statement</h5>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {caseStudy.problem_statement}
                                  </p>
                                </div>

                                {/* Dataset Overview */}
                                <div>
                                  <h5 className="font-semibold text-sm mb-2">📊 Dataset Overview</h5>
                                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                    {caseStudy.dataset_overview}
                                  </p>
                                </div>

                                {/* Questions Grid */}
                                <div>
                                  <h5 className="font-semibold text-sm mb-4">❓ Practice Questions</h5>
                                  <div className="grid gap-4">
                                    {caseStudy.questions.map((q) => (
                                      <div key={q.question_number} className="p-4 bg-white rounded-lg border-2 border-gray-300 hover:border-blue-400 transition-colors">
                                        {/* Question Header */}
                                        <div className="flex items-start gap-3 mb-3">
                                          <Badge className="bg-blue-600 text-white flex-shrink-0">
                                            Q{q.question_number}
                                          </Badge>
                                          <div className="flex-1">
                                            <p className="font-semibold text-sm mb-1">{q.question}</p>
                                            <Badge
                                              variant="outline"
                                              className={`text-xs font-semibold ${
                                                q.difficulty === "easy"
                                                  ? "bg-green-100 text-green-800 border-green-300"
                                                  : q.difficulty === "medium"
                                                  ? "bg-orange-100 text-orange-800 border-orange-300"
                                                  : "bg-red-100 text-red-800 border-red-300"
                                              }`}
                                            >
                                              {q.difficulty.toUpperCase()}
                                            </Badge>
                                          </div>
                                        </div>

                                        {/* Expected Approach */}
                                        <div className="ml-8 mb-3 p-3 bg-blue-50 rounded border border-blue-200">
                                          <p className="text-xs font-semibold text-blue-900 mb-1">💡 Expected Approach:</p>
                                          <p className="text-xs text-blue-800">{q.expected_approach}</p>
                                        </div>

                                        {/* Sample Input/Output */}
                                        {(q.sample_input || q.sample_output) && (
                                          <div className="ml-8 p-3 bg-gray-100 rounded border border-gray-300 font-mono text-xs">
                                            {q.sample_input && (
                                              <div className="mb-2">
                                                <p className="font-semibold text-gray-900">Input:</p>
                                                <p className="text-gray-800 whitespace-pre-wrap">{q.sample_input}</p>
                                              </div>
                                            )}
                                            {q.sample_output && (
                                              <div>
                                                <p className="font-semibold text-gray-900">Output:</p>
                                                <p className="text-gray-800 whitespace-pre-wrap">{q.sample_output}</p>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Dataset Reference Section */}
                      <div className={`p-6 rounded-lg border-2 ${colors.border} ${colors.bg} mb-6`}>
                        <h3 className="text-lg font-bold mb-4">📦 Dataset Reference for All Case Studies</h3>
                        <div className="space-y-4">
                          {subjectData.case_studies.map((caseStudy, idx) => (
                            <div key={idx} className="p-3 bg-white rounded border border-gray-300">
                              <p className="font-semibold text-sm mb-2">{caseStudy.title}</p>
                              {caseStudy.dataset_schema && (
                                <details className="mb-2">
                                  <summary className="text-xs font-medium cursor-pointer text-blue-600">
                                    Schema
                                  </summary>
                                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">
                                    {caseStudy.dataset_schema}
                                  </pre>
                                </details>
                              )}
                              {caseStudy.sample_data && (
                                <details>
                                  <summary className="text-xs font-medium cursor-pointer text-blue-600">
                                    Sample Data
                                  </summary>
                                  <pre className="text-xs bg-gray-100 p-2 rounded mt-1 overflow-x-auto whitespace-pre-wrap">
                                    {caseStudy.sample_data}
                                  </pre>
                                </details>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Learning Points */}
                      {subjectData.key_learning_points && subjectData.key_learning_points.length > 0 && (
                        <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200 mb-4">
                          <h4 className="font-semibold text-sm mb-3 text-green-900">✅ Key Learning Points</h4>
                          <ul className="space-y-2">
                            {subjectData.key_learning_points.map((point, i) => (
                              <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                                <span className="text-green-600 font-bold flex-shrink-0">✓</span>
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Common Mistakes */}
                      {subjectData.common_mistakes && subjectData.common_mistakes.length > 0 && (
                        <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                          <h4 className="font-semibold text-sm mb-3 text-red-900">⚠️ Common Mistakes to Avoid</h4>
                          <ul className="space-y-2">
                            {subjectData.common_mistakes.map((mistake, i) => (
                              <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                                <span className="text-red-600 font-bold flex-shrink-0">✗</span>
                                <span>{mistake}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="mb-12 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
            <p className="text-yellow-800">Subject-specific materials are being generated. Please refresh the page in a moment.</p>
          </div>
        )}

        {/* Problem-Solving Case Studies Section */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <Target className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-bold">Problem-Solving Case Studies</h2>
          </div>

          <div className="space-y-4">
            {plan.case_studies && plan.case_studies.length > 0 ? (
              plan.case_studies.map((caseStudy, idx) => (
                <Card
                  key={idx}
                  className="border-border bg-white/70 backdrop-blur cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() =>
                    setExpandedCase(
                      expandedCase === caseStudy.title ? null : caseStudy.title
                    )
                  }
                >
                  <div className="flex items-start justify-between p-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{caseStudy.title}</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        {caseStudy.business_problem}
                      </p>
                    </div>
                    <ChevronDown
                      className={`h-5 w-5 transition-transform flex-shrink-0 mt-1 ${
                        expandedCase === caseStudy.title ? "rotate-180" : ""
                      }`}
                    />
                  </div>

                  {expandedCase === caseStudy.title && (
                    <CardContent className="border-t border-border pt-6">
                      {/* Solution */}
                      <div className="mb-6">
                        <h4 className="font-semibold text-sm mb-2">Solution Outline:</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {caseStudy.solution_outline}
                        </p>
                      </div>

                      {/* Key Learnings */}
                      <div>
                        <h4 className="font-semibold text-sm mb-3">Key Learnings:</h4>
                        <ul className="space-y-2">
                          {caseStudy.key_learnings.map((learning, i) => (
                            <li
                              key={i}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <TrendingUp className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span>{learning}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground">No case studies available</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-12"
            onClick={() => window.print()}
          >
            <FileText className="h-4 w-4 mr-2" />
            Download as PDF
          </Button>
          <Button variant="outline" className="h-12">
            Share Plan
          </Button>
          <Button className="h-12 bg-primary hover:bg-primary/90">
            Start Practice
          </Button>
        </div>
      </div>
    </div>
  )
}