








import { GoogleGenAI, Modality, Type } from "@google/genai";
// FIX: Corrected the type name from GenerateVideosOperationResponse to GenerateVideosOperation.
import type { GenerateVideosOperation } from "@google/genai";
import type { ImageData, CreativeIdea, BrandKit, CopywritingResult, MarketingStrategy, TrendReport, SimulationReport } from '../types';

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
      5.  **Output:** Produce 2 distinct, high-resolution variations of the final scene. Do not include any text, logos, or watermarks in the output images.
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


export async function generatePosedImage(
  modelImage: ImageData,
  posePrompt: string,
): Promise<string[]> {
  try {
    const fullPrompt = `
      As a master digital artist specializing in photorealistic manipulation, your task is to alter the pose of the person in the provided image.
      - **Primary Goal:** Change the person's pose to match the following description: "${posePrompt}".
      - **Crucial Constraints:**
        1.  **Identity Preservation:** The person's face, hair, and physical identity must remain identical to the original image. Do NOT change the person.
        2.  **Clothing Integrity:** The person's outfit, including its colors, textures, and style, must be preserved exactly as it is.
        3.  **Background Consistency:** The background of the image should be kept as similar as possible to the original.
        4.  **Photorealism:** The final output must be a single, seamless, high-quality, photorealistic image. It should not look edited or manipulated.
      - **Input:** The image provided after this prompt is the person to be re-posed.
      - **Output:** Generate only the final image. Do not add any text, watermarks, or logos.
    `;
    
    const textPart = { text: fullPrompt };
    const modelPart = dataUrlToInlineData(modelImage.base64);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [textPart, modelPart],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const generatedImages: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImages.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }

    if (generatedImages.length === 0) {
      throw new Error("The model did not return an image. Try refining your pose description.");
    }
    
    return generatedImages;

  } catch (error) {
    console.error("Error generating posed image with Gemini:", error);
    throw new Error("Failed to generate posed image. The model may be unavailable or the request is invalid.");
  }
}

export async function generateGroupPhoto(
  personImages: ImageData[],
  backgroundPrompt: string,
  arrangementPrompt: string,
): Promise<string[]> {
  try {
    const imageDescriptions = personImages.map((_, index) => `- Person ${index + 1} corresponds to image input #${index + 1}.`).join('\n');

    const fullPrompt = `
      As an expert photo compositor, your job is to create a single, seamless, photorealistic group photo.
      - **Task:** Combine the individuals from the provided images into one cohesive scene.
      - **Image Inputs:** You are provided with ${personImages.length} images following this prompt.
      ${imageDescriptions}
      - **Scene Description:** The background and overall environment should be: "${backgroundPrompt}".
      - **Group Arrangement:** The people should be arranged and interacting as follows: "${arrangementPrompt}".
      - **Key Requirements:**
        1.  **Identity Preservation:** Each person must be clearly recognizable from their original photo (same face, hair, etc.).
        2.  **Clothing Integrity:** Keep the clothing from their original photos.
        3.  **Cohesive Lighting:** The lighting and shadows on all individuals must be consistent and match the described scene.
        4.  **Natural Scale:** All people should be scaled realistically relative to each other and the background.
        5.  **Photorealism:** The final image must look like a real photograph, not a collage.
      - **Output:** Generate only the final group photo. No text, watermarks, or logos.
    `;
    
    const parts: (({ text: string; }) | ({ inlineData: { data: string; mimeType: string; } }))[] = [
        { text: fullPrompt }
    ];

    personImages.forEach(image => {
        parts.push(dataUrlToInlineData(image.base64));
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const generatedImages: string[] = [];
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImages.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }

    if (generatedImages.length === 0) {
      throw new Error("The model did not return an image. Try refining your prompts.");
    }
    
    return generatedImages;

  } catch (error) {
    console.error("Error generating group photo with Gemini:", error);
    throw new Error("Failed to generate group photo. The model may be unavailable or the request is invalid.");
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

export async function generateVideo(
  prompt: string,
  image?: ImageData,
): Promise<string[]> {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      throw new Error("API key is not configured.");
    }

    // FIX: Corrected the type name from GenerateVideosOperationResponse to GenerateVideosOperation.
    let operation: GenerateVideosOperation = await ai.models.generateVideos({
      model: 'veo-2.0-generate-001',
      prompt: prompt,
      ...(image && {
        image: {
          imageBytes: image.base64.split(',')[1], // Remove data URL prefix
          mimeType: image.mimeType,
        },
      }),
      config: {
        numberOfVideos: 1,
      },
    });

    while (!operation.done) {
      // Poll every 10 seconds
      await new Promise(resolve => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const videoLinks = operation.response?.generatedVideos?.map(v => v.video?.uri).filter((uri): uri is string => !!uri) || [];

    if (videoLinks.length === 0) {
      throw new Error("The model did not return any video content.");
    }
    
    // Fetch videos and convert to blob URLs
    const blobUrls = await Promise.all(videoLinks.map(async (link) => {
      // The download link requires the API key
      const response = await fetch(`${link}&key=${apiKey}`);
      if (!response.ok) {
        throw new Error(`Failed to download video from ${link}. Status: ${response.status}`);
      }
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }));

    return blobUrls;

  } catch (error) {
    console.error("Error generating video with Gemini:", error);
    throw new Error("Failed to generate video. The model may be unavailable or the request is invalid.");
  }
}

export async function generateMarketingStrategy(
  goal: string,
  audience: string,
): Promise<MarketingStrategy> {
  try {
    const prompt = `
      As an expert marketing strategist, create a content distribution plan.
      - Campaign Goal: "${goal}"
      - Target Audience: "${audience}"

      Provide a concise summary and then recommend the top 3-4 channels. For each channel, specify the best content format, provide a strong reasoning based on the goal and audience, and list 2-3 concrete content ideas.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: "A brief, high-level summary of the recommended strategy.",
            },
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  channel: {
                    type: Type.STRING,
                    description: "The recommended social media or content channel (e.g., 'TikTok', 'Instagram', 'LinkedIn').",
                  },
                  format: {
                    type: Type.STRING,
                    description: "The best content format for this channel (e.g., '15s Vertical Video', 'Carousel Post', 'In-depth Article').",
                  },
                  reasoning: {
                    type: Type.STRING,
                    description: "A short explanation of why this channel and format are recommended for the given goal and audience.",
                  },
                  contentIdeas: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "A list of 2-3 specific content ideas for this channel and format.",
                  },
                },
                required: ["channel", "format", "reasoning", "contentIdeas"],
              },
            },
          },
          required: ["summary", "recommendations"],
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("The model returned an empty response.");
    }

    const result = JSON.parse(jsonText);
    if (!result.summary || !result.recommendations) {
        throw new Error("The model did not return the strategy in the expected format.");
    }

    return result as MarketingStrategy;

  } catch (error) {
    console.error("Error generating marketing strategy with Gemini:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the marketing strategy from the model.");
    }
    throw new Error("Failed to generate marketing strategy.");
  }
}


/**
 * A utility to find and parse a JSON object from a string that might contain other text.
 * @param text The string to search within.
 * @returns The parsed JSON object or null if not found/invalid.
 */
function extractAndParseJson<T>(text: string): T | null {
  const jsonRegex = /```json\s*([\s\S]*?)\s*```|({[\s\S]*})/;
  const match = text.match(jsonRegex);
  if (!match) {
    return null;
  }
  const jsonString = match[1] || match[2];
  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error("Failed to parse extracted JSON:", error);
    return null;
  }
}

export async function generateTrendReport(
  country: string,
): Promise<TrendReport> {
  try {
    const prompt = `
      Act as a world-class social media trend analyst. Your task is to provide a real-time, in-depth analysis of the current creative trends in ${country} on major platforms like TikTok, Instagram, and YouTube.
      Use your search capabilities to find the most up-to-date information.

      Provide your report in a valid JSON object format, enclosed in markdown code fences (\`\`\`json ... \`\`\`).
      The JSON object MUST have the following structure and keys:
      - "summary": A string summarizing the overall creative mood and biggest trends in the region.
      - "topicalTrends": An array of objects. Each object MUST have:
          - "title": A string for the trend's name.
          - "description": A string explaining the trend.
          - "velocity": A string, choosing ONE of the following options: 'Rising Fast', 'Growing Steadily', 'Peaking', 'Fading Slowly', 'Stable'.
          - "lifespanPrediction": A string predicting its longevity (e.g., "Short-term (1-2 weeks)", "Long-wave (2 months+)")
          - "targetAudience": A string describing the primary demographic/interest group (e.g., "Gen Z, Fashion enthusiasts").
          - "audienceResonance": A string explaining WHY and HOW this trend resonates with the specified target audience(s).
      - "visualAudioStyles": An array of objects with the exact same structure as "topicalTrends".
      - "popularFormats": An array of objects with the exact same structure as "topicalTrends".
      - "crossPlatformTrends": An array of objects. Each object MUST have:
          - "trend": A string describing the trend moving between platforms.
          - "originPlatform": A string for the platform where it started (e.g., "TikTok").
          - "emergingOn": An array of strings for platforms where it's gaining traction (e.g., ["Instagram Reels", "YouTube Shorts"]).
          - "insight": A string explaining the strategic opportunity.
      - "examplePrompt": A single, ready-to-use, descriptive string for an AI image generator that creatively combines several of the identified trends.

      Analyze and provide at least 2-3 items for each of the array categories. Ensure the entire output is a single, valid JSON object within the markdown fences.
    `;

    const response = await ai.models.generateContent({
       model: "gemini-2.5-flash",
       contents: prompt,
       config: {
         tools: [{googleSearch: {}}],
       },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("The model returned an empty response.");
    }
    
    const result = extractAndParseJson<TrendReport>(jsonText);

    if (!result || !result.summary || !result.topicalTrends || !result.crossPlatformTrends) {
        console.error("Parsed JSON is missing required fields. Raw text:", jsonText);
        throw new Error("The model did not return the trend report in the expected format. Please try again.");
    }

    return result;

  } catch (error) {
    console.error("Error generating trend report with Gemini:", error);
    if (error instanceof SyntaxError) {
        throw new Error("Failed to parse the trend report from the model. The response was not valid JSON.");
    }
    throw new Error("Failed to generate trend report. The model may be unavailable or the topic could be invalid.");
  }
}


export async function generatePredictiveSimulation(
  creatives: ImageData[],
  audience: string,
  channels: string,
): Promise<SimulationReport> {
  try {
    const creativeDescriptions = creatives.map((_, index) => `- Creative #${index + 1} is image input ${index + 1}.`).join('\n');
    
    const prompt = `
      As an expert AI Media Strategist, analyze the provided ad creatives for a campaign with the following parameters:
      - Target Audience: "${audience}"
      - Target Channels: "${channels}"
      - Creatives provided: ${creatives.length}
      ${creativeDescriptions}

      Your task is to generate a comprehensive predictive performance report. The output must be a single, valid JSON object that strictly adheres to the provided schema.
      
      For each creative, perform the following analysis:
      1.  **Metric Prediction:**
          - "viralityScore": An integer from 0-100 representing the likelihood of organic sharing and trending.
          - "conversionLikelihood": A string, must be one of: 'Low', 'Medium', 'High'.
          - "ctrEstimate": A string representing a likely Click-Through-Rate range (e.g., "1.5% - 2.5%").
      2.  **Channel Recommendation:** A string recommending the single best channel from the provided list for this specific creative and a brief 'why'.
      3.  **Visual Heatmap Analysis:**
          - "hotspots": Identify 3-5 key points of high visual attention.
          - "coldspots": Identify 2-3 points that are visually distracting or ignored.
          - Provide "x" and "y" coordinates as percentages (0-100) for each point.
          - "insight": A brief string explaining what the heatmap data reveals about the creative's visual effectiveness.
      4.  **Overall Assessment:** After analyzing all creatives, provide a "summary" of the overall strategy and designate exactly ONE creative as the "isBestPerformer".
    `;

    const parts: (({ text: string; }) | ({ inlineData: { data: string; mimeType: string; } }))[] = [
        { text: prompt }
    ];

    creatives.forEach(image => {
        parts.push(dataUrlToInlineData(image.base64));
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            results: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  creativeId: { type: Type.INTEGER },
                  isBestPerformer: { type: Type.BOOLEAN },
                  predictions: {
                    type: Type.OBJECT,
                    properties: {
                      viralityScore: { type: Type.INTEGER },
                      conversionLikelihood: { type: Type.STRING },
                      ctrEstimate: { type: Type.STRING },
                    },
                    required: ["viralityScore", "conversionLikelihood", "ctrEstimate"],
                  },
                  channelRecommendation: { type: Type.STRING },
                  heatmap: {
                    type: Type.OBJECT,
                    properties: {
                      hotspots: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                          },
                          required: ["x", "y"],
                        },
                      },
                      coldspots: {
                        type: Type.ARRAY,
                        items: {
                          type: Type.OBJECT,
                          properties: {
                            x: { type: Type.NUMBER },
                            y: { type: Type.NUMBER },
                          },
                          required: ["x", "y"],
                        },
                      },
                      insight: { type: Type.STRING },
                    },
                    required: ["hotspots", "coldspots", "insight"],
                  },
                },
                required: ["creativeId", "isBestPerformer", "predictions", "channelRecommendation", "heatmap"],
              },
            },
          },
          required: ["summary", "results"],
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
        throw new Error("The model returned an empty response.");
    }
    
    const result = JSON.parse(jsonText);
    if (!result.summary || !result.results) {
        throw new Error("The model did not return the simulation report in the expected format.");
    }

    return result as SimulationReport;

  } catch (error) {
    console.error("Error generating predictive simulation:", error);
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse the simulation report from the model.");
    }
    throw new Error("Failed to generate predictive simulation.");
  }
}

export async function generateLogo(
  brandName: string,
  slogan: string,
  keywords: string,
  colorPalette: string,
  style: string,
): Promise<{ images: string[]; rationaleText: string }> {
   try {
    const fullPrompt = `
      Act as an expert logo designer and brand strategist. Create 4 distinct logo concepts for a brand with the following details:
      - Brand Name: "${brandName}"
      - Slogan: "${slogan || 'Not specified'}"
      - Core Keywords: "${keywords}"
      - Color Palette: "${colorPalette}"
      - Style: "${style}"

      **Task:**
      Generate 4 unique logo options. Each logo must be on a solid, clean, white background (#FFFFFF).
      Simultaneously, provide a written analysis containing a short, one-sentence rationale for EACH of the 4 logos, explaining the design choice.

      **Output Instructions:**
      - You will output exactly 4 images.
      - You will also output a single text block.
      - In the text block, provide the rationales, clearly numbered 1 to 4, corresponding to the order of the generated images.
      - Start each rationale on a new line, like this:
      1. Rationale for logo 1...
      2. Rationale for logo 2...
      3. Rationale for logo 3...
      4. Rationale for logo 4...
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [{ text: fullPrompt }],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    const generatedImages: string[] = [];
    let rationaleText = '';

    if (response.candidates && response.candidates.length > 0) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const base64ImageBytes: string = part.inlineData.data;
                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                generatedImages.push(`data:${mimeType};base64,${base64ImageBytes}`);
            } else if (part.text) {
                rationaleText += part.text;
            }
        }
    }

    if (generatedImages.length === 0) {
      throw new Error("The model did not return any logos. Please try again.");
    }
    
    return { images: generatedImages, rationaleText };

  } catch (error) {
    console.error("Error generating logo with Gemini:", error);
    throw new Error("Failed to generate logos. The model may be unavailable or the prompt could be invalid.");
  }
}

export async function generateTagsForImage(imageData: ImageData): Promise<string[]> {
  try {
    const prompt = `
      Analyze the provided image and generate a list of 3-5 relevant, descriptive keywords or tags that accurately represent its content, style, and mood.
      Focus on objects, themes, colors, and overall feeling. Do not use generic tags like "image" or "art".
    `;

    const imagePart = dataUrlToInlineData(imageData.base64);
    const textPart = { text: prompt };

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: [textPart, imagePart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
                description: "A single descriptive tag.",
              },
            },
          },
          required: ["tags"],
        },
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      return [];
    }
    
    const result = JSON.parse(jsonText);

    if (!result.tags || !Array.isArray(result.tags)) {
      console.warn("AI did not return tags in the expected format.");
      return [];
    }
    
    return (result.tags as string[]).slice(0, 5);

  } catch (error) {
    console.error("Error generating tags for image:", error);
    return [];
  }
}

export async function generateLogoVariations(
  logoImage: ImageData,
): Promise<string[]> {
  try {
    const fullPrompt = `
      As an expert logo designer, you are provided with an existing logo image.
      Your task is to generate 3 distinct variations of this logo.
      
      **Crucial Instructions:**
      1.  **Maintain Core Concept:** Keep the fundamental idea, brand name, and style of the original logo.
      2.  **Explore Variations:** You can explore different layouts, icon refinements, font treatments, or simplified/monochrome versions.
      3.  **Clean Background:** All generated logos MUST be on a solid, clean, white background (#FFFFFF).
      4.  **Output:** Output only the 3 final image variations. Do not include any text or rationale.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          { text: fullPrompt },
          dataUrlToInlineData(logoImage.base64),
        ],
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
                const mimeType = part.inlineData.mimeType || 'image/jpeg';
                generatedImages.push(`data:${mimeType};base64,${base64ImageBytes}`);
            }
        }
    }

    if (generatedImages.length === 0) {
      throw new Error("The model did not return any logo variations. Please try again.");
    }
    
    // Ensure we return up to 3 images
    return generatedImages.slice(0, 3);

  } catch (error) {
    console.error("Error generating logo variations with Gemini:", error);
    throw new Error("Failed to generate logo variations.");
  }
}