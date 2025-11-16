# Interview Prep - AI-Powered Interview Preparation

An intelligent interview preparation system that creates personalized study plans based on your target role, current skills, and job description.

## 🎯 Features

- **Personalized Profiles**: Users define their experience level, target role, industry, and current skills
- **Job Description Analysis**: AI analyzes job descriptions to extract required skills and responsibilities
- **AI-Generated Plans**: Creates tailored interview prep plans with domain knowledge and case studies
- **Interactive Accordion UI**: Expandable sections for domains, KPIs, and case studies
- **Responsive Design**: Built with Next.js, Tailwind CSS, and Shadcn UI components
- **Brandbook Compliance**: Follows the Jarvis design system

## 📁 Project Structure

```
interview-prep/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # Home page with hero
│   │   ├── onboarding/
│   │   │   └── page.tsx             # User questionnaire form
│   │   ├── upload-jd/
│   │   │   └── page.tsx             # JD upload/paste page
│   │   ├── plan/
│   │   │   └── page.tsx             # Generated plan display
│   │   ├── layout.tsx               # Root layout
│   │   └── globals.css              # Global styles
│   ├── components/
│   │   ├── ui/                      # Shadcn UI components
│   │   ├── interview/
│   │   │   └── dashboard.tsx        # Dashboard component
│   │   ├── nav/                     # Navigation components
│   │   └── providers/               # React providers
│   ├── hooks/                       # Custom React hooks
│   └── lib/
│       └── utils.ts                 # Utility functions
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md                        # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Running backend service on `http://localhost:3001`
- Running AI service on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3004](http://localhost:3004) in your browser.

## 🔌 Integration Points

### Backend API
- **Base URL**: `http://localhost:3001/v1`
- **Authentication**: Bearer token in Authorization header

### AI Service
- **Base URL**: `http://localhost:8000`
- **Endpoints**:
  - `POST /interview/analyze-jd` - Analyze job descriptions
  - `POST /interview/generate-plan` - Generate personalized plans

## 📋 User Journey

```
Home Page
    ↓
Get Started → Onboarding (Profile Form)
    ↓
Upload JD (File Upload or Text)
    ↓
Analyze & Generate Plan (AI Processing)
    ↓
View Plan (Domains & Case Studies)
```

## 🎨 UI Components

### Custom Components
- **QuestionnaireForm**: Multi-step form for user profile
- **JDUploadForm**: File/text input for job descriptions
- **PlanAccordion**: Collapsible sections for plan content
- **DomainKPICard**: Display domain knowledge and KPIs

### Shadcn UI Components Used
- Card
- Button
- Badge
- Progress
- Select
- Textarea
- Input

## 🔐 Authentication

All API calls require authentication:
```typescript
headers: {
  "Authorization": `Bearer ${localStorage.getItem("auth_token")}`,
}
```

## 🌐 Environment Variables

Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_AI_URL=http://localhost:8000
```

## 📝 Page Routes

| Route | Purpose |
|-------|---------|
| `/` | Home page with hero section |
| `/onboarding` | User questionnaire |
| `/upload-jd` | Job description upload |
| `/plan` | Generated prep plan |

## 🧪 Testing

```bash
# Run tests
npm run test

# Run tests in UI mode
npm run test:ui

# Run tests in debug mode
npm run test:debug

# Run tests with browser visible
npm run test:headed
```

## 🔧 Development

### Adding New Pages
1. Create folder in `src/app/[page-name]/`
2. Create `page.tsx` inside
3. Use existing components or create new ones in `src/components/`

### Styling
- Uses Tailwind CSS with custom theme
- Theme configured in `tailwind.config.ts`
- Component styles in `src/app/globals.css`

### API Calls
Use the backend API:
```typescript
const response = await fetch('/v1/interview-prep/profile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(data)
})
```

## 📊 Data Models

### User Profile
```typescript
{
  experience_level: 'entry' | 'mid' | 'senior' | 'career-change'
  target_role: string
  industry: string
  current_skills: string[]
  timeline?: string
  company_name?: string
  notes?: string
}
```

### Generated Plan
```typescript
{
  domains: [{
    title: string
    description: string
    core_topics: string[]
    kpis: [{
      name: string
      description: string
      importance: 'high' | 'medium'
    }]
  }]
  case_studies: [{
    title: string
    business_problem: string
    solution_outline: string
    key_learnings: string[]
  }]
}
```

## 🎯 Future Enhancements

- [ ] Add practice modules (behavioral Q&A, coding challenges)
- [ ] Implement progress tracking
- [ ] Add mock interview scheduling
- [ ] Create resource recommendations
- [ ] Add analytics dashboard
- [ ] Implement plan sharing
- [ ] Add video recording for practice
- [ ] Integrate external practice platforms

## 🐛 Debugging

### Browser DevTools
- Check Network tab for API calls
- Check Console for errors
- Use React DevTools for component debugging

### Server Logs
```bash
# Monitor backend logs
npm run dev

# Monitor AI service logs
python main.py
```

## 📚 Related Docs

- [INTERVIEW_PREP_SETUP.md](../INTERVIEW_PREP_SETUP.md) - Complete setup guide
- [Jarvis Brandbook](../jarvis-frontend/BRANDBOOK.md) - Design system
- Backend API docs: Check `jarvis-backend/API_DOCUMENTATION.md`

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript for type safety
3. Follow Brandbook design guidelines
4. Test before committing
5. Update documentation

## 📄 License

Part of the Jarvis Learning Platform

---

**Built with**: Next.js, TypeScript, Tailwind CSS, Shadcn UI, and AI-powered backends