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
                    {"role": "system", "content": "You are a helpful assistant."},
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
                    {"role": "system", "content": "You are a helpful assistant."},
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
            prompt = f"Please summarize the following article in a concise and insightful way (around 100 words):\n\n{text}"
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
        if provider_type.lower() == 'siliconflow':
            return SiliconFlowProvider(api_key)
        else:
            # Default to SiliconFlow if unknown or just raise error. 
            # Since we deleted others, we might want to be strict or fallback.
            # Let's fallback to SiliconFlow if someone requests others, or raise error.
            # Request says "delete others", so probably strictly support only siliconflow.
            # But to be safe if frontend sends 'gemini', maybe we should map it to siliconflow or error?
            # User wants to delete others code.
            raise ValueError(f"Provider {provider_type} is not supported. Only 'siliconflow' is available.")

