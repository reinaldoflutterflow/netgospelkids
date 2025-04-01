import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: number;
  created_at: string;
  email: string | null;
  plano: string | null;
  status: boolean | null;
  senha: string | null;
  urlPhoto: string | null;
  perfilAtualizado: boolean | null;
  username: string | null;
  nome: string | null;
  sobrenome: string | null;
  uuid: string | null;
  token: string | null;
  kids: boolean | null;
}

/**
 * Busca os dados do perfil do usuário logado na tabela assinante_Eduzz
 * @returns Promise com os dados do perfil do usuário
 */
export async function getUserProfile(): Promise<UserProfile | null> {
  try {
    // Obtém o usuário atual
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('Nenhum usuário autenticado');
      return null;
    }

    // Busca o perfil do usuário na tabela assinante_Eduzz
    const { data, error } = await supabase
      .from('assinante_Eduzz')
      .select('*')
      .eq('uuid', user.id)
      .single();

    if (error) {
      console.error('Erro ao buscar perfil do usuário:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Erro ao buscar perfil do usuário:', error);
    return null;
  }
}

/**
 * Obtém a URL da foto de perfil do usuário logado
 * @param defaultImage URL da imagem padrão caso o usuário não tenha foto
 * @returns Promise com a URL da foto de perfil
 */
export async function getUserProfilePhoto(defaultImage: string = '/src/assets/avatar.png'): Promise<string> {
  try {
    const profile = await getUserProfile();
    
    if (profile && profile.urlPhoto) {
      return profile.urlPhoto;
    }
    
    return defaultImage;
  } catch (error) {
    console.error('Erro ao buscar foto de perfil:', error);
    return defaultImage;
  }
}

/**
 * Obtém o nome do usuário logado
 * @param defaultName Nome padrão caso o usuário não tenha nome cadastrado
 * @returns Promise com o nome do usuário
 */
export async function getUserName(defaultName: string = ''): Promise<string> {
  try {
    const profile = await getUserProfile();
    
    if (profile) {
      // Verifica se existe nome cadastrado
      if (profile.nome) {
        // Se tiver sobrenome, retorna nome + sobrenome
        if (profile.sobrenome) {
          return `${profile.nome} ${profile.sobrenome}`;
        }
        // Se não tiver sobrenome, retorna apenas o nome
        return profile.nome;
      }
      
      // Se não tiver nome, usa o username se disponível
      if (profile.username) {
        return profile.username;
      }
      
      // Se não tiver username, usa o email sem o domínio
      if (profile.email) {
        return profile.email.split('@')[0];
      }
    }
    
    return defaultName;
  } catch (error) {
    console.error('Erro ao buscar nome do usuário:', error);
    return defaultName;
  }
}
