<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getArticles, createArticle, updateArticle, deleteArticle } from '../services/api';
import { Article } from '../types';

const route = useRoute();
const router = useRouter();
const articles = ref<Article[]>([]);
const isEditing = ref(false);
const editingId = ref<string | null>(null);

const AVAILABLE_CATEGORIES = [
  { label: '数学', color: '#4b91e2' },
  { label: 'AI人工智能', color: '#B76E79' },
  { label: '技术', color: '#60a5fa' },
  { label: '杂思随笔', color: '#f472b6' }
];

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  coverImage: '',
  category: '',
  date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
});

const loadArticles = async () => {
  try {
    articles.value = await getArticles();
    
    // Check for edit query param
    const editId = route.query.edit as string;
    if (editId) {
      const articleToEdit = articles.value.find(a => a.id === editId);
      if (articleToEdit) {
        editArticle(articleToEdit);
      }
    }
  } catch (e) {
    console.error(e);
  }
};

const resetForm = () => {
  form.value = {
    title: '',
    excerpt: '',
    content: '',
    coverImage: '',
    category: '',
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
  };
  editingId.value = null;
  isEditing.value = false;
  // Clear query param
  router.replace({ path: '/editor' });
};

const editArticle = (article: Article) => {
  form.value = {
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverImage: article.coverImage,
    category: article.tags[0]?.label || '',
    date: article.date
  };
  editingId.value = article.id;
  isEditing.value = true;
};

const feedbackMessage = ref<{ text: string, type: 'success' | 'error' } | null>(null);

const showFeedback = (text: string, type: 'success' | 'error' = 'success') => {
  feedbackMessage.value = { text, type };
  setTimeout(() => {
    feedbackMessage.value = null;
  }, 3000);
};

const saveArticle = async () => {
  const selectedCategory = AVAILABLE_CATEGORIES.find(c => c.label === form.value.category);
  const color = selectedCategory ? selectedCategory.color : '#4b91e2';

  const articleData = {
    ...form.value,
    tags: [{ label: form.value.category, color: color }],
    readingTime: Math.ceil(form.value.content.length / 500) + ' 分钟' // Rough estimate
  };

  try {
    let savedId = '';
    if (editingId.value) {
      await updateArticle(editingId.value, articleData);
      savedId = editingId.value;
      showFeedback('文章更新成功！');
    } else {
      const newArticle = await createArticle(articleData);
      savedId = newArticle.id;
      showFeedback('文章发布成功！');
    }
    
    setTimeout(() => {
      router.push(`/article/${savedId}`);
    }, 800);
  } catch (e) {
    showFeedback('操作失败: ' + e, 'error');
  }
};

const removeArticle = async (id: string) => {
  if (!confirm('确定要删除这篇文章吗？')) return;
  try {
    await deleteArticle(id);
    await loadArticles();
    showFeedback('文章删除成功！');
  } catch (e) {
    showFeedback('删除失败: ' + e, 'error');
  }
};

onMounted(loadArticles);
</script>

<template>
  <div class="flex-1 max-w-7xl mx-auto w-full px-6 py-16 flex flex-col md:flex-row gap-12 relative">
    <!-- Feedback Notification -->
    <transition name="fade">
      <div 
        v-if="feedbackMessage" 
        class="fixed top-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-3 border backdrop-blur-md"
        :class="feedbackMessage.type === 'success' ? 'bg-green-500/20 border-green-500/50 text-green-200' : 'bg-red-500/20 border-red-500/50 text-red-200'"
      >
        <span class="material-symbols-outlined">{{ feedbackMessage.type === 'success' ? 'check_circle' : 'error' }}</span>
        <span class="text-sm font-bold tracking-wide">{{ feedbackMessage.text }}</span>
      </div>
    </transition>

    <!-- List Column -->
    <div class="w-full md:w-1/3 flex flex-col gap-6">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black uppercase tracking-widest text-white">文章管理</h2>
        <button @click="resetForm" class="p-2 bg-primary rounded-lg text-white hover:bg-white hover:text-primary transition-colors">
          <span class="material-symbols-outlined">add</span>
        </button>
      </div>

      <div class="flex flex-col gap-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        <div 
          v-for="article in articles" 
          :key="article.id"
          class="glass-card p-4 rounded-xl cursor-pointer hover:bg-white/5 transition-colors border border-white/5 flex justify-between items-start group"
          :class="{ 'border-accent bg-accent/10': editingId === article.id }"
          @click="editArticle(article)"
        >
          <div>
            <h3 class="font-bold text-white mb-1 line-clamp-1">{{ article.title }}</h3>
            <p class="text-xs text-white/50 line-clamp-2">{{ article.excerpt }}</p>
          </div>
          <button @click.stop="removeArticle(article.id)" class="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all">
            <span class="material-symbols-outlined text-sm">delete</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Editor Column -->
    <div class="w-full md:w-2/3 flex flex-col gap-6">
      <h2 class="text-2xl font-black uppercase tracking-widest text-white">
        {{ isEditing ? '编辑文章' : '撰写新文章' }}
      </h2>

      <div class="glass-card p-8 rounded-2xl flex flex-col gap-6 border border-white/5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-[10px] uppercase font-black tracking-wider text-white/50">标题</label>
            <input v-model="form.title" class="bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors" placeholder="输入文章标题..." />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-[10px] uppercase font-black tracking-wider text-white/50">分类</label>
            <div class="relative">
              <select v-model="form.category" class="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors appearance-none cursor-pointer">
                <option value="" disabled>选择分类...</option>
                <option v-for="cat in AVAILABLE_CATEGORIES" :key="cat.label" :value="cat.label">{{ cat.label }}</option>
              </select>
              <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[10px] uppercase font-black tracking-wider text-white/50">封面图片 URL</label>
          <input v-model="form.coverImage" class="bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors" placeholder="https://..." />
        </div>

        <div class="flex flex-col gap-2">
          <label class="text-[10px] uppercase font-black tracking-wider text-white/50">摘要</label>
          <textarea v-model="form.excerpt" rows="2" class="bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors resize-none" placeholder="简短的介绍..."></textarea>
        </div>

        <div class="flex flex-col gap-2 flex-1">
          <label class="text-[10px] uppercase font-black tracking-wider text-white/50">内容 (Markdown)</label>
          <textarea v-model="form.content" rows="12" class="bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-accent outline-none transition-colors font-mono text-sm leading-relaxed" placeholder="# Write your masterpiece here..."></textarea>
        </div>

        <div class="flex justify-end gap-4 pt-4 border-t border-white/5">
          <button @click="resetForm" class="px-6 py-3 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors">取消</button>
          <button @click="saveArticle" class="px-8 py-3 bg-accent text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-accent transition-all shadow-lg shadow-accent/20">
            {{ isEditing ? '更新文章' : '发布文章' }}
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
