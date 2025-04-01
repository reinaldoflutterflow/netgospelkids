<template>
  <section class="h-[65vh] relative">
    <div class="absolute inset-x-0 top-0 bottom-[40%] bg-gradient-to-b from-black/70 via-black/40 to-transparent z-10"></div>
    <img v-if="destaque?.capa" :src="destaque.capa" :alt="destaque.titulo || 'Banner'" class="w-full h-full object-cover" />
    <img v-else src="@/assets/banner.jpg" alt="Banner padrão" class="w-full h-full object-cover" />
    
    <div class="absolute top-[30%] left-12 z-20">
      <div v-if="loading">
        <SkeletonLoader type="text" :custom-style="{height: '48px', width: '33%', marginBottom: '16px'}" />
        <SkeletonLoader type="text" :custom-style="{height: '16px', width: '66%', marginBottom: '8px'}" />
        <SkeletonLoader type="text" :custom-style="{height: '16px', width: '50%', marginBottom: '16px'}" />
        <div class="flex space-x-4">
          <SkeletonLoader type="text" :custom-style="{height: '40px', width: '96px', borderRadius: '4px'}" />
          <SkeletonLoader type="text" :custom-style="{height: '40px', width: '128px', borderRadius: '4px'}" />
        </div>
      </div>
      
      <template v-else>
        <h1 class="text-4xl md:text-6xl font-bold text-white mb-4">{{ destaque?.titulo || 'Carregando...' }}</h1>
        <p class="text-base md:text-lg text-white max-w-xl mb-4">
          {{ destaque?.descricao || 'Carregando descrição...' }}
        </p>
        <div class="flex space-x-4">
          <button 
            @click="playVideo" 
            class="px-6 md:px-8 py-2 bg-blue-500 text-white rounded font-semibold hover:bg-blue-600 transition"
          >
            Assistir
          </button>
          <button class="px-6 md:px-8 py-2 bg-gray-500/70 text-white rounded font-semibold hover:bg-gray-500/50 transition">
            Mais informações
          </button>
        </div>
      </template>
    </div>
    
    <!-- Modal de vídeo com player personalizado -->
    <div v-if="showVideoModal" class="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      <!-- Barra superior com título e botão de fechar -->
      <div class="bg-gradient-to-b from-black/80 to-transparent py-3 px-6 flex items-center justify-between">
        <h2 class="text-white text-xl font-bold truncate pr-4">{{ destaque?.titulo || 'Vídeo' }}</h2>
        <button @click="closeVideoModal" class="text-white hover:text-gray-300 focus:outline-none flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <!-- Container do vídeo com player personalizado -->
      <div class="flex-grow relative overflow-hidden">
        <CustomVideoPlayer 
          v-if="destaque?.url_video" 
          :videoUrl="destaque.url_video" 
          :videoId="destaque.id?.toString() || ''" 
          @ended="closeVideoModal"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getDestaque, type Destaque } from '../services/destaqueService';
import CustomVideoPlayer from './CustomVideoPlayer.vue';
import SkeletonLoader from './SkeletonLoader.vue';

const destaque = ref<Destaque | null>(null);
const loading = ref(true);
const showVideoModal = ref(false);

onMounted(async () => {
  try {
    destaque.value = await getDestaque();
  } catch (error) {
    console.error('Erro ao carregar destaque:', error);
  } finally {
    loading.value = false;
  }
});

function playVideo() {
  if (destaque.value?.url_video) {
    showVideoModal.value = true;
  }
}

function closeVideoModal() {
  showVideoModal.value = false;
}


</script>
