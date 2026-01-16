<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import SeriesCard from '../components/SeriesCard.vue';
import { seriesStore } from '../stores/series';
import { Series } from '../types';

const showModal = ref(false);
const editingId = ref<string | null>(null);

const form = reactive({
  title: '',
  description: '',
  coverImage: 'https://images.unsplash.com/photo-1486718448742-1666229e2111?auto=format&fit=crop&q=80&w=1000'
});

const openCreateModal = () => {
  editingId.value = null;
  form.title = '';
  form.description = '';
  form.coverImage = 'https://images.unsplash.com/photo-1486718448742-1666229e2111?auto=format&fit=crop&q=80&w=1000';
  showModal.value = true;
};

const openEditModal = (series: Series) => {
  editingId.value = series.id;
  form.title = series.title;
  form.description = series.description;
  form.coverImage = series.coverImage;
  showModal.value = true;
};

const saveSeries = async () => {
  if (!form.title || !form.description) return;

  if (editingId.value) {
    await seriesStore.updateSeries(editingId.value, {
      title: form.title,
      description: form.description,
      coverImage: form.coverImage
    });
  } else {
    const series: Partial<Series> = {
      title: form.title,
      description: form.description,
      coverImage: form.coverImage,
    };
    await seriesStore.addSeries(series);
  }
  
  showModal.value = false;
};

const handleDelete = async (id: string) => {
  if (confirm('确定要删除这个专题吗？所有关联文章将保留，但专题会被移除。')) {
    await seriesStore.removeSeries(id);
  }
};

onMounted(() => {
  seriesStore.fetchSeries();
});
</script>

<template>
  <div class="flex-1 flex flex-col max-w-7xl mx-auto w-full px-6 py-16 gap-16 relative">
    <header class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <p class="text-accent font-black tracking-[0.5em] uppercase text-[10px]">Series / 2024</p>
        <button 
          @click="openCreateModal"
          class="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-accent rounded-lg transition-colors group"
        >
          <span class="material-symbols-outlined text-sm text-white/60 group-hover:text-white">add</span>
          <span class="text-xs font-bold uppercase tracking-widest text-white/60 group-hover:text-white">New Series</span>
        </button>
      </div>
      <h2 class="text-6xl font-black tracking-tighter leading-none italic">系列专题</h2>
      <p class="text-white/50 max-w-2xl font-light text-lg">
        深入探索特定主题的系列文章，从建筑理论到数字美学。
      </p>
    </header>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <SeriesCard 
        v-for="series in seriesStore.series"
        :key="series.id" 
        :series="series" 
        @edit="openEditModal"
        @delete="handleDelete"
      />
      
      <!-- Empty State / Add Placeholder -->
      <button 
        @click="openCreateModal"
        class="group relative h-[420px] rounded-2xl border-2 border-dashed border-white/5 hover:border-accent/40 flex flex-col items-center justify-center gap-4 transition-all hover:bg-white/[0.02]"
      >
         <div class="size-16 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-accent group-hover:scale-110 transition-all duration-300">
           <span class="material-symbols-outlined text-3xl text-white/40 group-hover:text-white">add</span>
         </div>
         <span class="text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">创建一个新专题</span>
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" @click="showModal = false"></div>
      <div class="glass-card w-full max-w-lg p-8 rounded-2xl relative z-10 border border-white/10 animate-fade-in-up">
        <h3 class="text-2xl font-black italic mb-6">{{ editingId ? '编辑专题' : '创建新专题' }}</h3>
        
        <form @submit.prevent="saveSeries" class="flex flex-col gap-6">
          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-white/40">专题名称</label>
            <input 
              v-model="form.title"
              type="text" 
              class="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="输入专题标题..."
              required
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-white/40">封面图片 URL</label>
            <input 
              v-model="form.coverImage"
              type="url" 
              class="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors"
              placeholder="https://..."
              required
            />
          </div>

          <div class="flex flex-col gap-2">
            <label class="text-xs font-bold uppercase tracking-widest text-white/40">简介描述</label>
            <textarea 
              v-model="form.description"
              rows="4"
              class="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-accent transition-colors resize-none"
              placeholder="简短描述该专题的主题..."
              required
            ></textarea>
          </div>

          <div class="flex justify-end gap-3 mt-4">
            <button 
              type="button" 
              @click="showModal = false"
              class="px-6 py-2 rounded-lg text-xs font-bold uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/5 transition-colors"
            >
              取消
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-accent rounded-lg text-white text-xs font-bold uppercase tracking-widest hover:bg-accent/80 transition-colors shadow-lg shadow-accent/20"
            >
              {{ editingId ? '保存修改' : '创建专题' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.3s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
