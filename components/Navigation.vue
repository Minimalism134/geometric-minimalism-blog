
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { SITE_NAME } from '../constants';

const route = useRoute();
const router = useRouter();

const AVATARS = [
  ...Array.from({ length: 50 }, (_, i) => `https://randomuser.me/api/portraits/men/${i}.jpg`),
  ...Array.from({ length: 50 }, (_, i) => `https://randomuser.me/api/portraits/women/${i}.jpg`)
];

const savedIndex = localStorage.getItem('user_avatar_index');
const currentAvatarIndex = ref(savedIndex ? parseInt(savedIndex) : 0);
const isLoggedIn = ref(false);

const checkAuth = () => {
  isLoggedIn.value = !!localStorage.getItem('auth_token');
};

// Check on mount
onMounted(() => {
  checkAuth();
  window.addEventListener('auth-change', checkAuth);
});

// Ensure index is valid on load
if (isNaN(currentAvatarIndex.value) || currentAvatarIndex.value < 0 || currentAvatarIndex.value >= AVATARS.length) {
  currentAvatarIndex.value = 0;
}

const toggleAvatar = () => {
  if (AVATARS.length === 0) return;
  currentAvatarIndex.value = (currentAvatarIndex.value + 1) % AVATARS.length;
  localStorage.setItem('user_avatar_index', currentAvatarIndex.value.toString());
};

const logout = () => {
  if (confirm('确定要退出登录吗？')) {
    localStorage.removeItem('auth_token');
    isLoggedIn.value = false;
    router.push('/');
  }
};

const handleAvatarClick = (e: MouseEvent) => {
  // Simple toggle on click
  toggleAvatar();
};

const handleAvatarDblClick = () => {
  logout();
};

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

// Close menu on route change
router.afterEach(() => {
  isMenuOpen.value = false;
});
</script>

<template>
  <header class="sticky top-0 z-[100] px-6 py-4 flex items-center justify-between border-b border-white/5 glass-card">
    <div class="flex items-center gap-6">
      <!-- Mobile Menu Button -->
      <button @click="toggleMenu" class="md:hidden text-white/70 hover:text-white transition-colors z-[110] relative">
         <span class="material-symbols-outlined text-3xl">{{ isMenuOpen ? 'close' : 'menu' }}</span>
      </button>

      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 z-[110] relative group">
         <span class="material-symbols-outlined text-accent text-3xl group-hover:rotate-180 transition-transform duration-500">change_history</span>
         <span class="font-black tracking-[0.25em] text-lg text-white group-hover:text-accent transition-colors hidden sm:block">GEOMETRIC</span>
      </router-link>
    </div>
    
    <!-- Mobile Menu Overlay -->
    <transition name="fade">
      <div v-if="isMenuOpen" class="fixed inset-0 bg-[#121820]/95 backdrop-blur-xl z-[100] flex flex-col items-center justify-center gap-12 text-center md:hidden">
         <nav class="flex flex-col gap-8 text-xl font-black tracking-[0.2em] uppercase">
            <router-link to="/" class="text-white hover:text-accent transition-colors">文章归档</router-link>
            <router-link to="/series" class="text-white hover:text-accent transition-colors">系列专题</router-link>
            <router-link to="/digital-minimalism" class="text-white hover:text-accent transition-colors">数字游民</router-link>
         </nav>
      </div>
    </transition>

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

    <div class="flex items-center gap-4 z-[101]">
      <template v-if="isLoggedIn">
        <router-link 
          to="/editor"
          class="hidden md:block mr-2 text-sm font-medium tracking-widest uppercase transition-all duration-300"
          :class="route.path === '/editor' ? 'text-accent' : 'text-white/60 hover:text-primary'"
        >
          写文章
        </router-link>

        <div 
          @click="handleAvatarClick"
          @dblclick="handleAvatarDblClick"
          class="size-10 rounded-full bg-cover bg-center border-2 border-accent/30 shadow-lg cursor-pointer hover:border-accent transition-colors active:scale-95 relative group"
          :style="{ backgroundImage: `url('${AVATARS[currentAvatarIndex]}')` }"
          title="点击更换头像 / 双击退出 (Double click to logout)"
        >
           <!-- Optional Logout Hint on Hover -->
           <div class="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
              点击换头像 | 双击退出
           </div>
        </div>
      </template>

      <template v-else>
        <router-link 
          to="/login"
          class="px-5 py-2 rounded-lg border border-white/20 text-sm font-bold uppercase tracking-widest text-white/80 hover:bg-white hover:text-black transition-all"
        >
          登录系统
        </router-link>
      </template>
    </div>
  </header>
</template>
