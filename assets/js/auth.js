/**
 * Sistema de autenticação para Terreiro Tia Maria
 * Integra com o backend FastAPI para validar credenciais reais
 */

const API_BASE_URL =
  window.__TIA_MARIA_API_BASE__ ||
  (document.documentElement?.dataset?.apiBase || '').trim() ||
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : window.location.origin.replace(/\/$/, ''));

const SESSION_STORAGE_KEY = 'tia-maria-auth';
const TOKEN_STORAGE_KEY = 'tia-maria-token';

function buildApiUrl(path) {
  const base = API_BASE_URL.replace(/\/$/, '');
  if (!path.startsWith('/')) {
    return `${base}/${path}`;
  }
  return `${base}${path}`;
}

// Estado global da autenticação
let authState = {
  isLoggedIn: false,
  user: null,
  token: null,
  users: [
    {
      id: 1,
      name: 'Usuário Exemplo',
      email: 'usuario@exemplo.com',
      role: 'membro'
    }
  ]
};

function persistLegacyState() {
  localStorage.setItem('auth', JSON.stringify(authState));
}

// Função de login integrada ao backend
async function login(email, password) {
  if (!email || !password) {
    return { success: false, error: 'Informe e-mail e senha' };
  }

  const endpoint = buildApiUrl('/auth/login');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha: password })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data?.detail || 'Credenciais inválidas');
    }

    const user = {
      id: null,
      name: data?.nome || 'Usuário',
      email: data?.email || email,
      role: data?.tipo || 'membro'
    };

    const sessionPayload = {
      token: data.token,
      nome: data?.nome || user.name,
      email: user.email,
      tipo: user.role
    };

    authState.isLoggedIn = true;
    authState.user = user;
    authState.token = data.token;

    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionPayload));
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    persistLegacyState();

    return { success: true, user };
  } catch (error) {
    console.error('Falha ao autenticar usuário', error);
    let message = 'Não foi possível entrar. Tente novamente.';
    if (error instanceof Error) {
      message = error.message;
      if (/Failed to fetch/i.test(message)) {
        message = 'Não foi possível conectar ao servidor. Verifique sua conexão.';
      }
    }
    return {
      success: false,
      error: message
    };
  }
}

// Função para logout
function logout() {
  authState.isLoggedIn = false;
  authState.user = null;
  authState.token = null;

  // Remove do localStorage
  localStorage.removeItem('auth');
  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(TOKEN_STORAGE_KEY);

  // Atualiza interface
  updateAuthUI();
}

// Função para verificar se está logado
function isLoggedIn() {
  return authState.isLoggedIn;
}

// Função para obter usuário atual
function getCurrentUser() {
  return authState.user;
}

// Função para atualizar interface baseada no estado de auth
function updateAuthUI() {
  const loginButton = document.getElementById('login-button');
  const profileButton = document.getElementById('profile-button');
  const profileDropdown = document.getElementById('profile-dropdown');
  const userName = document.getElementById('user-name');
  const userNameDropdown = document.getElementById('user-name-dropdown');
  const userEmailDropdown = document.getElementById('user-email-dropdown');
  // Floating FAB elements
  const userFab = document.getElementById('user-fab');
  const userFabName = document.getElementById('user-fab-name');
  const userFabEmail = document.getElementById('user-fab-email');

  console.log('Estado de auth:', authState);

  if (authState.isLoggedIn && authState.user) {
    console.log('Usuário logado - escondendo botão Entrar');

    // Esconde botão de login completamente
    if (loginButton) {
      loginButton.classList.add('hidden');
      loginButton.style.display = 'none';
    }

    // Mostra área de perfil
    if (profileButton) {
      profileButton.classList.remove('hidden');
      profileButton.style.display = 'flex';
    }

    // Atualiza informações do usuário
    if (userName) userName.textContent = authState.user.name;
    if (userNameDropdown) userNameDropdown.textContent = authState.user.name;
    if (userEmailDropdown) userEmailDropdown.textContent = authState.user.email;

    // Prefer floating menu instead of header button
    if (profileButton) {
      profileButton.classList.add('hidden');
      profileButton.style.display = 'none';
    }
    if (userFab) {
      userFab.classList.remove('hidden');
      userFab.setAttribute('aria-expanded', 'false');
    }
    if (userFabName) userFabName.textContent = authState.user.name;
    if (userFabEmail) userFabEmail.textContent = authState.user.email;

  } else {
    console.log('Usuário deslogado - mostrando botão Entrar');

    // Mostra botão de login
    if (loginButton) {
      loginButton.classList.remove('hidden');
      loginButton.style.display = 'inline-flex';
    }

    // Esconde área de perfil
    if (profileButton) {
      profileButton.classList.add('hidden');
      profileButton.style.display = 'none';
    }

    // Esconde dropdown
    if (profileDropdown) {
      profileDropdown.classList.add('hidden');
    }

    // Hide floating menu
    if (userFab) {
      userFab.classList.add('hidden');
      userFab.classList.remove('open');
    }
  }
}

// Função para inicializar autenticação
function initAuth() {
  console.log('Inicializando autenticação...');

  // Limpa qualquer estado inconsistente
  const elements = ['login-button', 'profile-button', 'profile-dropdown', 'user-fab'];
  elements.forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.classList.add('hidden');
    }
  });

  // Verifica se há sessão salva (preferência pelo formato integrado ao backend)
  const savedSession = localStorage.getItem(SESSION_STORAGE_KEY);
  if (savedSession) {
    try {
      const parsedSession = JSON.parse(savedSession);
      if (parsedSession && parsedSession.token && parsedSession.email) {
        authState.isLoggedIn = true;
        authState.token = parsedSession.token;
        authState.user = {
          id: null,
          name: parsedSession.nome || 'Usuário',
          email: parsedSession.email,
          role: parsedSession.tipo || 'membro'
        };
        persistLegacyState();
        console.log('Sessão carregada (API):', authState);
      } else {
        console.log('Sessão inválida, removendo...');
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    } catch (error) {
      console.error('Erro ao carregar sessão:', error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } else {
    const legacyAuth = localStorage.getItem('auth');
    if (legacyAuth) {
      try {
        const parsedAuth = JSON.parse(legacyAuth);
        if (parsedAuth && parsedAuth.isLoggedIn && parsedAuth.user) {
          authState.isLoggedIn = parsedAuth.isLoggedIn;
          authState.user = parsedAuth.user;
          authState.token = parsedAuth.token || null;
          console.log('Sessão carregada (legacy):', authState);
          // Sincroniza com novo formato, se houver token
          if (authState.token && authState.user?.email) {
            localStorage.setItem(
              SESSION_STORAGE_KEY,
              JSON.stringify({
                token: authState.token,
                nome: authState.user.name,
                email: authState.user.email,
                tipo: authState.user.role
              })
            );
          }
        } else {
          console.log('Sessão legada inválida, removendo...');
          localStorage.removeItem('auth');
        }
      } catch (error) {
        console.error('Erro ao carregar sessão legada:', error);
        localStorage.removeItem('auth');
      }
    }
  }

  // Força atualização da interface após inicialização
  setTimeout(() => {
    updateAuthUI();
  }, 50);

  // Event listeners
  setupAuthEventListeners();
}

// Função para configurar event listeners
function setupAuthEventListeners() {
  // Botão de abrir modal de login
  const loginButton = document.getElementById('login-button');
  const loginModal = document.getElementById('login-modal');
  const modernLoginCard = loginModal ? loginModal.querySelector('.login-card') : null;

  if (loginButton && loginModal) {
    loginButton.addEventListener('click', () => {
      loginModal.classList.remove('hidden');
      const emailEl = (modernLoginCard && modernLoginCard.querySelector('#login-email')) || document.getElementById('login-email');
      if (emailEl) emailEl.focus();
    });
  }

  // Botões de fechar modal
  const closeModalButtons = document.querySelectorAll('#close-login-modal');
  if (closeModalButtons.length && loginModal) {
    closeModalButtons.forEach(btn => btn.addEventListener('click', () => {
      loginModal.classList.add('hidden');
    }));
  }

  // Fechar modal ao clicar fora
  if (loginModal) {
    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) {
        loginModal.classList.add('hidden');
      }
    });
  }

  // Formulário de login
  const loginForm = (modernLoginCard && modernLoginCard.querySelector('#login-form')) || document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const emailEl = loginForm.querySelector('#login-email');
      const passwordEl = loginForm.querySelector('#login-password');
      const submitButton = loginForm.querySelector('#login-submit');
      const errorMessage = loginForm.querySelector('#login-error');

      const email = emailEl ? emailEl.value : '';
      const password = passwordEl ? passwordEl.value : '';

      // Mostra loading
      submitButton.disabled = true;
      submitButton.textContent = 'Entrando...';
      if (errorMessage) errorMessage.classList.add('hidden');

      try {
        const result = await login(email, password);

        if (result.success) {
          // Fecha modal e atualiza interface
          loginModal.classList.add('hidden');

          // Força atualização da interface
          setTimeout(() => {
            updateAuthUI();
          }, 100);

          // Limpa formulário
          loginForm.reset();
        } else {
          // Mostra erro
          if (errorMessage) {
            errorMessage.textContent = result.error;
            errorMessage.classList.remove('hidden');
          }
        }
      } catch (error) {
        if (errorMessage) {
          errorMessage.textContent = 'Erro interno. Tente novamente.';
          errorMessage.classList.remove('hidden');
        }
      } finally {
        // Remove loading
        submitButton.disabled = false;
        submitButton.textContent = 'Entrar';
      }
    });
  }

  // Botão de perfil (toggle dropdown)
  const profileButton = document.getElementById('profile-button');
  const profileDropdown = document.getElementById('profile-dropdown');

  if (profileButton && profileDropdown) {
    profileButton.addEventListener('click', (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle('hidden');
    });

    // Fecha dropdown ao clicar fora
    document.addEventListener('click', () => {
      profileDropdown.classList.add('hidden');
    });
  }

  // Botão de logout
  const logoutButton = document.getElementById('logout-button');
  if (logoutButton) {
    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      if (profileDropdown) profileDropdown.classList.add('hidden');
    });
  }

  // Logout buttons inside floating menu
  document.querySelectorAll('[data-logout]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      logout();
      const fab = document.getElementById('user-fab');
      const panel = document.getElementById('user-fab-panel');
      if (fab && panel) {
        fab.classList.remove('open');
        panel.classList.add('hidden');
        fab.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Botão X de fechar dropdown
  const closeDropdownButtons = document.querySelectorAll('.close-profile-dropdown');
  closeDropdownButtons.forEach(button => {
    button.addEventListener('click', () => {
      if (profileDropdown) profileDropdown.classList.add('hidden');
    });
  });

  // Toggle de visibilidade da senha no modal moderno
  const togglePassword = document.getElementById('toggle-password');
  const pwdInput = document.getElementById('login-password');
  const loginCard = document.querySelector('#login-modal .login-card');
  if (togglePassword && pwdInput) {
    togglePassword.addEventListener('click', () => {
      const showing = pwdInput.getAttribute('type') === 'password';
      pwdInput.setAttribute('type', showing ? 'text' : 'password');
      if (loginCard) loginCard.classList.toggle('showing-password', showing);
    });
  }

  // Floating User Menu (FAB)
  const fab = document.getElementById('user-fab');
  const fabToggle = document.getElementById('user-fab-toggle');
  const fabPanel = document.getElementById('user-fab-panel');
  if (fab && fabToggle && fabPanel) {
    fabToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !fab.classList.contains('open');
      fab.classList.toggle('open', willOpen);
      fabPanel.classList.toggle('hidden', !willOpen);
      fab.setAttribute('aria-expanded', String(willOpen));
    });

    // Fecha ao clicar fora
    document.addEventListener('click', (e) => {
      if (!fab.contains(e.target)) {
        fab.classList.remove('open');
        fabPanel.classList.add('hidden');
        fab.setAttribute('aria-expanded', 'false');
      }
    });

    // Fecha ao clicar em qualquer item
    fabPanel.querySelectorAll('.fab-item').forEach((el) => {
      el.addEventListener('click', () => {
        fab.classList.remove('open');
        fabPanel.classList.add('hidden');
        fab.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

// Inicializa quando DOM estiver carregado
document.addEventListener('DOMContentLoaded', initAuth);

