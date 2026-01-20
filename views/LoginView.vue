
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const password = ref('');
const error = ref('');
const loading = ref(false);

const handleLogin = async () => {
  if (!password.value) return;
  
  loading.value = true;
  error.value = '';

  try {
    const response = await fetch('http://127.0.0.1:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: password.value }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('auth_token', data.token);
      // Construct a custom event to notify Navigation component
      window.dispatchEvent(new Event('auth-change'));
      router.push('/editor');
    } else {
      error.value = '密码错误，请重试。';
    }
  } catch (e) {
    error.value = '登录服务暂时不可用。';
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-[80vh] flex items-center justify-center px-6">
    <div class="glass-card w-full max-w-md p-10 rounded-3xl border border-white/10 flex flex-col gap-8 relative overflow-hidden">
      <!-- Decor -->
      <div class="absolute -top-10 -right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>

      <div class="text-center space-y-2 relative z-10">
        <h1 class="text-3xl font-black italic tracking-tighter">管理员登录</h1>
        <p class="text-white/40 text-xs font-bold uppercase tracking-widest">验证身份以访问编辑器</p>
      </div>

      <form @submit.prevent="handleLogin" class="flex flex-col gap-6 relative z-10">
        <div class="flex flex-col gap-2">
          <label class="text-[10px] uppercase font-black tracking-wider text-white/50 pl-1">访问密码</label>
          <input 
            v-model="password"
            type="password" 
            class="bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-white/20 focus:outline-none focus:border-accent transition-colors text-center font-bold tracking-widest"
            placeholder="••••••••"
            required
            autofocus
          />
        </div>

        <div v-if="error" class="text-red-400 text-xs font-bold text-center tracking-wide bg-red-500/10 py-2 rounded-lg border border-red-500/20">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="bg-white text-black font-black py-4 rounded-xl uppercase tracking-widest hover:bg-accent hover:text-white transition-all transform active:scale-95 shadow-xl shadow-black/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          :disabled="loading"
        >
          <span v-if="loading" class="size-4 border-2 border-black/20 border-t-black rounded-full animate-spin"></span>
          {{ loading ? '验证中...' : '进入系统' }}
        </button>
      </form>
      
      <p class="text-center text-white/20 text-[10px] uppercase tracking-[0.2em] relative z-10">
        Geometric Minimalism
      </p>
    </div>
  </div>
</template>
