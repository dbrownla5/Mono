import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface WeightEstimate {
  minWeightOz: number;
  maxWeightOz: number;
  typicalWeightOz: number;
  category: string;
  confidence: number;
  reasoning: string;
  packagingType: string;
}

export async function estimateWeightFromDescription(description: string, price?: number): Promise<WeightEstimate> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Estimate the shipping weight for the following item: "${description}" ${price ? `valued at $${price}` : ''}.
    
    CRITICAL PACKAGING RULES:
    1. ALWAYS include packaging material weight.
    2. HIGH VALUE ITEMS (>$60 or Designer): Use a BOX (e.g., small box roughly 8x10x2 or "photo frame size") for protection. Add ~6-8oz for the box.
    3. PURSES (Large): Use a BOX. Add ~10-12oz for a sturdy box.
    4. BELTS/SILK/LIGHT DELICATES: Use a PADDED MAILER. Add ~1.5-2oz.
    5. STANDARD CLOTHING: Use a POLY MAILER with TISSUE. Add ~1oz.
    6. PREFER USPS GROUND ADVANTAGE: Ensure the final weight reflects the total package weight.
    
    Provide the weight in ounces. 
    Return a JSON object with: minWeightOz, maxWeightOz, typicalWeightOz, category, confidence (0-1), reasoning, and packagingType (e.g., "Small Box", "Padded Mailer", "Poly Mailer").`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          minWeightOz: { type: Type.NUMBER },
          maxWeightOz: { type: Type.NUMBER },
          typicalWeightOz: { type: Type.NUMBER },
          category: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
          packagingType: { type: Type.STRING },
        },
        required: ["minWeightOz", "maxWeightOz", "typicalWeightOz", "category", "confidence", "reasoning", "packagingType"],
      },
    },
  });

  return JSON.parse(response.text || "{}") as WeightEstimate;
}

export interface ShippingPreset {
  platform: string;
  presetName: string;
  weightLimitOz: number;
  cost: number;
}

export interface BulkEstimateResult extends WeightEstimate {
  id: string;
  name: string;
  presets: ShippingPreset[];
}

export async function estimateBulkWeights(items: {id: string, name: string, description: string, price?: number}[]): Promise<BulkEstimateResult[]> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Estimate shipping weights for the following items. Factor in packaging based on value and type.
    
    PACKAGING LOGIC:
    - Value > $60 or Designer: Small Box (~7oz packaging)
    - Large Purses: Box (~10oz packaging)
    - Belts/Silk: Padded Mailer (~2oz packaging)
    - Standard: Poly Mailer (~1oz packaging)
    
    Items:
    ${items.map(item => `ID: ${item.id} | Name: ${item.name} | Description: ${item.description} | Price: ${item.price || 'Unknown'}`).join('\n')}
    
    Return a JSON array of objects, each including the original ID, Name, and all weight/packaging fields.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            name: { type: Type.STRING },
            minWeightOz: { type: Type.NUMBER },
            maxWeightOz: { type: Type.NUMBER },
            typicalWeightOz: { type: Type.NUMBER },
            category: { type: Type.STRING },
            confidence: { type: Type.NUMBER },
            reasoning: { type: Type.STRING },
            packagingType: { type: Type.STRING },
          },
          required: ["id", "name", "minWeightOz", "maxWeightOz", "typicalWeightOz", "category", "confidence", "reasoning", "packagingType"],
        },
      },
    },
  });

  const estimates = JSON.parse(response.text || "[]") as any[];
  return estimates.map(est => ({
    ...est,
    presets: [] 
  }));
}
