import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { ImageData, CreativeIdea, BrandKit, CopywritingResult } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

function dataUrlToInlineData(dataUrl: string): { inlineData: { data: string; mimeType: string; } } {
  const match = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!match) {
    throw new Error("Invalid data URL");
  }
  const mimeType = match[1];
  const data = match[2];
  return {
    inlineData: { data, mimeType },
  };
}

export async function generatePhotoshootImage(
  productImage: ImageData,
  modelImage: ImageData,
  userPrompt: string,
  userRole: string,
  brandKit?: BrandKit,
): Promise<string[]> {
  try {
    let brandKitInstructions = '';
    if (brandKit) {
        if (brandKit.logo) {
            brandKitInstructions += `\n- There is a third image provided which is the BRAND LOGO. Subtly incorporate the logo onto the product or background where appropriate, making it look natural.`;
        }
        if (brandKit.colorPalette && brandKit.colorPalette.length > 0) {
            brandKitInstructions += `\n- The brand's color palette is [${brandKit.colorPalette.join(', ')}]. Prioritize using these colors in the background, clothing accents, or lighting to ensure brand consistency.`;
        }
        if (brandKit.brandFont) {
            brandKitInstructions += `\n- If any text is visible or implied, it should evoke the style of a font like '${brandKit.brandFont}'.`;
        }
    }

    const fullPrompt = `
      As a professional ${userRole || 'creative director'}, combine the provided images into a single, new, photorealistic commercial photoshoot image.
      - The first image after this prompt is the PRODUCT.
      - The second image is the MODEL.
      - Your instructions are: "${userPrompt}"
      
      ${brandKitInstructions ? `\n**Brand Kit Guidelines:**${brandKitInstructions}\n` : ''}
      Integrate the product naturally with the model in the described scene. The final image must be high-quality, well-lit, and creatively composed, suitable for a premium advertising campaign. Do not include any text, logos (unless specified by brand guidelines), or watermarks in the output image.
    `;
    
    const textPart = { text: fullPrompt };
    const productPart = dataUrlToInlineData(productImage.base64);
    const modelPart = dataUrlToInlineData(modelImage.base64);
    
    const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string })[] = [
        textPart,
        productPart,
        modelPart
    ];

    if (brandKit?.logo) {
        parts.push(dataUrlToInlineData(brandKit.logo.base64));
    }

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const generatedImages: string[] = [];
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/png';
                const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                generatedImages.push(imageUrl);
            }
        }
    }

    if (generatedImages.length === 0) {
      throw new Error("The model did not return an image. Try refining your prompt.");
    }
    
    return generatedImages;

  } catch (error) {
    console.error("Error generating image with Gemini:", error);
    throw new Error("Failed to generate image. The model may be unavailable or the request could be invalid.");
  }
}


export async function generateMockupImage(
  designImage: ImageData,
  templateImage: ImageData,
  backgroundPrompt: string,
  brandKit?: BrandKit
): Promise<string[]> {
   try {
    let brandKitInstructions = '';
    if (brandKit) {
        if (brandKit.colorPalette && brandKit.colorPalette.length > 0) {
            brandKitInstructions += `\n- The scene's color scheme should strongly feature colors from the brand palette: [${brandKit.colorPalette.join(', ')}].`;
        }
        if (brandKit.brandFont) {
            brandKitInstructions += `\n- If there are any background elements with text, they should be in a style similar to '${brandKit.brandFont}'.`;
        }
    }

    const fullPrompt = `
      As a professional CGI artist and mockup specialist, your task is to realistically apply the 'DESIGN' image onto the 'TEMPLATE' image.
      - The first image after this prompt is the 'DESIGN' to be placed on the mockup.
      - The second image is the 'TEMPLATE' object (e.g., a t-shirt, a phone, a mug).

      After applying the design, place the resulting mockup object into a new scene described as: "${backgroundPrompt}".

      ${brandKitInstructions ? `\n**Brand Kit Guidelines:**${brandKitInstructions}\n` : ''}

      Key requirements:
      1.  **Perspective and Warp:** The design must perfectly follow the contours, folds, and perspective of the template object. For a t-shirt, it should wrinkle with the fabric. For a mug, it should curve around its surface.
      2.  **Lighting and Shadows:** The design must inherit the lighting, shadows, and texture from the template image, making it look like it was part of the original photo.
      3.  **Seamless Integration:** The final composite should be photorealistic and seamless.
      4.  **Scene Placement:** The final mockup object should be naturally integrated into the background scene, with matching lighting and shadows.
      5.  **Output:** Produce only the final, high-resolution image. Do not include any text, logos, or watermarks.
    `;
    
    const textPart = { text: fullPrompt };
    const designPart = dataUrlToInlineData(designImage.base64);
    const templatePart = dataUrlToInlineData(templateImage.base64);
    const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string })[] = [
      textPart,
      designPart, 
      templatePart
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: parts,
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const generatedImages: string[] = [];
    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/png';
                const imageUrl = `data:${mimeType};base64,${base64ImageBytes}`;
                generatedImages.push(imageUrl);
            }
        }
    }

    if (generatedImages.length === 0) {
      throw new Error("The model did not return an image. Try refining your prompt.");
    }
    
    return generatedImages;

  } catch (error) {
    console.error("Error generating mockup with Gemini:", error);
    throw new Error("Failed to generate mockup. The model may be unavailable or the request could be invalid.");
  }
}


export async function generateImageFromPrompt(
  prompt: string,
  style: string,
  aspectRatio: '1:1' | '16:9' | '9:16',
  brandKit?: BrandKit
): Promise<string> {
   try {
    let brandKitInstructions = '';
    if (brandKit) {
        if (brandKit.colorPalette && brandKit.colorPalette.length > 0) {
            brandKitInstructions += ` The image should prominently feature the brand's color palette: [${brandKit.colorPalette.join(', ')}].`;
        }
        if (brandKit.brandFont) {
            brandKitInstructions += ` Any text elements should be in a style reminiscent of '${brandKit.brandFont}'.`;
        }
    }
    const fullPrompt = `A high-quality, ${style.toLowerCase()} image of: ${prompt}.${brandKitInstructions}`;

    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: fullPrompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio,
        },
    });

    if (!response.generatedImages || response.generatedImages.length === 0) {
        throw new Error("The model did not return an image. Please try a different prompt.");
    }

    const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
    const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
    
    return imageUrl;

  } catch (error) {
    console.error("Error generating image from prompt with Gemini:", error);
    throw new Error("Failed to generate image. The model may be unavailable or the prompt could be invalid.");
  }
}

export async function generateCreativeIdeas(
  topic: string,
  ideaType: string,
): Promise<CreativeIdea[]> {
   try {
    const prompt = `
      You are an expert creative director for a top-tier advertising agency.
      A client has given you the following topic or product description: "${topic}".
      They need 5 creative and unique ideas for a "${ideaType}" concept.
      
      For each idea, provide a catchy title and a detailed description.
      The description should be vivid and inspiring, giving the client a clear vision of the final result.
      Focus on originality, emotional impact, and marketability.
    `;

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         responseMimeType: "application/json",
         responseSchema: {
            type: Type.OBJECT,
            properties: {
                ideas: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: {
                          type: Type.STRING,
                          description: 'A short, catchy title for the creative concept.',
                        },
                        description: {
                          type: Type.STRING,
                          description: 'A detailed, vivid description of the creative concept, outlining the scene, mood, and execution.',
                        },
                      },
                      required: ["title", "description"],
                    },
                }
            },
            required: ["ideas"],
          },
       },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("The model returned an empty response. Please try a different topic.");
    }
    
    const result = JSON.parse(jsonText);

    if (!result.ideas || !Array.isArray(result.ideas)) {
        throw new Error("The model did not return ideas in the expected format.");
    }

    return result.ideas as CreativeIdea[];

  } catch (error)
  {
    console.error("Error generating creative ideas with Gemini:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse creative ideas from the model. The response was not valid JSON.");
    }
    throw new Error("Failed to generate creative ideas. The model may be unavailable or the topic could be invalid.");
  }
}


export async function generateCopywritingContent(
  topic: string,
  copyType: string,
  imageData?: ImageData
): Promise<CopywritingResult[]> {
  try {
    const model = 'gemini-2.5-flash';
    const parts: ({ inlineData: { data: string; mimeType: string; } } | { text: string })[] = [];
    
    let promptInstruction = '';
    if (imageData) {
      parts.push(dataUrlToInlineData(imageData.base64));
      promptInstruction = `Based on the provided image and the topic "${topic}", generate 5 creative suggestions for a "${copyType}". Analyze the image's mood, content, and style.`;
    } else {
      promptInstruction = `You are a world-class marketing copywriter. A client needs 5 creative suggestions for a "${copyType}" based on the topic: "${topic}".`;
    }

    const fullPrompt = `
      ${promptInstruction}
      
      For each suggestion, provide a catchy title (e.g., "Witty & Sarcastic", "Professional & Clean", "Urgent & Compelling") and the actual content for the copy.
      Focus on originality, clarity, and effectiveness for the target audience.
    `;
    parts.push({ text: fullPrompt });

    const response = await ai.models.generateContent({
      model,
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'A short, catchy title for the copy style (e.g., "Playful & Fun").',
                  },
                  content: {
                    type: Type.STRING,
                    description: 'The actual copywriting text.',
                  },
                },
                required: ["title", "content"],
              },
            }
          },
          required: ["suggestions"],
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("The model returned an empty response.");
    }

    const result = JSON.parse(jsonText);
    if (!result.suggestions || !Array.isArray(result.suggestions)) {
      throw new Error("The model did not return suggestions in the expected format.");
    }

    return result.suggestions as CopywritingResult[];

  } catch (error) {
    console.error("Error generating copywriting content with Gemini:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse copywriting content from the model.");
    }
    throw new Error("Failed to generate copywriting content.");
  }
}