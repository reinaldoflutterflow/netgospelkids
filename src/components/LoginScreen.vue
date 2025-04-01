<template>
  <div 
    class="fixed inset-0 flex items-center justify-center z-50"
    style="background-image: url('https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/hqnxutn5qgup/16x9_A_warm_and_cozy_living_room_fill.png'); background-size: cover; background-position: center;"
  >
    <!-- Overlay escuro para melhorar a legibilidade -->
    <div class="absolute inset-0 bg-black/60"></div>
    
    <div 
      class="relative w-full max-w-md mx-auto overflow-hidden rounded-lg shadow-xl z-10"
    >
      <div class="p-8 bg-black/80">
        <div class="flex justify-center mb-8">
          <img 
            src="https://storage.googleapis.com/flutterflow-io-6f20.appspot.com/projects/alanaland-9pr07u/assets/jvucoskivscc/logolimpa.png" 
            alt="NetGospel Kids Logo" 
            class="h-16"
          />
        </div>

        <h2 class="text-2xl font-bold text-white mb-6 text-center">Entrar</h2>
        
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <input 
              v-model="email" 
              type="email" 
              placeholder="Email ou número de celular" 
              class="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <input 
              v-model="password" 
              type="password" 
              placeholder="Senha" 
              class="w-full px-4 py-3 bg-gray-700/80 border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div v-if="errorMessage" class="text-red-500 text-sm">
            {{ errorMessage }}
          </div>
          
          <button 
            type="submit" 
            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-200"
            :disabled="loading"
          >
            {{ loading ? 'Entrando...' : 'Entrar' }}
          </button>
          
          <div class="flex items-center justify-between">
            <div class="flex items-center">
              <input 
                id="remember" 
                type="checkbox" 
                v-model="rememberMe"
                class="w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
              />
              <label for="remember" class="ml-2 text-sm text-gray-300">Lembre-se de mim</label>
            </div>
            
            <a href="#" class="text-sm text-gray-300 hover:underline">Esqueceu a senha?</a>
          </div>
        </form>
        
        <!-- Seção de botão alternativo removida -->
        
        <div class="mt-8 text-sm text-gray-400">
          <p>Primeira vez aqui? <a href="#" class="text-white hover:underline">Assine agora</a>.</p>
          <p class="mt-2">
            Esta página é protegida pelo Google reCAPTCHA para garantir que você não é um robô.
            <a href="#" class="text-blue-400 hover:underline">Saiba mais</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { supabase } from '../lib/supabase';

const email = ref('');
const password = ref('');
const rememberMe = ref(false);
const loading = ref(false);
const errorMessage = ref('');

// Verifica se há email salvo no localStorage ao montar o componente
onMounted(() => {
  const savedEmail = localStorage.getItem('netgospelkids_email');
  if (savedEmail) {
    email.value = savedEmail;
    rememberMe.value = true;
  }
});

const emit = defineEmits(['login-success']);

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor, preencha todos os campos';
    return;
  }
  
  loading.value = true;
  errorMessage.value = '';
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value
    });
    
    if (error) throw error;
    
    // Salva o email no localStorage se a opção "Lembre-se de mim" estiver marcada
    if (rememberMe.value) {
      localStorage.setItem('netgospelkids_email', email.value);
    } else {
      localStorage.removeItem('netgospelkids_email');
    }
    
    // Login bem-sucedido
    emit('login-success', data.user);
  } catch (error) {
    console.error('Erro de login:', error);
    errorMessage.value = error instanceof Error 
      ? error.message 
      : 'Ocorreu um erro ao fazer login. Verifique suas credenciais.';
  } finally {
    loading.value = false;
  }
}

// Função para usar uma conta de teste
async function useTestAccount() {
  email.value = 'teste@netgospelkids.com';
  password.value = 'teste123';
  await handleLogin();
}
</script>
