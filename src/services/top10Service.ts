import { supabase } from '../lib/supabase';
import { VideoDevocional } from './videoDevocionalService';

/**
 * Busca os 10 vídeos mais vistos da tabela video_devocional
 * @returns Promise com array de VideoDevocional ordenados por número de visualizações
 */
export async function getTop10Videos(): Promise<VideoDevocional[]> {
  try {
    const { data, error } = await supabase
      .from('video_devocional')
      .select('*')
      .order('view', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Erro ao buscar top 10 vídeos:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar top 10 vídeos:', error);
    return [];
  }
}
