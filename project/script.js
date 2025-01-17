document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const form = document.getElementById('authForm');
  const formTitle = document.getElementById('formTitle');
  const toggleFormBtn = document.getElementById('toggleForm');
  const togglePasswordBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('password');
  const themeToggle = document.getElementById('themeToggle');
  const messageContainer = document.getElementById('messageContainer');
  const emailField = document.getElementById('email');

  // Estado inicial
  let isLogin = true;
  let showPassword = false;
  
  // Carregar tema salvo
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);

  // Alternar entre login e registro
  function toggleForm() {
    isLogin = !isLogin;
    form.setAttribute('data-form-mode', isLogin ? 'login' : 'register');
    formTitle.textContent = isLogin ? 'Bem-vindo de volta' : 'Criar conta';
    toggleFormBtn.textContent = isLogin
      ? 'Não tem uma conta? Cadastre-se'
      : 'Já tem uma conta? Entre';
    emailField.required = !isLogin;
    clearMessage();
    form.reset();
  }

  // Alternar visibilidade da senha
  function togglePasswordVisibility() {
    showPassword = !showPassword;
    passwordInput.type = showPassword ? 'text' : 'password';
    togglePasswordBtn.setAttribute('data-show-password', showPassword);
  }

  // Alternar tema claro/escuro
  function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }

  // Exibir mensagem
  function showMessage(text, type) {
    messageContainer.innerHTML = `
      <div class="message ${type}">
        ${text}
      </div>
    `;
  }

  // Limpar mensagem
  function clearMessage() {
    messageContainer.innerHTML = '';
  }

  // Manipular envio do formulário
  function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(form);
    const username = formData.get('username');
    const password = formData.get('password');
    const email = formData.get('email');

    // Validação básica
    if (!username || !password || (!isLogin && !email)) {
      showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }

    if (isLogin) {
      // Verificar login
      const userData = localStorage.getItem(username);
      if (userData && JSON.parse(userData).password === password) {
        showMessage('Login realizado com sucesso!', 'success');
      } else {
        showMessage('Usuário ou senha inválidos.', 'error');
      }
    } else {
      // Registro
      if (localStorage.getItem(username)) {
        showMessage('Este nome de usuário já está em uso.', 'error');
        return;
      }

      localStorage.setItem(username, JSON.stringify({ username, email, password }));
      showMessage('Conta criada com sucesso!', 'success');
      
      // Voltar para o login após registro bem-sucedido
      setTimeout(() => {
        toggleForm();
      }, 1500);
    }
  }

  // Event Listeners
  form.addEventListener('submit', handleSubmit);
  toggleFormBtn.addEventListener('click', toggleForm);
  togglePasswordBtn.addEventListener('click', togglePasswordVisibility);
  themeToggle.addEventListener('click', toggleTheme);
});