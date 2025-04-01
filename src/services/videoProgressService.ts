import { supabase } from '../lib/supabase';

export interface VideoProgress {
  video_id: string;
  position: number;
  updated_at: string;
  uuid: string;
}

/**
 * Obtém o progresso de um vídeo para o usuário atual
 * @param videoId ID do vídeo
 * @returns Posição em segundos ou 0 se não houver progresso
 */
export async function getVideoProgress(videoId: string): Promise<number> {
  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error('Usuário não está autenticado', userError);
      return 0;
    }

    const userId = userData.user.id;
    console.log('Buscando progresso para vídeo:', videoId, 'usuário:', userId);

    const { data, error } = await supabase
      .from('video_progress')
      .select('position')
      .eq('video_id', videoId)
      .eq('uuid', userId)
      .maybeSingle();

    if (error) {
      console.error('Erro ao buscar progresso do vídeo:', error);
      return 0;
    }

    console.log('Dados de progresso recuperados:', data);
    return data?.position || 0;
  } catch (error) {
    console.error('Erro ao buscar progresso do vídeo:', error);
    return 0;
  }
}

/**
 * Salva o progresso de um vídeo para o usuário atual
 * @param videoId ID do vídeo
 * @param position Posição em segundos
 * @param duration Duração total do vídeo em segundos
 */
export async function saveVideoProgress(
  videoId: string,
  position: number,
  duration: number
): Promise<void> {
  try {
    // Não salva se a posição for inválida ou muito próxima do final
    if (position <= 0 || (duration > 0 && position >= duration - 10)) {
      console.log('Posição inválida ou próxima do final, não salvando:', position, '/', duration);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      console.error('Usuário não está autenticado', userError);
      return;
    }

    const userId = userData.user.id;
    console.log('Salvando progresso para vídeo:', videoId, 'usuário:', userId, 'posição:', Math.floor(position));

    // Verifica se já existe um registro para este vídeo e usuário
    const { data: existingData } = await supabase
      .from('video_progress')
      .select('id')
      .eq('video_id', videoId)
      .eq('uuid', userId)
      .maybeSingle();

    let result;
    if (existingData?.id) {
      // Atualiza o registro existente
      console.log('Atualizando registro existente ID:', existingData.id);
      result = await supabase
        .from('video_progress')
        .update({
          position: Math.floor(position),
          updated_at: new Date().toISOString()
        })
        .eq('id', existingData.id);
    } else {
      // Insere um novo registro
      console.log('Inserindo novo registro de progresso');
      result = await supabase
        .from('video_progress')
        .insert({
          video_id: videoId,
          position: Math.floor(position),
          updated_at: new Date().toISOString(),
          uuid: userId
        });
    }

    if (result.error) {
      console.error('Erro ao salvar progresso do vídeo:', result.error);
    } else {
      console.log(`Progresso salvo com sucesso: ${position}s para o vídeo ${videoId}`);
    }
  } catch (error) {
    console.error('Erro ao salvar progresso do vídeo:', error);
  }
}
