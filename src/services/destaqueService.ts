import { supabase } from '../lib/supabase';

export interface Destaque {
  id: number;
  created_at: string;
  capa: string | null;
  titulo: string | null;
  url_video: string | null;
  descricao: string | null;
}

export async function getDestaque(): Promise<Destaque | null> {
  try {
    // Busca o destaque mais recente
    const { data, error } = await supabase
      .from('destaque')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Erro ao buscar destaque:', error);
      return null;
    }

    // Retorna o primeiro item se existir
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Erro ao buscar destaque:', error);
    return null;
  }
}

export async function getAllDestaques(): Promise<Destaque[]> {
  try {
    const { data, error } = await supabase
      .from('destaque')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar destaques:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Erro ao buscar destaques:', error);
    return [];
  }
}
