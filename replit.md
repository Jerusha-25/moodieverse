# MoodieVerse - Mental Wellness Application

## Overview

MoodieVerse is a privacy-first mental wellness application that combines mood tracking, AI-powered wellness prompts, and gamification through a digital garden visualization. The application helps users track their emotional well-being, receive personalized wellness guidance, and maintain engagement through a growing virtual world that reflects their wellness journey.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state, React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini AI for wellness prompt generation
- **Session Management**: PostgreSQL sessions with connect-pg-simple
- **Data Validation**: Zod schemas for type-safe API contracts

### Project Structure
- `client/`: React frontend application
- `server/`: Express.js backend with API routes
- `shared/`: Common TypeScript types and database schema
- `migrations/`: Database migration files managed by Drizzle

## Key Components

### 1. Mood Tracking System
- **Purpose**: Allow users to log daily emotional states with optional journal entries
- **Implementation**: React form components that submit to Express API endpoints
- **Data Flow**: User input → Validation → Database storage → AI prompt generation
- **Storage**: PostgreSQL table with mood, journal, timestamp, and AI prompt fields

### 2. AI-Powered Wellness Prompts
- **Purpose**: Generate personalized wellness suggestions based on user mood
- **Implementation**: Google Gemini AI integration with context-aware prompting
- **Fallback Strategy**: Predefined prompts for each mood type when AI fails
- **User Interaction**: Prompts can be marked as completed, tracking user engagement

### 3. Digital Garden Gamification
- **Purpose**: Visual representation of user progress through garden growth
- **Implementation**: JSON-stored garden items that increase based on mood submissions
- **Growth Logic**: Different moods contribute different garden elements (flowers, trees, seedlings)
- **Progress Tracking**: Streak counting and achievement system

### 4. Kindness Exchange
- **Purpose**: Anonymous message sharing system for community support
- **Implementation**: User-generated and AI-generated supportive messages
- **Privacy**: No user identification or message attribution
- **Moderation**: Simple content validation and usage tracking

### 5. Crisis Support System
- **Purpose**: Immediate access to mental health resources and coping tools
- **Implementation**: Modal overlay with breathing exercises, grounding techniques, and professional resources
- **Accessibility**: Always-available "Need Help?" button in navigation
- **Tools**: 5-4-3-2-1 grounding technique, breathing exercises, crisis hotlines

## Data Flow

### Mood Check-in Flow
1. User selects mood emoji and optionally writes journal entry
2. Frontend validates input using Zod schemas
3. Backend receives request and stores mood entry in database
4. AI service generates personalized wellness prompt
5. Database updated with AI prompt
6. User progress and streak calculations updated
7. Frontend refreshes to show new garden growth and prompt

### Garden Growth Logic
- **Happy mood**: Adds flowers to garden
- **Good mood**: Adds various positive elements
- **Neutral mood**: Adds seedlings for future growth
- **Sad/Anxious mood**: Still contributes to growth (no mood is "bad")
- **Streak bonuses**: Additional garden items for consecutive check-ins

## External Dependencies

### AI Services
- **Google Gemini AI**: Wellness prompt generation
- **Configuration**: API key via environment variables
- **Error Handling**: Graceful fallback to predefined prompts

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Via environment variable DATABASE_URL
- **ORM**: Drizzle for type-safe database operations

### UI Components
- **shadcn/ui**: Pre-built accessible React components
- **Radix UI**: Underlying primitive components
- **Tailwind CSS**: Utility-first styling framework

### Development Tools
- **Vite**: Fast development server and build tool
- **TypeScript**: Type safety across frontend and backend
- **Replit Integration**: Runtime error overlay and cartographer plugin

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express API
- **Hot Reload**: Vite HMR for frontend, tsx for backend
- **Environment Variables**: DATABASE_URL, GEMINI_API_KEY required

### Production Build
- **Frontend**: Vite build outputs to `dist/public`
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Static Serving**: Express serves built frontend in production
- **Database**: Drizzle migrations via `npm run db:push`

### Environment Configuration
- **NODE_ENV**: Controls development vs production behavior
- **Database**: PostgreSQL connection string required
- **AI Services**: Google API key for Gemini integration

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

- **Enhanced Visual Design (July 06, 2025)**: Complete colorful redesign with rainbow gradients, animated cards, hover effects, and vibrant UI elements throughout the application
- **Milestone Streak System (July 06, 2025)**: Automatic streak tracking with celebration notifications at 3, 7, 14, 30, 50, and 100-day milestones
- **Interactive Crisis Support (July 06, 2025)**: Enhanced crisis toolkit with guided breathing exercises, 5-4-3-2-1 grounding technique, and clear explanations for each tool
- **Shareable Garden Snapshots (July 06, 2025)**: html2canvas integration allowing users to create and share beautiful images of their wellness progress
- **Privacy Controls (July 06, 2025)**: Complete data export/import functionality with local storage management and clear data options
- **AI Integration (July 06, 2025)**: Successfully configured Google Gemini AI for personalized wellness prompts and kindness message generation
- **Onboarding Experience (July 06, 2025)**: Interactive modal with proper navigation and feature explanations

## Changelog

- July 06, 2025: Initial MoodieVerse setup with complete feature implementation