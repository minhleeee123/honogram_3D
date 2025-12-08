import { GoogleGenAI, Type } from "@google/genai";
import { HologramState, AICommandResponse } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const systemInstruction = `
Bạn là một trợ lý AI cho hệ thống "HoloCore 3D". Nhiệm vụ của bạn là điều khiển các tham số của mô hình hologram dựa trên yêu cầu của người dùng.
Các tham số có thể điều khiển:
- rotationSpeed (tốc độ quay): số thực từ 0 đến 5.
- particleSize (kích thước hạt): số thực từ 0.01 đến 0.3.
- color (màu sắc): mã hex (ví dụ: #00f0ff, #ff0000).
- glitchIntensity (độ nhiễu): số thực từ 0 đến 1.
- shape (hình dạng): 'torus', 'sphere', 'box', 'earth', 'galaxy', 'dna', 'pyramid', 't-rex', 'dragon', 'car'.
- zoomLevel (phóng to/thu nhỏ): số thực từ 0.5 đến 3.0.

Logic ánh xạ hình ảnh (RẤT QUAN TRỌNG):
- "Khủng long", "T-Rex", "Dino" -> chọn 't-rex'.
- "Rồng", "Dragon" -> chọn 'dragon'.
- "Xe", "Ô tô", "Tàu", "Car" -> chọn 'car'.
- "Trái đất", "Địa cầu" -> chọn 'earth'.
- "Vũ trụ", "Thiên hà" -> chọn 'galaxy'.
- "Sinh vật", "Gen", "DNA" -> chọn 'dna'.
- "Kim tự tháp" -> chọn 'pyramid'.
- "Hộp", "Khối" -> chọn 'box'.
- Mặc định: 'torus'.

Nếu người dùng yêu cầu thay đổi hình ảnh/trạng thái, hãy trả về action "update_settings" và các giá trị cần thay đổi.
Nếu người dùng yêu cầu "phóng to", hãy tăng zoomLevel. Nếu "thu nhỏ", hãy giảm zoomLevel.
Luôn trả về JSON hợp lệ.
`;

export const interpretCommand = async (
  prompt: string,
  currentState: HologramState
): Promise<AICommandResponse> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Trạng thái hiện tại: ${JSON.stringify(currentState)}. Yêu cầu người dùng: "${prompt}"`,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: { type: Type.STRING, enum: ["update_settings", "chat"] },
            settings: {
              type: Type.OBJECT,
              properties: {
                rotationSpeed: { type: Type.NUMBER },
                particleSize: { type: Type.NUMBER },
                color: { type: Type.STRING },
                glitchIntensity: { type: Type.NUMBER },
                shape: { type: Type.STRING, enum: ["torus", "sphere", "box", "earth", "galaxy", "dna", "pyramid", "t-rex", "dragon", "car"] },
                zoomLevel: { type: Type.NUMBER }
              }
            },
            message: { type: Type.STRING }
          },
          required: ["action"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AICommandResponse;
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      action: "chat",
      message: "Xin lỗi, kết nối thần kinh không ổn định. Vui lòng thử lại."
    };
  }
};