
<script setup lang="ts">
import { ref } from 'vue';
import FocusTimer from '../components/FocusTimer.vue';

const checklistItems = ref([
  { id: 1, text: "关闭非必要通知", checked: false },
  { id: 2, text: "清理桌面图标", checked: false },
  { id: 3, text: "取消关注 5 个账号", checked: false },
  { id: 4, text: "整理收件箱", checked: false },
  { id: 5, text: "设定今日无手机时间", checked: false },
]);

// Load from local storage if available could be added here
const toggleItem = (id: number) => {
  const item = checklistItems.value.find(i => i.id === id);
  if (item) item.checked = !item.checked;
};

const principles = [
  {
    title: "意向性 (Intentionality)",
    desc: "数字极简主义不仅仅是不使用技术，而是有目的地使用它。每一个数字工具都应该有一个明确的服务于你生活价值的目标。",
    icon: "adjust"
  },
  {
    title: "独处 (Solitude)",
    desc: "在没有输入的情况下独处的能力。在这个时刻，我们处理思想，定义自我。数字噪音常常剥夺了我们这种至关重要的精神空间。",
    icon: "self_improvement"
  },
  {
    title: "质量 (Quality)",
    desc: "用更少但更好的数字活动取代大量低价值的点击。深度阅读一篇文章胜过浏览一百条推文。",
    icon: "diamond"
  }
];
</script>

<template>
  <div class="flex-1 flex flex-col w-full">
    <!-- Hero Section -->
    <div class="relative min-h-[50vh] flex flex-col items-center justify-center px-6 py-20 overflow-hidden">
      <!-- Background Shapes -->
      <div class="absolute top-[20%] left-[10%] w-64 h-64 border border-white/5 rounded-full animate-spin-slow" />
      <div class="absolute bottom-[20%] right-[10%] w-96 h-96 border border-white/5 rounded-full animate-reverse-spin-slow" />
      
      <p class="text-accent font-black tracking-[0.5em] uppercase text-[10px] mb-6">数字游民</p>
      <h1 class="text-6xl md:text-8xl font-black tracking-tighter leading-none italic text-center mb-8 bg-gradient-to-b from-white to-white/20 bg-clip-text text-transparent">
        重获<br/>专注力
      </h1>
      <p class="text-white/50 max-w-xl text-center text-lg font-light leading-relaxed">
        在这个充斥着干扰的世界里，注意力是稀缺资源。数字极简主义是一场关于夺回生活控制权的静默革命。
      </p>
    </div>

    <div class="max-w-7xl mx-auto w-full px-6 py-12 flex flex-col gap-24">
      
      <!-- Focus Tool Section -->
      <section class="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div class="flex flex-col gap-8">
          <h2 class="text-4xl font-black italic tracking-tight">专注计时器</h2>
          <p class="text-white/60 leading-relaxed font-light">
            番茄工作法（Pomodoro）的几何演绎。设定 25 分钟，在此期间，只做一件事。当圆环闭合，放下工作，呼吸。
          </p>
          <ul class="flex flex-col gap-4 mt-4">
             <li class="flex items-center gap-4 text-white/50 text-sm">
               <span class="material-symbols-outlined text-accent">check_circle</span>
               <span>单任务处理</span>
             </li>
             <li class="flex items-center gap-4 text-white/50 text-sm">
               <span class="material-symbols-outlined text-accent">check_circle</span>
               <span>消除干扰</span>
             </li>
             <li class="flex items-center gap-4 text-white/50 text-sm">
               <span class="material-symbols-outlined text-accent">check_circle</span>
               <span>深度工作</span>
             </li>
          </ul>
        </div>
        <div class="flex justify-center">
          <FocusTimer :duration-minutes="25" />
        </div>
      </section>

      <!-- Principles Section -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div 
          v-for="(principle, idx) in principles" 
          :key="idx"
          class="glass-card p-8 rounded-2xl flex flex-col gap-6 hover:bg-white/5 transition-colors group"
        >
          <div class="size-12 rounded-lg bg-white/5 flex items-center justify-center text-white group-hover:bg-primary group-hover:scale-110 transition-all duration-300">
            <span class="material-symbols-outlined text-2xl">{{ principle.icon }}</span>
          </div>
          <h3 class="text-xl font-bold tracking-wide uppercase">{{ principle.title }}</h3>
          <p class="text-white/40 text-sm leading-relaxed">{{ principle.desc }}</p>
        </div>
      </section>

      <!-- Checklist Section -->
      <section class="max-w-2xl mx-auto w-full glass-card rounded-3xl p-8 md:p-12 border border-white/5">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl font-black italic tracking-tight">每日数字清理</h2>
          <span class="text-xs font-bold uppercase tracking-widest text-white/30">日常检查</span>
        </div>
        
        <div class="flex flex-col gap-4">
          <div 
            v-for="item in checklistItems" 
            :key="item.id"
            @click="toggleItem(item.id)"
            class="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300"
            :class="item.checked ? 'bg-primary/10' : 'hover:bg-white/5'"
          >
            <div 
              class="size-6 rounded-full border-2 flex items-center justify-center transition-colors duration-300"
              :class="item.checked ? 'border-primary bg-primary' : 'border-white/20'"
            >
              <span v-if="item.checked" class="material-symbols-outlined text-sm text-white">check</span>
            </div>
            <span 
              class="text-sm font-medium transition-all duration-300"
              :class="item.checked ? 'text-white line-through opacity-50' : 'text-white/80'"
            >
              {{ item.text }}
            </span>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<style scoped>
.animate-spin-slow {
  animation: spin 20s linear infinite;
}
.animate-reverse-spin-slow {
  animation: spin 25s linear infinite reverse;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
