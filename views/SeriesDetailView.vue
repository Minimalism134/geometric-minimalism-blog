
<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import ArticleCard from '../components/ArticleCard.vue';
import { seriesStore } from '../stores/series';
import { getArticles } from '../services/api';
import { Article } from '../types';

const route = useRoute();
const seriesId = route.params.id as string;
const allArticles = ref<Article[]>([]);

onMounted(async () => {
  if (seriesStore.series.length === 0) {
    await seriesStore.fetchSeries();
  }
  try {
    allArticles.value = await getArticles();
  } catch (e) {
    console.error("Failed to load articles:", e);
  }
});

const series = computed(() => seriesStore.getSeriesById(seriesId));
const articles = computed(() => {
  if (!series.value) return [];
  return allArticles.value.filter(a => series.value?.articleIds.includes(a.id));
});
</script>

<template>
  <div v-if="series" class="flex-1 flex flex-col w-full">
    <!-- Hero Section -->
    <div class="relative h-[60vh] w-full overflow-hidden flex items-end">
      <div 
        class="absolute inset-0 bg-cover bg-center"
        :style="{ backgroundImage: `url(${series.coverImage})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#121820] via-[#121820]/60 to-transparent" />
      
      <div class="relative max-w-7xl mx-auto w-full px-6 pb-20 flex flex-col gap-6">
        <div class="flex items-center gap-3 mb-4">
           <router-link to="/series" class="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
               <span class="material-symbols-outlined text-base">arrow_back</span>
              返回专题列表
           </router-link>
        </div>
        <span class="text-accent font-black tracking-[0.5em] uppercase text-xs">专题背景</span>
        <h1 class="text-5xl md:text-7xl font-black tracking-tighter leading-none italic text-white max-w-4xl">
          {{ series.title }}
        </h1>
        <p class="text-white/70 max-w-2xl text-lg font-light leading-relaxed border-l-2 border-accent pl-6">
          {{ series.description }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="max-w-7xl mx-auto w-full px-6 py-20">
      <div class="flex items-center gap-4 mb-12">
        <div class="h-px bg-white/10 flex-1"></div>
        <span class="text-xs font-bold uppercase tracking-[0.3em] text-white/40">收录文章</span>
        <div class="h-px bg-white/10 flex-1"></div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
        <ArticleCard 
          v-for="article in articles"
          :key="article.id" 
          :article="article"
          :featured="false" 
        />
      </div>
      
      <div v-if="articles.length === 0" class="text-center py-20 text-white/30">
        <p>该专题下暂无相关文章。</p>
      </div>
    </div>
  </div>
  
  <div v-else class="flex-1 flex items-center justify-center min-h-[50vh]">
    <div class="text-center">
      <h2 class="text-2xl font-bold text-white mb-4">未找到专题</h2>
      <router-link to="/series" class="text-accent hover:underline">返回专题列表</router-link>
    </div>
  </div>
</template>
