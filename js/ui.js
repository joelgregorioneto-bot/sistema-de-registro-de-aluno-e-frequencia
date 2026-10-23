/**
 * Utilitários de UI - Sistema de Chamada Digital
 * Colégio Estadual Presidente Kennedy
 */

window.UI = (function() {
    'use strict';

    // ========================================
    // Toast Notifications
    // ========================================
    let toastContainer = null;

    function getToastContainer() {
        if (!toastContainer) {
            toastContainer = document.getElementById('toast-container');
            if (!toastContainer) {
                toastContainer = document.createElement('div');
                toastContainer.id = 'toast-container';
                toastContainer.className = 'toast-container';
                toastContainer.setAttribute('aria-live', 'polite');
                toastContainer.setAttribute('aria-label', 'Notificações');
                document.body.appendChild(toastContainer);
            }
        }
        return toastContainer;
    }

    function showToast(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            duration = 5000,
            action = null
        } = options;

        const container = getToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');

        const iconSvg = {
            success: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>',
            error: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
            warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
            info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
        };

        let html = `<div class="toast-icon">${iconSvg[type] || iconSvg.info}</div>`;
        html += `<div class="toast-content">`;
        if (title) html += `<div class="toast-title">${Utils.String.escapeHtml(title)}</div>`;
        if (message) html += `<div class="toast-message">${Utils.String.escapeHtml(message)}</div>`;
        html += `</div>`;
        html += `<button class="toast-close" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>`;
        if (action) {
            html += `<button class="toast-action btn btn-sm btn-ghost">${Utils.String.escapeHtml(action.label)}</button>`;
        }

        toast.innerHTML = html;

        // Close button
        toast.querySelector('.toast-close').addEventListener('click', () => removeToast(toast));
        
        // Action button
        if (action) {
            toast.querySelector('.toast-action').addEventListener('click', () => {
                action.callback();
                removeToast(toast);
            });
        }

        container.appendChild(toast);

        // Auto remove
        let timeoutId;
        if (duration > 0) {
            timeoutId = setTimeout(() => removeToast(toast), duration);
        }

        // Pause on hover
        toast.addEventListener('mouseenter', () => {
            if (timeoutId) clearTimeout(timeoutId);
        });
        toast.addEventListener('mouseleave', () => {
            if (duration > 0) timeoutId = setTimeout(() => removeToast(toast), duration);
        });

        return toast;
    }

    function removeToast(toast) {
        if (!toast || toast.classList.contains('removing')) return;
        toast.classList.add('removing');
        toast.addEventListener('animationend', () => toast.remove());
        // Fallback
        setTimeout(() => toast.remove(), 300);
    }

    // Shortcuts
    const toast = {
        success: (title, message, opts) => showToast({ type: 'success', title, message, ...opts }),
        error: (title, message, opts) => showToast({ type: 'error', title, message, ...opts }),
        warning: (title, message, opts) => showToast({ type: 'warning', title, message, ...opts }),
        info: (title, message, opts) => showToast({ type: 'info', title, message, ...opts })
    };

    // ========================================
    // Modal
    // ========================================
    let modalContainer = null;

    function getModalContainer() {
        if (!modalContainer) {
            modalContainer = document.getElementById('modal-container');
            if (!modalContainer) {
                modalContainer = document.createElement('div');
                modalContainer.id = 'modal-container';
                modalContainer.className = 'modal-container';
                modalContainer.setAttribute('role', 'dialog');
                modalContainer.setAttribute('aria-modal', 'true');
                document.body.appendChild(modalContainer);
            }
        }
        return modalContainer;
    }

    function openModal(options) {
        const {
            title = '',
            content = '',
            size = 'md',
            footer = null,
            closeOnBackdrop = true,
            closeOnEscape = true,
            onClose = null,
            onOpen = null
        } = options;

        const container = getModalContainer();
        
        const modalId = 'modal-' + Utils.String.generateId();
        
        const sizeClasses = {
            sm: 'modal-sm',
            md: '',
            lg: 'modal-lg',
            xl: 'modal-xl',
            full: 'modal-full'
        };

        const html = `
            <div class="modal-backdrop" data-close="${closeOnBackdrop}"></div>
            <div class="modal ${sizeClasses[size] || ''}" id="${modalId}" role="document">
                <div class="modal-header">
                    <h3 class="modal-title" id="${modalId}-title">${Utils.String.escapeHtml(title)}</h3>
                    <button class="modal-close" aria-label="Fechar modal"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="modal-body" id="${modalId}-body">${content}</div>
                ${footer ? `<div class="modal-footer">${footer}</div>` : ''}
            </div>
        `;

        container.innerHTML = html;
        container.classList.add('open');
        document.body.style.overflow = 'hidden';

        const modal = container.querySelector('.modal');
        const backdrop = container.querySelector('.modal-backdrop');
        const closeBtn = container.querySelector('.modal-close');

        // Focus management
        const focusableElements = modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];

        function handleKeydown(e) {
            if (e.key === 'Escape' && closeOnEscape) {
                closeModal();
            } else if (e.key === 'Tab') {
                if (e.shiftKey && document.activeElement === firstFocusable) {
                    e.preventDefault();
                    lastFocusable?.focus();
                } else if (!e.shiftKey && document.activeElement === lastFocusable) {
                    e.preventDefault();
                    firstFocusable?.focus();
                }
            }
        }

        function closeModal() {
            container.classList.remove('open');
            document.body.style.overflow = '';
            document.removeEventListener('keydown', handleKeydown);
            
            setTimeout(() => {
                container.innerHTML = '';
                if (onClose) onClose();
            }, 250);
        }

        // Event listeners
        closeBtn.addEventListener('click', closeModal);
        if (closeOnBackdrop) {
            backdrop.addEventListener('click', closeModal);
        }
        document.addEventListener('keydown', handleKeydown);

        // Focus first element
        setTimeout(() => firstFocusable?.focus(), 100);

        if (onOpen) onOpen(modal);

        return {
            close: closeModal,
            element: modal,
            body: modal.querySelector('.modal-body'),
            footer: modal.querySelector('.modal-footer')
        };
    }

    function closeModal() {
        const container = getModalContainer();
        if (container.classList.contains('open')) {
            container.classList.remove('open');
            document.body.style.overflow = '';
            setTimeout(() => container.innerHTML = '', 250);
        }
    }

    // ========================================
    // Confirmação (Modal simples)
    // ========================================
    function confirm(options) {
        const {
            title = 'Confirmar',
            message = 'Tem certeza?',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            type = 'warning', // warning, danger, info
            onConfirm = null,
            onCancel = null
        } = options;

        return new Promise((resolve) => {
            const footer = `
                <button class="btn btn-ghost" data-action="cancel">${Utils.String.escapeHtml(cancelText)}</button>
                <button class="btn btn-${type === 'danger' ? 'danger' : 'primary'}" data-action="confirm">${Utils.String.escapeHtml(confirmText)}</button>
            `;

            const modal = openModal({
                title,
                content: `<div class="alert alert-${type}"><div class="alert-icon">${{
                    warning: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
                    danger: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
                    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>'
                }[type]}</div><div class="alert-content"><div class="alert-message">${Utils.String.escapeHtml(message)}</div></div></div>`,
                footer,
                size: 'sm',
                onClose: () => {
                    if (onCancel) onCancel();
                    resolve(false);
                }
            });

            modal.footer.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                modal.close();
                if (onConfirm) onConfirm();
                resolve(true);
            });

            modal.footer.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                modal.close();
            });
        });
    }

    // ========================================
    // Prompt (Input no Modal)
    // ========================================
    function prompt(options) {
        const {
            title = 'Entrada',
            message = '',
            inputType = 'text',
            placeholder = '',
            defaultValue = '',
            confirmText = 'OK',
            cancelText = 'Cancelar',
            validate = null
        } = options;

        return new Promise((resolve) => {
            const inputId = 'prompt-input-' + Utils.String.generateId();
            
            const footer = `
                <button class="btn btn-ghost" data-action="cancel">${Utils.String.escapeHtml(cancelText)}</button>
                <button class="btn btn-primary" data-action="confirm" disabled>${Utils.String.escapeHtml(confirmText)}</button>
            `;

            const modal = openModal({
                title,
                content: `
                    ${message ? `<p style="margin-bottom: 16px; color: var(--text-secondary);">${Utils.String.escapeHtml(message)}</p>` : ''}
                    <div class="form-group">
                        <input type="${inputType}" id="${inputId}" class="form-input" placeholder="${Utils.String.escapeHtml(placeholder)}" value="${Utils.String.escapeHtml(defaultValue)}" autocomplete="off">
                    </div>
                    <div class="form-error" id="${inputId}-error" style="display: none;"></div>
                `,
                footer,
                size: 'sm',
                onOpen: (modalEl) => {
                    const input = modalEl.querySelector('#' + inputId);
                    const errorEl = modalEl.querySelector('#' + inputId + '-error');
                    const confirmBtn = modalEl.querySelector('[data-action="confirm"]');
                    
                    input.focus();
                    
                    const checkValidity = () => {
                        const value = input.value.trim();
                        let valid = true;
                        let errorMsg = '';
                        
                        if (validate) {
                            const result = validate(value);
                            if (result !== true) {
                                valid = false;
                                errorMsg = result;
                            }
                        }
                        
                        if (value === '' && input.required) {
                            valid = false;
                            errorMsg = 'Campo obrigatório';
                        }
                        
                        confirmBtn.disabled = !valid;
                        if (errorMsg) {
                            errorEl.textContent = errorMsg;
                            errorEl.style.display = 'block';
                            input.classList.add('error');
                        } else {
                            errorEl.style.display = 'none';
                            input.classList.remove('error');
                        }
                    };
                    
                    input.addEventListener('input', checkValidity);
                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Enter' && !confirmBtn.disabled) {
                            modal.close();
                            resolve(input.value.trim());
                        } else if (e.key === 'Escape') {
                            modal.close();
                            resolve(null);
                        }
                    });
                    
                    checkValidity();
                },
                onClose: () => resolve(null)
            });

            modal.footer.querySelector('[data-action="confirm"]').addEventListener('click', () => {
                const input = modal.element.querySelector('#' + inputId);
                modal.close();
                resolve(input.value.trim());
            });

            modal.footer.querySelector('[data-action="cancel"]').addEventListener('click', () => {
                modal.close();
            });
        });
    }

    // ========================================
    // Tabela Dinâmica
    // ========================================
    function renderTable(container, options) {
        const {
            columns = [],
            data = [],
            keyField = 'id',
            sortable = true,
            searchable = false,
            pagination = true,
            pageSize = 10,
            rowClick = null,
            rowClass = null,
            emptyMessage = 'Nenhum registro encontrado',
            renderRow = null
        } = options;

        const wrapper = document.createElement('div');
        wrapper.className = 'table-wrapper';

        let currentPage = 1;
        let filteredData = [...data];
        let sortColumn = null;
        let sortDirection = 'asc';

        // Search
        let searchInput = null;
        if (searchable) {
            const searchBar = document.createElement('div');
            searchBar.className = 'search-bar';
            searchBar.innerHTML = `
                <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input type="search" class="form-input search-input" placeholder="Buscar..." aria-label="Buscar na tabela">
            `;
            searchInput = searchBar.querySelector('.search-input');
            searchInput.addEventListener('input', Utils.DOM.debounce(() => {
                currentPage = 1;
                applyFilters();
            }, 300));
            wrapper.appendChild(searchBar);
        }

        // Table
        const tableContainer = document.createElement('div');
        tableContainer.className = 'table-container';
        
        const table = document.createElement('table');
        table.className = 'table';
        table.innerHTML = `
            <thead>
                <tr>
                    ${columns.map(col => `
                        <th scope="col" data-column="${col.key}" style="${col.width ? 'width:' + col.width : ''}">
                            ${col.label}
                            ${sortable && col.sortable !== false ? '<svg class="sort-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg>' : ''}
                        </th>
                    `).join('')}
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody = table.querySelector('tbody');
        tableContainer.appendChild(table);
        wrapper.appendChild(tableContainer);

        // Pagination
        let paginationEl = null;
        if (pagination) {
            paginationEl = document.createElement('nav');
            paginationEl.className = 'pagination';
            paginationEl.setAttribute('aria-label', 'Paginação');
            wrapper.appendChild(paginationEl);
        }

        container.appendChild(wrapper);

        // Functions
        function applyFilters() {
            let result = [...data];
            
            // Search
            if (searchInput) {
                const query = searchInput.value.toLowerCase().trim();
                if (query) {
                    result = result.filter(row => 
                        columns.some(col => {
                            const val = row[col.key];
                            return val && String(val).toLowerCase().includes(query);
                        })
                    );
                }
            }

            // Sort
            if (sortColumn) {
                result.sort((a, b) => {
                    const aVal = a[sortColumn];
                    const bVal = b[sortColumn];
                    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
                    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }

            filteredData = result;
            render();
        }

        function render() {
            // Render rows
            const start = (currentPage - 1) * pageSize;
            const end = start + pageSize;
            const pageData = filteredData.slice(start, end);

            tbody.innerHTML = pageData.map((row, index) => {
                const rowId = row[keyField];
                const trClass = rowClass ? rowClass(row) : '';
                const clickable = rowClick ? 'style="cursor: pointer;"' : '';
                
                return `<tr data-id="${Utils.String.escapeHtml(rowId)}" class="${trClass}" ${clickable}>
                    ${columns.map(col => {
                        const value = row[col.key];
                        let displayValue = value === null || value === undefined ? '' : value;
                        
                        if (col.render) {
                            displayValue = col.render(value, row, index);
                        } else if (col.type === 'date') {
                            displayValue = value ? Utils.Date.formatBR(value) : '-';
                        } else if (col.type === 'datetime') {
                            displayValue = value ? Utils.Date.formatBRDateTime(value) : '-';
                        } else if (col.type === 'badge') {
                            const variant = col.badgeVariant ? col.badgeVariant(value, row) : 'gray';
                            displayValue = `<span class="badge badge-${variant}">${Utils.String.escapeHtml(displayValue)}</span>`;
                        } else if (col.type === 'actions') {
                            displayValue = col.renderActions ? col.renderActions(row) : '';
                        }
                        
                        const align = col.align ? `style="text-align: ${col.align};"` : '';
                        return `<td ${align}>${displayValue}</td>`;
                    }).join('')}
                </tr>`;
            }).join('');

            // Row click
            if (rowClick) {
                tbody.querySelectorAll('tr[data-id]').forEach(tr => {
                    tr.addEventListener('click', (e) => {
                        if (e.target.closest('button, a, input, select')) return;
                        const id = tr.dataset.id;
                        const row = data.find(r => r[keyField] === id);
                        if (row) rowClick(row, tr);
                    });
                });
            }

            // Sort headers
            if (sortable) {
                table.querySelectorAll('th[data-column]').forEach(th => {
                    const colKey = th.dataset.column;
                    const col = columns.find(c => c.key === colKey);
                    if (!col || col.sortable === false) return;
                    
                    th.style.cursor = 'pointer';
                    th.addEventListener('click', () => {
                        if (sortColumn === colKey) {
                            sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
                        } else {
                            sortColumn = colKey;
                            sortDirection = 'asc';
                        }
                        
                        table.querySelectorAll('th').forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));
                        th.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
                        
                        applyFilters();
                    });
                    
                    if (sortColumn === colKey) {
                        th.classList.add(sortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
                    }
                });
            }

            // Pagination
            if (paginationEl) {
                const totalPages = Math.ceil(filteredData.length / pageSize);
                if (totalPages <= 1) {
                    paginationEl.innerHTML = '';
                    return;
                }

                let html = '';
                
                // Prev
                html += `<button class="pagination-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''} aria-label="Página anterior"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg></button>`;
                
                // Pages
                const maxVisible = 5;
                let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
                let endPage = Math.min(totalPages, startPage + maxVisible - 1);
                
                if (endPage - startPage + 1 < maxVisible) {
                    startPage = Math.max(1, endPage - maxVisible + 1);
                }
                
                if (startPage > 1) {
                    html += `<button class="pagination-btn" data-page="1">1</button>`;
                    if (startPage > 2) html += `<span class="pagination-ellipsis">...</span>`;
                }
                
                for (let i = startPage; i <= endPage; i++) {
                    html += `<button class="pagination-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
                }
                
                if (endPage < totalPages) {
                    if (endPage < totalPages - 1) html += `<span class="pagination-ellipsis">...</span>`;
                    html += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
                }
                
                // Next
                html += `<button class="pagination-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''} aria-label="Próxima página"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg></button>`;
                
                // Info
                const startItem = filteredData.length > 0 ? start + 1 : 0;
                const endItem = Math.min(end, filteredData.length);
                html += `<span class="pagination-info">${startItem}-${endItem} de ${filteredData.length}</span>`;
                
                paginationEl.innerHTML = html;
                
                paginationEl.querySelectorAll('.pagination-btn[data-page]').forEach(btn => {
                    btn.addEventListener('click', () => {
                        const page = parseInt(btn.dataset.page);
                        if (page >= 1 && page <= totalPages && page !== currentPage) {
                            currentPage = page;
                            render();
                        }
                    });
                });
            }

            // Empty state
            if (filteredData.length === 0) {
                tbody.innerHTML = `<tr><td colspan="${columns.length}" class="empty-state" style="padding: 48px; text-align: center; color: var(--text-tertiary);">${Utils.String.escapeHtml(emptyMessage)}</td></tr>`;
            }
        }

        // Initial render
        applyFilters();

        // Public API
        return {
            refresh: (newData) => {
                if (newData) data = newData;
                applyFilters();
            },
            setData: (newData) => {
                data = newData;
                applyFilters();
            },
            getData: () => filteredData,
            getSelected: () => null, // Para futuro checkbox selection
            destroy: () => wrapper.remove()
        };
    }

    // ========================================
    // Form Helpers
    // ========================================
    function serializeForm(form) {
        const data = {};
        const formData = new FormData(form);
        for (const [key, value] of formData.entries()) {
            if (data[key]) {
                if (!Array.isArray(data[key])) data[key] = [data[key]];
                data[key].push(value);
            } else {
                data[key] = value;
            }
        }
        return data;
    }

    function populateForm(form, data) {
        for (const [key, value] of Object.entries(data)) {
            const field = form.querySelector(`[name="${key}"]`);
            if (!field) continue;
            
            if (field.type === 'checkbox') {
                field.checked = !!value;
            } else if (field.type === 'radio') {
                const radio = form.querySelector(`[name="${key}"][value="${value}"]`);
                if (radio) radio.checked = true;
            } else if (field.tagName === 'SELECT' && field.multiple) {
                Array.from(field.options).forEach(opt => opt.selected = Array.isArray(value) && value.includes(opt.value));
            } else {
                field.value = value === null || value === undefined ? '' : value;
            }
        }
    }

    function clearForm(form) {
        form.reset();
        form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
        form.querySelectorAll('.form-error').forEach(el => el.style.display = 'none');
    }

    function validateForm(form) {
        let valid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            const value = field.type === 'checkbox' ? field.checked : field.value.trim();
            if (!value) {
                field.classList.add('error');
                valid = false;
            } else {
                field.classList.remove('error');
            }
        });

        // Custom validation
        const customValidators = form.querySelectorAll('[data-validate]');
        customValidators.forEach(field => {
            const validator = field.dataset.validate;
            if (validator === 'email' && field.value && !Utils.String.isValidEmail(field.value)) {
                field.classList.add('error');
                valid = false;
            } else if (validator === 'cpf' && field.value && !Utils.String.isValidCPF(field.value)) {
                field.classList.add('error');
                valid = false;
            }
        });

        return valid;
    }

    // ========================================
    // Loading States
    // ========================================
    function setButtonLoading(btn, loading, originalText = null) {
        if (loading) {
            btn.dataset.originalText = originalText || btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = `<span class="btn-spinner"></span> Carregando...`;
        } else {
            btn.disabled = false;
            btn.innerHTML = btn.dataset.originalText || btn.innerHTML;
            delete btn.dataset.originalText;
        }
    }

    function showLoading(container) {
        container.classList.add('loading');
        const overlay = document.createElement('div');
        overlay.className = 'loading-overlay';
        overlay.innerHTML = '<div class="loading-spinner"></div>';
        container.appendChild(overlay);
        return overlay;
    }

    function hideLoading(overlay) {
        if (overlay) overlay.remove();
        const container = overlay?.parentElement;
        if (container) container.classList.remove('loading');
    }

    // ========================================
    // Dropdown Toggle
    // ========================================
    function initDropdowns() {
        document.addEventListener('click', (e) => {
            const trigger = e.target.closest('[data-dropdown-toggle]');
            if (trigger) {
                const dropdown = trigger.closest('.dropdown');
                if (dropdown) {
                    dropdown.classList.toggle('open');
                    e.stopPropagation();
                }
            } else {
                document.querySelectorAll('.dropdown.open').forEach(d => d.classList.remove('open'));
            }
        });
    }

    // ========================================
    // Tabs
    // ========================================
    function initTabs(container = document) {
        container.querySelectorAll('.tabs .tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabs = btn.closest('.tabs');
                const target = btn.dataset.tab;
                
                tabs.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                tabs.parentElement?.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
                const panel = document.getElementById(target);
                if (panel) panel.classList.add('active');
            });
        });
    }

    // ========================================
    // Accordion
    // ========================================
    function initAccordions(container = document) {
        container.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => {
                const item = header.closest('.accordion-item');
                const isOpen = item.classList.contains('open');
                
                // Fechar outros no mesmo accordion
                item.closest('.accordion').querySelectorAll('.accordion-item.open').forEach(openItem => {
                    if (openItem !== item) openItem.classList.remove('open');
                });
                
                item.classList.toggle('open', !isOpen);
            });
        });
    }

    // ========================================
    // File Upload UI
    // ========================================
    function initFileUpload(container = document) {
        container.querySelectorAll('.file-upload').forEach(upload => {
            const input = upload.querySelector('input[type="file"]');
            if (!input) return;

            ['dragenter', 'dragover'].forEach(evt => {
                upload.addEventListener(evt, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    upload.classList.add('drag-over');
                });
            });

            ['dragleave', 'drop'].forEach(evt => {
                upload.addEventListener(evt, (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    upload.classList.remove('drag-over');
                });
            });

            upload.addEventListener('drop', (e) => {
                input.files = e.dataTransfer.files;
                input.dispatchEvent(new Event('change'));
            });

            input.addEventListener('change', () => {
                const files = Array.from(input.files);
                if (!files.length) return;
                
                // Trigger custom event
                upload.dispatchEvent(new CustomEvent('filesselected', { detail: { files } }));
            });
        });
    }

    // ========================================
    // Auto-init on DOMContentLoaded
    // ========================================
    document.addEventListener('DOMContentLoaded', () => {
        initDropdowns();
        initTabs();
        initAccordions();
        initFileUpload();
    });

    // ========================================
    // Export
    // ========================================
    return {
        toast,
        showToast,
        modal: {
            open: openModal,
            close: closeModal
        },
        confirm,
        prompt,
        table: renderTable,
        form: {
            serialize: serializeForm,
            populate: populateForm,
            clear: clearForm,
            validate: validateForm
        },
        loading: {
            button: setButtonLoading,
            show: showLoading,
            hide: hideLoading
        }
    };
})();
