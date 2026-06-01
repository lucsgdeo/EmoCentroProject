const API_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    setupTabs();
    setupLoginForm();
    setupRegisterForm();
});

function setupTabs() {
    const tabLogin = document.getElementById('tab-login');
    const tabRegister = document.getElementById('tab-register');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authMsg = document.getElementById('auth-msg');

    tabLogin.addEventListener('click', () => {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        tabLogin.style.borderBottom = '2px solid var(--primary-color)';
        tabLogin.style.color = 'var(--text-color)';
        tabRegister.style.borderBottom = 'none';
        tabRegister.style.color = '#777';
        authMsg.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        tabRegister.style.borderBottom = '2px solid var(--primary-color)';
        tabRegister.style.color = 'var(--text-color)';
        tabLogin.style.borderBottom = 'none';
        tabLogin.style.color = '#777';
        authMsg.style.display = 'none';
    });
}

function setupLoginForm() {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const msg = document.getElementById('auth-msg');

        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'index.html';
            } else {
                msg.textContent = data.error || 'Erro ao fazer login';
                msg.style.color = 'red';
                msg.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            msg.textContent = 'Erro de conexão com o servidor';
            msg.style.color = 'red';
            msg.style.display = 'block';
        }
    });
}

function setupRegisterForm() {
    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const msg = document.getElementById('auth-msg');

        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                msg.textContent = 'Conta criada com sucesso! Faça login abaixo.';
                msg.style.color = 'green';
                msg.style.display = 'block';
                // Switch to login tab
                setTimeout(() => {
                    document.getElementById('tab-login').click();
                    document.getElementById('login-email').value = email;
                }, 2000);
            } else {
                msg.textContent = data.error || 'Erro ao criar conta';
                msg.style.color = 'red';
                msg.style.display = 'block';
            }
        } catch (error) {
            console.error('Register error:', error);
            msg.textContent = 'Erro de conexão com o servidor';
            msg.style.color = 'red';
            msg.style.display = 'block';
        }
    });
}
