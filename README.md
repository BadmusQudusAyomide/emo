# 💖 Emo - Create Emotional Moments

A web app where users can create personalized emotional pages and share them with their loved ones.

## 🚀 Features

- **5 Page Types**: Message, Memory, Q&A, Valentine Proposal, Anonymous Confession
- **No Login Required**: Create and share instantly
- **Beautiful Animations**: Powered by Framer Motion
- **Mobile Responsive**: Works perfectly on all devices
- **Direct Sharing**: WhatsApp integration
- **Modern Tech Stack**: React + TypeScript + Tailwind CSS

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Backend**: Supabase (Database + API)
- **Image Hosting**: Cloudinary
- **Routing**: React Router

## 📋 Setup Instructions

### 1. Clone and Install

```bash
git clone <your-repo>
cd emo
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

You'll need:

- **Supabase**: Create a new project at [supabase.com](https://supabase.com)
  - Get your Project URL and Anon Key
- **Cloudinary**: Create an account at [cloudinary.com](https://cloudinary.com)
  - Get your Cloud Name, API Key, and API Secret
  - Create an upload preset named `emo_pages`

### 3. Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create pages table
CREATE TABLE pages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('message', 'memory', 'qa', 'valentine', 'anonymous')),
  tone text NOT NULL CHECK (tone IN ('romantic', 'playful', 'mixed')),
  occasion text NOT NULL CHECK (occasion IN ('valentine', 'birthday', 'other')),
  content jsonb NOT NULL,
  is_anonymous boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  expires_at timestamp with time zone
);

-- Create views table
CREATE TABLE views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  created_at timestamp with time zone DEFAULT now()
);

-- Create responses table
CREATE TABLE responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id uuid REFERENCES pages(id) ON DELETE CASCADE,
  response text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE views ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public pages are viewable by everyone" ON pages FOR SELECT USING (true);
CREATE POLICY "Public views are viewable by everyone" ON views FOR SELECT USING (true);
CREATE POLICY "Public responses are viewable by everyone" ON responses FOR SELECT USING (true);

-- Allow public insert
CREATE POLICY "Anyone can create pages" ON pages FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log views" ON views FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can create responses" ON responses FOR INSERT WITH CHECK (true);
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to see your app.

## 🎯 Page Types

### 💌 Message Page
- Personalized messages with animations
- Custom backgrounds
- Character limits for optimal sharing

### 🖼 Memory Page
- Upload 3-6 photos via Cloudinary
- Add captions to each memory
- Beautiful slideshow presentation

### ❓ Q&A Page
- Answer 3-5 relationship questions
- Progressive reveal of answers
- Personalized final note

### 💘 Valentine Proposal
- Classic "Will you be my Valentine?" 
- Playful dancing "No" button
- Celebration animation on yes

### 🤐 Anonymous Confession
- Share feelings anonymously
- Optional reply feature
- Rate-limited and filtered

## 🔧 Development

### Project Structure

```
src/
├── pages/           # Main page components
├── components/      # Reusable UI components
├── services/        # API services (Supabase, Cloudinary)
├── utils/           # Utilities and constants
└── styles/          # Global styles
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features

- **Instant Creation**: No signup required
- **Mobile-First**: Perfect for WhatsApp sharing
- **Emotional Design**: Romantic color palette and animations
- **Scalable Architecture**: Easy to add new page types
- **Performance Optimized**: Lazy loading and efficient animations

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports static sites (Netlify, Railway, etc.).

## 📄 License

MIT License - feel free to use this for your projects!

## 🤝 Contributing

Contributions welcome! Please read the contributing guidelines and submit pull requests.

---

Made with ❤️ for couples everywhere
