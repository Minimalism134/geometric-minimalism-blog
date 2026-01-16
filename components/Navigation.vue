
<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { SITE_NAME } from '../constants';

const route = useRoute();

const AVATARS = [
  'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&q=80&w=200'
];

const savedIndex = localStorage.getItem('user_avatar_index');
const currentAvatarIndex = ref(savedIndex ? parseInt(savedIndex) : 0);

const toggleAvatar = () => {
  currentAvatarIndex.value = (currentAvatarIndex.value + 1) % AVATARS.length;
  localStorage.setItem('user_avatar_index', currentAvatarIndex.value.toString());
};
</script>

<template>
  <header class="sticky top-0 z-50 px-6 py-4 flex items-center justify-between border-b border-white/5 glass-card">
    <div class="flex items-center gap-6">
      <button class="text-white hover:text-accent transition-colors">
        <span class="material-symbols-outlined text-3xl">menu</span>
      </button>
      <router-link to="/" class="flex items-center gap-2">
        <div class="size-8 bg-accent flex items-center justify-center rounded-lg shadow-lg shadow-accent/20">
          <span class="material-symbols-outlined text-white text-lg">category</span>
        </div>
        <h1 class="text-xl font-black tracking-tighter uppercase italic">{{ SITE_NAME }}</h1>
      </router-link>
    </div>
    
    <nav class="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
      <router-link 
        to="/" 
        class="pb-1 transition-all duration-300"
        :class="route.path === '/' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-primary'"
      >
        文章归档
      </router-link>
      <router-link 
        to="/series"
        class="pb-1 transition-all duration-300"
        :class="route.path.includes('/series') ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-primary'"
      >
        系列专题
      </router-link>
      <router-link 
        to="/digital-minimalism"
        class="pb-1 transition-all duration-300"
        :class="route.path === '/digital-minimalism' ? 'text-accent border-b-2 border-accent' : 'text-white/60 hover:text-primary'"
      >
        数字游民
      </router-link>

    </nav>

    <div class="flex items-center gap-4">
      <router-link 
        to="/editor"
        class="hidden md:block mr-2 text-sm font-medium tracking-widest uppercase transition-all duration-300"
        :class="route.path === '/editor' ? 'text-accent' : 'text-white/60 hover:text-primary'"
      >
        写文章
      </router-link>
      <button class="p-2 hover:bg-white/10 rounded-full transition-colors">
        <span class="material-symbols-outlined">search</span>
      </button>
      <div 
        @click="toggleAvatar"
        class="size-10 rounded-full bg-cover bg-center border-2 border-accent/30 shadow-lg cursor-pointer hover:border-accent transition-colors active:scale-95"
        :style="{ backgroundImage: `url('${AVATARS[currentAvatarIndex]}')` }"
      />
    </div>
  </header>
</template>
