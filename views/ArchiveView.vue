
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ArticleCard from '../components/ArticleCard.vue';
import AIChatWindow from '../components/AIChatWindow.vue';
import { getArticles, deleteArticle } from '../services/api';
import { DEFAULT_AUTHOR } from '../constants';
import { Article } from '../types';

const router = useRouter();
const chatWindow = ref<InstanceType<typeof AIChatWindow> | null>(null);

const topics = [
  { label: '数学', color: '#4b91e2' },
  { label: 'AI人工智能', color: '#B76E79' },
  { label: '技术', color: '#60a5fa' },
  { label: '杂思随笔', color: '#f472b6' }
];

const articles = ref<Article[]>([]);
const currentFilter = ref<string | null>(null);

const loadArticles = async () => {
  try {
    articles.value = await getArticles();
  } catch (e) {
    console.error("Failed to load articles:", e);
  }
};

const removeArticle = async (id: string) => {
  if (!confirm('确定要删除这篇文章吗？')) return;
  try {
    await deleteArticle(id);
    await loadArticles();
  } catch (e) {
    alert('删除失败: ' + e);
  }
};

const editArticle = (article: Article) => {
  router.push({ path: '/editor', query: { edit: article.id } });
};

const openChat = () => {
  chatWindow.value?.toggleChat();
};

onMounted(loadArticles);

const filteredArticles = computed(() => {
  if (!currentFilter.value) return articles.value;
  return articles.value.filter(article => 
    article.tags.some(tag => tag.label === currentFilter.value)
  );
});

const toggleFilter = (label: string) => {
  if (currentFilter.value === label) {
    currentFilter.value = null;
  } else {
    currentFilter.value = label;
  }
};
</script>

<template>
  <div class="flex-1 flex max-w-7xl mx-auto w-full px-6 py-16 gap-16 relative">
    <AIChatWindow ref="chatWindow" />

    <!-- Sidebar -->
    <aside class="hidden lg:flex flex-col w-72 shrink-0 gap-12 sticky top-32 h-fit">
      <div class="flex flex-col gap-6">
        <h3 class="text-[10px] font-black text-accent tracking-[0.4em] uppercase">关于主编</h3>
        <div class="flex items-center gap-4">
          <div class="size-14 rounded-2xl overflow-hidden border-2 border-primary/20 p-1">
             <img :src="DEFAULT_AUTHOR.avatar" class="w-full h-full object-cover rounded-xl" />
          </div>
          <div>
            <p class="font-black text-lg tracking-tight">{{ DEFAULT_AUTHOR.name }}</p>
            <p class="text-white/40 text-[10px] uppercase font-bold tracking-widest">{{ DEFAULT_AUTHOR.role }}</p>
          </div>
        </div>
        <p class="text-white/50 text-sm leading-relaxed italic font-light">
          "{{ DEFAULT_AUTHOR.bio }}"
        </p>
      </div>

      <div class="flex flex-col gap-6">
        <h3 class="text-[10px] font-black text-accent tracking-[0.4em] uppercase">深度探索</h3>
        <div class="flex flex-col gap-2">
          <div 
            v-for="(topic, i) in topics"
            :key="i" 
            @click="toggleFilter(topic.label)"
            class="flex items-center justify-between px-4 py-3 rounded-xl border transition-all cursor-pointer group"
            :class="currentFilter === topic.label ? 'bg-primary/20 border-primary' : 'bg-white/[0.02] border-white/5 hover:border-primary/50 hover:bg-primary/5'"
          >
            <div class="flex items-center gap-3">
              <div class="size-2 rounded-full" :style="{ backgroundColor: topic.color }"></div>
              <span class="text-xs font-bold uppercase tracking-widest">{{ topic.label }}</span>
            </div>
            <span class="material-symbols-outlined text-sm transition-opacity" :class="currentFilter === topic.label ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'">chevron_right</span>
          </div>
        </div>
      </div>

      <div class="flex flex-col gap-6 mt-6">
         <button 
           @click="openChat"
           class="w-full bg-white text-black font-black py-4 rounded-xl text-xs uppercase tracking-[0.2em] hover:bg-accent hover:text-white transition-all transform active:scale-95 shadow-xl shadow-black/20 flex items-center justify-center gap-2"
         >
            <span class="material-symbols-outlined">smart_toy</span>
            AI 助手
         </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col gap-16">
      <header class="flex flex-col gap-4">
        <p class="text-primary font-black tracking-[0.5em] uppercase text-[10px]">
          {{ currentFilter ? `Archives / ${currentFilter}` : 'Archives / 2024' }}
        </p>
        <h2 class="text-6xl font-black tracking-tighter leading-none italic">
          {{ currentFilter ? `${currentFilter}专题` : '建筑与' }}<br/>
          {{ currentFilter ? '精选文章' : '数字游民' }}
        </h2>
      </header>

      <div class="columns-1 md:columns-2 gap-8 space-y-8">
        <ArticleCard 
          v-for="(article, index) in filteredArticles"
          :key="article.id" 
          :article="article" 
          :featured="index === 0" 
          @edit="editArticle(article)"
          @delete="removeArticle(article.id)"
        />
      </div>

      <div v-if="filteredArticles.length === 0" class="flex flex-col items-center justify-center py-20 opacity-50">
        <span class="material-symbols-outlined text-4xl mb-4">content_paste_off</span>
        <p class="text-sm uppercase tracking-widest">该分类下暂无文章</p>
      </div>

      <div v-if="filteredArticles.length > 0" class="flex justify-center py-20">
        <button class="group flex flex-col items-center gap-4">
          <div class="size-20 rounded-full bg-surface border border-white/10 flex items-center justify-center text-white transition-all duration-500 group-hover:scale-110 group-hover:border-primary group-hover:shadow-[0_0_30px_rgba(75,145,226,0.3)]">
            <span class="material-symbols-outlined text-4xl font-light">keyboard_double_arrow_down</span>
          </div>
          <span class="text-[10px] font-black tracking-[0.5em] uppercase text-white/40 group-hover:text-primary transition-colors">加载更多内容</span>
        </button>
      </div>
    </main>
  </div>
</template>
