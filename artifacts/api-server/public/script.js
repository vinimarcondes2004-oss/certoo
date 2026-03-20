const API = '/api';

function aplicarConteudo(data) {
  if (!data) return;

  const tituloEl = document.getElementById('titulo');
  const descEl = document.getElementById('descricao');
  const botaoEl = document.getElementById('botao');
  const imgEl = document.getElementById('imagem');

  if (tituloEl) {
    tituloEl.textContent = data.titulo || '';
    tituloEl.classList.remove('flash');
    void tituloEl.offsetWidth;
    tituloEl.classList.add('flash');
  }

  if (descEl) {
    descEl.textContent = data.descricao || '';
    descEl.classList.remove('flash');
    void descEl.offsetWidth;
    descEl.classList.add('flash');
  }

  if (botaoEl) {
    botaoEl.textContent = data.botao || 'Saiba Mais';
  }

  if (imgEl && data.imagem) {
    imgEl.src = data.imagem;
    imgEl.onload = () => imgEl.classList.add('loaded');
    imgEl.onerror = () => imgEl.classList.remove('loaded');
    if (data.imagem.startsWith('http')) {
      imgEl.classList.add('loaded');
    }
  }
}

async function carregarConteudo() {
  try {
    const res = await fetch(`${API}/content`);
    if (!res.ok) throw new Error('Falha ao carregar conteúdo');
    const data = await res.json();
    aplicarConteudo(data);
  } catch (e) {
    console.error('Erro ao carregar conteúdo:', e);
    const tituloEl = document.getElementById('titulo');
    if (tituloEl) tituloEl.textContent = 'Erro ao carregar conteúdo';
  }
}

function conectarSocket() {
  const dot = document.getElementById('dot');
  const statusText = document.getElementById('status-text');

  const socket = io({ path: '/api/socket.io' });

  socket.on('connect', () => {
    if (dot) dot.classList.add('connected');
    if (statusText) statusText.textContent = 'Conectado — atualizações em tempo real ativas';
    console.log('[Socket.io] Conectado:', socket.id);
  });

  socket.on('disconnect', () => {
    if (dot) dot.classList.remove('connected');
    if (statusText) statusText.textContent = 'Desconectado — tentando reconectar...';
    console.log('[Socket.io] Desconectado');
  });

  socket.on('content-updated', (data) => {
    console.log('[Socket.io] Conteúdo atualizado em tempo real:', data);
    aplicarConteudo(data);
  });

  return socket;
}

carregarConteudo();
conectarSocket();
