
<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { marked } from 'marked';
import { getArticle } from '../services/api';
import { summarizeArticle } from '../services/geminiService';
import { Article } from '../types';

const route = useRoute();
const articleId = computed(() => route.params.id as string);
const article = ref<Article | null>(null);

const scrollProgress = ref(0);
const summary = ref<string | null>(null);
const loadingSummary = ref(false);

const loadArticle = async () => {
  try {
    article.value = await getArticle(articleId.value);
  } catch (e) {
    console.error(e);
  }
};

const renderedContent = computed(() => {
  if (!article.value?.content) return '';
  return marked.parse(article.value.content);
});

const handleScroll = () => {
  const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
  const currentScroll = window.scrollY;
  scrollProgress.value = totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0;
};

const handleGenerateSummary = async () => {
  if (!article.value) return;
  loadingSummary.value = true;
  try {
    const result = await summarizeArticle(article.value.title, article.value.content);
    summary.value = result || "抱歉，无法生成该内容的摘要。";
  } catch (e) {
    summary.value = "AI 服务暂时不可用。";
  } finally {
    loadingSummary.value = false;
  }
};

onMounted(() => {
  loadArticle();
  window.addEventListener('scroll', handleScroll);
  handleScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div v-if="article" class="relative flex justify-center py-24 px-6 bg-transparent">
    <!-- Scroll Indicator (Minimalist Sidebar) -->
    <div class="fixed right-0 top-0 bottom-0 w-[2px] bg-white/5 z-50">
      <div 
        class="w-full bg-accent shadow-[0_0_15px_rgba(183,110,121,0.5)] transition-all duration-150" 
        :style="{ height: `${scrollProgress}%` }"
      />
    </div>

    <!-- Content Navigator -->
    <aside class="hidden xl:block fixed left-[calc(50%-640px)] top-48 w-60">
      <div class="flex flex-col gap-10">
        <div class="space-y-2">
          <p class="text-[10px] uppercase tracking-[0.4em] text-accent font-black">Navigator</p>
          <p class="text-xs text-white/40 font-medium">Estimated {{ article.readingTime }} Read</p>
        </div>
        
        <nav class="flex flex-col gap-5 border-l-2 border-white/5">
          <a class="pl-5 -ml-[2px] border-l-2 border-primary text-primary text-xs font-black uppercase tracking-widest" href="#intro">Introduction</a>
          <a class="pl-5 -ml-[2px] border-l-2 border-transparent text-white/30 hover:text-white transition-all text-xs font-bold uppercase tracking-widest" href="#core">The Core Grid</a>
          <a class="pl-5 -ml-[2px] border-l-2 border-transparent text-white/30 hover:text-white transition-all text-xs font-bold uppercase tracking-widest" href="#ai">AI Insights</a>
        </nav>
        
        <div class="pt-8 border-t border-white/5">
           <button 
             @click="handleGenerateSummary"
             class="flex items-center gap-3 text-[10px] font-black text-white/60 hover:text-primary transition-all uppercase tracking-[0.3em] group"
           >
             <span class="material-symbols-outlined text-lg group-hover:rotate-12 transition-transform">auto_awesome</span>
             AI 智能洞察
           </button>
        </div>
      </div>
    </aside>

    <article class="max-w-[800px] w-full flex flex-col gap-16 relative">
      <!-- Article Header -->
      <header class="space-y-12">
        <div class="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.4em] text-white/30">
          <router-link to="/" class="hover:text-primary transition-colors">Archive</router-link>
          <span class="text-white/10">/</span>
          <span class="text-accent">{{ article.tags[0]?.label || 'Article' }}</span>
        </div>

        <div class="flex gap-4">
          <div v-for="(tag, idx) in article.tags" :key="idx" class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 shadow-inner">
            <div class="size-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" :style="{ backgroundColor: tag.color }"></div>
            <span class="text-[10px] font-bold uppercase tracking-[0.2em]" :style="{ color: tag.color }">
              {{ tag.label }}
            </span>
          </div>
        </div>

        <h1 class="text-5xl md:text-7xl font-black leading-[1.1] tracking-tighter text-white font-display">
          {{ article.title }}
        </h1>

        <div class="flex items-center justify-between py-8 border-y border-white/5">
          <div class="flex items-center gap-4">
            <img :src="article.author.avatar" class="size-12 rounded-2xl border border-white/10" />
            <div>
              <p class="text-sm font-black text-white">{{ article.author.name }}</p>
              <p class="text-[10px] font-bold text-white/40 uppercase tracking-widest">{{ article.date }}</p>
            </div>
          </div>
          <div class="flex gap-4">
             <button class="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent hover:border-accent transition-all group">
                <span class="material-symbols-outlined text-xl group-hover:scale-110">bookmark</span>
             </button>
             <button class="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all group">
                <span class="material-symbols-outlined text-xl group-hover:scale-110">share</span>
             </button>
          </div>
        </div>
      </header>

      <!-- AI Summary Component -->
      <transition name="page-fade">
        <div v-if="summary || loadingSummary" id="ai" class="p-8 rounded-3xl bg-primary/5 border border-primary/20 relative overflow-hidden">
           <div class="absolute top-0 right-0 p-4 opacity-10">
              <span class="material-symbols-outlined text-6xl">flare</span>
           </div>
           <p class="text-[10px] font-black text-primary tracking-[0.4em] uppercase mb-4">AI Insight / Summary</p>
           
           <div v-if="loadingSummary" class="flex items-center gap-3 text-primary animate-pulse py-4">
              <span class="material-symbols-outlined animate-spin">sync</span>
              <span class="text-xs font-bold uppercase tracking-widest">正在深度解析内容...</span>
           </div>
           
           <p v-else class="text-primary/90 text-lg leading-relaxed font-serif italic">
             "{{ summary }}"
           </p>
        </div>
      </transition>

      <!-- Featured Image -->
      <div class="w-full aspect-[21/9] overflow-hidden rounded-[2rem] bg-slate-900 border border-white/5 shadow-2xl">
        <img :src="article.coverImage" class="w-full h-full object-cover" />
      </div>

      <!-- Main Body Text -->
      <div class="font-serif text-xl md:text-2xl text-white/70 space-y-12 leading-[1.8] tracking-normal">
        <p id="intro" class="first-letter:text-7xl first-letter:font-black first-letter:text-accent first-letter:mr-3 first-letter:float-left first-letter:leading-[1] italic text-white/90">
          {{ article.excerpt }}
        </p>

        <div id="core" class="space-y-10 prose prose-invert prose-lg max-w-none" v-html="renderedContent"></div>
      </div>

      <!-- Footer Info -->
      <footer class="mt-24 pt-16 border-t border-white/5 flex flex-col items-center gap-12 text-center">
        <div class="space-y-4">
          <p class="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Thank you for reading</p>
          <div class="flex gap-2 justify-center">
             <div class="size-1 bg-accent rounded-full"></div>
             <div class="size-1 bg-accent/40 rounded-full"></div>
             <div class="size-1 bg-accent/10 rounded-full"></div>
          </div>
        </div>

        <div class="flex gap-6">
          <button class="flex items-center gap-4 px-10 py-5 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all transform active:scale-95 shadow-xl shadow-black/40">
            <span class="material-symbols-outlined">favorite</span> Appreciate 1.2K
          </button>
          <button class="flex items-center gap-4 px-10 py-5 rounded-2xl bg-surface border border-white/10 text-white font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all transform active:scale-95">
            <span class="material-symbols-outlined">forum</span> Discussion 42
          </button>
        </div>
      </footer>
    </article>
  </div>
  <div v-else class="min-h-screen flex items-center justify-center text-white/20 uppercase tracking-[1em] font-black text-4xl">
    Entry Not Found
  </div>
</template>
