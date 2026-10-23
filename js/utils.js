/**
 * Utilitários Gerais - Sistema de Chamada Digital
 * Colégio Estadual Presidente Kennedy
 */

// ========================================
// Namespace Global
// ========================================
window.AppUtils = (function() {
    'use strict';

    // ========================================
    // Datas e Formatação
    // ========================================
    const DateUtils = {
        // Formata data para DD/MM/YYYY
        formatBR(date) {
            if (!date) return '-';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        },

        // Formata data para YYYY-MM-DD (input date)
        formatISO(date) {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().split('T')[0];
        },

        // Formata data/hora para DD/MM/YYYY HH:mm
        formatBRDateTime(date) {
            if (!date) return '-';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
                   d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        },

        // Formata apenas hora HH:mm
        formatTime(date) {
            if (!date) return '-';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '-';
            return d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
        },

        // Data de hoje em ISO
        todayISO() {
            return new Date().toISOString().split('T')[0];
        },

        // Início do dia (00:00:00)
        startOfDay(date = new Date()) {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
        },

        // Fim do dia (23:59:59)
        endOfDay(date = new Date()) {
            const d = new Date(date);
            d.setHours(23, 59, 59, 999);
            return d;
        },

        // Adiciona dias
        addDays(date, days) {
            const d = new Date(date);
            d.setDate(d.getDate() + days);
            return d;
        },

        // Diferença em dias entre duas datas
        diffDays(date1, date2) {
            const d1 = this.startOfDay(date1);
            const d2 = this.startOfDay(date2);
            return Math.round((d2 - d1) / (1000 * 60 * 60 * 24));
        },

        // Verifica se é hoje
        isToday(date) {
            return this.formatISO(date) === this.todayISO();
        },

        // Verifica se data está no período
        isInPeriod(date, start, end) {
            const d = this.startOfDay(date);
            return d >= this.startOfDay(start) && d <= this.startOfDay(end);
        },

        // Nome do mês
        monthName(month, year) {
            const date = new Date(year, month - 1, 1);
            return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        },

        // Obter trimestre da data
        getTrimester(date) {
            const d = new Date(date);
            const month = d.getMonth() + 1;
            if (month <= 4) return 1;
            if (month <= 7) return 2;
            return 3;
        },

        // Período do trimestre
        getTrimesterPeriod(trimester, year = new Date().getFullYear()) {
            const periods = {
                1: { inicio: `${year}-02-01`, fim: `${year}-04-30` },
                2: { inicio: `${year}-05-01`, fim: `${year}-07-31` },
                3: { inicio: `${year}-08-01`, fim: `${year}-11-30` }
            };
            return periods[trimester] || periods[1];
        }
    };

    // ========================================
    // Strings e Validação
    // ========================================
    const StringUtils = {
        // Gera ID único
        generateId(prefix = '') {
            const timestamp = Date.now().toString(36);
            const random = Math.random().toString(36).substring(2, 8);
            return `${prefix}${prefix ? '_' : ''}${timestamp}${random}`;
        },

        // Gera PIN numérico (4-6 dígitos)
        generatePin(length = 4) {
            const min = Math.pow(10, length - 1);
            const max = Math.pow(10, length) - 1;
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Gera código alfanumérico
        generateCode(length = 8) {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sem I, O, 0, 1
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },

        // Sanitiza HTML (prevenção XSS)
        escapeHtml(text) {
            if (!text) return '';
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        // Remove acentos
        removeAccents(str) {
            return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        },

        // Capitaliza primeira letra
        capitalize(str) {
            if (!str) return '';
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        },

        // Trunca texto
        truncate(str, length = 50, suffix = '...') {
            if (!str || str.length <= length) return str;
            return str.substring(0, length - suffix.length) + suffix;
        },

        // Valida email
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        // Valida CPF (básico)
        isValidCPF(cpf) {
            if (!cpf) return false;
            cpf = cpf.replace(/\D/g, '');
            if (cpf.length !== 11) return false;
            if (/^(\d)\1+$/.test(cpf)) return false;
            
            let sum = 0;
            for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
            let rev = 11 - (sum % 11);
            if (rev >= 10) rev = 0;
            if (rev !== parseInt(cpf[9])) return false;
            
            sum = 0;
            for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
            rev = 11 - (sum % 11);
            if (rev >= 10) rev = 0;
            if (rev !== parseInt(cpf[10])) return false;
            
            return true;
        },

        // Normaliza matrícula
        normalizeMatricula(matricula) {
            return matricula ? matricula.replace(/\D/g, '').padStart(8, '0') : '';
        },

        // Slugify para URLs
        slugify(str) {
            return this.removeAccents(str)
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
        }
    };

    // ========================================
    // Números e Formatação
    // ========================================
    const NumberUtils = {
        // Formata porcentagem
        formatPercent(value, decimals = 1) {
            if (value === null || value === undefined || isNaN(value)) return '-';
            return `${Number(value).toFixed(decimals)}%`;
        },

        // Formata número com separador de milhar
        formatNumber(num) {
            if (num === null || num === undefined || isNaN(num)) return '-';
            return new Intl.NumberFormat('pt-BR').format(num);
        },

        // Arredonda
        round(value, decimals = 2) {
            if (value === null || value === undefined || isNaN(value)) return 0;
            const factor = Math.pow(10, decimals);
            return Math.round(value * factor) / factor;
        },

        // Clamp valor
        clamp(value, min, max) {
            return Math.min(Math.max(value, min), max);
        }
    };

    // ========================================
    // DOM e UI Helpers
    // ========================================
    const DOMUtils = {
        // Cria elemento com atributos
        createElement(tag, attrs = {}, children = []) {
            const el = document.createElement(tag);
            Object.entries(attrs).forEach(([key, value]) => {
                if (key === 'class') el.className = value;
                else if (key === 'style') Object.assign(el.style, value);
                else if (key.startsWith('data-')) el.setAttribute(key, value);
                else if (key.startsWith('on') && typeof value === 'function') el.addEventListener(key.slice(2), value);
                else el.setAttribute(key, value);
            });
            children.forEach(child => {
                if (typeof child === 'string') el.appendChild(document.createTextNode(child));
                else if (child instanceof Node) el.appendChild(child);
            });
            return el;
        },

        // Limpa elemento
        clearElement(el) {
            while (el.firstChild) el.removeChild(el.firstChild);
        },

        // Query selector único
        $(selector, context = document) {
            return context.querySelector(selector);
        },

        // Query selector all
        $$(selector, context = document) {
            return Array.from(context.querySelectorAll(selector));
        },

        // Adiciona classe
        addClass(el, ...classes) {
            el.classList.add(...classes);
        },

        // Remove classe
        removeClass(el, ...classes) {
            el.classList.remove(...classes);
        },

        // Toggle classe
        toggleClass(el, className, force) {
            return el.classList.toggle(className, force);
        },

        // Verifica se tem classe
        hasClass(el, className) {
            return el.classList.contains(className);
        },

        // Debounce
        debounce(fn, delay) {
            let timeoutId;
            return (...args) => {
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => fn(...args), delay);
            };
        },

        // Throttle
        throttle(fn, limit) {
            let inThrottle;
            return (...args) => {
                if (!inThrottle) {
                    fn(...args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        // Formata bytes
        formatBytes(bytes, decimals = 2) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
        },

        // Copia para clipboard
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (e) {
                // Fallback
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.opacity = '0';
                document.body.appendChild(textarea);
                textarea.select();
                const success = document.execCommand('copy');
                document.body.removeChild(textarea);
                return success;
            }
        },

        // Download de arquivo
        downloadFile(content, filename, mimeType = 'text/plain') {
            const blob = new Blob([content], { type: mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        },

        // Parse CSV para array de objetos
        parseCSV(csvText, delimiter = ',') {
            const lines = csvText.trim().split('\n');
            if (lines.length < 2) return [];
            
            const headers = lines[0].split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''));
            const rows = [];
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(delimiter).map(v => v.trim().replace(/^"|"$/g, ''));
                if (values.length !== headers.length) continue;
                
                const obj = {};
                headers.forEach((h, idx) => obj[h] = values[idx]);
                rows.push(obj);
            }
            return rows;
        },

        // Converte array para CSV
        arrayToCSV(data, headers = null) {
            if (!data || !data.length) return '';
            const keys = headers || Object.keys(data[0]);
            const rows = [
                keys.join(','),
                ...data.map(obj => keys.map(k => {
                    const val = obj[k];
                    if (val === null || val === undefined) return '';
                    const str = String(val);
                    return str.includes(',') || str.includes('"') || str.includes('\n') 
                        ? '"' + str.replace(/"/g, '""') + '"' 
                        : str;
                }).join(','))
            ];
            return rows.join('\n');
        }
    };

    // ========================================
    // Storage Helpers
    // ========================================
    const StorageUtils = {
        // LocalStorage com JSON
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                console.error('Storage set error:', e);
                return false;
            }
        },

        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Storage get error:', e);
                return defaultValue;
            }
        },

        remove(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (e) {
                console.error('Storage remove error:', e);
                return false;
            }
        },

        clear() {
            try {
                localStorage.clear();
                return true;
            } catch (e) {
                console.error('Storage clear error:', e);
                return false;
            }
        },

        // SessionStorage
        sessionSet(key, value) {
            try {
                sessionStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (e) {
                return false;
            }
        },

        sessionGet(key, defaultValue = null) {
            try {
                const item = sessionStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        }
    };

    // ========================================
    // Export
    // ========================================
    return {
        Date: DateUtils,
        String: StringUtils,
        Number: NumberUtils,
        DOM: DOMUtils,
        Storage: StorageUtils
    };
})();

// Shortcuts globais
const $ = AppUtils.DOM.$;
const $$ = AppUtils.DOM.$$;
const Utils = AppUtils;
