import { supabase } from '../lib/supabase';
import { VideoDevocional } from './videoDevocionalService';

/**
 * Busca os vídeos da categoria "Filme" da tabela video_devocional
 * @param limit Número máximo de registros a serem retornados (padrão: 10)
 */
export async function getFilmes(limit: number = 20): Promise<VideoDevocional[]> {
  try {
    // Primeiro, vamos verificar se existem registros com categoria 'Filme'
    const { data: filmeData, error: filmeError } = await supabase
      .from('video_devocional')
      .select('*')
      .eq('categoria', 'Filme')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (filmeError) {
      console.error('Erro ao buscar filmes com categoria Filme:', filmeError);
      return [];
    }

    console.log('Filmes encontrados (categoria=Filme):', filmeData?.length || 0);
    
    // Se não encontrou filmes com categoria 'Filme', vamos tentar com 'filme' (minúsculo)
    if (!filmeData || filmeData.length === 0) {
      const { data: filmeMinusculoData, error: filmeMinusculoError } = await supabase
        .from('video_devocional')
        .select('*')
        .eq('categoria', 'filme')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filmeMinusculoError) {
        console.error('Erro ao buscar filmes com categoria filme (minúsculo):', filmeMinusculoError);
        return [];
      }

      console.log('Filmes encontrados (categoria=filme):', filmeMinusculoData?.length || 0);
      
      // Se encontrou com 'filme' minúsculo, retorna esses resultados
      if (filmeMinusculoData && filmeMinusculoData.length > 0) {
        return filmeMinusculoData;
      }
      
      // Última tentativa: buscar por filmes onde o campo 'filme' é true
      const { data: filmeBooleanData, error: filmeBooleanError } = await supabase
        .from('video_devocional')
        .select('*')
        .eq('filme', true)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (filmeBooleanError) {
        console.error('Erro ao buscar filmes com filme=true:', filmeBooleanError);
        return [];
      }

      console.log('Filmes encontrados (filme=true):', filmeBooleanData?.length || 0);
      return filmeBooleanData || [];
    }
    
    // Retorna os filmes encontrados com categoria 'Filme'
    return filmeData;
  } catch (error) {
    console.error('Erro ao buscar filmes:', error);
    return [];
  }
}
