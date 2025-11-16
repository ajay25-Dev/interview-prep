import { Suspense } from "react"
import Link from "next/link"
import { InterviewDashboard } from "@/components/interview/dashboard"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react"

export default function HomePage() {
  const features = [
    { icon: "🎯", title: "Personalized Path", desc: "AI-tailored to your role" },
    { icon: "⚡", title: "Instant Feedback", desc: "Real-time performance insights" },
    { icon: "📊", title: "Track Progress", desc: "Detailed analytics & metrics" },
  ]

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-white to-blue-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950/20">
      <Suspense fallback={<div className="h-screen flex items-center justify-center">Loading...</div>}>
        {/* Hero Section */}
        <div className="container mx-auto px-4 pt-16 pb-20">
          <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 mb-6 border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-semibold">AI-Powered Interview Prep</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-slate-900 dark:text-white leading-tight">
              Ace Your
              <span className="block bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
                Next Interview
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Master coding challenges, behavioral questions, and system design with AI-powered personalized coaching tailored to your dream role.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link href="/upload-jd">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all h-14 px-8 text-base font-semibold">
                  Start Your Journey <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Button 
                variant="outline" 
                size="lg"
                className="border-2 border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 h-14 px-8 text-base font-semibold transition-all"
              >
                View Demo
              </Button>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
              {features.map((feature, i) => (
                <div key={i} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-3 md:grid-cols-3 gap-4 mb-20 p-8 rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border border-blue-100 dark:border-blue-900/30">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">10K+</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Active Users</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">98%</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Success Rate</p>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">500+</div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Questions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Section */}
        <div className="w-full bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800">
          <InterviewDashboard />
        </div>
      </Suspense>
    </div>
  )
}
