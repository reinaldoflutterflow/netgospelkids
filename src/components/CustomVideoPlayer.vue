<template>
  <div class="custom-video-player relative w-full h-full max-h-[calc(100vh-80px)]">
    <!-- Video element com proteção contra download -->
    <video
      ref="videoElement"
      class="w-full h-full"
      autoplay
      controlsList="nodownload nofullscreen noremoteplayback"
      disablePictureInPicture
      @timeupdate="onTimeUpdate"
      @play="isPlaying = true"
      @pause="isPlaying = false"
      @ended="onVideoEnded"
      @loadedmetadata="onVideoLoaded"
      @contextmenu.prevent
    >
      <source :src="props.videoUrl" type="video/mp4" />
      Seu navegador não suporta a reprodução de vídeos.
    </video>

    <!-- Overlay transparente para capturar cliques -->
    <div 
      class="absolute inset-0 cursor-pointer"
      @click="togglePlay"
    ></div>

    <!-- Overlay para controles -->
    <div 
      v-if="showControls" 
      class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end pb-4 pointer-events-none"
      @mousemove="resetControlsTimer"
      @mouseleave="startHideControlsTimer"
    >
      <!-- Barra de progresso -->
      <div class="px-4 pb-2 mb-2 pointer-events-auto">
        <div 
          class="relative h-1 bg-gray-600 rounded-full mb-4 cursor-pointer" 
          @click="seekVideo"
          @mousemove="updateSeekPreview"
        >
          <div 
            class="absolute top-0 left-0 h-full bg-red-600 rounded-full" 
            :style="{ width: `${progressPercentage}%` }"
          ></div>
          <div 
            class="absolute top-0 left-0 h-full bg-red-400 rounded-full" 
            :style="{ width: `${bufferedPercentage}%`, opacity: 0.5 }"
          ></div>
          <div 
            class="absolute top-0 left-0 h-3 w-3 bg-red-600 rounded-full transform -translate-y-1" 
            :style="{ left: `${progressPercentage}%` }"
          ></div>
          
          <!-- Preview de tempo ao passar o mouse -->
          <div 
            v-if="showSeekPreview" 
            class="absolute bottom-4 transform -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-white text-xs"
            :style="{ left: `${seekPreviewPosition}px` }"
          >
            {{ formatTime(seekPreviewTime) }}
          </div>
        </div>
      </div>

      <!-- Controles principais -->
      <div class="px-4 pb-4 flex items-center justify-between pointer-events-auto">
        <div class="flex items-center space-x-4">
          <!-- Play/Pause -->
          <button class="text-white focus:outline-none" @click="togglePlay">
            <svg v-if="!isPlaying" xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="white" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="white" viewBox="0 0 24 24">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>

          <!-- Retroceder 10s -->
          <button class="text-white focus:outline-none" @click="skipBackward">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="white" viewBox="0 0 24 24">
              <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8zm-1.1 11h-.8v-3.1h.8v3.1zm0-4.2h-.8V9.1h.8v2.7z"/>
            </svg>
            <span class="text-xs absolute -bottom-1 left-1/2 transform -translate-x-1/2">10</span>
          </button>

          <!-- Avançar 10s -->
          <button class="text-white focus:outline-none" @click="skipForward">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="white" viewBox="0 0 24 24">
              <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8zm1.1 11h.8V9.1h-.8v6.9zm-2.1-5.5h.8V9.1h-.8v1.4z"/>
            </svg>
            <span class="text-xs absolute -bottom-1 left-1/2 transform -translate-x-1/2">10</span>
          </button>

          <!-- Tempo atual / Duração -->
          <div class="text-white text-sm">
            {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
          </div>
        </div>

        <div class="flex items-center space-x-4">
          <!-- Volume -->
          <div class="flex items-center">
            <button class="text-white focus:outline-none mr-2" @click="toggleMute">
              <svg v-if="!isMuted" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="white" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="white" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
              </svg>
            </button>
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              v-model="volume" 
              class="w-16 accent-red-600"
              @input="updateVolume"
            />
          </div>


          
          <!-- Tela cheia -->
          <button class="text-white focus:outline-none" @click="toggleFullscreen">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="white" viewBox="0 0 24 24">
              <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading spinner -->
    <div v-if="isLoading" class="absolute inset-0 flex items-center justify-center">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
    </div>

    <!-- Play button overlay (quando pausado) -->
    <div 
      v-if="!isPlaying && !isLoading" 
      class="absolute inset-0 flex items-center justify-center cursor-pointer"
      @click="togglePlay"
    >
      <div class="bg-red-600/80 rounded-full p-4 hover:bg-red-500/80 transition-all duration-200 transform hover:scale-110">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12" fill="white" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z"/>
        </svg>
      </div>
    </div>
    

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { getVideoProgress, saveVideoProgress } from '@/services/videoProgressService';

// Props
const props = defineProps<{
  videoUrl: string;
  videoId: string;
}>();

// Emits
const emit = defineEmits(['ended', 'timeupdate']);

// Refs
const videoElement = ref<HTMLVideoElement | null>(null);
const isPlaying = ref(false);
const isMuted = ref(false);
const showControls = ref(true);
const isLoading = ref(true);
const currentTime = ref(0);
const duration = ref(0);
const bufferedPercentage = ref(0);
const volume = ref(1);
const showSeekPreview = ref(false);
const seekPreviewPosition = ref(0);


const seekPreviewTime = ref(0);

// Controle de timers
let controlsTimer: number | null = null;
let progressSaveTimer: number | null = null;

// Computed
const progressPercentage = ref(0);
const videoUrl = computed(() => props.videoUrl);

// Lifecycle hooks
onMounted(async () => {
  console.log('Player montado, videoId:', props.videoId);
  
  // Adiciona listener para eventos de tela cheia
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  
  // Limpa os listeners quando o componente for desmontado
  onUnmounted(() => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  });
  
  // Adiciona proteção contra download
  if (videoElement.value) {
    // Desativa o menu de contexto
    videoElement.value.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      return false;
    });
    
    // Configura atributos de proteção
    videoElement.value.controlsList = 'nodownload nofullscreen noremoteplayback';
    videoElement.value.disablePictureInPicture = true;
  }
  
  // Carrega a última posição do vídeo
  if (props.videoId) {
    try {
      const lastPosition = await getVideoProgress(props.videoId);
      console.log('Posição recuperada:', lastPosition, 'segundos');
      
      if (videoElement.value) {
        // Configura para iniciar automaticamente com som
        videoElement.value.muted = false;
        isPlaying.value = true;
        
        // Recupera a posição anterior se existir
        if (lastPosition > 0) {
          console.log('Definindo currentTime para:', lastPosition);
          videoElement.value.currentTime = lastPosition;
          currentTime.value = lastPosition;
          updateProgressPercentage();
        }
        
        // Inicia a reprodução
        try {
          const playPromise = videoElement.value.play();
          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                console.log('Reprodução iniciada com sucesso');
                // Entra em modo tela cheia após iniciar a reprodução
                setTimeout(() => {
                  toggleFullscreen();
                }, 500);
              })
              .catch(error => {
                console.error('Erro ao iniciar reprodução automática:', error);
                // Tenta novamente com interação do usuário
                const playButton = document.querySelector('.bg-red-600/80');
                if (playButton) {
                  playButton.classList.add('animate-pulse');
                }
              });
          }
        } catch (error) {
          console.error('Erro ao iniciar reprodução:', error);
        }
      }
    } catch (error) {
      console.error('Erro ao recuperar progresso do vídeo:', error);
    }
  }

  // Configura timer para salvar progresso periodicamente
  progressSaveTimer = window.setInterval(() => {
    if (isPlaying.value && currentTime.value > 0) {
      saveProgress();
    }
  }, 5000);

  // Adiciona listener para eventos de visibilidade da página
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Inicia o timer para esconder os controles
  startHideControlsTimer();
});

onUnmounted(() => {
  // Limpa timers
  if (controlsTimer) {
    clearTimeout(controlsTimer);
  }
  if (progressSaveTimer) {
    clearInterval(progressSaveTimer);
  }

  // Remove listeners
  document.removeEventListener('visibilitychange', handleVisibilityChange);

  // Salva a posição final
  saveProgress();
});

// Methods
// Debounce para evitar múltiplos cliques
let isTogglePlayDebouncing = false;

function togglePlay() {
  if (!videoElement.value || isTogglePlayDebouncing) return;
  
  // Ativa o debounce
  isTogglePlayDebouncing = true;
  
  console.log('Toggle play/pause. Estado atual:', isPlaying.value ? 'reproduzindo' : 'pausado');
  
  if (isPlaying.value) {
    videoElement.value.pause();
    saveProgress();
    console.log('Vídeo pausado');
  } else {
    videoElement.value.play()
      .then(() => console.log('Vídeo iniciado com sucesso'))
      .catch(err => console.error('Erro ao iniciar vídeo:', err));
  }
  
  isPlaying.value = !isPlaying.value;
  resetControlsTimer();
  
  // Libera o debounce após 300ms
  setTimeout(() => {
    isTogglePlayDebouncing = false;
  }, 300);
}

function toggleMute() {
  if (!videoElement.value) return;
  
  videoElement.value.muted = !videoElement.value.muted;
  isMuted.value = videoElement.value.muted;
  
  resetControlsTimer();
}

function updateVolume() {
  if (!videoElement.value) return;
  
  videoElement.value.volume = parseFloat(volume.value.toString());
  isMuted.value = videoElement.value.volume === 0;
  
  resetControlsTimer();
}

function skipForward() {
  if (!videoElement.value) return;
  
  videoElement.value.currentTime = Math.min(
    videoElement.value.currentTime + 10,
    videoElement.value.duration
  );
  
  resetControlsTimer();
}

function skipBackward() {
  if (!videoElement.value) return;
  
  videoElement.value.currentTime = Math.max(
    videoElement.value.currentTime - 10,
    0
  );
  
  resetControlsTimer();
}

function seekVideo(event: MouseEvent) {
  if (!videoElement.value) return;
  
  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const position = (event.clientX - rect.left) / rect.width;
  
  videoElement.value.currentTime = position * videoElement.value.duration;
  currentTime.value = videoElement.value.currentTime;
  updateProgressPercentage();
  
  resetControlsTimer();
}

function updateSeekPreview(event: MouseEvent) {
  if (!videoElement.value) return;
  
  const progressBar = event.currentTarget as HTMLElement;
  const rect = progressBar.getBoundingClientRect();
  const position = (event.clientX - rect.left) / rect.width;
  
  seekPreviewPosition.value = event.clientX - rect.left;
  seekPreviewTime.value = position * videoElement.value.duration;
  showSeekPreview.value = true;
}

function toggleFullscreen() {
  if (!videoElement.value) return;
  
  if (!document.fullscreenElement) {
    videoElement.value.requestFullscreen().catch(err => {
      console.error(`Erro ao tentar entrar em tela cheia: ${err.message}`);
    });
  } else {
    document.exitFullscreen();
  }
  
  resetControlsTimer();
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement;
  console.log('Estado de tela cheia alterado:', isFullscreen.value);
}



function onTimeUpdate() {
  if (!videoElement.value) return;
  
  currentTime.value = videoElement.value.currentTime;
  updateProgressPercentage();
  updateBufferedPercentage();
  
  emit('timeupdate', {
    currentTime: currentTime.value,
    duration: duration.value,
    percentage: progressPercentage.value
  });
}

function onVideoLoaded() {
  if (!videoElement.value) return;
  
  duration.value = videoElement.value.duration;
  isLoading.value = false;
  updateProgressPercentage();
}

function onVideoEnded() {
  isPlaying.value = false;
  emit('ended');
  
  // Limpa o progresso quando o vídeo termina
  if (props.videoId) {
    saveVideoProgress(props.videoId, 0, duration.value);
  }
}

function updateProgressPercentage() {
  if (duration.value > 0) {
    progressPercentage.value = (currentTime.value / duration.value) * 100;
  }
}

function updateBufferedPercentage() {
  if (!videoElement.value || !videoElement.value.buffered.length) return;
  
  const bufferedEnd = videoElement.value.buffered.end(videoElement.value.buffered.length - 1);
  bufferedPercentage.value = (bufferedEnd / videoElement.value.duration) * 100;
}

function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startHideControlsTimer() {
  if (controlsTimer) {
    clearTimeout(controlsTimer);
  }
  
  if (isPlaying.value) {
    controlsTimer = window.setTimeout(() => {
      showControls.value = false;
      showSeekPreview.value = false;
    }, 3000);
  }
}

function resetControlsTimer() {
  showControls.value = true;
  startHideControlsTimer();
}

function saveProgress() {
  if (props.videoId && currentTime.value > 0) {
    console.log('Salvando progresso:', props.videoId, currentTime.value, 'segundos');
    saveVideoProgress(props.videoId, currentTime.value, duration.value)
      .then(() => console.log('Progresso salvo com sucesso'))
      .catch(error => console.error('Erro ao salvar progresso:', error));
  }
}

function handleVisibilityChange() {
  if (document.hidden && isPlaying.value) {
    togglePlay(); // Pausa o vídeo quando a página fica em segundo plano
    saveProgress();
  }
}
</script>

<style scoped>
.custom-video-player {
  user-select: none;
}

input[type="range"] {
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #e50914;
  border-radius: 50%;
  cursor: pointer;
}

/* Esconde o botão de download nos controles nativos */
:deep(video::-webkit-media-controls-enclosure) {
  overflow: hidden;
}

:deep(video::-webkit-media-controls-panel) {
  width: calc(100% + 30px);
}

:deep(video::-webkit-media-controls-download-button) {
  display: none !important;
}

/* Esconde o botão de tela cheia nos controles nativos */
:deep(video::-webkit-media-controls-fullscreen-button) {
  display: none !important;
}

/* Esconde o botão de picture-in-picture */
:deep(video::-webkit-media-controls-picture-in-picture-button) {
  display: none !important;
}
</style>
