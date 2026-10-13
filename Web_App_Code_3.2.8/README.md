# News Tailwind

A modern news website built with Next.js and Tailwind CSS.

## Features

### Footer Description Translation

The application now supports automatic translation of footer descriptions using Google's Gemini AI API. The translation feature includes:

- **Automatic Translation**: Footer descriptions are automatically translated based on the current language setting
- **Caching**: Translations are cached in session storage to improve performance
- **Fallback Handling**: If translation fails, the original description is displayed
- **Loading States**: Shows "Translating..." while translation is in progress

#### How it Works

1. **Language Detection**: The system detects the current language from Redux store
2. **Caching Check**: Checks if a translation already exists in session storage
3. **API Translation**: Uses Gemini API to translate the footer description
4. **Display**: Shows the translated text or fallback to original

#### Configuration

Make sure you have the following environment variable set:
```
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

#### Testing the Translation

You can test the translation functionality using the test function:

```javascript
import { testFooterTranslation } from '@/gemini-api/AiCreateNewsApi';

// Test translation
const translatedText = await testFooterTranslation(
  "Your footer description here",
  "Spanish",
  "es"
);
```

#### Supported Languages

The translation supports all languages that Gemini API supports, including:
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- And many more...

### Content Summarization

The application now supports AI-powered content summarization for news articles using Google's Gemini AI API. The summarization feature includes:

- **Smart Summarization**: Automatically creates concise summaries of news content
- **Language Support**: Summarizes content in the current language setting
- **HTML Handling**: Properly processes HTML content from rich text editors
- **Loading States**: Shows "Generating summary..." while processing
- **Error Handling**: Graceful fallback if summarization fails

#### How it Works

1. **Content Validation**: Checks if content exists before attempting to summarize
2. **HTML Cleaning**: Removes HTML tags for better summarization
3. **AI Processing**: Uses Gemini API to generate a concise summary
4. **Display**: Shows the summary in a dedicated box below the content editor

#### Usage

1. **Add Content**: Write or paste your news content in the rich text editor
2. **Click Summarize**: Click the "Summarize Description" button
3. **View Summary**: The generated summary appears in the "Summarized Description" box

#### Features

- **Concise Output**: Generates 2-3 sentence summaries (50-100 words)
- **Key Facts Preservation**: Maintains important information and main points
- **Professional Tone**: Uses appropriate language for news websites
- **Multi-language Support**: Works with all supported languages
- **Real-time Feedback**: Shows loading states and success/error messages

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
