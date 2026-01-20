<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { marked } from 'marked';
import { chatWithAI, chatWithAIStream } from '../services/geminiService';

const isOpen = ref(false);
const messages = ref<{ text: string, isUser: boolean }[]>([
  { text: "你好！我是你的几何极简助手。有什么可以帮你的吗？", isUser: false }
]);
const inputMessage = ref("");
const isLoading = ref(false);
const chatContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const suggestedQuestions = [
  "什么是极简主义设计？",
  "如何开始数字断舍离？",
  "AI 如何影响现代艺术？",
  "推荐几本关于建筑美学的书",
  "解释 'Less is More'"
];

const useQuestion = (q: string) => {
  inputMessage.value = q;
  sendMessage();
};

const clearChat = () => {
    messages.value = [{ text: "对话已清除。我是你的几何极简助手。有什么可以帮你的吗？", isUser: false }];
};

const renderMessage = (text: string) => {
    return marked.parse(text);
};

watch(isOpen, async (val) => {
  if (val) {
    await nextTick();
    inputRef.value?.focus();
    scrollToBottom();
  }
});

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
       messages.value[aiMsgIndex].text = "连接服务器出错，请稍后再试。";
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
      <div class="flex items-center justify-between p-4 border-b border-white/5 bg-white/5 backdrop-blur-md z-10">
        <div class="flex items-center gap-3">
           <div class="size-8 rounded-lg bg-gradient-to-br from-accent to-primary flex items-center justify-center shadow-lg">
              <span class="material-symbols-outlined text-white text-sm">auto_awesome</span>
           </div>
           <div>
              <h3 class="font-bold text-white tracking-wider text-sm">AI 助手</h3>
              <p class="text-[9px] text-white/40 uppercase tracking-widest font-bold">DeepSeek V3</p>
           </div>
        </div>
        
        <div class="flex items-center gap-2">
            <button @click="clearChat" class="group p-2 rounded-lg hover:bg-white/10 transition-colors" title="清除对话">
                <span class="material-symbols-outlined text-white/50 group-hover:text-red-400 text-lg transition-colors">delete_sweep</span>
            </button>
            <div class="w-[1px] h-4 bg-white/10 mx-1"></div>
            <button @click="toggleChat" class="group p-2 rounded-lg hover:bg-white/10 transition-colors">
                <span class="material-symbols-outlined text-white/50 group-hover:text-white text-lg transition-colors">close</span>
            </button>
        </div>
      </div>

      <!-- Messages -->
      <div ref="chatContainer" class="flex-1 overflow-y-auto p-4 flex flex-col gap-6 custom-scrollbar scroll-smooth">
        <div 
          v-for="(msg, idx) in messages" 
          :key="idx" 
          class="flex w-full"
          :class="msg.isUser ? 'justify-end' : 'justify-start'"
        >
          <!-- Message Bubble -->
          <div 
            class="max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed shadow-lg relative group transition-all"
            :class="msg.isUser ? 'bg-primary text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-white/90 rounded-tl-none'"
          >
             <!-- Avatar for AI -->
             <div v-if="!msg.isUser" class="absolute -top-6 -left-2 size-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10 text-[10px]">AI</div>
             
             <!-- Content -->
             <div v-if="msg.isUser">{{ msg.text }}</div>
             <div v-else class="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10 font-light" v-html="renderMessage(msg.text)"></div>
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

      <!-- Suggested Questions -->
      <div v-if="messages.length < 3 && !isLoading" class="px-4 pb-2">
         <p class="text-[10px] uppercase font-bold text-white/30 mb-2 tracking-widest">推荐提问</p>
         <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            <button 
              v-for="q in suggestedQuestions" 
              :key="q"
              @click="useQuestion(q)"
              class="shrink-0 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs text-white/70 whitespace-nowrap transition-colors"
            >
              {{ q }}
            </button>
         </div>
      </div>

      <!-- Input -->
      <div class="p-4 border-t border-white/5 bg-white/[0.02]">
        <div class="flex gap-2">
          <input 
            ref="inputRef"
            v-model="inputMessage" 
            @keyup.enter="sendMessage"
            type="text" 
            placeholder="与 AI 探讨数字美学..." 
            class="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-accent outline-none text-sm transition-colors"
            :disabled="isLoading"
          />
          <button 
            @click="sendMessage"
            class="p-3 bg-accent rounded-xl text-white hover:bg-white hover:text-accent transition-colors disabled:opacity-50"
            :disabled="isLoading"
          >
            <span class="text-xs font-bold uppercase tracking-widest">发送</span>
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
