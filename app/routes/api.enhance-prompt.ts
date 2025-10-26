import { json, type ActionFunctionArgs } from "@remix-run/node";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function action({ request }: ActionFunctionArgs) {
  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { prompt, token, teamSlug, deploymentName } = body;

    if (!prompt || !token || !teamSlug) {
      return json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    // Initialize Google Generative AI with Flash model
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const systemPrompt = `You are a prompt enhancement assistant for an e-commerce website builder. 

Your task is to enhance the user's prompt to be more detailed and specific for generating an e-commerce site. Focus on:
- UI/UX details and styling preferences
- Specific features and functionalities
- User experience improvements
- Design elements and visual appeal

Return ONLY the enhanced prompt, nothing else. Do not include explanations, markdown, or any other text. Just the enhanced prompt.`;

    const fullPrompt = `${systemPrompt}

Original prompt:
${prompt}

Enhanced prompt:`;

    // Call the AI
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const enhancedPrompt = response.text().trim();

    return json({ enhancedPrompt });
  } catch (error: any) {
    console.error("Error enhancing prompt:", error);
    
    if (error.message?.includes("API key")) {
      return json(
        { error: "Invalid API key. Please check your GOOGLE_API_KEY." },
        { status: 500 }
      );
    }

    if (error.status === 429 || error.message?.includes("quota")) {
      return json(
        { error: "Rate limit exceeded. Please try again in a moment." },
        { status: 429 }
      );
    }

    return json(
      { error: error.message || "Failed to enhance prompt" },
      { status: 500 }
    );
  }
}
