/**
 * AI Service Module using Google Gemini API
 * This module contains all AI-related API calls for the application
 */

// Gemini API configuration
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models";
const GEMINI_MODEL = "gemini-2.0-flash"; // You can also use gemini-1.5-pro for more advanced use cases

/**
 * Helper function to make Gemini API calls
 * @param {string} prompt - The prompt text to send to Gemini
 * @param {string} systemInstruction - Optional system instruction
 * @returns {Promise<Object>} - Gemini API response
 */
const callGeminiAPI = async (api_key,prompt, systemInstruction = null) => {
    try {
        const requestBody = {
            contents: [
                {
                    parts: [{ text: prompt }]
                }
            ]
        };

        // Add system instruction if provided
        if (systemInstruction) {
            requestBody.systemInstruction = { parts: [{ text: systemInstruction }] };
        }

        const response = await fetch(
            `${GEMINI_API_URL}/${GEMINI_MODEL}:generateContent?key=${api_key}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Failed to generate content');
        }

        return await response.json();
    } catch (error) {
        console.error('Gemini API error:', error);
        throw error;
    }
};

/**
 * Generate content using AI based on a prompt and context
 * @param {Object} params - Parameters for content generation
 * @param {string} params.prompt - User's prompt for content generation
 * @param {string} params.title - Title of the news article (optional)
 * @param {string} params.category - Category of the news article (optional)
 * @param {string} params.language - Language name (e.g., "English", "Spanish")
 * @param {string} params.languageCode - Language code (e.g., "en", "es")
 * @returns {Promise<Object>} - Generated content
 */
export const generateContent = async ({ api_key,prompt, title, category, language, languageCode, contentType }) => {
    try {
        // Build the base system prompt
        let fullPrompt = "You are a skilled news article writer.";

        // Add the backend dev prompt logic
        fullPrompt += ` Write a comprehensive news article description/content for the title: '${title}' in ${language} language. Create engaging, informative content suitable for a ${contentType} article. Include relevant details and maintain a professional journalistic tone. 

CRITICAL: Return ONLY the plain text content. Do NOT include any markdown formatting, code blocks, HTML tags, or syntax wrappers like \`\`\`html or \`\`\`. Just return the raw article content as plain text.`;

        // Add context if available
        if (category) {
            fullPrompt += `\n\nCategory: ${category}`;
        }

        if (language && languageCode) {
            fullPrompt += `\n\nIMPORTANT: Generate all content in ${language} language (${languageCode}). The response MUST be in ${language}.`;
        }

        if (prompt) {
            fullPrompt += `\n\nAdditional Request: ${prompt}`;
        }
        const response = await callGeminiAPI(api_key,fullPrompt);

        // Extract the generated text from Gemini response
        const content = response.candidates[0].content.parts[0].text;

        return {
            content: content
        };
    } catch (error) {
        console.error('AI content generation error:', error);
        throw error;
    }
};


/**
 * Translate footer description using Gemini API
 * This function handles the actual API call to Gemini for translating footer descriptions
 * @param {string} desc - The footer description text to translate
 * @param {string} targetLanguage - Target language name (e.g., "Spanish", "French")
 * @param {string} targetLanguageCode - Target language code (e.g., "es", "fr")
 * @returns {Promise<string>} - Translated footer description
 */
const translateFooterDesc = async (api_key,desc, targetLanguage, targetLanguageCode) => {
    try {
        
        // Validate input parameters
        if (!desc || !desc.trim()) {
            console.log('No footer description provided for translation');
            return '';
        }

        // // Skip translation for English language (assume original is in English)
        // if (!targetLanguage || targetLanguage.toLowerCase() === 'english' || targetLanguageCode === 'en') {
        //     console.log('Skipping translation - language is English');
        //     return desc;
        // }

        // Create a detailed translation prompt for better results
        const prompt = `Translate the following footer description to ${targetLanguage} (${targetLanguageCode}). 
        
        Original text: "${desc}"
        
        Instructions:
        - Maintain the same tone and style as the original
        - Keep any HTML tags or special formatting intact
        - Ensure the translation is natural and appropriate for a website footer
        - Return only the translated text, no additional explanations
        - Preserve any links or special characters
        
        Translated text:`;
        
        // Call Gemini API with the translation prompt
        const response = await callGeminiAPI(api_key,prompt);
        
        // Extract the translated text from Gemini response
        const translatedText = response.candidates[0].content.parts[0].text.trim();
        
        // Clean up the response by removing any extra quotes or formatting
        const cleanTranslation = translatedText.replace(/^["']|["']$/g, '').trim();
        return cleanTranslation;
        
    } catch (error) {
        console.error('Footer description translation error:', error);
        // Return original description if translation fails to ensure UI doesn't break
        return desc;
    }
};

/**
 * Translate footer description with caching support
 * This function provides a higher-level interface with caching to improve performance
 * @param {string} desc - The footer description text to translate
 * @param {string} targetLanguage - Target language name
 * @param {string} targetLanguageCode - Target language code
 * @returns {Promise<string>} - Translated footer description
 */
export const translateFooterDescription = async (api_key,desc, targetLanguage, targetLanguageCode) => {
    try {
        // Create a unique cache key based on language code and content hash
        // Use encodeURIComponent instead of btoa to handle Unicode characters safely
        const cacheKey = `footer_desc_${targetLanguageCode}_${encodeURIComponent(desc).substring(0, 30)}`;
        
        // Check if translation exists in session storage (client-side caching)
        if (typeof window !== 'undefined') {
            const cachedTranslation = sessionStorage.getItem(cacheKey);
            if (cachedTranslation) {
                return cachedTranslation;
            }
        }
        
        // Perform translation if not cached
        const translatedText = await translateFooterDesc(api_key,desc, targetLanguage, targetLanguageCode);
        
        // Cache the successful translation in session storage for future use
        if (typeof window !== 'undefined' && translatedText && translatedText !== desc) {
            sessionStorage.setItem(cacheKey, translatedText);
        }
        
        return translatedText;
        
    } catch (error) {
        console.error('Footer description translation with caching error:', error);
        // Return original description if translation fails
        return desc;
    }
};

/**
 * Generate meta information using AI based on a title
 * @param {Object} params - Parameters for meta generation
 * @param {string} params.title - Title of the news article
 * @param {string} params.language - Language name (e.g., "English", "Spanish")
 * @param {string} params.languageCode - Language code (e.g., "en", "es")
 * @returns {Promise<Object>} - Generated meta information (title, description, keywords)
 */
export const generateMetaInfo = async ({ api_key,title, language, languageCode }) => {
    try {
        let languageInstruction = "";
        if (language && languageCode) {
            languageInstruction = `\n\nIMPORTANT: Generate all content in ${language} language (${languageCode}). The response MUST be in the same language as the title.`;
        }

        const prompt = `You are an SEO expert. Generate meta title, description, keywords, and a slug for this news article titled: "${title}".${languageInstruction}
    
Return ONLY a JSON object with these fields:
- meta_title: an SEO-friendly title (max 60 chars)
- meta_description: an engaging description (between 50-160 chars)
- meta_keywords: comma-separated keywords
- slug: URL-friendly version of the title (avoid other languages only in english)

The response must be valid JSON format with these exact field names. Do not include any explanation or additional text.`;

        const response = await callGeminiAPI(api_key,prompt);
        const responseText = response.candidates[0].content.parts[0].text.trim();

        // Handle potential JSON parsing issues
        try {
            // Try to directly parse if response is valid JSON
            return JSON.parse(responseText);
        } catch (parseError) {
            console.error("JSON parse error:", parseError.message);

            // If direct parsing fails, extract JSON-like content using regex
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                try {
                    const extractedJson = jsonMatch[0];
                    return JSON.parse(extractedJson);
                } catch (secondParseError) {
                    console.error("Second JSON parse error:", secondParseError.message);
                }
            }
            return {
                meta_title: title,
                meta_description: `Read about ${title} in our latest news article.`,
                meta_keywords: title.toLowerCase().split(' ').join(','),
                slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
            };
        }
    } catch (error) {
        console.error('AI meta generation error:', error);
        throw error;
    }
};

/**
 * Suggest tags using AI based on the title and content
 * @param {Object} params - Parameters for tag suggestion
 * @param {string} params.title - Title of the news article
 * @param {string} params.content - Content of the news article (optional)
 * @param {string} params.category - Category of the news article (optional)
 * @returns {Promise<Object>} - Suggested tags
 */

/**
 * Generate an image using AI based on a prompt
 * @param {Object} params - Parameters for image generation
 * @param {string} params.prompt - Description of the image to generate
 * @param {string} params.title - Title of the news article (optional for context)
 * @returns {Promise<Blob>} - Generated image as a Blob
 */
export const generateImage = async ({ api_key,prompt, title }) => {
    try {
        // Note: Gemini doesn't have direct image generation like DALL-E
        // We'll use a fallback service or external API for image generation

        // Option 1: Use a different image generation API (e.g., Stable Diffusion or similar)
        // This is just a placeholder - you'll need to implement an actual image generation API call

        // For now, let's redirect to a placeholder image service with the prompt as text
        let fullPrompt = prompt;
        if (title) {
            fullPrompt = `${prompt} for news article titled "${title}"`;
        }

        // Using DummyImage as a fallback (this won't generate AI images, just a placeholder)
        // In production, replace with an actual image generation API
        const encodedPrompt = encodeURIComponent(fullPrompt.substring(0, 50));
        const placeholderUrl = `https://via.placeholder.com/1024x1024.png?text=${encodedPrompt}`;

        console.warn('Note: Gemini does not support image generation. Using placeholder image instead.');
        console.warn('Consider integrating a dedicated image generation API like Stable Diffusion.');

        // Fetch the placeholder image and convert to blob
        const imageResponse = await fetch(placeholderUrl);
        return await imageResponse.blob();
    } catch (error) {
        console.error('AI image generation error:', error);
        throw error;
    }
};

/**
 * Test function to demonstrate footer description translation
 * This function can be used for testing the translation functionality
 * @param {string} testDescription - Test footer description
 * @param {string} testLanguage - Test language name
 * @param {string} testLanguageCode - Test language code
 */
export const testFooterTranslation = async (api_key,testDescription, testLanguage, testLanguageCode) => {
    try {
        
        const translatedText = await translateFooterDescription(
            api_key,
            testDescription,
            testLanguage,
            testLanguageCode
        );
        
        return translatedText;
    } catch (error) {
        console.error('Translation test failed:', error);
        return null;
    }
};

/**
 * Summarize news content using Gemini API
 * This function creates a concise summary of the provided content
 * @param {string} description - The content to summarize
 * @param {string} language - Language name (e.g., "English", "Spanish")
 * @param {string} languageCode - Language code (e.g., "en", "es")
 * @returns {Promise<string>} - Summarized content
 */
export const summarizeDescription = async (api_key,description, language = "English", languageCode = "en") => {
    try {
        // Validate input parameters
        if (!description || !description.trim()) {
            return '';
        }

        // Remove HTML tags for better summarization
        const cleanContent = description.replace(/<[^>]*>/g, '').trim();
        
        if (!cleanContent) {
            return '';
        }

        // Create a detailed summarization prompt
        const prompt = `You are a skilled content summarizer. Create a concise and engaging summary of the following news content.
        
        Content to summarize: "${cleanContent}"
        
        Instructions:
        - Create a summary that is 10-15 sentences long (approximately 200-250 words)
        - Maintain the key facts and main points
        - Use clear, professional language appropriate for a news website
        - Focus on the most important information
        - Make it engaging for readers
        - Return only the summary text, no additional explanations
        
        ${language && languageCode ? `IMPORTANT: Generate the summary in ${language} language (${languageCode}).` : ''}
        
        Summary:`;
        
        // Call Gemini API with the summarization prompt
        const response = await callGeminiAPI(api_key,prompt);
        
        // Extract the summarized text from Gemini response
        const summarizedText = response.candidates[0].content.parts[0].text.trim();
        
        // Clean up the response by removing any extra quotes or formatting
        const cleanSummary = summarizedText.replace(/^["']|["']$/g, '').trim();
        
        return cleanSummary;
        
    } catch (error) {
        console.error('Content summarization error:', error);
        // Return a fallback summary if API fails
        const fallbackSummary = description.replace(/<[^>]*>/g, '').substring(0, 150) + '...';
        return fallbackSummary;
    }
};

/**
 * Test function to demonstrate content summarization
 * This function can be used for testing the summarization functionality
 * @param {string} testContent - Test content to summarize
 * @param {string} testLanguage - Test language name
 * @param {string} testLanguageCode - Test language code
 */
export const testContentSummarization = async (api_key,testContent, testLanguage = "English", testLanguageCode = "en") => {
    try {      
        
        const summarizedText = await summarizeDescription(
            api_key,
            testContent,
            testLanguage,
            testLanguageCode
        );
        
        return summarizedText;
    } catch (error) {
        console.error('Summarization test failed:', error);
        return null;
    }
};

export default {
    generateContent,
    generateMetaInfo,
    generateImage,
    translateFooterDescription,
    testFooterTranslation,
    summarizeDescription,
    testContentSummarization,
}; 