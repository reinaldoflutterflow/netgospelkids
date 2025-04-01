import { supabase } from '../lib/supabase';

export interface VideoDevocional {
  id: number;
  created_at: string;
  titulo: string | null;
  descricao: string | null;
  url: string | null;
  url_img: string | null;
  categoria: string | null;
  view: number | null;
  unic_id: number;
  filme: boolean | null;
}

/**
 * Busca os últimos 10 vídeos devocionais da categoria especificada
 * @param categoria Categoria dos vídeos a serem buscados
 * @param limit Número máximo de registros a serem retornados (padrão: 10)
 */
export async function getVideoDevocionalByCategoria(categoria: string, limit: number = 10): Promise<VideoDevocional[]> {
  try {
    const { data, error } = await supabase
      .from('video_devocional')
      .select('*')
      .eq('categoria', categoria)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar vídeos devocionais:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar vídeos devocionais:', error);
    return [];
  }
}

/**
 * Incrementa o contador de visualizações de um vídeo devocional
 * @param id ID do vídeo devocional
 */
export async function incrementVideoView(id: number): Promise<void> {
  try {
    // Primeiro, obtém o valor atual de visualizações
    const { data: video, error: getError } = await supabase
      .from('video_devocional')
      .select('view')
      .eq('id', id)
      .single();

    if (getError) {
      console.error('Erro ao buscar vídeo para incrementar visualizações:', getError);
      return;
    }

    const currentViews = video?.view || 0;
    
    // Incrementa o contador de visualizações
    const { error: updateError } = await supabase
      .from('video_devocional')
      .update({ view: currentViews + 1 })
      .eq('id', id);

    if (updateError) {
      console.error('Erro ao incrementar visualizações:', updateError);
    }
  } catch (error) {
    console.error('Erro ao incrementar visualizações:', error);
  }
}
