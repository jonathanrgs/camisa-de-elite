// Configurações globais do site Camisa de Elite

export const CONFIG = {
  // Informações da loja
  storeName: 'Camisa de Elite',
  storeSlogan: 'Vista sua paixão',
  
  // WhatsApp (número com código do país, sem símbolos)
  whatsapp: {
    number: '5534996769091',
    formatted: '(34) 99676-9091'
  },
  
  // E-mail de contato
  email: {
    contact: 'contato@camisadeelite.com',
    privacy: 'privacidade@camisadeelite.com'
  },
  
  // Horário de atendimento
  businessHours: 'Seg-Sex 9h às 18h',
  
  // Redes sociais (adicione conforme necessário)
  social: {
    instagram: 'https://www.instagram.com/camisadeelite/',
    facebook: '',
    tiktok: ''
  },
  
  // Imagem fallback (Camisa do Brasil)
  fallbackImage: 'https://http2.mlstatic.com/D_NQ_NP_935818-MLA72578168113_112023-O.webp'
};

// Função helper para gerar link do WhatsApp
export function getWhatsAppLink(message = '') {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${CONFIG.whatsapp.number}${message ? `?text=${encodedMessage}` : ''}`;
}
