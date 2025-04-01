import { supabase } from '../lib/supabase';

/**
 * Registra a visualização de um vídeo na tabela videos_assistidos
 * @param videoId ID do vídeo na tabela video_devocional
 * @returns Promise<boolean> Indica se o registro foi bem-sucedido
 */
export async function registerVideoView(videoId: number): Promise<boolean> {
  try {
    // Obtém o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Usuário não autenticado');
      return false;
    }
    
    // Insere um novo registro na tabela videos_assistidos
    const { error } = await supabase
      .from('videos_assistidos')
      .insert([
        { 
          video_id: videoId,
          uuid: user.id
        }
      ]);
    
    if (error) {
      console.error('Erro ao registrar visualização de vídeo:', error);
      return false;
    }
    
    console.log('Visualização de vídeo registrada com sucesso para o vídeo ID:', videoId);
    return true;
  } catch (error) {
    console.error('Erro ao registrar visualização de vídeo:', error);
    return false;
  }
}
