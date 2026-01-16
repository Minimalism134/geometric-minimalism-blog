
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:5000/api/ai';

export async function summarizeArticle(title: string, content: string, provider = 'siliconflow') {
  try {
    const response = await fetch(`${API_BASE}/summary`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: `Title: ${title}\nContent: ${content}`,
        provider
      })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.summary || "无法生成摘要。";
  } catch (error) {
    console.error("AI Summary Error:", error);
    return "无法生成摘要，请稍后再试。";
  }
}

export async function chatWithAI(message: string, provider = 'siliconflow') {
  try {
    const response = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, provider })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.response || "No response from AI.";
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "AI 暂时无法回答，请稍后再试。";
  }
}

export async function chatWithAIStream(
  message: string,
  onChunk: (chunk: string) => void,
  onDone: () => void,
  onError: (err: any) => void,
  provider = 'siliconflow'
) {
  try {
    const response = await fetch(`${API_BASE}/chat/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, provider })
    });

    if (!response.ok || !response.body) {
      throw new Error('Network response was not ok');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const text = decoder.decode(value, { stream: true });
      onChunk(text);
    }
    onDone();

  } catch (error) {
    console.error("AI Chat Stream Error:", error);
    onError(error);
  }
}
