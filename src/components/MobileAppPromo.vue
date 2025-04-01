<template>
  <div class="mobile-app-promo" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="content">
      <div class="logo">
        <img src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/jvucoskivscc/logolimpa.png" alt="NetGospel Kids" />
      </div>
      
      <div class="message">
        <h1>Assista à NetGospel Kids no seu smartphone ou tablet</h1>
      </div>
      
      <div class="app-buttons">
        <a href="https://apps.apple.com/br/app/netgospel-kids/id6741534598" target="_blank" class="app-button ios-button">
          <div class="button-content">
            <span class="icon">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M16.5 3C14.76 3 13.09 4.03 12 5.5C10.91 4.03 9.24 3 7.5 3C4.42 3 2 5.42 2 8.5C2 12.28 5.4 15.36 10.55 20.04L12 21.35L13.45 20.03C18.6 15.36 22 12.28 22 8.5C22 5.42 19.58 3 16.5 3ZM12.1 18.55L12 18.65L11.9 18.55C7.14 14.24 4 11.39 4 8.5C4 6.5 5.5 5 7.5 5C9.04 5 10.54 5.99 11.07 7.36H12.94C13.46 5.99 14.96 5 16.5 5C18.5 5 20 6.5 20 8.5C20 11.39 16.86 14.24 12.1 18.55Z" />
              </svg>
            </span>
            <span class="text">
              <small>Baixar na</small>
              <strong>App Store</strong>
            </span>
          </div>
        </a>
        
        <div class="app-button android-button coming-soon">
          <div class="button-content">
            <span class="icon">
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.523 15.3414C17.523 16.0004 16.9104 16.5272 16.1486 16.5272H8.30955C7.54778 16.5272 6.93518 16.0004 6.93518 15.3414V8.67116C6.93518 8.01219 7.54778 7.4854 8.30955 7.4854H16.1486C16.9104 7.4854 17.523 8.01219 17.523 8.67116V15.3414Z" />
                <path d="M5.76634 7.48782V15.3477C5.76634 15.5643 5.77941 15.7242 5.77941 15.9408C5.77941 17.1237 4.95052 18.1174 3.88129 18.1174C2.81206 18.1174 1.9701 17.1237 1.9701 15.9408C1.9701 14.7579 2.81206 13.7642 3.88129 13.7642C4.06355 13.7642 4.25888 13.7908 4.44114 13.8441V9.00116C4.44114 8.7846 4.61032 8.61542 4.82688 8.61542C5.04344 8.61542 5.21262 8.7846 5.21262 9.00116V9.6734C5.21262 9.6734 5.76634 7.48782 5.76634 7.48782Z" />
                <path d="M22.0299 15.9408C22.0299 17.1237 21.1879 18.1174 20.1187 18.1174C19.0495 18.1174 18.2075 17.1237 18.2075 15.9408C18.2075 15.7242 18.2206 15.5643 18.2206 15.3477V7.48782C18.2206 7.48782 18.7743 9.6734 18.7743 9.6734V9.00116C18.7743 8.7846 18.9435 8.61542 19.16 8.61542C19.3766 8.61542 19.5458 8.7846 19.5458 9.00116V13.8441C19.728 13.7908 19.9234 13.7642 20.1056 13.7642C21.1879 13.7642 22.0299 14.7579 22.0299 15.9408Z" />
              </svg>
            </span>
            <span class="text">
              <small>Em breve na</small>
              <strong>Google Play</strong>
            </span>
          </div>
        </div>
      </div>
      
      <div class="account-management">
        <button @click="accessWebVersion" class="account-button">Acessar versão web</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

// Define os eventos que o componente pode emitir
const emit = defineEmits(['access-web-version']);

const backgroundImage = ref('https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/hqnxutn5qgup/16x9_A_warm_and_cozy_living_room_fill.png');

// Função para acessar a versão web
function accessWebVersion() {
  // Emite o evento para o componente pai
  emit('access-web-version');
}
</script>

<style scoped>
.mobile-app-promo {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  color: white;
  text-align: center;
  z-index: 9999;
}

.mobile-app-promo::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: -1;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  width: 100%;
  gap: 2rem;
}

.logo {
  margin-bottom: 1rem;
}

.logo img {
  width: 180px;
  height: auto;
}

.message h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  line-height: 1.3;
}

.app-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  max-width: 300px;
}

.app-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.button-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon {
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon svg {
  width: 24px;
  height: 24px;
}

.text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.2;
}

.text small {
  font-size: 0.7rem;
  opacity: 0.9;
}

.text strong {
  font-size: 1.1rem;
}

.ios-button {
  background-color: white;
  color: black;
}

.ios-button:hover {
  background-color: #f2f2f2;
}

.android-button {
  background-color: white;
  color: black;
}

.android-button:hover {
  background-color: #f2f2f2;
}

.coming-soon {
  opacity: 0.7;
  position: relative;
}

.coming-soon::after {
  content: 'Em breve';
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #e50914;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: bold;
}

.account-management {
  margin-top: 1.5rem;
}

.account-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
}

.account-button:hover {
  background-color: rgba(255, 255, 255, 0.3);
}
</style>
