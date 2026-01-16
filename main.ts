
import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import App from './App.vue';
import ArchiveView from './views/ArchiveView.vue';
import ArticleView from './views/ArticleView.vue';
import SeriesListView from './views/SeriesListView.vue';
import SeriesDetailView from './views/SeriesDetailView.vue';
import DigitalMinimalismView from './views/DigitalMinimalismView.vue';
import EditorView from './views/EditorView.vue';

const routes = [
  { path: '/', component: ArchiveView },
  { path: '/article/:id', component: ArticleView },
  { path: '/series', component: SeriesListView },
  { path: '/series/:id', component: SeriesDetailView },
  { path: '/digital-minimalism', component: DigitalMinimalismView },
  { path: '/editor', component: EditorView },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

const app = createApp(App);
app.use(router);
app.mount('#root');
