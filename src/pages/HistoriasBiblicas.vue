<template>
  <div class="min-h-screen bg-[#141414]">
    <header class="fixed top-0 z-50 w-full flex items-center justify-between px-4 py-2 transition-all lg:px-10 lg:py-4 bg-gradient-to-b from-black/80 to-transparent">
      <div class="flex items-center space-x-8">
        <router-link to="/">
          <img src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/jvucoskivscc/logolimpa.png" alt="NetGospel Kids" class="h-10" />
        </router-link>
        <nav class="hidden lg:flex space-x-4">
          <router-link to="/" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Início</router-link>
          <router-link to="/filmes" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Filmes</router-link>
          <router-link to="/historias-biblicas" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3] font-semibold">Histórias Bíblicas</router-link>
          <router-link to="/#recentes" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Novidades</router-link>
        </nav>
      </div>

      <div class="flex items-center space-x-4">
        <div class="relative">
          <button class="text-sm font-light text-[#e5e5e5]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        <div class="flex items-center">
          <img :src="userProfilePhoto" alt="Avatar" class="rounded-full h-7 w-7 object-cover" />
          <div class="flex items-center ml-2">
            <span class="text-white text-sm mr-2">{{ userName }}</span>
            <button @click="logout" class="text-sm text-red-500 hover:text-red-400">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="pt-24 px-12 pb-12">
      <h1 class="text-3xl font-bold text-white mb-8">Histórias Bíblicas</h1>
      
      <!-- Indicador de carregamento -->
      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Mensagem se não houver histórias bíblicas -->
      <div v-else-if="historiasBiblicas.length === 0" class="text-center py-8 text-gray-400">
        Nenhuma história bíblica encontrada.
      </div>
      
      <!-- Grid de histórias bíblicas -->
      <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        <div 
          v-for="historia in historiasBiblicas" 
          :key="historia.id" 
          class="relative group cursor-pointer"
          @click="openVideoModal(historia)"
        >
          <div class="relative overflow-hidden rounded-md">
            <!-- Usa a imagem da história ou uma imagem padrão se não houver -->
            <img 
              :src="historia.url_img || '@/assets/movies/movie1.jpg'" 
              :alt="historia.titulo || 'História Bíblica sem título'" 
              class="w-full h-48 object-cover transition duration-200 group-hover:scale-110" 
            />
            
            <!-- Badge de categoria -->
            <div v-if="historia.categoria" class="absolute top-2 right-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full">
              {{ historia.categoria }}
            </div>
            
            <!-- Título da história -->
            <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
              <h3 class="text-white text-sm font-medium">{{ historia.titulo || 'Sem título' }}</h3>
            </div>
          </div>
          
          <!-- Badge de visualizações -->
          <div class="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {{ historia.view || 0 }}
          </div>
        </div>
      </div>
    </main>

    <!-- Modal de vídeo -->
    <div v-if="showVideoModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div class="relative w-full max-w-4xl h-auto">
        <button @click="closeVideoModal" class="absolute -top-10 right-0 text-white hover:text-gray-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <div v-if="selectedVideo">
          <h2 class="text-white text-xl font-bold mb-2">{{ selectedVideo.titulo }}</h2>
          
          <!-- Player de vídeo -->
          <div class="aspect-video bg-black">
            <CustomVideoPlayer 
              v-if="selectedVideo.url && !isExternalVideo(selectedVideo.url)" 
              :videoUrl="getVideoUrl(selectedVideo.url)" 
              :videoId="String(selectedVideo.id || '0')"
              @video-ended="handleVideoEnded"
            />
            <iframe 
              v-else-if="selectedVideo.url" 
              :src="getEmbedUrl(selectedVideo.url)" 
              class="w-full h-full" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
            <div v-else class="w-full h-full flex items-center justify-center text-white">
              Nenhum vídeo disponível
            </div>
          </div>
          
          <!-- Descrição do vídeo -->
          <div class="mt-4 text-white">
            <p>{{ selectedVideo.descricao || 'Sem descrição disponível.' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getAllHistoriasBiblicas } from '../services/historiasBiblicasService';
import { registerVideoView } from '../services/videosAssistidosService';
import { getUserProfilePhoto, getUserName } from '../services/userProfileService';
import { logout } from '../services/authService';
import type { VideoDevocional } from '../services/videoDevocionalService';
import CustomVideoPlayer from '../components/CustomVideoPlayer.vue';

const router = useRouter();

// Dados do perfil do usuário
const userProfilePhoto = ref('@/assets/avatar.png');
const userName = ref('');

// Dados para a página de histórias bíblicas
const historiasBiblicas = ref<VideoDevocional[]>([]);
const loading = ref(true);

// Variáveis para o modal de vídeo
const selectedVideo = ref<VideoDevocional | null>(null);
const showVideoModal = ref(false);

// Carrega a foto de perfil do usuário
async function loadUserProfilePhoto() {
  try {
    userProfilePhoto.value = await getUserProfilePhoto('@/assets/avatar.png');
  } catch (error) {
    console.error('Erro ao carregar foto de perfil:', error);
  }
}

// Carrega o nome do usuário
async function loadUserName() {
  try {
    userName.value = await getUserName();
  } catch (error) {
    console.error('Erro ao carregar nome do usuário:', error);
  }
}

// Função para carregar todas as histórias bíblicas
async function loadHistoriasBiblicas() {
  loading.value = true;
  
  try {
    historiasBiblicas.value = await getAllHistoriasBiblicas();
  } catch (error) {
    console.error('Erro ao carregar histórias bíblicas:', error);
  } finally {
    loading.value = false;
  }
}

// Função para abrir o modal de vídeo
async function openVideoModal(video: VideoDevocional) {
  selectedVideo.value = video;
  showVideoModal.value = true;
  
  // Registra a visualização do vídeo
  if (video && video.id) {
    try {
      await registerVideoView(video.id);
      
      // Atualiza a contagem de visualizações localmente
      if (video.view !== undefined && video.view !== null) {
        video.view += 1;
      } else {
        video.view = 1;
      }
    } catch (error) {
      console.error('Erro ao registrar visualização:', error);
    }
  }
}

// Função para fechar o modal de vídeo
function closeVideoModal() {
  showVideoModal.value = false;
  selectedVideo.value = null;
}

// Função para lidar com o término do vídeo
function handleVideoEnded() {
  // Pode adicionar lógica adicional aqui se necessário
  console.log('Vídeo terminou de ser reproduzido');
}

// Função para verificar se é um vídeo externo (YouTube, Vimeo, etc.)
function isExternalVideo(url: string): boolean {
  if (!url) return false;
  
  return url.includes('youtube.com') || 
         url.includes('youtu.be') || 
         url.includes('vimeo.com');
}

// Função para obter a URL do vídeo para o player personalizado
function getVideoUrl(url: string): string {
  if (!url) return '';
  
  // Se a URL já contiver o formato correto, retorna como está
  if (url.includes('play_720p.mp4')) {
    return url;
  }
  
  // Constrói a URL no formato esperado pelo player
  return `https://vz-f2dd6111-853.b-cdn.net/${url}/play_720p.mp4`;
}

// Função para obter a URL de embed para vídeos externos
function getEmbedUrl(url: string): string {
  if (!url) return '';
  
  // Converte URLs do YouTube formato padrão
  if (url.includes('youtube.com/watch')) {
    const videoId = new URL(url).searchParams.get('v');
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  
  // Converte URLs do YouTube formato curto
  if (url.includes('youtu.be/')) {
    const videoId = url.split('youtu.be/')[1].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  }
  
  // Converte URLs do Vimeo para formato de embed
  if (url.includes('vimeo.com')) {
    const videoId = url.split('/').pop();
    return `https://player.vimeo.com/video/${videoId}?autoplay=1`;
  }
  
  return url; // Retorna a URL original se não for YouTube ou Vimeo
}

// Carrega os dados ao montar o componente
onMounted(() => {
  loadUserProfilePhoto();
  loadUserName();
  loadHistoriasBiblicas();
});
</script>

<style scoped>
/* Estilo para esconder a barra de rolagem */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
