/**
 * Configuração de imagens
 * Permite usar URLs externas quando as imagens locais não existem
 * 
 * Adicione aqui as URLs externas reais das imagens que não estão no projeto local.
 * Formato: '/assets/nome-arquivo.webp': 'https://url-externa-real.com/imagem.webp'
 */

// Mapeamento de imagens locais para URLs externas (quando necessário)
// Adicione as URLs externas reais aqui quando tiver
export const externalImageUrls: Record<string, string> = {
  // Exemplo (remova e adicione as URLs reais):
  // '/assets/crszRH9X.webp': 'https://sua-url-real-aqui.com/imagem.webp',
};

/**
 * Retorna a URL da imagem
 * Prioriza a imagem local, mas permite usar URL externa se configurada
 * @param localPath Caminho local da imagem (ex: '/assets/image.webp')
 * @returns URL da imagem (local ou externa se configurada)
 */
export const getImageUrl = (localPath: string): string => {
  // Retorna o caminho local primeiro (o navegador tentará carregar)
  // Se a imagem local não existir, você pode adicionar a URL externa no objeto externalImageUrls acima
  return localPath;
};

/**
 * Retorna a URL externa de fallback se a imagem local falhar
 * @param localPath Caminho local da imagem
 * @returns URL externa se configurada, ou null
 */
export const getExternalImageUrl = (localPath: string): string | null => {
  return externalImageUrls[localPath] || null;
};

