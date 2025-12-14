import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
// 1. Initialize Google Client (For Text Enhancement only)
// We use 'gemini-1.5-flash' because it is fast, free, and your key DEFINITELY works for it.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    console.log("📝 User Prompt:", prompt);

    let finalPrompt = prompt;

    // --- STEP 1: PROMPT ENGINEERING (The "Brain") ---
    // We ask Gemini to rewrite the user's prompt to be better for image generation.
    try {
      if (process.env.GEMINI_API_KEY) {
        console.log("🧠 Enhancing prompt with Gemini...");
        
        // Note: Using the v1 beta SDK style for text generation
        // If this specific call fails due to SDK version differences, we fall back to the raw prompt.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const enhancementRequest = `
          Rewrite this image prompt to be more descriptive, artistic, and suitable for a high-quality AI image generator. 
          Keep it under 40 words. Focus on lighting, texture, and mood.
          User Prompt: "${prompt}"
        `;

        const result = await model.generateContent(enhancementRequest);
        const response = await result.response;
        const enhancedText = response.text();
        
        if (enhancedText) {
          finalPrompt = enhancedText.replace(/\n/g, " ").trim();
          console.log("✨ Enhanced Prompt:", finalPrompt);
        }
      }
    } catch (error) {
      console.warn("⚠️ Prompt enhancement failed (using original):", error);
      // If Gemini fails, we just use the user's original text. No crash.
    }

    // --- STEP 2: IMAGE GENERATION (The "Artist") ---
    // We use Pollinations.ai which generates REAL images from text (No key needed).
    // This is much better than Unsplash because it creates NEW images.
    
    // We generate 4 variations by adding a random "seed" number to the URL.
    const ImageUrls = Array.from({ length: 4 }).map((_, i) => {
      const seed = Math.floor(Math.random() * 10000) + i;
      // We encode the prompt so spaces and special characters work in the URL
      const encodedPrompt = encodeURIComponent(finalPrompt);
      
      // URL Structure: https://image.pollinations.ai/prompt/[PROMPT]?width=...&seed=...
      return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true&seed=${seed}&model=flux`;
    });

    // Simulate a small delay so the UI animation has time to look cool
    await new Promise(resolve => setTimeout(resolve, 1500));

    return NextResponse.json({ 
      success: true, 
      images: ImageUrls,
      // We send the enhanced prompt back so the frontend can show it (Optional)
      enhancedPrompt: finalPrompt 
    });

  } catch (error: any) {
    console.error("❌ Generation Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Unknown error" },
      { status: 500 }
    );
  }
}