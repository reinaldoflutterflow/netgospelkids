import { supabase } from '../lib/supabase';

export interface ContinuarAssistindo {
  video_id: number;
  video_created_at: string;
  titulo: string | null;
  descricao: string | null;
  url: string | null;
  url_img: string | null;
  categoria: string | null;
  view: number | null;
  unic_id: number;
  uuid: string;
}

/**
 * Busca os últimos vídeos que o usuário começou a assistir
 * @param limit Número máximo de registros a serem retornados (padrão: 10)
 */
export async function getContinuarAssistindo(limit: number = 10): Promise<ContinuarAssistindo[]> {
  try {
    const { data, error } = await supabase
      .from('continuar_assistindo')
      .select('*')
      .limit(limit);

    if (error) {
      console.error('Erro ao buscar vídeos para continuar assistindo:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar vídeos para continuar assistindo:', error);
    return [];
  }
}
