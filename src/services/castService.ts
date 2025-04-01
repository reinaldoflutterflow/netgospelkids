/**
 * Serviço para gerenciar a transmissão para dispositivos externos (Smart TVs)
 * Utiliza a API de Presentation para descobrir e se conectar a displays secundários
 */

// Definindo o tipo PresentationConnection que não está disponível por padrão
interface PresentationConnection {
  id: string;
  state: string;
  send: (data: string) => void;
  close: () => void;
  terminate?: () => void; // Adicionando o método terminate como opcional
}

// Interface para gerenciar o estado da conexão
interface CastState {
  available: boolean;
  connected: boolean;
  deviceName: string | null;
  connection: PresentationConnection | null;
}

// Estado global da conexão
const castState: CastState = {
  available: false,
  connected: false,
  deviceName: null,
  connection: null
};

/**
 * Inicializa o serviço de transmissão
 */
export function initCastService(): void {
  // Verifica se a API de Presentation está disponível
  if ('PresentationRequest' in window) {
    castState.available = true;
    console.log('API de transmissão disponível');
  } else {
    console.warn('API de transmissão não disponível neste navegador');
  }
}

/**
 * Verifica se há dispositivos disponíveis para transmissão
 * @returns Promise<boolean> - True se há dispositivos disponíveis
 */
export async function checkAvailableDevices(): Promise<boolean> {
  if (!castState.available) return false;
  
  try {
    // Cria uma solicitação de apresentação usando a URL atual
    const currentUrl = window.location.origin;
    const presentationRequest = new (window as any).PresentationRequest([
      `${currentUrl}/receiver.html`
    ]);
    
    console.log('URL de verificação:', `${currentUrl}/receiver.html`);
    
    // Verifica se há displays disponíveis
    const availability = await presentationRequest.getAvailability();
    return availability.value;
  } catch (error) {
    console.error('Erro ao verificar dispositivos disponíveis:', error);
    return false;
  }
}

/**
 * Inicia a transmissão para um dispositivo
 * @param videoUrl URL do vídeo a ser transmitido
 * @param currentTime Tempo atual do vídeo em segundos
 * @param title Título do vídeo
 * @returns Promise<boolean> - True se a conexão foi estabelecida com sucesso
 */
export async function startCasting(
  videoUrl: string,
  currentTime: number = 0,
  title: string = ''
): Promise<boolean> {
  if (!castState.available) {
    console.warn('API de transmissão não disponível');
    return false;
  }
  
  try {
    // Verifica se a URL do vídeo é válida e absoluta
    let fullVideoUrl = videoUrl;
    
    // Verifica se a URL contém protocolos especiais como bunny.net
    if (videoUrl.includes('bunny.net') || videoUrl.includes('bunnycdn.com')) {
      console.log('Detectada URL do Bunny CDN:', videoUrl);
      // Garante que a URL use HTTPS
      if (videoUrl.startsWith('http:')) {
        fullVideoUrl = videoUrl.replace('http:', 'https:');
      }
      
      // Verifica se a URL contém parâmetros de segurança
      if (!fullVideoUrl.includes('token=') && !fullVideoUrl.includes('signature=')) {
        console.log('Adicionando parâmetros de segurança para Bunny.net');
        // Adiciona parâmetros que podem ajudar com CORS e segurança
        const separator = fullVideoUrl.includes('?') ? '&' : '?';
        fullVideoUrl = `${fullVideoUrl}${separator}alloworigin=true&cors=true`;
      }
    } 
    // Verifica se é uma URL relativa
    else if (!videoUrl.startsWith('http://') && !videoUrl.startsWith('https://')) {
      // Se for relativa, converte para absoluta usando a origem atual
      const currentOrigin = window.location.origin;
      fullVideoUrl = `${currentOrigin}${videoUrl.startsWith('/') ? '' : '/'}${videoUrl}`;
      console.log('URL relativa convertida para absoluta:', fullVideoUrl);
    }
    
    // Tenta validar a URL
    try {
      new URL(fullVideoUrl);
      console.log('URL válida para transmissão:', fullVideoUrl);
    } catch (e) {
      console.error('URL inválida, tentando usar como está:', fullVideoUrl);
    }
    
    // Cria uma URL para o receptor com os parâmetros do vídeo
    // Usa a URL atual (servidor local) em vez de uma URL externa
    const currentUrl = window.location.origin;
    const receiverUrl = new URL(`${currentUrl}/receiver.html`);
    
    // Codifica a URL do vídeo para evitar problemas com caracteres especiais
    receiverUrl.searchParams.append('videoUrl', encodeURIComponent(fullVideoUrl));
    receiverUrl.searchParams.append('currentTime', currentTime.toString());
    receiverUrl.searchParams.append('title', title);
    
    // Adiciona informações de debug
    receiverUrl.searchParams.append('source', encodeURIComponent(window.location.href));
    receiverUrl.searchParams.append('timestamp', Date.now().toString());
    
    console.log('URL do receptor:', receiverUrl.toString());
    
    // Cria uma solicitação de apresentação
    const presentationRequest = new (window as any).PresentationRequest([
      receiverUrl.toString()
    ]);
    
    // Solicita ao usuário que selecione um dispositivo
    const connection = await presentationRequest.start();
    
    // Armazena a conexão
    castState.connection = connection;
    castState.connected = true;
    castState.deviceName = connection.receiver?.friendlyName || 'Dispositivo externo';
    
    // Configura os listeners de eventos
    setupConnectionListeners(connection);
    
    console.log(`Conectado a ${castState.deviceName}`);
    return true;
  } catch (error) {
    console.error('Erro ao iniciar transmissão:', error);
    return false;
  }
}

/**
 * Configura os listeners de eventos para a conexão
 * @param connection Conexão de apresentação
 */
function setupConnectionListeners(connection: any): void {
  // Evento disparado quando a conexão é fechada
  connection.onclose = () => {
    console.log('Conexão fechada');
    castState.connected = false;
    castState.deviceName = null;
    castState.connection = null;
  };
  
  // Evento disparado quando a conexão é encerrada
  connection.onterminate = () => {
    console.log('Conexão terminada');
    castState.connected = false;
    castState.deviceName = null;
    castState.connection = null;
  };
  
  // Evento disparado quando uma mensagem é recebida
  connection.onmessage = (event: MessageEvent) => {
    console.log('Mensagem recebida:', event.data);
    // Aqui você pode implementar lógica para lidar com mensagens do receptor
  };
}

/**
 * Envia um comando para o dispositivo conectado
 * @param command Comando a ser enviado
 * @param data Dados adicionais
 * @returns boolean - True se o comando foi enviado com sucesso
 */
export function sendCommand(command: string, data: any = {}): boolean {
  if (!castState.connected || !castState.connection) {
    console.warn('Nenhum dispositivo conectado');
    return false;
  }
  
  try {
    const message = JSON.stringify({
      command,
      data
    });
    
    castState.connection.send(message);
    return true;
  } catch (error) {
    console.error('Erro ao enviar comando:', error);
    return false;
  }
}

/**
 * Controla a reprodução no dispositivo conectado
 * @param action Ação a ser executada (play, pause, seek)
 * @param value Valor adicional (tempo em segundos para seek)
 * @returns boolean - True se o comando foi enviado com sucesso
 */
export function controlPlayback(action: 'play' | 'pause' | 'seek', value?: number): boolean {
  return sendCommand('playback', { action, value });
}

/**
 * Encerra a conexão com o dispositivo
 * @returns boolean - True se a conexão foi encerrada com sucesso
 */
export function stopCasting(): boolean {
  if (!castState.connected || !castState.connection) {
    console.warn('Nenhum dispositivo conectado');
    return false;
  }
  
  try {
    // Usando o método close em vez de terminate
    if (castState.connection.terminate) {
      castState.connection.terminate();
    } else {
      castState.connection.close();
    }
    return true;
  } catch (error) {
    console.error('Erro ao encerrar transmissão:', error);
    return false;
  }
}

/**
 * Verifica se há uma conexão ativa
 * @returns boolean - True se há uma conexão ativa
 */
export function isConnected(): boolean {
  return castState.connected;
}

/**
 * Obtém o nome do dispositivo conectado
 * @returns string | null - Nome do dispositivo ou null se não houver conexão
 */
export function getConnectedDeviceName(): string | null {
  return castState.deviceName;
}

/**
 * Verifica se a API de transmissão está disponível
 * @returns boolean - True se a API está disponível
 */
export function isCastAvailable(): boolean {
  return castState.available;
}
