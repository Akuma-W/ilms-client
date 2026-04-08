import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: message,
      config: {
        systemInstruction:
          'Bạn là một trợ lý học tập thông minh trong hệ thống KEIVerse. Bạn thân thiện, nhiệt tình và luôn sẵn sàng giải đáp các thắc mắc về học tập, kỹ năng và định hướng nghề nghiệp cho sinh viên. Hãy trả lời bằng tiếng Việt một cách súc tích và dễ hiểu.',
      },
    });

    const assistantMessage = response.text || 'Xin lỗi, mình không thể trả lời lúc này.';

    return Response.json({
      text: assistantMessage,
    });
  } catch (error) {
    console.error(error);

    return Response.json({ error: 'AI error' }, { status: 500 });
  }
}
