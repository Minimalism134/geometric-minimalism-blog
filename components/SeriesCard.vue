
<script setup lang="ts">
import { Series } from '../types';

defineProps<{
  series: Series;
}>();

defineEmits<{
  (e: 'delete', id: string): void;
  (e: 'edit', series: Series): void;
}>();
</script>

<template>
  <div class="relative group">
    <router-link 
    :to="`/series/${series.id}`"
    class="block glass-card rounded-2xl overflow-hidden transition-all duration-500 hover:translate-y-[-8px] hover:shadow-2xl hover:shadow-accent/10"
  >
    <div class="h-64 bg-cover bg-center overflow-hidden relative">
      <div 
        class="w-full h-full bg-cover bg-center transition-transform duration-[1.5s] ease-out group-hover:scale-105"
        :style="{ backgroundImage: `url(${series.coverImage})` }"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-[#121820] to-transparent opacity-80" />
      
      <div class="absolute bottom-6 left-6 right-6 flex flex-col gap-2">
        <h3 class="text-2xl font-black tracking-tight leading-none text-white group-hover:text-accent transition-colors">
          {{ series.title }}
        </h3>
        <span class="text-[10px] text-white/60 uppercase font-bold tracking-[0.2em]">
          {{ series.articleIds.length }} 篇文章 / {{ series.date }}
        </span>
      </div>
    </div>
    
    <div class="p-6">
      <p class="text-white/50 text-sm leading-relaxed line-clamp-2 font-light">
        {{ series.description }}
      </p>
      
      <div class="mt-6 flex items-center gap-2 group/btn">
        <span class="text-xs font-bold uppercase tracking-widest text-accent group-hover/btn:mr-2 transition-all">
          浏览专题
        </span>
        <span class="material-symbols-outlined text-lg text-accent">
          arrow_forward
        </span>
      </div>
    </div>
  </router-link>
  <div class="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
    <button 
      @click.prevent="$emit('edit', series)"
      class="size-8 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:bg-accent flex items-center justify-center text-white/70 hover:text-white transition-all"
      title="编辑专题"
    >
      <span class="material-symbols-outlined text-sm">edit</span>
    </button>
    <button 
      @click.prevent="$emit('delete', series.id)"
      class="size-8 rounded-full bg-black/50 backdrop-blur border border-white/10 hover:bg-red-500 flex items-center justify-center text-white/70 hover:text-white transition-all"
      title="删除专题"
    >
      <span class="material-symbols-outlined text-sm">delete</span>
    </button>
  </div>
  </div>
</template>
