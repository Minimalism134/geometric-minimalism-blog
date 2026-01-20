import os
import openai

class LLMProvider:
    def chat(self, message):
        raise NotImplementedError("Chat method must be implemented")
    
    def summarize(self, text):
        raise NotImplementedError("Summarize method must be implemented")

class SiliconFlowProvider(LLMProvider):
    def __init__(self, api_key):
        if not api_key:
            raise ValueError("SiliconFlow API Key is required")
        # SiliconFlow API Base URL
        self.client = openai.OpenAI(api_key=api_key, base_url="https://api.siliconflow.cn/v1")

    def chat(self, message):
        try:
            # Using DeepSeek-V3 as default for SiliconFlow
            response = self.client.chat.completions.create(
                model="deepseek-ai/DeepSeek-V3", 
                messages=[
                    {"role": "system", "content": "你是一位富有思想的'几何简致'数字美学助手。你的回答应该简洁、深刻，富有哲学意味，通过精炼的语言探讨技术、设计与人文的交集。避免冗长和陈词滥调。"},
                    {"role": "user", "content": message},
                ],
                stream=False
            )
            return response.choices[0].message.content
        except Exception as e:
            return f"Error from SiliconFlow: {str(e)}"

    def stream_chat(self, message):
        try:
            response = self.client.chat.completions.create(
                model="deepseek-ai/DeepSeek-V3", 
                messages=[
                    {"role": "system", "content": "你是一位富有思想的'几何简致'数字美学助手。你的回答应该简洁、深刻，富有哲学意味，通过精炼的语言探讨技术、设计与人文的交集。"},
                    {"role": "user", "content": message},
                ],
                stream=True
            )
            for chunk in response:
                if chunk.choices[0].delta.content is not None:
                     yield chunk.choices[0].delta.content
        except Exception as e:
            yield f"Error from SiliconFlow: {str(e)}"

    def summarize(self, text):
        try:
            # Enhanced prompt for "AI Insight"
            prompt = f"""
            请阅读以下文章，并提供一段“AI 深度洞察”。
            要求：
            1. 不要仅仅复述内容，而是要提炼出文章背后的核心哲学思想或独特观点。
            2. 使用优雅、简洁、富有文学性的中文。
            3. 字数控制在 100 字左右。
            4. 语气要客观、冷静且具有启发性。

            文章内容：
            {text}
            """
            response = self.client.chat.completions.create(
                 model="deepseek-ai/DeepSeek-V3",
                 messages=[{"role": "user", "content": prompt}],
                 stream=False
            )
            return response.choices[0].message.content
        except Exception as e:
             return f"Error from SiliconFlow: {str(e)}"

    def extract_key_points(self, text):
        try:
            prompt = f"""
            请从以下文章中提炼出 3-5 个“核心要点” (Core Takeaways)。
            要求：
            1. 以Markdown列表格式返回。
            2. 每个要点不超过 20 字。
            3. 聚焦于最具洞察力的结论。

            文章内容：
            {text}
            """
            response = self.client.chat.completions.create(
                 model="deepseek-ai/DeepSeek-V3",
                 messages=[{"role": "user", "content": prompt}],
                 stream=False
            )
            return response.choices[0].message.content
        except Exception as e:
             return f"Error from SiliconFlow: {str(e)}"

class ModelFactory:
    @staticmethod
    def get_provider(provider_type, api_key):
        # Always fallback to SiliconFlow for now to ensure service works
        # regardless of what frontend requests (e.g. 'gemini')
        return SiliconFlowProvider(api_key)

