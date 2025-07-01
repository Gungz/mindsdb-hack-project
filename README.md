# 🚀 Hackathon Aggregator

A modern, AI-powered hackathon discovery platform that aggregates hackathons from multiple sources including Devpost, Topcoder, and Quira. Built with React, TypeScript, and MindsDB for intelligent search and recommendations.

![Hackathon Aggregator](https://img.shields.io/badge/React-18.3.1-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue?logo=typescript)
![MindsDB](https://img.shields.io/badge/MindsDB-AI%20Powered-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)

## ✨ Features

- **🔍 Smart Search & Filtering**: Find hackathons by title, description, tags, status, and type
- **🤖 AI-Powered Chatbot**: Interactive assistant that helps users find relevant hackathons
- **📊 Real-time Statistics**: Live counts of upcoming, ongoing, and total hackathons
- **🎯 Personalized Recommendations**: AI-driven suggestions based on user preferences
- **📱 Responsive Design**: Beautiful, modern UI that works on all devices
- **🔄 Multi-Source Integration**: Aggregates data from Devpost, Topcoder, and Quira
- **⚡ Real-time Updates**: Automatic data fetching and updates
- **🔐 Admin Dashboard**: Manage data sources and monitor system health

## Demo Video
Watch on Youtube:

[![MindsDB KB Demo](https://img.youtube.com/vi/-bWM94k06x0/0.jpg)](https://www.youtube.com/watch?v=-bWM94k06x0)

## 🏗️ Architecture

```
Frontend (React + TypeScript)
├── Components (UI Components)
├── Pages (Route Components)
├── Hooks (Custom React Hooks)
└── Utils (Utility Functions)

Backend (Express + TypeScript)
├── API Routes
├── Database Layer
└── Data Processors

AI Layer (MindsDB)
├── Knowledge Base
├── ML Models
├── Agents
└── Web Crawlers
```

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Markdown** - Content Rendering
- **Lucide React** - Icons

### Backend
- **Express.js** - API Server
- **TypeScript** - Type Safety
- **MySQL2** - Database Driver
- **CORS** - Cross-Origin Support

### AI & Database
- **MindsDB** - AI/ML Platform
- **MySQL** - Primary Database
- **Google Gemini** - LLM Integration
- **OpenAI Embeddings** - Vector Search

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MySQL** (v8.0 or higher)
- **MindsDB** (v2.0 or higher)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mindsdb-hack-project
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create a `.env` file in the `src` directory g:

```env
# MySQL Configuration
VITE_MYSQL_HOST=127.0.0.1
VITE_MYSQL_PORT=3306
VITE_MYSQL_USERNAME=root
VITE_MYSQL_PASSWORD=root
VITE_MYSQL_DATABASE=hackathon

# MindsDB Configuration
VITE_MINDSDB_HOST=127.0.0.1
VITE_MINDSDB_PORT=47335
VITE_MINDSDB_USERNAME=mindsdb
VITE_MINDSDB_PASSWORD=
VITE_MINDSDB_DATABASE=mindsdb
```

### 4. Database Setup

#### MySQL Setup

1. Start MySQL in docker:
```bash
docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=hackathon -p 3306:3306 mysql:latest
```

#### MindsDB Setup

1. Start MindsDB server in docker:
```bash
docker run -e MINDSDB_APIS="http,mysql,mongodb,postgres" -p 47334:47334 -p 47335:47335 -p 47336:47336 -p 55432:55432 --network host mindsdb/mindsdb
```

2. Modify `src/database/schema.sql`  
Replace `<openai_api_key>` with your [Open AI API Key](https://platform.openai.com/api-keys).
Replace `<google_api_key>` with your [Google AI Studio API Key](https://aistudio.google.com/app/apikey).


3. Run the database setup (you should get message **Database setup completed successfully!**) - this executes command in `src/database/schema.sql` and `src/database/seed.sql`:
```bash
npm run db:setup
``` 


### 5. Start Development Server
If you run `mysql` and `mindsdb` in different setting, kindly change `src/config/mindsdb.ts` before running command below.
```bash
npm run dev
```
This will start both the frontend (Vite) and backend (Express) servers concurrently.

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001

### 6. KB Evaluation
Watch Youtube demo video to understand how to fetch hackathon from various sources.  
Run the fetch using button on the `admin` page for each hackathon source.
Then replace <openai_api_key> in `src/database/eval_kb_setup.sql` and `src/database/eval_kb_run.sql` with your API key. 
Finally, using command line run the following:
```bash
npm run kb:eval_setup
npm run kb:eval_run
```
**P.S.:** If you need to redo the evaluation, kindly run this SQL in the mindsdb console `DROP table mysql_datasource.hackathon.eval_hackathons;`, then rerun the commands above.  
Also, if you get error related to SSL routines, when running `npm run kb:eval_setup` but you get message **KB evaluation setup done successfully**, ignore the error.  
The test data is still successfully generated if success message appears.


## 📁 Project Structure

```
src/
├── api/                    # API layer and data processing
│   ├── client.ts          # API client
│   ├── database.ts        # Database connections
│   ├── hackathons.ts      # Hackathon API logic
│   ├── fetcher.ts         # Data fetching utilities
│   └── processor/         # Data processors for different sources
├── components/            # Reusable UI components
│   ├── ChatbotWidget.tsx  # AI chatbot interface
│   ├── HackathonCard.tsx  # Hackathon display card
│   ├── SearchAndFilter.tsx # Search and filter interface
│   └── Layout/           # Layout components
├── config/               # Configuration files
│   └── mindsdb.ts       # MindsDB configuration
├── database/            # Database setup and migrations
├── hooks/               # Custom React hooks
├── pages/               # Page components
├── server/              # Express server
│   ├── index.ts         # Server entry point
│   └── routes/          # API routes
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🎯 Key Features Explained

### AI-Powered Chatbot

The chatbot uses MindsDB's knowledge base and ML models to:
- Understand user queries in natural language
- Search through hackathon data intelligently
- Provide personalized recommendations
- Answer questions about specific hackathons

### Smart Search & Filtering

- **Text Search**: Search by title, description, or tags
- **Status Filtering**: Filter by upcoming, ongoing, or ended
- **Type Filtering**: Filter by online, hybrid, or in-person
- **Real-time Results**: Instant search results with pagination

### Data Aggregation

The system automatically fetches and processes hackathon data from:
- **Devpost**: Popular hackathon platform
- **Topcoder**: Competitive programming platform
- **Quira**: Emerging hackathon platform

### Admin Dashboard

Access the admin dashboard at `/admin` to:
- Monitor data sources
- Manually trigger data fetching
- View system statistics
- Manage source configurations

## 🔧 Available Scripts

```bash
# Development
npm run dev              # Start development servers
npm run server           # Start only the backend server

# Building
npm run build            # Build for production
npm run preview          # Preview production build

# Database
npm run db:setup         # Setup database schema and seed initial data

# Linting
npm run lint             # Run ESLint
```

## 🌐 API Endpoints

### Hackathons
- `GET /api/hackathons` - Get all hackathons with filters
- `GET /api/hackathons/:id` - Get specific hackathon
- `GET /api/hackathons/stats` - Get hackathon statistics
- `POST /api/hackathons/fetch` - Fetch new hackathons

### Chatbot
- `POST /api/chatbot` - Chat with AI assistant

### Sources (Admin)
- `GET /api/sources` - Get data sources
- `POST /api/sources` - Add new source
- `PUT /api/sources/:id` - Update source
- `DELETE /api/sources/:id` - Delete source
- `POST /api/sources/:id/fetch` - Fetch from specific source

## 🤖 AI Models

The application uses several MindsDB models:

1. **tag_generation_model**: Generates relevant tags for hackathons
2. **metadata_generation_model**: Extracts metadata from user queries
3. **chat_generation_model**: Generates conversational responses
4. **hack_description_agent**: Crawls and processes hackathon descriptions

## 🎨 UI Components

### ChatbotWidget
A floating chat interface that provides AI-powered assistance for finding hackathons.

### HackathonCard
Displays hackathon information in an attractive card format with:
- Prize information
- Date ranges
- Status indicators
- Registration links

### SearchAndFilter
Advanced search interface with:
- Real-time search
- Status filters
- Type filters
- Responsive design

## 🔒 Security

- **CORS**: Configured for secure cross-origin requests
- **Environment Variables**: Sensitive data stored in environment variables
- **Input Validation**: All user inputs are validated
- **SQL Injection Protection**: Parameterized queries throughout

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Environment Variables for Production

Ensure all environment variables are properly set in your production environment.

### Database Migration

Run the database setup script in your production environment:

```bash
npm run db:setup
```

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the [Issues](../../issues) page
2. Ensure all prerequisites are installed
3. Verify environment variables are set correctly
4. Check database connections

## 🙏 Acknowledgments

- **MindsDB** for AI/ML capabilities
- **React** team for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icons

## Next Step
1. Add more data source to fetch hackathon from.
2. Improve admin page to properly insert fetched hackathon stats. 
3. Add authentication
4. Find better URL to fetch hackathon from sources.
5. Handle hackathon update from sources so that status filtering is useful (currently only insert is handled and no update).

---

**Happy Hacking! 🎉**