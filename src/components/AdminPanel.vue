<template>
  <div class="fixed bottom-4 right-4 z-50">
    <button 
      @click="showPanel = !showPanel" 
      class="bg-gray-800 text-white p-2 rounded-full shadow-lg hover:bg-gray-700"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    </button>

    <div v-if="showPanel" class="fixed bottom-16 right-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-xl w-96">
      <h3 class="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Painel Administrativo</h3>
      
      <div class="mb-4">
        <button 
          @click="insertTestData" 
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          :disabled="loading"
        >
          {{ loading ? 'Inserindo...' : 'Inserir Dados de Teste' }}
        </button>
      </div>

      <div v-if="message" :class="[
        'p-3 rounded mb-4', 
        success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        {{ message }}
      </div>

      <div class="border-t pt-4 mt-4">
        <h4 class="font-medium mb-2 text-gray-800 dark:text-white">Formulário de Destaque</h4>
        <form @submit.prevent="saveDestaque" class="space-y-3">
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Título</label>
            <input 
              v-model="form.titulo" 
              type="text" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL da Imagem</label>
            <input 
              v-model="form.capa" 
              type="url" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">URL do Vídeo</label>
            <input 
              v-model="form.url_video" 
              type="url" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Descrição</label>
            <textarea 
              v-model="form.descricao" 
              rows="3" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            ></textarea>
          </div>
          
          <button 
            type="submit" 
            class="w-full bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            :disabled="formLoading"
          >
            {{ formLoading ? 'Salvando...' : 'Salvar Destaque' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { insertExampleDestaque } from '../utils/seedData';
import { supabase } from '../lib/supabase';

const showPanel = ref(false);
const loading = ref(false);
const formLoading = ref(false);
const message = ref('');
const success = ref(false);

const form = ref({
  titulo: '',
  capa: '',
  url_video: '',
  descricao: ''
});

async function insertTestData() {
  loading.value = true;
  message.value = '';
  
  try {
    const result = await insertExampleDestaque();
    if (result) {
      message.value = 'Dados de teste inseridos com sucesso!';
      success.value = true;
      // Recarrega a página para mostrar os novos dados
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      message.value = 'Erro ao inserir dados de teste.';
      success.value = false;
    }
  } catch (error) {
    console.error('Erro:', error);
    message.value = `Erro: ${error instanceof Error ? error.message : 'Desconhecido'}`;
    success.value = false;
  } finally {
    loading.value = false;
  }
}

async function saveDestaque() {
  formLoading.value = true;
  message.value = '';
  
  try {
    const { data, error } = await supabase
      .from('destaque')
      .insert([{
        titulo: form.value.titulo,
        capa: form.value.capa,
        url_video: form.value.url_video,
        descricao: form.value.descricao
      }])
      .select();
      
    if (error) throw error;
    
    message.value = 'Destaque salvo com sucesso!';
    success.value = true;
    
    // Limpa o formulário
    form.value = {
      titulo: '',
      capa: '',
      url_video: '',
      descricao: ''
    };
    
    // Recarrega a página para mostrar os novos dados
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (error) {
    console.error('Erro ao salvar destaque:', error);
    message.value = `Erro ao salvar: ${error instanceof Error ? error.message : 'Desconhecido'}`;
    success.value = false;
  } finally {
    formLoading.value = false;
  }
}
</script>
