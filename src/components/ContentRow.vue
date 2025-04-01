<template>
  <section class="px-12 py-8">
    <h2 class="text-xl font-semibold text-white mb-4">{{ title }}</h2>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      <div v-for="(item, index) in items" :key="index" class="relative group cursor-pointer">
        <div class="relative overflow-hidden rounded-sm">
          <img :src="item.image" :alt="item.title" class="w-full h-40 object-cover transition duration-200 group-hover:scale-110" />
          
          <!-- Barra de progresso (opcional) -->
          <div v-if="item.progress" class="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>
          <div v-if="item.progress" class="absolute bottom-0 left-0 bg-blue-500 h-1" :style="`width: ${item.progress}%`"></div>
          
          <!-- Título (opcional) -->
          <div v-if="item.title" class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
            <h3 class="text-white text-sm font-medium">{{ item.title }}</h3>
          </div>
        </div>
        
        <!-- Overlay com botão de play -->
        <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition duration-200 flex items-center justify-center">
          <button class="bg-white/90 rounded-full p-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
interface ContentItem {
  image: string;
  title?: string;
  progress?: number;
}

defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array as () => ContentItem[],
    required: true
  }
});
</script>
