
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Article } from '../types';

defineProps<{
  article: Article;
  featured?: boolean;
}>();

defineEmits<{
  (e: 'edit'): void;
  (e: 'delete'): void;
}>();

const isLoggedIn = ref(false);
const checkAuth = () => {
    isLoggedIn.value = !!localStorage.getItem('auth_token');
};

onMounted(() => {
    checkAuth();
    // Listen for global auth changes if needed, or just check on mount since card re-renders
    window.addEventListener('auth-change', checkAuth);
});
</script>

<template>
  <div class="break-inside-avoid block glass-card rounded-xl overflow-hidden group mb-6 transition-all duration-500 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-primary/5 active:scale-[0.99] active:translate-y-0 relative">
    <router-link :to="`/article/${article.id}`" class="block h-full cursor-pointer">
      <div v-if="article.coverImage" :class="featured ? 'h-72' : 'h-48'" class="bg-cover bg-center overflow-hidden relative">
        <div 
          class="w-full h-full bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
          :style="{ backgroundImage: `url(${article.coverImage})` }"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-[#121820]/80 to-transparent opacity-60" />
      </div>
      <div class="p-8 flex flex-col gap-5">
        <div class="flex gap-4">
          <div v-for="(tag, idx) in article.tags" :key="idx" class="dot-tag flex items-center cursor-pointer">
            <div class="size-2 rounded-full shadow-[0_0_8px_rgba(255,255,255,0.3)]" :style="{ backgroundColor: tag.color }"></div>
            <span class="tag-text text-[10px] font-bold uppercase tracking-[0.2em]" :style="{ color: tag.color }">
              {{ tag.label }}
            </span>
          </div>
        </div>
        <h3 
          class="font-black tracking-tight leading-tight transition-colors duration-300"
          :class="featured ? 'text-3xl group-hover:text-primary' : 'text-xl group-hover:text-accent'"
        >
          {{ article.title }}
        </h3>
        <p class="text-white/50 text-sm leading-relaxed line-clamp-2 font-light">
          {{ article.excerpt }}
        </p>
        <div class="pt-6 border-t border-white/5 flex items-center justify-between">
          <span class="text-[10px] text-white/30 uppercase font-bold tracking-[0.2em]">{{ article.date }}</span>
          <div class="flex items-center gap-1 group-hover:gap-2 transition-all">
            <span class="text-[10px] uppercase font-bold tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">阅读全文</span>

          </div>
        </div>
      </div>
    </router-link>

    <!-- Admin Controls -->
    <div v-if="isLoggedIn" class="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
      <button 
        @click.stop="$emit('edit')" 
        class="size-8 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white/70 hover:bg-primary hover:text-white transition-colors"
        title="编辑"
      >
        <span class="material-symbols-outlined text-sm">edit</span>
      </button>
      <button 
        @click.stop="$emit('delete')" 
        class="size-8 rounded-full bg-black/50 backdrop-blur border border-white/10 flex items-center justify-center text-white/70 hover:bg-red-500 hover:text-white transition-colors"
        title="删除"
      >
        <span class="material-symbols-outlined text-sm">delete</span>
      </button>
    </div>
  </div>
</template>
