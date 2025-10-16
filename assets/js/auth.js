/**
 * Sistema de autenticação mockado para Terreiro Tia Maria
 * Simula backend de login sem servidor real
 */

// Estado global da autenticação
let authState = {
  isLoggedIn: false,
  user: null,
  users: [
    {
      id: 1,
      name: 'Usuário Exemplo',
      email: 'usuario@exemplo.com',
      role: 'membro'
    }
  ]
};

// Função para simular delay de requisição
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Função para simular login
async function login(email, password) {
  // Simula delay de rede
  await delay(1000);

  // Mock: aceita qualquer e-mail/senha válidos
  if (email && password && password.length >= 6) {
    const user = {
      id: 1,
      name: 'Usuário Exemplo',
      email: email,
      role: 'membro'
    };

    authState.isLoggedIn = true;
    authState.user = user;

    // Salva no localStorage
    localStorage.setItem('auth', JSON.stringify(authState));

    return { success: true, user: user };
  } else {
    return { success: false, error: 'Credenciais inválidas' };
  }
}

// Função para logout
function logout() {
  authState.isLoggedIn = false;
  authState.user = null;

  // Remove do localStorage
  localStorage.removeItem('auth');

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

  // Verifica se há sessão salva
  const savedAuth = localStorage.getItem('auth');
  if (savedAuth) {
    try {
      const parsedAuth = JSON.parse(savedAuth);
      if (parsedAuth && parsedAuth.isLoggedIn && parsedAuth.user) {
        authState = parsedAuth;
        console.log('Sessão carregada:', authState);
      } else {
        console.log('Sessão inválida, removendo...');
        localStorage.removeItem('auth');
      }
    } catch (e) {
      console.error('Erro ao carregar sessão:', e);
      localStorage.removeItem('auth');
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

