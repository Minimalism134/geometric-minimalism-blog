
<script setup lang="ts">
import Navigation from './components/Navigation.vue';
</script>

<template>
  <div class="min-h-screen relative flex flex-col">
    <!-- Geometric Background shapes -->
    <div class="geometric-bg">
      <div class="shape bg-primary w-[500px] h-[500px] rounded-full top-[-100px] left-[-100px]" />
      <div 
        class="shape bg-accent w-[600px] h-[400px] bottom-[-100px] right-[-100px]" 
        style="clip-path: polygon(50% 0%, 0% 100%, 100% 100%)" 
      />
      <div 
        class="shape bg-primary/40 w-[300px] h-[300px] top-[40%] right-[10%]" 
        style="clip-path: polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)" 
      />
    </div>

    <Navigation />

    <main class="flex-1">
      <router-view v-slot="{ Component }">
        <transition name="page-fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="mt-auto border-t border-white/5 py-12 px-6 glass-card">
      <div class="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col gap-2">
          <div class="flex items-center gap-2">
            <div class="size-4 bg-accent rounded-sm"></div>
            <h2 class="text-white text-lg font-bold leading-tight tracking-[-0.015em]">几何日志</h2>
          </div>
          <p class="text-white/30 text-xs tracking-wider uppercase">© 2024 保留所有权利</p>
        </div>
        <div class="flex gap-10 text-xs font-bold tracking-widest uppercase text-white/50">
          <a class="hover:text-accent transition-colors" href="#">隐私政策</a>
          <a class="hover:text-accent transition-colors" href="#">服务条款</a>
          <a class="hover:text-accent transition-colors" href="#">联系我们</a>
        </div>
        <div class="flex gap-4">
          <div class="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-primary transition-colors cursor-pointer group">
            <span class="material-symbols-outlined text-lg group-hover:text-white">alternate_email</span>
          </div>
          <div class="size-10 rounded-lg bg-white/5 flex items-center justify-center hover:bg-accent transition-colors cursor-pointer group">
            <span class="material-symbols-outlined text-lg group-hover:text-white">language</span>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>
