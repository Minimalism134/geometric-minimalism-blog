
<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';

const props = defineProps<{
  durationMinutes?: number
}>();

const duration = (props.durationMinutes || 25) * 60;
const timeLeft = ref(duration);
const isActive = ref(false);
const timer = ref<number | null>(null);

const progress = computed(() => {
  return ((duration - timeLeft.value) / duration) * 100;
});

const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60);
  const seconds = timeLeft.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const toggleTimer = () => {
  if (isActive.value) {
    pauseTimer();
  } else {
    startTimer();
  }
};

const startTimer = () => {
  isActive.value = true;
  timer.value = window.setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      pauseTimer();
      // Optional: Play sound
    }
  }, 1000);
};

const pauseTimer = () => {
  isActive.value = false;
  if (timer.value) {
    clearInterval(timer.value);
    timer.value = null;
  }
};

const resetTimer = () => {
  pauseTimer();
  timeLeft.value = duration;
};

onUnmounted(() => {
  if (timer.value) clearInterval(timer.value);
});
</script>

<template>
  <div class="glass-card p-12 rounded-3xl flex flex-col items-center justify-center gap-8 relative overflow-hidden group">
    <!-- Geometric decorative elements -->
    <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-700"></div>
    <div class="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-2xl group-hover:bg-accent/20 transition-all duration-700"></div>

    <div class="relative size-64 flex items-center justify-center">
      <!-- Background Circle -->
      <svg class="w-full h-full transform -rotate-90">
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="currentColor"
          stroke-width="4"
          fill="transparent"
          class="text-white/5"
        />
        <!-- Progress Circle -->
        <circle
          cx="128"
          cy="128"
          r="120"
          stroke="currentColor"
          stroke-width="4"
          fill="transparent"
          class="text-accent transition-all duration-1000 ease-linear"
          :stroke-dasharray="2 * Math.PI * 120"
          :stroke-dashoffset="2 * Math.PI * 120 * (1 - progress / 100)"
          stroke-linecap="round"
        />
      </svg>
      
      <!-- Time Display -->
      <div class="absolute inset-0 flex flex-col items-center justify-center cursor-pointer" @click="toggleTimer">
        <span class="text-6xl font-black tabular-nums tracking-tighter text-white select-none">
          {{ formattedTime }}
        </span>
        <span class="text-xs uppercase font-bold tracking-[0.3em] text-white/40 mt-4 animate-pulse" v-if="isActive">
          专注中
        </span>
        <span class="text-xs uppercase font-bold tracking-[0.3em] text-white/40 mt-4 group-hover:text-primary transition-colors" v-else>
          点击开始
        </span>
      </div>
    </div>

    <!-- Controls -->
    <div class="flex items-center gap-6">
      <button 
        @click="toggleTimer"
        class="size-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-primary/50 transition-all text-white"
      >
        <span class="material-symbols-outlined">{{ isActive ? 'pause' : 'play_arrow' }}</span>
      </button>
      
      <button 
        @click="resetTimer"
        class="size-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-accent/50 transition-all text-white/50 hover:text-white"
      >
        <span class="material-symbols-outlined">restart_alt</span>
      </button>
    </div>
  </div>
</template>
