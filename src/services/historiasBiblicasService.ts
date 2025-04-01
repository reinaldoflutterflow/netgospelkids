import { supabase } from '../lib/supabase';
import type { VideoDevocional } from './videoDevocionalService';

/**
 * Busca todas as histórias bíblicas (vídeos onde filme = false)
 * @returns Promise com a lista de histórias bíblicas
 */
export async function getAllHistoriasBiblicas(): Promise<VideoDevocional[]> {
  try {
    const { data, error } = await supabase
      .from('video_devocional')
      .select('*')
      .eq('filme', false)
      .order('titulo');

    if (error) {
      console.error('Erro ao buscar histórias bíblicas:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar histórias bíblicas:', error);
    return [];
  }
}
