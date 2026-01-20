
const API_BASE = '/api/ai';

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

export async function extractKeyPoints(content: string, provider = 'siliconflow') {
  try {
    const response = await fetch(`${API_BASE}/key_points`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, provider })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.key_points || "无法提取要点。";
  } catch (error) {
    console.error("AI Key Points Error:", error);
    return "无法提取核心要点。";
  }
}

export async function generateCoverImage(title: string, provider = 'siliconflow') {
  try {
    const response = await fetch(`${API_BASE}/generate_cover`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, provider })
    });
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    return data.image_url;
  } catch (error) {
    console.error("AI Cover Gen Error:", error);
    return null;
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
