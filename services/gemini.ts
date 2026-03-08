
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getProductRecommendation(query: string, products: Product[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User is looking for: "${query}". Based on these products: ${JSON.stringify(products)}, recommend the top 2 best matches with reasons.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              productId: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["productId", "reason"]
          }
        }
      }
    });
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
}

export async function generateProductDescription(productName: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a 2-sentence premium marketing description for a product named "${productName}".`,
    });
    return response.text;
  } catch (error) {
    return "Experience premium quality with this exquisite product.";
  }
}
