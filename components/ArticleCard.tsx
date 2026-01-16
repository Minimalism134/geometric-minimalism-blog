
import { defineComponent, PropType } from 'vue';
import { RouterLink } from 'vue-router';
import { Article } from '../types.ts';

export default defineComponent({
  name: 'ArticleCard',
  props: {
    article: {
      type: Object as PropType<Article>,
      required: true
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    return () => (
      <RouterLink 
        to={`/article/${props.article.id}`}
        class="break-inside-avoid block glass-card rounded-xl overflow-hidden group mb-6 transition-all hover:translate-y-[-4px]"
      >
        {props.article.coverImage && (
          <div class={[props.featured ? 'h-64' : 'h-48', 'bg-cover bg-center overflow-hidden transition-all duration-700']}>
            <div 
              class="w-full h-full bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
              style={{ backgroundImage: `url(${props.article.coverImage})` }}
            >
              <div class="w-full h-full bg-black/20 group-hover:bg-black/0 transition-all" />
            </div>
          </div>
        )}
        <div class="p-6 flex flex-col gap-4">
          <div class="flex gap-3">
            {props.article.tags.map((tag, idx) => (
              <div key={idx} class="dot-tag flex items-center cursor-pointer">
                <div class="size-2.5 rounded-full" style={{ backgroundColor: tag.color }}></div>
                <span class="tag-text text-[10px] font-bold uppercase tracking-widest" style={{ color: tag.color }}>
                  {tag.label}
                </span>
              </div>
            ))}
          </div>
          <h3 class={[
            'font-bold transition-colors leading-tight',
            props.featured ? 'text-2xl group-hover:text-primary' : 'text-xl group-hover:text-accent'
          ]}>
            {props.article.title}
          </h3>
          <p class="text-white/60 text-sm leading-relaxed line-clamp-2">
            {props.article.excerpt}
          </p>
          <div class="pt-4 border-t border-white/5 flex items-center justify-between">
            <span class="text-[10px] text-white/30 uppercase font-bold tracking-widest">{props.article.date}</span>
            <span class={[
              'material-symbols-outlined group-hover:translate-x-1 transition-transform',
              props.featured ? 'text-primary' : 'text-accent'
            ]}>
              arrow_forward
            </span>
          </div>
        </div>
      </RouterLink>
    );
  }
});
