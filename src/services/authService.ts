import { ref } from 'vue';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

// Estado global para o usuário autenticado
export const currentUser = ref<User | null>(null);
export const isAuthenticated = ref(false);
export const authLoading = ref(true);

// Inicializa o estado de autenticação verificando a sessão atual
export async function initAuth() {
  try {
    // Verifica se há uma sessão ativa
    const { data } = await supabase.auth.getSession();
    
    if (data.session) {
      currentUser.value = data.session.user;
      isAuthenticated.value = true;
    } else {
      currentUser.value = null;
      isAuthenticated.value = false;
    }
  } catch (error) {
    console.error('Erro ao inicializar autenticação:', error);
    currentUser.value = null;
    isAuthenticated.value = false;
  } finally {
    authLoading.value = false;
  }
  
  // Configura listener para mudanças de autenticação
  supabase.auth.onAuthStateChange((event, session) => {
    if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
      currentUser.value = session.user;
      isAuthenticated.value = true;
    } else if (event === 'SIGNED_OUT') {
      currentUser.value = null;
      isAuthenticated.value = false;
    }
  });
}

// Função para fazer login
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  if (error) throw error;
  
  return data;
}

// Função para fazer logout
export async function logout() {
  const { error } = await supabase.auth.signOut();
  
  if (error) throw error;
  
  currentUser.value = null;
  isAuthenticated.value = false;
}

// Função para criar conta
export async function signUp(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password
  });
  
  if (error) throw error;
  
  return data;
}
