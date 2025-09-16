
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

interface EditImageResult {
    image: string | null;
    text: string | null;
}

export const editImage = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<EditImageResult> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    let editedImage: string | null = null;
    let textResponse: string | null = null;
    
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              editedImage = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
            } else if (part.text) {
              textResponse = part.text;
            }
        }
    }

    if (!editedImage && !textResponse) {
        throw new Error("API returned an empty response.");
    }

    return { image: editedImage, text: textResponse };

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};
