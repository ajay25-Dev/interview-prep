"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Code,
  Users,
  BookOpen,
  Trophy,
  TrendingUp,
  Clock,
  ChevronRight,
  Zap,
  Award,
  LucideIcon
} from "lucide-react"

interface StatCardProps {
  title: string
  completed: number
  total: number
  progress: number
  icon: LucideIcon
  color: string
}

interface RecentActivity {
  type: 'coding' | 'behavioral' | 'system-design'
  title: string
  status: 'completed' | 'in-progress'
  time: string
  difficulty: string
}

export function InterviewDashboard() {
  const stats = {
    codingChallenges: { completed: 24, total: 50, progress: 48, color: "from-blue-500 to-blue-600" },
    behavioralPractice: { completed: 8, total: 20, progress: 40, color: "from-purple-500 to-purple-600" },
    systemDesign: { completed: 3, total: 15, progress: 20, color: "from-orange-500 to-orange-600" },
    mockInterviews: { completed: 2, total: 10, progress: 20, color: "from-green-500 to-green-600" }
  }

  const recentActivity: RecentActivity[] = [
    { type: "coding", title: "Two Sum - Easy", status: "completed", time: "2 hours ago", difficulty: "Easy" },
    { type: "behavioral", title: "Tell me about yourself", status: "completed", time: "1 day ago", difficulty: "Medium" },
    { type: "system-design", title: "Design URL Shortener", status: "in-progress", time: "2 days ago", difficulty: "Hard" },
  ]

  const upcomingSessions = [
    { title: "Mock Interview - Frontend Developer", date: "Tomorrow, 2:00 PM", type: "mock", icon: Trophy },
    { title: "System Design Practice", date: "Friday, 10:00 AM", type: "practice", icon: BookOpen },
  ]

  const StatCard = ({ title, completed, total, progress, icon: Icon, color }: StatCardProps) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${color} p-6 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}>
      <div className="absolute -right-8 -top-8 h-32 w-32 bg-white/10 rounded-full"></div>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
            <Icon className="h-6 w-6" />
          </div>
          <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">{progress}%</span>
        </div>
        <h3 className="text-sm font-medium mb-1 opacity-90">{title}</h3>
        <div className="mb-3">
          <div className="text-2xl font-bold">{completed}/{total}</div>
          <Progress value={progress} className="mt-2 h-1.5 bg-white/20" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-2">
            <Award className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Welcome Back</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3 text-slate-900 dark:text-white">
            Keep Crushing Your Goals!
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            You're on an incredible journey. Keep practicing and you'll ace that interview. Your progress shows dedication! 🚀
          </p>
        </div>

        {/* Stats Overview - Colorful Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <StatCard 
            title="Coding Challenges" 
            completed={stats.codingChallenges.completed}
            total={stats.codingChallenges.total}
            progress={stats.codingChallenges.progress}
            icon={Code}
            color={stats.codingChallenges.color}
          />
          <StatCard 
            title="Behavioral Practice" 
            completed={stats.behavioralPractice.completed}
            total={stats.behavioralPractice.total}
            progress={stats.behavioralPractice.progress}
            icon={Users}
            color={stats.behavioralPractice.color}
          />
          <StatCard 
            title="System Design" 
            completed={stats.systemDesign.completed}
            total={stats.systemDesign.total}
            progress={stats.systemDesign.progress}
            icon={BookOpen}
            color={stats.systemDesign.color}
          />
          <StatCard 
            title="Mock Interviews" 
            completed={stats.mockInterviews.completed}
            total={stats.mockInterviews.total}
            progress={stats.mockInterviews.progress}
            icon={Trophy}
            color={stats.mockInterviews.color}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {/* Quick Actions */}
          <Card className="lg:col-span-2 border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Zap className="h-5 w-5 text-orange-500" />
                Quick Start
              </CardTitle>
              <CardDescription>
                Jump into your next practice session
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-4">
                <Button className="h-24 flex-col gap-3 bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg transition-all">
                  <Code className="h-6 w-6" />
                  <span className="text-sm font-semibold">Coding Challenge</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-3 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-slate-800 transition-all">
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-semibold">Behavioral</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-3 border-2 border-slate-200 dark:border-slate-700 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-800 transition-all">
                  <BookOpen className="h-6 w-6" />
                  <span className="text-sm font-semibold">System Design</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-3 border-2 border-slate-200 dark:border-slate-700 hover:border-green-500 hover:bg-green-50 dark:hover:bg-slate-800 transition-all">
                  <Trophy className="h-6 w-6" />
                  <span className="text-sm font-semibold">Mock Interview</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
            <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-6">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-cyan-500" />
                Upcoming Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {upcomingSessions.map((session, index) => {
                  const SessionIcon = session.icon
                  return (
                    <div key={index} className="group p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className="mt-1 p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg group-hover:bg-cyan-200 dark:group-hover:bg-cyan-900/50 transition-colors">
                          <SessionIcon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">{session.title}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{session.date}</p>
                        </div>
                        <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                      </div>
                    </div>
                  )
                })}
                <Button variant="outline" className="w-full mt-4 border-2 border-slate-200 dark:border-slate-700 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 transition-all">
                  Schedule New Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="border-0 shadow-lg bg-white dark:bg-slate-900">
          <CardHeader className="border-b border-slate-200 dark:border-slate-800 pb-6">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const iconColor: Record<RecentActivity['type'], string> = {
                  'coding': 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
                  'behavioral': 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
                  'system-design': 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                }
                
                const badgeColor: Record<RecentActivity['status'], string> = {
                  'completed': 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400',
                  'in-progress': 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                }

                return (
                  <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
                    <div className="flex items-center gap-4 flex-1">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconColor[activity.type]}`}>
                        {activity.type === 'coding' && <Code className="h-5 w-5" />}
                        {activity.type === 'behavioral' && <Users className="h-5 w-5" />}
                        {activity.type === 'system-design' && <BookOpen className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white">{activity.title}</p>
                        <div className="flex gap-2 mt-1">
                          <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
                          <span className="text-xs text-slate-500 dark:text-slate-400">•</span>
                          <span className="text-xs font-medium text-slate-600 dark:text-slate-300">{activity.difficulty}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${badgeColor[activity.status]} border-0 capitalize`}>
                      {activity.status}
                    </Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
