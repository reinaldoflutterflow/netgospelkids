<template>
  <div class="min-h-screen bg-[#141414]">
    <!-- Tela de promoção do aplicativo para dispositivos móveis -->
    <MobileAppPromo v-if="isMobileDevice && !forceWebVersion" @access-web-version="showWebVersion" />
    
    <!-- Mostrar tela de login se não estiver autenticado -->
    <LoginScreen v-if="!isAuthenticated && !authLoading" @login-success="handleLoginSuccess" />
    
    <!-- Loader enquanto verifica autenticação -->
    <div v-if="authLoading" class="fixed inset-0 flex items-center justify-center bg-black">
      <div class="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
    </div>
    
    <!-- Conteúdo principal quando autenticado e não é dispositivo móvel -->
    <template v-if="isAuthenticated">
    <header class="fixed top-0 z-50 w-full flex items-center justify-between px-4 py-2 transition-all lg:px-10 lg:py-4 bg-gradient-to-b from-black/80 to-transparent">
      <div class="flex items-center">
        <img src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/jvucoskivscc/logolimpa.png" alt="NetGospel Kids" class="h-10" />
        <!-- Menu desktop (visível apenas em telas grandes) -->
        <nav class="hidden lg:flex space-x-4 ml-8">
          <a href="#" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Início</a>
          <a href="#filmes-completos" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Filmes</a>
          <router-link to="/historias-biblicas" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Histórias Bíblicas</router-link>
          <a href="#recentes" class="text-sm font-light text-[#e5e5e5] transition duration-[.4s] hover:text-[#b3b3b3]">Novidades</a>
        </nav>
      </div>

      <div class="flex items-center space-x-4">
        <!-- Botão do menu mobile (visível apenas em telas pequenas) -->
        <button 
          @click="toggleMobileMenu" 
          class="lg:hidden text-white focus:outline-none mr-4"
          aria-label="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path v-if="!mobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div class="relative hidden sm:block">
          <button class="text-sm font-light text-[#e5e5e5]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
        </div>
        <div class="hidden sm:flex items-center">
          <img src="https://cdn-icons-png.flaticon.com/256/5050/5050417.png" alt="Avatar" class="rounded-full h-7 w-7 object-cover" />
          <div class="flex items-center ml-2">
            <span class="text-white text-sm mr-2">{{ userName || 'Reinaldo Campos' }}</span>
            <button @click="logout" class="text-sm text-red-500 hover:text-red-400">
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
    
    <!-- Menu mobile (exibido quando o botão hamburguer é clicado) -->
    <div 
      v-if="mobileMenuOpen" 
      class="fixed top-[60px] left-0 right-0 z-40 bg-black/95 shadow-lg lg:hidden"
    >
      <!-- Informações do usuário no topo do menu mobile -->
      <div class="border-b border-gray-800 px-6 py-4">
        <div class="flex items-center">
          <img src="https://cdn-icons-png.flaticon.com/256/5050/5050417.png" alt="Avatar" class="rounded-full h-10 w-10 object-cover" />
          <div class="flex flex-col ml-3">
            <span class="text-white text-sm font-medium">{{ userName || 'Reinaldo Campos' }}</span>
            <button @click="logout" class="text-sm text-red-500 hover:text-red-400 text-left mt-1">
              Sair
            </button>
          </div>
        </div>
      </div>
      
      <nav class="flex flex-col py-2">
        <a 
          href="#" 
          class="px-6 py-3 text-sm font-light text-[#e5e5e5] hover:bg-gray-800 transition duration-[.4s]"
          @click="closeMobileMenu"
        >
          Início
        </a>
        <a 
          href="#filmes-completos" 
          class="px-6 py-3 text-sm font-light text-[#e5e5e5] hover:bg-gray-800 transition duration-[.4s]"
          @click="closeMobileMenu"
        >
          Filmes
        </a>
        <router-link 
          to="/historias-biblicas" 
          class="px-6 py-3 text-sm font-light text-[#e5e5e5] hover:bg-gray-800 transition duration-[.4s]"
          @click="closeMobileMenu"
        >
          Histórias Bíblicas
        </router-link>
        <a 
          href="#recentes" 
          class="px-6 py-3 text-sm font-light text-[#e5e5e5] hover:bg-gray-800 transition duration-[.4s]"
          @click="closeMobileMenu"
        >
          Novidades
        </a>
      </nav>
    </div>

    <main class="relative pt-24">
      <!-- Banner principal usando o componente HeroBanner que busca dados da tabela destaque -->
      <HeroBanner />

      <!-- Seção de Histórias Bíblicas com dados da tabela video_devocional -->
      <section class="px-12 py-8">
        <h2 class="text-xl font-semibold text-white mb-4">Histórias Bíblicas</h2>
        
        <!-- Skeleton loader durante o carregamento -->
        <div v-if="loadingVideos" class="relative">
          <div class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth">
            <SkeletonLoader 
              v-for="n in 5" 
              :key="n" 
              type="card" 
              class="w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]" 
              :custom-style="{height: '180px'}" 
            />
          </div>
        </div>
        
        <!-- Mensagem se não houver vídeos -->
        <div v-else-if="biblicalVideos.length === 0" class="text-center py-8 text-gray-400">
          Nenhuma história bíblica encontrada.
        </div>
        
        <!-- Grade de vídeos com scroll horizontal -->
        <div v-else class="relative">
          <!-- Botões de navegação -->
          <button 
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-r-lg text-white hover:bg-black/70 transition"
            @click="scrollLeft"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-l-lg text-white hover:bg-black/70 transition"
            @click="scrollRight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Container com scroll horizontal -->
          <div 
            ref="scrollContainer"
            class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <div 
              v-for="video in biblicalVideos" 
              :key="video.id" 
              class="relative group cursor-pointer w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]"
              @click="openVideoModal(video)"
            >
              <div class="relative overflow-hidden rounded-xl">
                <!-- Usa a imagem do vídeo ou uma imagem padrão se não houver -->
                <div class="w-full h-0 pb-[56.25%] relative">
                  <div class="absolute inset-0 overflow-hidden">
                    <img 
                      v-image-retry="{defaultSrc: '@/assets/movies/movie1.jpg', maxRetries: 3}"
                      :src="video.url_img || '@/assets/movies/movie1.jpg'" 
                      :alt="video.titulo || 'Vídeo Bíblico'" 
                      class="w-[120%] h-[120%] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 object-cover transition duration-200 group-hover:scale-105" 
                      @error="handleImageError($event, video)"
                    />
                  </div>
                </div>
                
                <!-- Título do vídeo -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <h3 class="text-white text-sm font-medium">{{ video.titulo || 'Sem título' }}</h3>
                </div>
              </div>
              
              <!-- Sem overlay no hover, apenas o cursor pointer já indica que é clicável -->
            </div>
          </div>
        </div>
        
        <!-- Modal de vídeo -->
        <div v-if="selectedVideo && showVideoModal" class="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
          <div class="relative w-full max-w-4xl">
            <button @click="closeVideoModal" class="absolute -top-10 right-0 text-white hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <!-- Usa o CustomVideoPlayer para vídeos do Bunny.net -->
            <CustomVideoPlayer
              v-if="selectedVideo.url && !selectedVideo.url.includes('youtube') && !selectedVideo.url.includes('vimeo')"
              :videoUrl="selectedVideo.url"
              :videoId="String(selectedVideo.id)"
              class="w-full aspect-video"
            />
            <!-- Usa iframe para YouTube/Vimeo -->
            <iframe 
              v-else-if="selectedVideo.url" 
              :src="getEmbedUrl(selectedVideo.url)" 
              class="w-full aspect-video" 
              frameborder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen
            ></iframe>
            <div v-else class="flex items-center justify-center h-64 bg-gray-800 text-white">
              Vídeo não disponível
            </div>
          </div>
        </div>
      </section>

      <!-- Seção de Continuar Assistindo -->
      <section class="px-12 py-8">
        <h2 class="text-xl font-semibold text-white mb-4">Continuar Assistindo</h2>
        
        <!-- Skeleton loader durante o carregamento -->
        <div v-if="loadingContinueWatching" class="relative">
          <div class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth">
            <div v-for="n in 5" :key="n" class="relative group w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]">
              <SkeletonLoader type="card" :custom-style="{height: '180px'}" />
              <!-- Barra de progresso skeleton -->
              <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <SkeletonLoader type="text" :custom-style="{height: '4px', width: '60%', borderRadius: '0'}" />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Mensagem se não houver vídeos -->
        <div v-else-if="continueWatchingVideos.length === 0" class="text-center py-8 text-gray-400">
          Nenhum vídeo para continuar assistindo.
        </div>
        
        <!-- Grade de vídeos com scroll horizontal -->
        <div v-else class="relative">
          <!-- Botões de navegação -->
          <button 
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-r-lg text-white hover:bg-black/70 transition"
            @click="scrollContinueWatchingLeft"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-l-lg text-white hover:bg-black/70 transition"
            @click="scrollContinueWatchingRight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Container com scroll horizontal -->
          <div 
            ref="continueWatchingContainer"
            class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <div 
              v-for="video in continueWatchingVideos" 
              :key="video.video_id" 
              class="relative group cursor-pointer w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]"
              @click="openContinueWatchingVideo(video)"
            >
              <div class="relative overflow-hidden rounded-xl">
                <!-- Usa a imagem do vídeo ou uma imagem padrão se não houver -->
                <div class="w-full h-40 relative overflow-hidden">
                  <img 
                    v-image-retry="{defaultSrc: '@/assets/continue/continue1.jpg', maxRetries: 3}"
                    :src="video.url_img || '@/assets/continue/continue1.jpg'" 
                    :alt="video.titulo || 'Vídeo sem título'" 
                    class="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                    @error="handleImageError($event, video)"
                  />
                </div>
                
                <!-- Barra de progresso -->
                <div class="absolute bottom-0 left-0 right-0 h-1 bg-red-600"></div>
                <div 
                  class="absolute bottom-0 left-0 bg-blue-500 h-1" 
                  :style="{ width: getVideoProgressPercentage(video.video_id) + '%' }"
                ></div>
                
                <!-- Título do vídeo -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <h3 class="text-white text-sm font-medium">{{ video.titulo || 'Sem título' }}</h3>
                </div>
              </div>
              
              <!-- Sem overlay no hover, apenas o cursor pointer já indica que é clicável -->
            </div>
          </div>
        </div>
      </section>


      
      <!-- Seção de Filmes Completos -->
      <section id="filmes-completos" class="px-12 py-8">
        <h2 class="text-xl font-semibold text-white mb-4">Filmes Completos</h2>
        
        <!-- Skeleton loader durante o carregamento -->
        <div v-if="loadingFilmes" class="relative">
          <div class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth">
            <SkeletonLoader 
              v-for="n in 5" 
              :key="n" 
              type="card" 
              class="w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]" 
              :custom-style="{height: '180px'}" 
            />
          </div>
        </div>
        
        <!-- Mensagem se não houver filmes -->
        <div v-else-if="filmes.length === 0" class="text-center py-8 text-gray-400">
          Nenhum filme encontrado.
        </div>
        
        <!-- Grade de filmes com scroll horizontal -->
        <div v-else class="relative">
          <!-- Botões de navegação -->
          <button 
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-r-lg text-white hover:bg-black/70 transition"
            @click="scrollFilmesLeft"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-l-lg text-white hover:bg-black/70 transition"
            @click="scrollFilmesRight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Container com scroll horizontal -->
          <div 
            ref="filmesContainer"
            class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <div 
              v-for="filme in filmes" 
              :key="filme.id" 
              class="relative group cursor-pointer w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]"
              @click="openVideoModal(filme)"
            >
              <div class="relative overflow-hidden rounded-xl">
                <!-- Usa a imagem do filme ou uma imagem padrão se não houver -->
                <div class="w-full h-40 relative overflow-hidden">
                  <img 
                    v-image-retry="{defaultSrc: '@/assets/movies/movie1.jpg', maxRetries: 3}"
                    :src="filme.url_img || '@/assets/movies/movie1.jpg'" 
                    :alt="filme.titulo || 'Filme sem título'" 
                    class="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                    @error="handleImageError($event, filme)"
                  />
                </div>
                
                <!-- Título do filme -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <h3 class="text-white text-sm font-medium">{{ filme.titulo || 'Sem título' }}</h3>
                </div>
              </div>
              
              <!-- Sem overlay no hover, apenas o cursor pointer já indica que é clicável -->
            </div>
          </div>
        </div>
      </section>
      
      <!-- Seção de Top 10 -->
      <section class="px-4 sm:px-8 md:px-12 py-6 sm:py-8">
        <h2 class="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Top 10 em histórias bíblicas e educativas</h2>
        
        <!-- Skeleton loader durante o carregamento para versão mobile -->
        <div v-if="loadingTop10 && isMobileView" class="mt-4 relative">
          <div class="flex overflow-x-auto scrollbar-hide gap-3 pb-4">
            <SkeletonLoader 
              v-for="n in 5" 
              :key="n" 
              type="card" 
              class="flex-none w-[calc(50%-6px)] sm:w-[calc(33.333%-8px)]" 
              :custom-style="{height: '160px'}" 
            />
          </div>
        </div>
        
        <!-- Skeleton loader durante o carregamento para versão desktop -->
        <div v-if="loadingTop10 && !isMobileView" class="relative flex items-center mt-4">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 w-full">
            <SkeletonLoader 
              v-for="n in 10" 
              :key="n" 
              type="card" 
              :custom-style="{height: '180px'}" 
            />
          </div>
        </div>
        
        <!-- Mensagem se não houver vídeos -->
        <div v-else-if="top10Videos.length === 0" class="text-center py-8 text-gray-400">
          Nenhum vídeo encontrado no Top 10.
        </div>
        
        <!-- Versão mobile do Top 10 (exibida apenas em telas pequenas) -->
        <div v-else-if="isMobileView" class="mt-4 relative">
          <!-- Botões de navegação para mobile -->
          <button 
            class="absolute left-0 z-10 bg-black/50 p-2 rounded-r-lg text-white hover:bg-black/70 transition top-1/2 transform -translate-y-1/2"
            @click="scrollMobileTop10Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-0 z-10 bg-black/50 p-2 rounded-l-lg text-white hover:bg-black/70 transition top-1/2 transform -translate-y-1/2"
            @click="scrollMobileTop10Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Container com scroll horizontal para mobile -->
          <div 
            ref="mobileTop10Container"
            class="flex overflow-x-auto pb-4 scrollbar-hide gap-3 scroll-smooth w-full pl-2 pr-2"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <div 
              v-for="(video, index) in top10Videos" 
              :key="video.id" 
              class="relative cursor-pointer flex-none bg-[#1a1a1a] rounded-md overflow-hidden"
              style="width: 160px;"
              @click="openVideoModal(video)"
            >
              <!-- Tag vermelha com número do Top 10 -->
              <div class="absolute top-2 left-0 z-10 bg-red-600 text-white font-bold py-1 px-2 text-xs rounded-r-md shadow-md">
                Top: {{ (index + 1).toString().padStart(2, '0') }}
              </div>
              
              <!-- Imagem do vídeo -->
              <div class="w-full aspect-[2/3] overflow-hidden">
                <img 
                  v-image-retry="{defaultSrc: '@/assets/movies/movie1.jpg', maxRetries: 3}"
                  :src="video.capa_destaque || video.url_img || '@/assets/movies/movie1.jpg'" 
                  :alt="video.titulo || 'Vídeo sem título'" 
                  class="w-full h-full object-cover transition duration-200 hover:scale-105"
                  @error="handleImageError($event, video)"
                />
              </div>
              
              <!-- Título do vídeo -->
              <div class="p-2">
                <h3 class="text-white text-xs font-medium line-clamp-2">{{ video.titulo || 'Sem título' }}</h3>
              </div>
              
              <!-- Badge de novidade -->
              <div v-if="isNewVideo(video)" class="absolute top-2 right-0 bg-blue-600 text-white text-xs px-2 py-1 rounded-l-md">
                Novo
              </div>
            </div>
          </div>
        </div>
        
        <!-- Versão desktop do Top 10 (exibida apenas em telas maiores) -->
        <div v-else class="relative flex items-center mt-4">
          <!-- Botões de navegação -->
          <button 
            class="absolute left-0 z-10 bg-black/50 p-2 rounded-r-lg text-white hover:bg-black/70 transition"
            @click="scrollTop10Left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-0 z-10 bg-black/50 p-2 rounded-l-lg text-white hover:bg-black/70 transition"
            @click="scrollTop10Right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Container com scroll horizontal -->
          <div 
            ref="top10Container"
            class="flex overflow-x-auto pb-4 scrollbar-hide gap-4 sm:gap-8 md:gap-16 scroll-smooth w-full pl-4 sm:pl-8 md:pl-16 pr-4 sm:pr-8 md:pr-16"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <div 
              v-for="(video, index) in top10Videos" 
              :key="video.id" 
              class="relative cursor-pointer flex-none"
              :class="{'w-[200px] h-[260px] sm:w-[250px] sm:h-[300px] md:w-[320px] md:h-[350px]': true}"
              @click="openVideoModal(video)"
            >
              <!-- Número do ranking em estilo Netflix -->
              <div class="absolute inset-0 flex items-center justify-start z-0 overflow-visible pl-0">
                <span 
                  class="text-[150px] sm:text-[200px] md:text-[280px] font-black leading-none text-[#333333] opacity-80"
                  style="transform: translateX(-30px);"
                  :class="{'sm:translate-x-[-40px] md:translate-x-[-50px]': true}"
                >{{ index + 1 }}</span>
              </div>
              
              <!-- Container da imagem vertical posicionado acima do número -->
              <div class="relative z-10 w-full h-full flex flex-col items-center justify-center">
                <div class="relative w-[120px] sm:w-[150px] md:w-[180px] h-[180px] sm:h-[225px] md:h-[270px] overflow-hidden rounded-sm ml-10 sm:ml-14 md:ml-20">
                  <!-- Imagem do vídeo em formato vertical (poster) -->
                  <img 
                    v-image-retry="{defaultSrc: '@/assets/movies/movie1.jpg', maxRetries: 3}"
                    :src="video.capa_destaque || video.url_img || '@/assets/movies/movie1.jpg'" 
                    :alt="video.titulo || 'Vídeo sem título'" 
                    class="w-full h-full object-cover transition duration-200 group-hover:scale-110" 
                    @error="handleImageError($event, video)"
                  />
                  
                  <!-- Badge de novidade -->
                  <div v-if="isNewVideo(video)" class="absolute bottom-2 right-2 bg-red-600 text-white text-xs px-2 py-1 rounded">
                    Novidade
                  </div>
                  
                  <!-- Título do vídeo -->
                  <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <h3 class="text-white text-sm font-medium">{{ video.titulo || 'Sem título' }}</h3>
                  </div>
                </div>
              </div>
              
              <!-- Sem overlay no hover, apenas o cursor pointer já indica que é clicável -->
            </div>
          </div>
        </div>
      </section>
      

      
      <!-- Seção de Vídeos Recentes -->
      <section id="recentes" class="px-12 py-8">
        <h2 class="text-xl font-semibold text-white mb-4">Adicionados Recentemente</h2>
        
        <!-- Indicador de carregamento -->
        <div v-if="loadingRecentVideos" class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
        
        <!-- Mensagem se não houver vídeos recentes -->
        <div v-else-if="recentVideos.length === 0" class="text-center py-8 text-gray-400">
          Nenhum vídeo recente encontrado.
        </div>
        
        <!-- Grade de vídeos recentes com scroll horizontal -->
        <div v-else class="relative">
          <!-- Botões de navegação -->
          <button 
            class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-r-lg text-white hover:bg-black/70 transition"
            @click="scrollRecentVideosLeft"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button 
            class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 p-2 rounded-l-lg text-white hover:bg-black/70 transition"
            @click="scrollRecentVideosRight"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Container com scroll horizontal -->
          <div 
            ref="recentVideosContainer"
            class="flex flex-col sm:flex-row overflow-y-auto sm:overflow-x-auto pb-4 scrollbar-hide gap-4 scroll-smooth"
            style="-ms-overflow-style: none; scrollbar-width: none;"
          >
            <div 
              v-for="video in recentVideos" 
              :key="video.id" 
              class="relative group cursor-pointer w-full sm:flex-none sm:w-[calc(20%-16px)] sm:min-w-[200px]"
              @click="openVideoModal(video)"
            >
              <div class="relative overflow-hidden rounded-xl">
                <!-- Usa a imagem do vídeo ou uma imagem padrão se não houver -->
                <div class="w-full h-40 bg-center bg-no-repeat bg-cover transition duration-200 group-hover:scale-105"
                  :style="{ backgroundImage: `url(${video.url_img || '@/assets/movies/movie1.jpg'})` }"
                  :aria-label="video.titulo || 'Vídeo sem título'"
                ></div>
                
                <!-- Badge de novidade -->
                <div class="absolute top-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Novo
                </div>
                
                <!-- Data de adição -->
                <div class="absolute top-2 left-2 text-white text-xs">
                  {{ formatDate(video.created_at) }}
                </div>
                
                <!-- Título do vídeo -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                  <h3 class="text-white text-sm font-medium">{{ video.titulo || 'Sem título' }}</h3>
                </div>
              </div>
              
              <!-- Sem overlay no hover, apenas o cursor pointer já indica que é clicável -->
            </div>
          </div>
        </div>
      </section>

    </main>

    <footer class="bg-[#141414] text-[#808080] py-8 px-12">
      <div class="max-w-6xl mx-auto">
        <div class="flex space-x-4 mb-4">
          <a href="#" class="hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href="#" class="hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z"/></svg>
          </a>
          <a href="#" class="hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg>
          </a>
          <a href="#" class="hover:text-white">
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>
        
        <div class="grid grid-cols-4 gap-8 mb-8">
          <div>
            <a href="#" class="block mb-2 text-sm hover:text-white">Audiodescrição</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Relações com investidores</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Avisos legais</a>
          </div>
          <div>
            <a href="#" class="block mb-2 text-sm hover:text-white">Central de Ajuda</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Carreiras</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Preferências de cookies</a>
          </div>
          <div>
            <a href="#" class="block mb-2 text-sm hover:text-white">Cartão pré-pago</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Termos de Uso</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Informações corporativas</a>
          </div>
          <div>
            <a href="#" class="block mb-2 text-sm hover:text-white">Imprensa</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Privacidade</a>
            <a href="#" class="block mb-2 text-sm hover:text-white">Entre em contato</a>
          </div>
        </div>
      </div>
    </footer>
    </template>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeMount } from 'vue';
import HeroBanner from '@/components/HeroBanner.vue';
import ContentRow from '@/components/ContentRow.vue';
import LoginScreen from '@/components/LoginScreen.vue';
import CustomVideoPlayer from '@/components/CustomVideoPlayer.vue';
import MobileAppPromo from '@/components/MobileAppPromo.vue';
import SkeletonLoader from '@/components/SkeletonLoader.vue';
import { registerVideoView } from '@/services/videosAssistidosService';
import { initAuth, isAuthenticated, authLoading, currentUser, logout } from '@/services/authService';
import { getUserProfilePhoto, getUserName } from '@/services/userProfileService';
import { getRecentVideos } from '@/services/recentVideosService';

// Detectar se é um dispositivo móvel
const isMobileDevice = ref(false);

// Variável para forçar a exibição da versão web mesmo em dispositivos móveis
const forceWebVersion = ref(false);

// Variável para controlar a exibição da versão mobile ou desktop do Top 10
const isMobileView = ref(false);

// Variável para controlar a exibição do menu mobile
const mobileMenuOpen = ref(false);

// Função para mostrar a versão web quando o usuário clicar no botão "Acessar versão web"
function showWebVersion() {
  forceWebVersion.value = true;
  // Salva a preferência do usuário no localStorage para manter entre sessões
  localStorage.setItem('netgospelKids_forceWebVersion', 'true');
}

// Função para alternar a exibição do menu mobile
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value;
}

// Função para fechar o menu mobile
function closeMobileMenu() {
  mobileMenuOpen.value = false;
}

// Função para verificar se é um dispositivo móvel
function checkIfMobile() {
  // Verificação mais precisa de dispositivos móveis usando uma combinação de técnicas
  
  // 1. Verifica o user agent para dispositivos móveis comuns
  const userAgent = navigator.userAgent.toLowerCase();
  const mobileRegex = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i;
  const tabletRegex = /ipad|android(?!.*mobile)/i;
  
  // 2. Verifica a largura da tela (dispositivos com menos de 480px são quase certamente móveis)
  const isMobileWidth = window.innerWidth <= 480;
  
  // 3. Verifica se o dispositivo suporta eventos de toque (característica de dispositivos móveis)
  const hasTouchSupport = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  // Combina os critérios para uma detecção mais precisa
  // - É definitivamente móvel se o user agent indicar E tiver suporte a toque
  // - OU se a tela for muito estreita (< 480px)
  isMobileDevice.value = (mobileRegex.test(userAgent) && hasTouchSupport) || 
                          isMobileWidth || 
                          (tabletRegex.test(userAgent) && window.innerWidth < 768);
  
  // Atualiza a variável isMobileView para controlar a exibição da versão mobile ou desktop do Top 10
  // Considera mobile view para telas com menos de 640px de largura
  isMobileView.value = window.innerWidth < 640;
}

// Verificar se é um dispositivo móvel antes de montar o componente
onBeforeMount(() => {
  checkIfMobile();
});

// Também verificar quando a janela for redimensionada e carregar preferências do usuário
onMounted(() => {
  // Adiciona listener para redimensionamento
  window.addEventListener('resize', checkIfMobile);
  
  // Verifica se o usuário já optou por ver a versão web em dispositivos móveis
  const savedPreference = localStorage.getItem('netgospelKids_forceWebVersion');
  if (savedPreference === 'true') {
    forceWebVersion.value = true;
  }
});

// Dados do perfil do usuário
const userProfilePhoto = ref('@/assets/avatar.png');
const userName = ref('');

// Inicializa a autenticação ao montar o componente
onMounted(() => {
  initAuth();
  loadUserProfilePhoto();
  loadUserName();
  loadRecentVideos();
});

// Carrega a foto de perfil do usuário
async function loadUserProfilePhoto() {
  try {
    if (isAuthenticated.value) {
      userProfilePhoto.value = await getUserProfilePhoto('@/assets/avatar.png');
    }
  } catch (error) {
    console.error('Erro ao carregar foto de perfil:', error);
  }
}

// Carrega o nome do usuário
async function loadUserName() {
  try {
    if (isAuthenticated.value) {
      userName.value = await getUserName();
    }
  } catch (error) {
    console.error('Erro ao carregar nome do usuário:', error);
  }
}

// Função para lidar com o login bem-sucedido
async function handleLoginSuccess() {
  console.log('Login bem-sucedido!');
  await loadUserProfilePhoto();
  await loadUserName();
}

// Dados para a seção de Histórias Bíblicas
import { onMounted as onMountedVideos } from 'vue';
import { getVideoDevocionalByCategoria } from '@/services/videoDevocionalService';
import { getFilmes } from '@/services/filmesService';
import { getTop10Videos } from '@/services/top10Service';

const biblicalVideos = ref<VideoDevocional[]>([]);
const loadingVideos = ref(true);

// Variáveis para o modal de vídeo
const selectedVideo = ref<VideoDevocional | null>(null);
const showVideoModal = ref(false);

// Referência para os containers de scroll
const scrollContainer = ref<HTMLElement | null>(null);
const continueWatchingContainer = ref<HTMLElement | null>(null);
const filmesContainer = ref<HTMLElement | null>(null);
const top10Container = ref<HTMLElement | null>(null);
const mobileTop10Container = ref<HTMLElement | null>(null);
const musicasContainer = ref<HTMLElement | null>(null);
const recentVideosContainer = ref<HTMLElement | null>(null);

// Funções para controlar o scroll horizontal na seção de vídeos bíblicos
function scrollLeft() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollRight() {
  if (scrollContainer.value) {
    scrollContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

// Funções para controlar o scroll horizontal na seção de continuar assistindo
function scrollContinueWatchingLeft() {
  if (continueWatchingContainer.value) {
    continueWatchingContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollContinueWatchingRight() {
  if (continueWatchingContainer.value) {
    continueWatchingContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

// Funções para controlar o scroll horizontal na seção de filmes
function scrollFilmesLeft() {
  if (filmesContainer.value) {
    filmesContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollFilmesRight() {
  if (filmesContainer.value) {
    filmesContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

// Funções para controlar o scroll horizontal na seção de músicas
function scrollMusicasLeft() {
  if (musicasContainer.value) {
    musicasContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollMusicasRight() {
  if (musicasContainer.value) {
    musicasContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

// Funções para controlar o scroll horizontal na seção de vídeos recentes
function scrollRecentVideosLeft() {
  if (recentVideosContainer.value) {
    recentVideosContainer.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollRecentVideosRight() {
  if (recentVideosContainer.value) {
    recentVideosContainer.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

// Funções para controlar o scroll horizontal na seção de Top 10
function scrollTop10Left() {
  if (top10Container.value) {
    top10Container.value.scrollBy({ left: -400, behavior: 'smooth' });
  }
}

function scrollTop10Right() {
  if (top10Container.value) {
    top10Container.value.scrollBy({ left: 400, behavior: 'smooth' });
  }
}

// Funções para controlar o scroll horizontal na versão mobile do Top 10
function scrollMobileTop10Left() {
  if (mobileTop10Container.value) {
    mobileTop10Container.value.scrollBy({ left: -200, behavior: 'smooth' });
  }
}

function scrollMobileTop10Right() {
  if (mobileTop10Container.value) {
    mobileTop10Container.value.scrollBy({ left: 200, behavior: 'smooth' });
  }
}

// Busca os vídeos devocionais da categoria BÍBLICA
onMountedVideos(async () => {
  try {
    biblicalVideos.value = await getVideoDevocionalByCategoria('BÍBLICA', 10);
    
    // Se não houver vídeos, usa os dados de fallback
    if (biblicalVideos.value.length === 0) {
      biblicalVideos.value = fallbackVideos as unknown as VideoDevocional[];
    }
  } catch (error) {
    console.error('Erro ao carregar vídeos bíblicos:', error);
    // Em caso de erro, usa os dados de fallback
    biblicalVideos.value = fallbackVideos as unknown as VideoDevocional[];
  } finally {
    loadingVideos.value = false;
  }
});

// Função para abrir o modal de vídeo
async function openVideoModal(video: VideoDevocional) {
  // Cria uma cópia do vídeo para não modificar o original
  const videoWithFullUrl = { ...video };
  
  // Constrói a URL completa do vídeo combinando a base fixa com o campo url da tabela
  if (video.url) {
    videoWithFullUrl.url = `https://vz-f2dd6111-853.b-cdn.net/${video.url}/play_720p.mp4`;
    console.log('URL do vídeo completa:', videoWithFullUrl.url);
  }
  
  selectedVideo.value = videoWithFullUrl;
  showVideoModal.value = true;
  
  // Incrementa o contador de visualizações
  if (video.id) {
    // Incrementa o contador na tabela video_devocional
    import('@/services/videoDevocionalService').then(({ incrementVideoView }) => {
      incrementVideoView(video.id);
    });
    
    // Registra a visualização na tabela videos_assistidos
    import('@/services/videosAssistidosService').then(({ registerVideoView }) => {
      registerVideoView(video.id).then((success: boolean) => {
        if (success) {
          // Atualiza a lista de "Continuar Assistindo" após registrar a visualização
          // Pequeno atraso para garantir que o banco de dados processou a inserção
          setTimeout(() => {
            loadContinueWatchingVideos();
          }, 500);
        }
      });
    });
  }
}

// Função para fechar o modal de vídeo
function closeVideoModal() {
  showVideoModal.value = false;
  
  // Atualiza a lista de "Continuar Assistindo" ao fechar o modal
  loadContinueWatchingVideos();
}

// Função para converter URLs para formato de embed
function getEmbedUrl(url: string | null): string {
  if (!url) return '';
  
  // Converte URLs do YouTube para formato de embed
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

// Dados de fallback caso não haja vídeos na tabela
const fallbackVideos = [
  { 
    titulo: 'Arca de Noé',
    url_img: '@/assets/movies/movie1.jpg',
    id: 1
  },
  { 
    titulo: 'Davi e Golias',
    url_img: '@/assets/movies/movie2.jpg',
    id: 2
  },
  { 
    titulo: 'Daniel na Cova dos Leões',
    url_img: '@/assets/movies/movie3.jpg',
    id: 3
  },
  { 
    titulo: 'Jonas e a Baleia',
    url_img: '@/assets/movies/movie4.jpg',
    id: 4
  },
  { 
    titulo: 'Moisés e o Mar Vermelho',
    url_img: '@/assets/movies/movie5.jpg',
    id: 5
  },
  { 
    titulo: 'José do Egito',
    url_img: '@/assets/movies/movie6.jpg',
    id: 6
  }
];

// Dados para a seção de Continuar Assistindo
import { getContinuarAssistindo } from '@/services/continuarAssistindoService';
import { getVideoProgress } from '@/services/videoProgressService';

const continueWatchingVideos = ref<ContinuarAssistindo[]>([]);
const loadingContinueWatching = ref(true);
const videoProgressCache = ref<Record<number, number>>({});

// Função para carregar os vídeos da seção "Continuar Assistindo"
async function loadContinueWatchingVideos() {
  loadingContinueWatching.value = true;
  
  try {
    continueWatchingVideos.value = await getContinuarAssistindo();
    
    // Carrega o progresso de cada vídeo
    for (const video of continueWatchingVideos.value) {
      if (video.video_id) {
        const progress = await getVideoProgress(String(video.video_id));
        videoProgressCache.value[video.video_id] = progress;
      }
    }
  } catch (error) {
    console.error('Erro ao carregar vídeos para continuar assistindo:', error);
  } finally {
    loadingContinueWatching.value = false;
  }
}

// Carrega os vídeos ao montar o componente
onMountedVideos(loadContinueWatchingVideos);

// Função para obter a porcentagem de progresso de um vídeo
function getVideoProgressPercentage(videoId: number): number {
  return videoProgressCache.value[videoId] || 0;
}

// Função para abrir o modal de vídeo para continuar assistindo
async function openContinueWatchingVideo(video: ContinuarAssistindo) {
  // Cria uma cópia do vídeo para não modificar o original
  const videoWithFullUrl = { 
    ...video,
    id: video.video_id // Mapeia video_id para id para compatibilidade
  };
  
  // Constrói a URL completa do vídeo combinando a base fixa com o campo url da tabela
  if (video.url) {
    videoWithFullUrl.url = `https://vz-f2dd6111-853.b-cdn.net/${video.url}/play_720p.mp4`;
    console.log('URL do vídeo completa (continuar assistindo):', videoWithFullUrl.url);
  }
  
  selectedVideo.value = videoWithFullUrl;
  showVideoModal.value = true;
  
  // Incrementa o contador de visualizações
  if (video.video_id) {
    // Incrementa o contador na tabela video_devocional
    import('@/services/videoDevocionalService').then(({ incrementVideoView }) => {
      incrementVideoView(video.video_id);
    });
    
    // Registra a visualização na tabela videos_assistidos
    import('@/services/videosAssistidosService').then(({ registerVideoView }) => {
      registerVideoView(video.video_id).then((success: boolean) => {
        if (success) {
          // Atualiza a lista de "Continuar Assistindo" após registrar a visualização
          // Pequeno atraso para garantir que o banco de dados processou a inserção
          setTimeout(() => {
            loadContinueWatchingVideos();
          }, 500);
        }
      });
    });
  }
}

// Dados para a seção de Filmes
const filmes = ref<VideoDevocional[]>([]);
const loadingFilmes = ref(true);

// Função para carregar os filmes
async function loadFilmes() {
  loadingFilmes.value = true;
  
  try {
    filmes.value = await getFilmes();
  } catch (error) {
    console.error('Erro ao carregar filmes:', error);
  } finally {
    loadingFilmes.value = false;
  }
}

// Carrega os filmes ao montar o componente
onMountedVideos(loadFilmes);

// Dados para a seção de Top 10
const top10Videos = ref<VideoDevocional[]>([]);
const loadingTop10 = ref(true);

// Dados para a seção de Músicas
const musicas = ref<VideoDevocional[]>([]);
const loadingMusicas = ref(true);

// Dados para a seção de Vídeos Recentes
const recentVideos = ref<VideoDevocional[]>([]);
const loadingRecentVideos = ref(true);

// Função para carregar os vídeos do Top 10
async function loadTop10Videos() {
  loadingTop10.value = true;
  
  try {
    top10Videos.value = await getTop10Videos();
  } catch (error) {
    console.error('Erro ao carregar Top 10 vídeos:', error);
  } finally {
    loadingTop10.value = false;
  }
}

// Função para carregar as músicas
async function loadMusicas() {
  loadingMusicas.value = true;
  
  try {
    musicas.value = await getVideoDevocionalByCategoria('MÚSICA');
  } catch (error) {
    console.error('Erro ao carregar músicas:', error);
  } finally {
    loadingMusicas.value = false;
  }
}

// Função para carregar os vídeos recentes
async function loadRecentVideos() {
  loadingRecentVideos.value = true;
  
  try {
    recentVideos.value = await getRecentVideos();
  } catch (error) {
    console.error('Erro ao carregar vídeos recentes:', error);
  } finally {
    loadingRecentVideos.value = false;
  }
}

// Verifica se um vídeo é novo (criado nos últimos 7 dias)
function isNewVideo(video: VideoDevocional): boolean {
  if (!video.created_at) return false;
  
  const videoDate = new Date(video.created_at);
  const now = new Date();
  const sevenDaysAgo = new Date(now.setDate(now.getDate() - 7));
  
  return videoDate >= sevenDaysAgo;
}

// Formata a data para exibição
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// Função para lidar com erros de carregamento de imagens
function handleImageError(event: Event, item: any) {
  const img = event.target as HTMLImageElement;
  console.log(`Erro ao carregar imagem: ${img.src}`);
  
  // Se o item tiver uma URL de imagem, tenta recarregá-la com um timestamp
  if (item?.url_img) {
    const timestamp = new Date().getTime();
    const newSrc = item.url_img.includes('?') 
      ? `${item.url_img}&_t=${timestamp}` 
      : `${item.url_img}?_t=${timestamp}`;
    
    console.log(`Tentando recarregar com nova URL: ${newSrc}`);
    img.src = newSrc;
  }
}

// Carrega os vídeos do Top 10 ao montar o componente
onMountedVideos(loadTop10Videos);

// Dados para a seção de Histórias Bíblicas
const biblicalStories = [
  { image: '@/assets/banners/bible1.jpg', title: 'Arca de Noé' },
  { image: '@/assets/banners/bible2.jpg', title: 'Davi e Golias' },
  { image: '@/assets/banners/bible3.jpg', title: 'Daniel na Cova dos Leões' },
  { image: '@/assets/banners/bible4.jpg', title: 'Jonas e a Baleia' },
  { image: '@/assets/banners/bible5.jpg', title: 'Moisés e o Mar Vermelho' },
  { image: '@/assets/banners/bible6.jpg', title: 'José do Egito' }
];
</script>

<style>
/* Esconde a scrollbar */
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

.scrollbar-hide {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>