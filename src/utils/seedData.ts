import { supabase } from '../lib/supabase';

// Função para inserir um registro de exemplo na tabela destaque
export async function insertExampleDestaque() {
  const { data, error } = await supabase
    .from('destaque')
    .insert([
      {
        capa: 'https://i.imgur.com/JR8D3J2.jpg', // Imagem de exemplo
        titulo: 'Superlivro: A Arca de Noé',
        url_video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', // Substitua por um vídeo real
        descricao: 'Acompanhe as aventuras de Chris, Joy e Gizmo enquanto viajam no tempo para vivenciar a história da Arca de Noé de uma maneira divertida e educativa.'
      }
    ])
    .select();

  if (error) {
    console.error('Erro ao inserir dados de exemplo:', error);
    return null;
  }

  return data;
}

// Execute esta função no console do navegador para inserir dados de exemplo:
// import { insertExampleDestaque } from './utils/seedData';
// insertExampleDestaque().then(data => console.log('Dados inseridos:', data));
