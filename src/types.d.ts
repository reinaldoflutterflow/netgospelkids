// Declaração de tipos para os componentes Vue
declare module '@/components/HeroBanner.vue';
declare module '@/components/ContentRow.vue';
declare module '@/components/LoginScreen.vue';
declare module '@/components/CustomVideoPlayer.vue';
declare module '@/components/MobileAppPromo.vue';

// Declaração de tipos para os serviços
declare module '@/services/videosAssistidosService';
declare module '@/services/authService';
declare module '@/services/userProfileService';
declare module '@/services/recentVideosService';
declare module '@/services/videoDevocionalService';
declare module '@/services/filmesService';
declare module '@/services/top10Service';
declare module '@/services/continuarAssistindoService';
declare module '@/services/videoProgressService';

// Tipos para o CustomVideoPlayer
interface HTMLVideoElement {
  controlsList?: DOMTokenList;
}

// Declaração de tipos para variáveis globais
declare const isFullscreen: boolean;

// Interfaces para os tipos de dados
interface VideoDevocional {
  id: number;
  titulo: string;
  url?: string;
  url_img?: string;
  capa_destaque?: string;
  created_at?: string;
  categoria?: string;
  view?: number;
}

interface ContinuarAssistindo {
  video_id: number;
  titulo: string;
  url?: string;
  url_img?: string;
  progresso?: number;
  duracao?: number;
}

interface Filme {
  id: number;
  titulo: string;
  url?: string;
  url_img?: string;
}

interface Top10Video {
  id: number;
  titulo: string;
  url?: string;
  url_img?: string;
  posicao: number;
}

interface RecentVideo {
  id: number;
  titulo: string;
  url?: string;
  url_img?: string;
  created_at: string;
}
