/**
 * Aplicação Principal - Sistema de Chamada Digital
 * Colégio Estadual Presidente Kennedy
 */

window.App = (function() {
    'use strict';

    // ========================================
    // Estado Global
    // ========================================
    const state = {
        currentRoute: 'login',
        currentView: null,
        selectedTurma: null,
        chamadaAtiva: null,
        user: null
    };

    // ========================================
    // Elementos DOM Principais
    // ========================================
    const elements = {
        loadingScreen: null,
        app: null,
        header: null,
        mainContent: null,
        footer: null,
        userName: null,
        btnLogout: null,
        navButtons: {}
    };

    // ========================================
    // Rotas e Views
    // ========================================
    const routes = {
        login: { view: 'LoginView', auth: false },
        dashboard: { view: 'DashboardView', auth: true },
        turmas: { view: 'TurmasView', auth: true },
        'turmas/nova': { view: 'TurmaFormView', auth: true },
        'turmas/editar': { view: 'TurmaFormView', auth: true },
        'turmas/alunos': { view: 'TurmaAlunosView', auth: true },
        chamada: { view: 'ChamadaView', auth: true },
        'chamada/iniciar': { view: 'ChamadaIniciarView', auth: true },
        checkin: { view: 'CheckinView', auth: false },
        'relatorios/diario': { view: 'RelatorioDiarioView', auth: true },
        'relatorios/trimestral': { view: 'RelatorioTrimestralView', auth: true },
        configuracoes: { view: 'ConfiguracoesView', auth: true }
    };

    // ========================================
    // Inicialização
    // ========================================
    async function init() {
        // Cache elements
        cacheElements();
        
        // Inicializa banco
        await AppDB.init();
        
        // Restaura sessão
        const user = Auth.restoreSession();
        state.user = user;
        
        // Setup event listeners
        setupEventListeners();
        
        // Inicializa router
        initRouter();
        
        // Esconde loading
        hideLoading();
        
        console.log('Sistema Chamada Digital inicializado');
    }

    function cacheElements() {
        elements.loadingScreen = document.getElementById('loading-screen');
        elements.app = document.getElementById('app');
        elements.header = document.getElementById('header');
        elements.mainContent = document.getElementById('main-content');
        elements.footer = document.getElementById('footer');
        elements.userName = document.getElementById('user-name');
        elements.btnLogout = document.getElementById('btn-logout');
        
        // Nav buttons
        elements.navButtons = {
            dashboard: document.getElementById('btn-dashboard'),
            turmas: document.getElementById('btn-turmas'),
            chamada: document.getElementById('btn-chamada'),
            relatorios: document.getElementById('btn-relatorios')
        };
    }

    function hideLoading() {
        if (elements.loadingScreen) {
            elements.loadingScreen.classList.add('hidden');
            setTimeout(() => elements.loadingScreen.style.display = 'none', 300);
        }
        elements.app?.classList.remove('hidden');
    }

    function setupEventListeners() {
        // Logout
        elements.btnLogout?.addEventListener('click', handleLogout);
        
        // Navigation
        Object.entries(elements.navButtons).forEach(([route, btn]) => {
            btn?.addEventListener('click', () => navigate(route));
        });

        // Auth events
        window.addEventListener('auth:login', () => onAuthChange());
        window.addEventListener('auth:logout', () => onAuthChange());
        window.addEventListener('auth:expired', () => onAuthExpired());
        
        // Hash change (para browser back/forward)
        window.addEventListener('hashchange', () => handleHashChange());
    }

    // ========================================
    // Router
    // ========================================
    function initRouter() {
        // Verifica hash inicial
        const hash = window.location.hash.slice(1) || (state.user ? 'dashboard' : 'login');
        navigate(hash, false);
    }

    function navigate(route, pushState = true) {
        // Parse route com parâmetros
        const [path, ...params] = route.split('?');
        const routeConfig = routes[path] || routes.login;
        
        // Verifica autenticação
        if (routeConfig.auth && !state.user) {
            if (pushState) window.location.hash = 'login';
            return showView('login');
        }
        
        // Redireciona login se já logado
        if (path === 'login' && state.user) {
            if (pushState) window.location.hash = 'dashboard';
            return showView('dashboard');
        }

        if (pushState) {
            window.location.hash = route;
        }

        state.currentRoute = path;
        showView(path, params);
    }

    function handleHashChange() {
        const hash = window.location.hash.slice(1);
        if (hash && hash !== state.currentRoute) {
            navigate(hash, false);
        }
    }

    async function showView(viewName, params = []) {
        // Atualiza nav ativo
        updateActiveNav(viewName);
        
        // Carrega view
        try {
            const viewModule = window[viewName];
            if (viewModule && typeof viewModule.render === 'function') {
                state.currentView = viewName;
                await viewModule.render(elements.mainContent, params, state);
            } else {
                console.warn(`View ${viewName} não encontrada, carregando dashboard`);
                await showView('dashboard');
            }
        } catch (error) {
            console.error(`Erro ao carregar view ${viewName}:`, error);
            UI.toast.error('Erro', 'Não foi possível carregar a página');
            if (state.user) await showView('dashboard');
            else await showView('login');
        }
    }

    function updateActiveNav(viewName) {
        const routeMap = {
            'LoginView': null,
            'DashboardView': 'dashboard',
            'TurmasView': 'turmas',
            'TurmaFormView': 'turmas',
            'TurmaAlunosView': 'turmas',
            'ChamadaView': 'chamada',
            'ChamadaIniciarView': 'chamada',
            'CheckinView': null,
            'RelatorioDiarioView': 'relatorios',
            'RelatorioTrimestralView': 'relatorios',
            'ConfiguracoesView': 'turmas'
        };
        
        const activeRoute = routeMap[viewName];
        Object.entries(elements.navButtons).forEach(([route, btn]) => {
            btn?.classList.toggle('active', route === activeRoute);
        });
    }

    // ========================================
    // Auth Handlers
    // ========================================
    function onAuthChange() {
        state.user = Auth.getCurrentUser();
        if (state.user) {
            elements.userName.textContent = state.user.nome;
            elements.header?.classList.remove('hidden');
            elements.footer?.classList.remove('hidden');
        } else {
            elements.header?.classList.add('hidden');
            elements.footer?.classList.add('hidden');
        }
    }

    function onAuthExpired() {
        UI.toast.warning('Sessão expirada', 'Sua sessão expirou. Faça login novamente.');
        navigate('login');
    }

    async function handleLogout() {
        const confirmed = await UI.confirm({
            title: 'Sair do Sistema',
            message: 'Tem certeza que deseja sair?',
            confirmText: 'Sair',
            type: 'info'
        });
        
        if (confirmed) {
            Auth.logout();
            state.user = null;
            state.selectedTurma = null;
            state.chamadaAtiva = null;
            navigate('login');
        }
    }

    // ========================================
    // Helpers de Estado
    // ========================================
    function setSelectedTurma(turma) {
        state.selectedTurma = turma;
    }

    function getSelectedTurma() {
        return state.selectedTurma;
    }

    function setChamadaAtiva(chamada) {
        state.chamadaAtiva = chamada;
    }

    function getChamadaAtiva() {
        return state.chamadaAtiva;
    }

    // ========================================
    // Utilitários de View
    // ========================================
    function renderPageTitle(title, subtitle = '', actions = '') {
        return `
            <div class="view-header">
                <div class="view-title">
                    <h1>${Utils.String.escapeHtml(title)}</h1>
                    ${subtitle ? `<p>${Utils.String.escapeHtml(subtitle)}</p>` : ''}
                </div>
                <div class="view-actions">${actions}</div>
            </div>
        `;
    }

    function renderCard(title, content, footer = '', options = {}) {
        const { className = '', headerActions = '' } = options;
        return `
            <div class="card ${className}">
                <div class="card-header">
                    <h3 class="card-title">${Utils.String.escapeHtml(title)}</h3>
                    ${headerActions}
                </div>
                <div class="card-body">${content}</div>
                ${footer ? `<div class="card-footer">${footer}</div>` : ''}
            </div>
        `;
    }

    function renderStatCard(label, value, icon, variant = 'primary', change = null) {
        const changeHtml = change ? `
            <div class="stat-change ${change.positive ? 'positive' : 'negative'}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:12px;height:12px">
                    ${change.positive ? '<polyline points="18 15 12 9 6 15"/>' : '<polyline points="6 15 12 9 18 15"/>'}
                </svg>
                <span>${Utils.String.escapeHtml(change.label)}</span>
            </div>
        ` : '';
        
        return `
            <div class="stat-card">
                <div class="stat-icon ${variant}">
                    ${icon}
                </div>
                <div class="stat-content">
                    <div class="stat-value">${Utils.String.escapeHtml(String(value))}</div>
                    <div class="stat-label">${Utils.String.escapeHtml(label)}</div>
                    ${changeHtml}
                </div>
            </div>
        `;
    }

    // ========================================
    // Export
    // ========================================
    return {
        init,
        navigate,
        state,
        setSelectedTurma,
        getSelectedTurma,
        setChamadaAtiva,
        getChamadaAtiva,
        renderPageTitle,
        renderCard,
        renderStatCard
    };
})();

// Inicializa quando DOM pronto
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
