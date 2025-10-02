# Team Dashboard with AI Assistant

An internal team dashboard featuring an AI assistant powered by OpenAI, with conversation history and a searchable knowledge base for saving important Q&A pairs.

## Features

### Core Functionality
- **AI Assistant Chat Interface**: Interactive chat with OpenAI-powered AI assistant
- **Recent Messages**: View and manage recent conversations with the AI
- **Knowledge Base**: Save important Q&A pairs for future reference
- **Search & Filter**: Search through saved knowledge base entries
- **No Authentication Required**: Login-free dashboard for internal team use

### Knowledge Base Features
- Save any conversation to the knowledge base with one click
- Add custom titles and tags to saved entries
- **Pin/Unpin entries** for quick access with visual indicators
- Search through questions, answers, and titles
- Filter by pinned entries only
- Organize entries by categories
- Interactive pin toggle buttons with loading states

### Technical Features
- **Real-time Updates**: Conversations update immediately
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Graceful error handling with user feedback
- **Database Storage**: Persistent storage using SQLite with Prisma ORM
- **TypeScript**: Full type safety throughout the application
- **Content Moderation**: Basic filtering for inappropriate content and spam
- **Content Sanitization**: Automatic cleanup of problematic content

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **AI Integration**: OpenAI API (GPT-3.5-turbo)
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd team-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY="your-openai-api-key-here"
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open the application**

   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Using the AI Assistant

1. **Start a Conversation**: Type your question in the chat input at the bottom of the main panel
2. **View Response**: The AI assistant will respond with helpful information
3. **Save Important Answers**: Click the "Save" button on any message in the Recent Messages panel to add it to your knowledge base

### Managing the Knowledge Base

1. **Search Entries**: Use the search bar in the Knowledge Base sidebar to find specific information
2. **Filter by Pinned**: Toggle "Pinned Only" to see your most important saved entries
3. **Pin/Unpin Entries**: Click the pin icon on any entry to toggle its pinned status
4. **Add Tags**: Organize entries with custom tags for better categorization
5. **Content Moderation**: The system automatically filters inappropriate content and spam

### Content Moderation

The application includes basic content moderation to maintain a professional environment:

1. **Automatic Filtering**: Messages are automatically scanned for inappropriate content
2. **Spam Detection**: Identifies potential spam patterns like excessive caps, repeated characters, and suspicious URLs
3. **Profanity Filter**: Blocks or sanitizes messages containing inappropriate language
4. **User Feedback**: Clear error messages when content is blocked
5. **Content Sanitization**: Automatically cleans up problematic content when possible

**Moderation Actions:**
- **Allow**: Content passes all checks
- **Warn**: Content is sanitized but allowed through
- **Block**: Content is rejected with an explanation

## API Endpoints

### Chat
- `POST /api/chat` - Send a message to the AI assistant
- `GET /api/messages` - Retrieve recent messages

### Knowledge Base
- `GET /api/knowledge-base` - Get saved knowledge base entries (supports search, filtering)
- `POST /api/knowledge-base` - Save a message to the knowledge base
- `PUT /api/knowledge-base/[id]` - Update a knowledge base entry
- `DELETE /api/knowledge-base/[id]` - Delete a knowledge base entry

## Database Schema

The application uses three main models:

- **Message**: Stores chat conversations between users and AI
- **KnowledgeBaseEntry**: Stores saved Q&A pairs with metadata
- **Category**: Organizes knowledge base entries (future enhancement)

## Design Notes

### Architecture Decisions

1. **Next.js App Router**: Used for modern React patterns and better performance
2. **SQLite Database**: Simple, file-based database perfect for internal tools
3. **Prisma ORM**: Type-safe database access with excellent TypeScript integration
4. **Component-Based Architecture**: Reusable components for maintainability

### UI/UX Considerations

1. **Three-Panel Layout**: Chat interface, recent messages, and knowledge base for optimal workflow
2. **Responsive Design**: Adapts to different screen sizes
3. **Visual Hierarchy**: Clear distinction between user messages and AI responses
4. **Loading States**: Provides feedback during API calls
5. **Error Handling**: User-friendly error messages

### Performance Optimizations

1. **Client-Side State Management**: Reduces unnecessary API calls
2. **Optimistic Updates**: UI updates immediately for better user experience
3. **Efficient Database Queries**: Proper indexing and query optimization
4. **Component Memoization**: Prevents unnecessary re-renders

## Development

### Project Structure
```
src/
├── app/                 # Next.js app router pages
│   ├── api/            # API routes
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Main dashboard page
├── components/         # React components
│   ├── ChatInterface.tsx
│   ├── RecentMessages.tsx
│   └── KnowledgeBaseSidebar.tsx
├── lib/                # Utility libraries
│   ├── db.ts          # Database connection
│   └── openai.ts      # OpenAI integration
└── types/             # TypeScript type definitions
    └── index.ts
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open database browser

## Bonus Features Implemented

- ✅ **Search Functionality**: Search through saved Q&A pairs
- ✅ **Pinned Answers**: Interactive pin/unpin functionality with visual indicators
- ✅ **Tagging System**: Add custom tags to organize entries
- ✅ **Categories**: Basic category support for organization
- ✅ **Basic Content Moderation**: Automatic filtering of inappropriate content and spam
- ✅ **Responsive Design**: Works well on all device sizes
- ✅ **Real-time Updates**: Immediate UI updates for better UX

## Future Enhancements

- **Content Moderation**: Add basic content filtering
- **Export Functionality**: Export knowledge base entries
- **Advanced Search**: Full-text search with highlighting
- **User Preferences**: Customizable UI settings
- **Analytics**: Usage statistics and insights
- **Bulk Operations**: Select and manage multiple entries
- **Rich Text Support**: Markdown support for formatted responses

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is for internal use and assessment purposes.
