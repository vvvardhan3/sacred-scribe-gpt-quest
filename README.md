
# HinduGPT - AI-Powered Hindu Scripture Learning Platform

A full-stack SaaS web application that combines ancient Hindu wisdom with modern AI technology to provide interactive learning experiences through quizzes and AI-powered conversations.

## Features

### 🔐 Authentication & Profiles
- Email/password authentication via Supabase Auth
- User profiles with display names and roles
- Row-Level Security for data protection

### 📚 Interactive Quiz System
- AI-generated quizzes on Hindu scriptures
- Categories: Bhagavad Gita, Upanishads, Ramayana, Mahabharata, Puranas, Vedas
- Progress tracking and score management
- Dynamic quiz generation using OpenAI GPT-4o-mini

### 💬 AI Scripture Chatbot
- Ask questions about Hindu scriptures
- AI responses with proper scripture citations
- Powered by OpenAI GPT-4o-mini
- Vector search using Pinecone for accurate context

### 👑 Subscription Management
- Multiple tier system (Free, Premium, Pro)
- Stripe integration ready (placeholder implementation)
- Feature-based access control

## Tech Stack

- **Frontend**: Vite + React + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Authentication**: Supabase Auth
- **AI Services**: OpenAI GPT-4o-mini
- **Vector Search**: Pinecone
- **Payments**: Stripe (placeholder)

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase CLI
- OpenAI API key
- Pinecone account

### Local Development Setup

1. **Clone and install dependencies**
   ```bash
   git clone <repository-url>
   cd hinduGPT
   npm install
   ```

2. **Start Supabase locally**
   ```bash
   supabase start
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env.local
   # Fill in your API keys and configurations
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Seed the database (optional)**
   ```bash
   node seed.ts
   ```

### Environment Variables

Create a `.env.local` file with:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
OPENAI_API_KEY=your_openai_api_key
PINECONE_API_KEY=your_pinecone_api_key
PINECONE_ENVIRONMENT=your_pinecone_environment
PINECONE_INDEX_NAME=hindu-scriptures
```

## Database Schema

### Tables
- `profiles` - User profiles with display names and roles
- `quizzes` - Quiz metadata and categories
- `questions` - Quiz questions with choices and answers
- `progress` - User quiz progress and scores
- `settings` - Subscription plans and features

### Security
- Row-Level Security (RLS) enabled on all tables
- Users can only access their own data
- Public read access for quizzes and questions

## API Endpoints (Edge Functions)

### Quiz Generation
```
POST /functions/v1/quiz/generate
```
Generates new quizzes using OpenAI based on scripture categories.

### Chat Assistant
```
POST /functions/v1/chat/ask
```
Processes user questions and returns AI responses with scripture citations.

## Deployment

### Supabase
1. Create a new Supabase project
2. Run migrations from `supabase/migrations/`
3. Deploy Edge Functions
4. Configure authentication providers

### Frontend
Deploy to Vercel, Netlify, or your preferred hosting platform.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For questions or support, please create an issue in the GitHub repository.
