import type { Directive, DirectiveBinding } from 'vue';

// Número máximo de tentativas de recarregamento
const MAX_RETRIES = 3;

// Tempo entre as tentativas (em milissegundos)
const RETRY_DELAY = 1000;

// Armazena o número de tentativas para cada imagem
const retryMap = new Map<HTMLImageElement, number>();

/**
 * Diretiva para tentar recarregar imagens quebradas
 */
export const vImageRetry: Directive = {
  mounted(el: HTMLImageElement, binding: DirectiveBinding) {
    // Configurações padrão
    const defaultSrc = binding.value?.defaultSrc || '';
    const maxRetries = binding.value?.maxRetries || MAX_RETRIES;
    const retryDelay = binding.value?.retryDelay || RETRY_DELAY;
    
    // Salva a URL original da imagem
    const originalSrc = el.src;
    
    // Função para lidar com erros de carregamento
    const handleError = () => {
      const retryCount = retryMap.get(el) || 0;
      
      if (retryCount < maxRetries) {
        // Incrementa o contador de tentativas
        retryMap.set(el, retryCount + 1);
        
        // Aguarda um pouco antes de tentar novamente
        setTimeout(() => {
          console.log(`Tentando recarregar imagem (${retryCount + 1}/${maxRetries}): ${originalSrc}`);
          
          // Força o navegador a recarregar a imagem adicionando um timestamp
          const timestamp = new Date().getTime();
          el.src = originalSrc.includes('?') 
            ? `${originalSrc}&_retry=${timestamp}` 
            : `${originalSrc}?_retry=${timestamp}`;
        }, retryDelay);
      } else if (defaultSrc) {
        // Se excedeu o número máximo de tentativas e temos uma imagem padrão, usamos ela
        console.log(`Falha ao carregar imagem após ${maxRetries} tentativas. Usando imagem padrão.`);
        el.src = defaultSrc;
      }
    };
    
    // Adiciona o listener de erro
    el.addEventListener('error', handleError);
  },
  
  beforeUnmount(el: HTMLImageElement) {
    // Remove a entrada do mapa quando o elemento é desmontado
    retryMap.delete(el);
  }
};
