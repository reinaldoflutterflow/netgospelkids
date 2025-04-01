import { supabase } from '../lib/supabase';
import type { VideoDevocional } from './videoDevocionalService';

/**
 * Busca os 10 vídeos mais recentes da tabela video_devocional
 * @returns Promise com a lista dos 10 vídeos mais recentes
 */
export async function getRecentVideos(): Promise<VideoDevocional[]> {
  try {
    const { data, error } = await supabase
      .from('video_devocional')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar vídeos recentes:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar vídeos recentes:', error);
    return [];
  }
}
