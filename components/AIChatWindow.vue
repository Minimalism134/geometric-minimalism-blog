<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { chatWithAI, chatWithAIStream } from '../services/geminiService';

const isOpen = ref(false);
const messages = ref<{ text: string, isUser: boolean }[]>([
  { text: "你好！我是你的几何极简助手。有什么可以帮你的吗？", isUser: false }
]);
const inputMessage = ref("");
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);

const toggleChat = () => {
  isOpen.value = !isOpen.value;
};

const scrollToBottom = async () => {
  await nextTick();
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  }
};

const selectedModel = ref("siliconflow");

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;

  const userMsg = inputMessage.value;
  messages.value.push({ text: userMsg, isUser: true });
  inputMessage.value = "";
  scrollToBottom();

  isLoading.value = true;
  
  // Add placeholder for AI response
  const aiMsgIndex = messages.value.push({ text: "", isUser: false }) - 1;

  await chatWithAIStream(
    userMsg,
    (chunk) => {
      messages.value[aiMsgIndex].text += chunk;
      scrollToBottom();
    },
    () => {
      isLoading.value = false;
      scrollToBottom();
    },
    (err) => {
       messages.value[aiMsgIndex].text = "连接出错了。";
       isLoading.value = false;
    },
    selectedModel.value
  );
};

defineExpose({ toggleChat });
</script>

<template>
  <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="toggleChat">
    <div class="w-[90vw] md:w-[500px] h-[600px] bg-[#121820] border border-white/10 rounded-2xl flex flex-col shadow-2xl overflow-hidden relative">
      <!-- Header -->
      <div class="flex items-center justify-between p-4 border-b border-white/5 bg-white/5">
        <div class="flex items-center gap-3">
           <div class="size-8 rounded-lg bg-accent flex items-center justify-center">
             <span class="material-symbols-outlined text-white text-lg">smart_toy</span>
           </div>
           <h3 class="font-bold text-white tracking-wider">AI Assistant</h3>
        </div>
        
        <div class="flex items-center gap-3">
            <select v-model="selectedModel" class="bg-black/20 text-[10px] font-bold text-white/70 border border-white/10 rounded-lg px-2 py-1 outline-none uppercase tracking-wider hover:border-accent transition-colors">
                <option value="siliconflow">Silicon Flow (DeepSeek V3)</option>
            </select>
            <button @click="toggleChat" class="text-white/50 hover:text-white transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
        <div 
          v-for="(msg, idx) in messages" 
          :key="idx" 
          class="flex w-full"
          :class="msg.isUser ? 'justify-end' : 'justify-start'"
        >
          <div 
            class="max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed"
            :class="msg.isUser ? 'bg-primary text-white rounded-br-none' : 'bg-white/10 text-white/90 rounded-bl-none'"
          >
            {{ msg.text }}
          </div>
        </div>
        <div v-if="isLoading" class="flex justify-start">
           <div class="bg-white/10 p-3 rounded-2xl rounded-bl-none flex gap-1">
             <div class="size-2 bg-white/50 rounded-full animate-bounce"></div>
             <div class="size-2 bg-white/50 rounded-full animate-bounce delay-75"></div>
             <div class="size-2 bg-white/50 rounded-full animate-bounce delay-150"></div>
           </div>
        </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-white/5 bg-white/[0.02]">
        <div class="flex gap-2">
          <input 
            v-model="inputMessage" 
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="输入你的问题..." 
            class="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm transition-colors"
          />
          <button 
            @click="sendMessage"
            class="p-3 bg-accent rounded-xl text-white hover:bg-white hover:text-accent transition-colors disabled:opacity-50"
            :disabled="isLoading"
          >
            <span class="material-symbols-outlined">send</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
</style>
