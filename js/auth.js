/**
 * Autenticação - Sistema de Chamada Digital
 * Colégio Estadual Presidente Kennedy
 */

window.Auth = (function() {
    'use strict';

    const SESSION_KEY = 'chamada_session';
    const REMEMBER_KEY = 'chamada_remember';
    const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 horas
    const REMEMBER_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 dias

    let currentUser = null;
    let sessionCheckInterval = null;

    // ========================================
    // Hash de Senha (bcryptjs)
    // ========================================
    async function hashPassword(password) {
        return new Promise((resolve) => {
            try {
                // bcryptjs usa 10 rounds por padrão
                const hash = bcrypt.hashSync(password, 10);
                resolve(hash);
            } catch (e) {
                console.error('Hash error:', e);
                resolve(null);
            }
        });
    }

    async function verifyPassword(password, hash) {
        return new Promise((resolve) => {
            try {
                const result = bcrypt.compareSync(password, hash);
                resolve(result);
            } catch (e) {
                console.error('Verify error:', e);
                resolve(false);
            }
        });
    }

    // ========================================
    // Sessão
    // ========================================
    function createSession(user, remember = false) {
        const now = Date.now();
        const expiresAt = now + (remember ? REMEMBER_DURATION : SESSION_DURATION);
        
        const session = {
            userId: user.id,
            userNome: user.nome,
            userEmail: user.email,
            remember,
            createdAt: now,
            expiresAt
        };

        if (remember) {
            localStorage.setItem(REMEMBER_KEY, JSON.stringify(session));
        } else {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
        }

        currentUser = {
            id: user.id,
            nome: user.nome,
            email: user.email
        };

        // Inicia verificação periódica
        startSessionCheck();
        
        return currentUser;
    }

    function getSession() {
        // Tenta sessionStorage primeiro
        let session = sessionStorage.getItem(SESSION_KEY);
        let source = 'session';
        
        if (!session) {
            session = localStorage.getItem(REMEMBER_KEY);
            source = 'local';
        }

        if (!session) return null;

        try {
            const data = JSON.parse(session);
            if (data.expiresAt < Date.now()) {
                // Expirada
                clearSession();
                return null;
            }
            return { ...data, source };
        } catch (e) {
            clearSession();
            return null;
        }
    }

    function clearSession() {
        sessionStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(REMEMBER_KEY);
        currentUser = null;
        stopSessionCheck();
    }

    function restoreSession() {
        const session = getSession();
        if (session) {
            currentUser = {
                id: session.userId,
                nome: session.userNome,
                email: session.userEmail
            };
            startSessionCheck();
            return currentUser;
        }
        return null;
    }

    function startSessionCheck() {
        stopSessionCheck();
        sessionCheckInterval = setInterval(() => {
            const session = getSession();
            if (!session && currentUser) {
                // Sessão expirou
                clearSession();
                // Dispara evento para UI reagir
                window.dispatchEvent(new CustomEvent('auth:expired'));
            }
        }, 60000); // Verifica a cada minuto
    }

    function stopSessionCheck() {
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
            sessionCheckInterval = null;
        }
    }

    // ========================================
    // Login/Logout
    // ========================================
    async function login(email, password, remember = false) {
        const professor = await AppDB.Professores.getByEmail(email);
        if (!professor) {
            throw new Error('Email ou senha incorretos');
        }

        const valid = await verifyPassword(password, professor.senhaHash);
        if (!valid) {
            throw new Error('Email ou senha incorretos');
        }

        return createSession(professor, remember);
    }

    function logout() {
        clearSession();
        window.dispatchEvent(new CustomEvent('auth:logout'));
    }

    function getCurrentUser() {
        return currentUser;
    }

    function isAuthenticated() {
        return !!currentUser;
    }

    // ========================================
    // Cadastro (Primeiro Acesso)
    // ========================================
    async function register(nome, email, password) {
        // Verifica se já existe
        const existing = await AppDB.Professores.getByEmail(email);
        if (existing) {
            throw new Error('Este email já está cadastrado');
        }

        const senhaHash = await hashPassword(password);
        if (!senhaHash) {
            throw new Error('Erro ao processar senha');
        }

        const professor = await AppDB.Professores.create({
            nome,
            email: email.toLowerCase(),
            senhaHash
        });

        return professor;
    }

    // ========================================
    // Alterar Senha
    // ========================================
    async function changePassword(currentPassword, newPassword) {
        if (!currentUser) throw new Error('Não autenticado');

        const professor = await AppDB.Professores.getById(currentUser.id);
        if (!professor) throw new Error('Usuário não encontrado');

        const valid = await verifyPassword(currentPassword, professor.senhaHash);
        if (!valid) throw new Error('Senha atual incorreta');

        const newHash = await hashPassword(newPassword);
        if (!newHash) throw new Error('Erro ao processar nova senha');

        await AppDB.Professores.update(currentUser.id, { senhaHash: newHash });
        
        // Renova sessão por segurança
        createSession({ ...professor, senhaHash: newHash }, true);
        
        return true;
    }

    // ========================================
    // Reset de Senha (Simulado - Admin)
    // ========================================
    async function resetPassword(email, newPassword) {
        const professor = await AppDB.Professores.getByEmail(email);
        if (!professor) {
            // Por segurança, não revelamos se email existe
            return true;
        }

        const senhaHash = await hashPassword(newPassword);
        if (!senhaHash) throw new Error('Erro ao processar senha');

        await AppDB.Professores.update(professor.id, { senhaHash });
        return true;
    }

    // ========================================
    // Eventos de Autenticação
    // ========================================
    function onAuthChange(callback) {
        window.addEventListener('auth:login', callback);
        window.addEventListener('auth:logout', callback);
        window.addEventListener('auth:expired', callback);
        
        return () => {
            window.removeEventListener('auth:login', callback);
            window.removeEventListener('auth:logout', callback);
            window.removeEventListener('auth:expired', callback);
        };
    }

    // ========================================
    // Export
    // ========================================
    return {
        login,
        logout,
        register,
        changePassword,
        resetPassword,
        getCurrentUser,
        isAuthenticated,
        restoreSession,
        hashPassword,
        verifyPassword,
        onAuthChange
    };
})();

// Auto-restaurar sessão ao carregar
document.addEventListener('DOMContentLoaded', () => {
    Auth.restoreSession();
});
