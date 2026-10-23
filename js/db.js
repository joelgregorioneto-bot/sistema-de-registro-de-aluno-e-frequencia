/**
 * IndexedDB Wrapper - Sistema de Chamada Digital
 * Colégio Estadual Presidente Kennedy
 */

window.AppDB = (function() {
    'use strict';

    const DB_NAME = 'ChamadaDigitalDB';
    const DB_VERSION = 1;

    // Definição das stores
    const STORES = {
        professores: { keyPath: 'id', indexes: ['email'] },
        turmas: { keyPath: 'id', indexes: ['professorId', 'codigoAcesso', 'anoLetivo'] },
        alunos: { keyPath: 'id', indexes: ['turmaId', 'matricula'] },
        presencas: { keyPath: 'id', indexes: ['turmaId', 'data', 'alunoId', 'turmaId_data'] },
        configuracoes: { keyPath: 'chave' }
    };

    let db = null;
    let initPromise = null;

    // ========================================
    // Inicialização
    // ========================================
    function init() {
        if (initPromise) return initPromise;

        initPromise = new Promise((resolve, reject) => {
            if (typeof indexedDB === 'undefined') {
                reject(new Error('IndexedDB não suportado neste navegador'));
                return;
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION);

            request.onerror = () => reject(new Error('Erro ao abrir banco: ' + request.error.message));

            request.onsuccess = () => {
                db = request.result;
                db.onerror = (e) => console.error('DB Error:', e.target.error);
                resolve(db);
            };

            request.onupgradeneeded = (e) => {
                const database = e.target.result;
                const oldVersion = e.oldVersion;

                // Criar stores
                Object.entries(STORES).forEach(([name, config]) => {
                    let store;
                    if (!database.objectStoreNames.contains(name)) {
                        store = database.createObjectStore(name, { keyPath: config.keyPath });
                    } else {
                        store = e.target.transaction.objectStore(name);
                    }

                    // Criar índices
                    config.indexes.forEach(indexName => {
                        const indexOptions = indexName === 'turmaId_data' ? { unique: false } : { unique: indexName === 'email' || indexName === 'codigoAcesso' || indexName === 'matricula' };
                        const actualIndexName = indexName === 'turmaId_data' ? 'turmaId_data' : indexName;
                        
                        if (!store.indexNames.contains(actualIndexName)) {
                            if (indexName === 'turmaId_data') {
                                // Índice composto será criado manualmente
                            } else {
                                store.createIndex(actualIndexName, indexName, indexOptions);
                            }
                        }
                    });
                });

                // Índice composto para presencas (turmaId + data)
                if (!database.objectStoreNames.contains('presencas')) {
                    const presencasStore = e.target.transaction.objectStore('presencas');
                    if (!presencasStore.indexNames.contains('turmaId_data')) {
                        presencasStore.createIndex('turmaId_data', ['turmaId', 'data'], { unique: false });
                    }
                }
            };
        });

        return initPromise;
    }

    // ========================================
    // Helpers de Transação
    // ========================================
    function transaction(storeNames, mode, callback) {
        return init().then(() => {
            return new Promise((resolve, reject) => {
                const tx = db.transaction(storeNames, mode);
                tx.oncomplete = () => resolve();
                tx.onerror = () => reject(tx.error);
                tx.onabort = () => reject(new Error('Transação abortada'));
                
                const stores = Array.isArray(storeNames) 
                    ? storeNames.map(name => tx.objectStore(name))
                    : tx.objectStore(storeNames);
                
                callback(stores, tx);
            });
        });
    }

    // ========================================
    // CRUD Genérico
    // ========================================
    const CRUD = {
        // Create
        add(storeName, data) {
            return transaction(storeName, 'readwrite', (store) => {
                const request = store.add(data);
                request.onsuccess = () => request.result;
            }).then(() => data);
        },

        // Create or Update
        put(storeName, data) {
            return transaction(storeName, 'readwrite', (store) => {
                store.put(data);
            }).then(() => data);
        },

        // Read by ID
        get(storeName, id) {
            return transaction(storeName, 'readonly', (store) => {
                return new Promise((resolve, reject) => {
                    const request = store.get(id);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
        },

        // Read all
        getAll(storeName) {
            return transaction(storeName, 'readonly', (store) => {
                return new Promise((resolve, reject) => {
                    const request = store.getAll();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
        },

        // Read by index
        getByIndex(storeName, indexName, value) {
            return transaction(storeName, 'readonly', (store) => {
                return new Promise((resolve, reject) => {
                    const index = store.index(indexName);
                    const request = index.getAll(value);
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
        },

        // Query com cursor (para filtros complexos)
        query(storeName, callback, options = {}) {
            return transaction(storeName, 'readonly', (store) => {
                return new Promise((resolve, reject) => {
                    const results = [];
                    const request = options.index 
                        ? store.index(options.index).openCursor(options.range || null, options.direction || 'next')
                        : store.openCursor(null, options.direction || 'next');
                    
                    request.onsuccess = (e) => {
                        const cursor = e.target.result;
                        if (cursor) {
                            if (callback(cursor.value, cursor)) {
                                results.push(cursor.value);
                            }
                            cursor.continue();
                        } else {
                            resolve(results);
                        }
                    };
                    request.onerror = () => reject(request.error);
                });
            });
        },

        // Count
        count(storeName, indexName, value) {
            return transaction(storeName, 'readonly', (store) => {
                return new Promise((resolve, reject) => {
                    const request = indexName 
                        ? store.index(indexName).count(value)
                        : store.count();
                    request.onsuccess = () => resolve(request.result);
                    request.onerror = () => reject(request.error);
                });
            });
        },

        // Delete
        delete(storeName, id) {
            return transaction(storeName, 'readwrite', (store) => {
                store.delete(id);
            });
        },

        // Clear store
        clear(storeName) {
            return transaction(storeName, 'readwrite', (store) => {
                store.clear();
            });
        }
    };

    // ========================================
    // API Específica por Entidade
    // ========================================

    // ---- Professores ----
    const Professores = {
        async create(professor) {
            const now = new Date().toISOString();
            const data = {
                id: Utils.String.generateId('prof'),
                ...professor,
                criadoEm: now,
                atualizadoEm: now
            };
            return CRUD.add('professores', data);
        },

        async getByEmail(email) {
            const results = await CRUD.getByIndex('professores', 'email', email.toLowerCase());
            return results[0] || null;
        },

        async getById(id) {
            return CRUD.get('professores', id);
        },

        async getAll() {
            return CRUD.getAll('professores');
        },

        async update(id, data) {
            const professor = await this.getById(id);
            if (!professor) throw new Error('Professor não encontrado');
            
            const updated = {
                ...professor,
                ...data,
                id, // preserva ID
                atualizadoEm: new Date().toISOString()
            };
            return CRUD.put('professores', updated);
        },

        async delete(id) {
            return CRUD.delete('professores', id);
        },

        async verifyPassword(professor, password) {
            if (!professor.senhaHash) return false;
            // bcryptjs usa compareSync
            return await new Promise(resolve => {
                try {
                    const result = bcrypt.compareSync(password, professor.senhaHash);
                    resolve(result);
                } catch (e) {
                    resolve(false);
                }
            });
        }
    };

    // ---- Turmas ----
    const Turmas = {
        async create(turma) {
            const now = new Date().toISOString();
            const codigoAcesso = turma.codigoAcesso || Utils.String.generateCode(8).toUpperCase();
            
            const data = {
                id: Utils.String.generateId('turma'),
                ...turma,
                codigoAcesso,
                alunos: turma.alunos || [],
                criadoEm: now,
                atualizadoEm: now
            };
            return CRUD.add('turmas', data);
        },

        async getById(id) {
            return CRUD.get('turmas', id);
        },

        async getByCodigo(codigo) {
            const results = await CRUD.getByIndex('turmas', 'codigoAcesso', codigo.toUpperCase());
            return results[0] || null;
        },

        async getByProfessor(professorId) {
            return CRUD.getByIndex('turmas', 'professorId', professorId);
        },

        async getAll() {
            return CRUD.getAll('turmas');
        },

        async update(id, data) {
            const turma = await this.getById(id);
            if (!turma) throw new Error('Turma não encontrada');
            
            const updated = {
                ...turma,
                ...data,
                id,
                atualizadoEm: new Date().toISOString()
            };
            return CRUD.put('turmas', updated);
        },

        async addAluno(turmaId, alunoId) {
            const turma = await this.getById(turmaId);
            if (!turma) throw new Error('Turma não encontrada');
            if (!turma.alunos.includes(alunoId)) {
                turma.alunos.push(alunoId);
                return this.update(turmaId, { alunos: turma.alunos });
            }
            return turma;
        },

        async removeAluno(turmaId, alunoId) {
            const turma = await this.getById(turmaId);
            if (!turma) throw new Error('Turma não encontrada');
            turma.alunos = turma.alunos.filter(id => id !== alunoId);
            return this.update(turmaId, { alunos: turma.alunos });
        },

        async delete(id) {
            // Remove alunos da turma primeiro? Ou apenas desvincula?
            // Por enquanto, apenas deleta a turma
            return CRUD.delete('turmas', id);
        },

        async regenerarCodigo(id) {
            const novoCodigo = Utils.String.generateCode(8).toUpperCase();
            return this.update(id, { codigoAcesso: novoCodigo });
        }
    };

    // ---- Alunos ----
    const Alunos = {
        async create(aluno) {
            const now = new Date().toISOString();
            const data = {
                id: Utils.String.generateId('alu'),
                ...aluno,
                matricula: Utils.String.normalizeMatricula(aluno.matricula),
                criadoEm: now,
                atualizadoEm: now
            };
            return CRUD.add('alunos', data);
        },

        async createBatch(alunos) {
            const results = [];
            for (const aluno of alunos) {
                try {
                    const created = await this.create(aluno);
                    results.push({ success: true, data: created });
                } catch (e) {
                    results.push({ success: false, error: e.message, data: aluno });
                }
            }
            return results;
        },

        async getById(id) {
            return CRUD.get('alunos', id);
        },

        async getByMatricula(matricula) {
            const results = await CRUD.getByIndex('alunos', 'matricula', Utils.String.normalizeMatricula(matricula));
            return results[0] || null;
        },

        async getByTurma(turmaId) {
            return CRUD.getByIndex('alunos', 'turmaId', turmaId);
        },

        async getAll() {
            return CRUD.getAll('alunos');
        },

        async update(id, data) {
            const aluno = await this.getById(id);
            if (!aluno) throw new Error('Aluno não encontrado');
            
            const updated = {
                ...aluno,
                ...data,
                id,
                matricula: data.matricula ? Utils.String.normalizeMatricula(data.matricula) : aluno.matricula,
                atualizadoEm: new Date().toISOString()
            };
            return CRUD.put('alunos', updated);
        },

        async delete(id) {
            return CRUD.delete('alunos', id);
        },

        async search(query, turmaId = null) {
            const all = turmaId ? await this.getByTurma(turmaId) : await this.getAll();
            const q = query.toLowerCase().trim();
            if (!q) return all;
            
            return all.filter(a => 
                a.nome.toLowerCase().includes(q) ||
                a.matricula.includes(q) ||
                (a.email && a.email.toLowerCase().includes(q))
            );
        }
    };

    // ---- Presenças ----
    const Presencas = {
        async create(presenca) {
            const now = new Date().toISOString();
            const data = {
                id: Utils.String.generateId('pres'),
                ...presenca,
                criadoEm: now
            };
            return CRUD.add('presencas', data);
        },

        async getById(id) {
            return CRUD.get('presencas', id);
        },

        async getByTurmaAndData(turmaId, data) {
            // Usar índice composto
            return CRUD.query('presencas', (p) => p.turmaId === turmaId && p.data === data, {
                index: 'turmaId_data'
            });
        },

        async getByAlunoAndData(alunoId, data) {
            return CRUD.query('presencas', (p) => p.alunoId === alunoId && p.data === data);
        },

        async getByTurmaPeriodo(turmaId, inicio, fim) {
            return CRUD.query('presencas', (p) => 
                p.turmaId === turmaId && 
                p.data >= inicio && 
                p.data <= fim
            );
        },

        async getByAlunoPeriodo(alunoId, inicio, fim) {
            return CRUD.query('presencas', (p) => 
                p.alunoId === alunoId && 
                p.data >= inicio && 
                p.data <= fim
            );
        },

        async getAll() {
            return CRUD.getAll('presencas');
        },

        async checkExists(turmaId, alunoId, data) {
            const existentes = await this.getByAlunoAndData(alunoId, data);
            return existentes.some(p => p.turmaId === turmaId);
        },

        async registrarPresenca({ turmaId, alunoId, data, metodo = 'pin', status = 'presente' }) {
            // Verifica duplicata
            const existe = await this.checkExists(turmaId, alunoId, data);
            if (existe) {
                throw new Error('Presença já registrada para este aluno hoje');
            }

            return this.create({
                turmaId,
                alunoId,
                data,
                timestamp: new Date().toISOString(),
                metodo,
                status
            });
        },

        async registrarManual({ turmaId, alunoId, data, status = 'presente', observacao = '' }) {
            const existe = await this.checkExists(turmaId, alunoId, data);
            if (existe) {
                // Atualiza existente
                const existentes = await this.getByAlunoAndData(alunoId, data);
                const pres = existentes.find(p => p.turmaId === turmaId);
                if (pres) {
                    return this.update(pres.id, { status, observacao, metodo: 'manual' });
                }
            }
            return this.registrarPresenca({ turmaId, alunoId, data, metodo: 'manual', status });
        },

        async update(id, data) {
            const pres = await this.getById(id);
            if (!pres) throw new Error('Registro não encontrado');
            
            const updated = { ...pres, ...data, id };
            return CRUD.put('presencas', updated);
        },

        async delete(id) {
            return CRUD.delete('presencas', id);
        },

        async getEstatisticasTurma(turmaId, inicio, fim) {
            const presencas = await this.getByTurmaPeriodo(turmaId, inicio, fim);
            
            const stats = {
                totalAulas: 0,
                porAluno: {},
                porData: {}
            };

            // Agrupar por data para contar aulas únicas
            const datasUnicas = new Set(presencas.map(p => p.data));
            stats.totalAulas = datasUnicas.size;

            // Por aluno
            presencas.forEach(p => {
                if (!stats.porAluno[p.alunoId]) {
                    stats.porAluno[p.alunoId] = { presencas: 0, faltas: 0, atrasos: 0, justificadas: 0 };
                }
                const alunoStats = stats.porAluno[p.alunoId];
                if (p.status === 'presente') alunoStats.presencas++;
                else if (p.status === 'atrasado') alunoStats.atrasos++;
                else if (p.status === 'justificado') alunoStats.justificadas++;
                else alunoStats.faltas++;
            });

            // Por data
            presencas.forEach(p => {
                if (!stats.porData[p.data]) {
                    stats.porData[p.data] = { presentes: 0, ausentes: 0, atrasados: 0, justificados: 0 };
                }
                const diaStats = stats.porData[p.data];
                if (p.status === 'presente') diaStats.presentes++;
                else if (p.status === 'atrasado') diaStats.atrasados++;
                else if (p.status === 'justificado') diaStats.justificados++;
                else diaStats.ausentes++;
            });

            return stats;
        }
    };

    // ---- Configurações ----
    const Config = {
        async get(chave) {
            const result = await CRUD.get('configuracoes', chave);
            return result ? result.valor : null;
        },

        async set(chave, valor) {
            return CRUD.put('configuracoes', { chave, valor, atualizadoEm: new Date().toISOString() });
        },

        async getAll() {
            const all = await CRUD.getAll('configuracoes');
            return all.reduce((acc, item) => { acc[item.chave] = item.valor; return acc; }, {});
        },

        async initDefaults() {
            const defaults = {
                escolaNome: 'Colégio Estadual Presidente Kennedy',
                anoLetivoAtual: new Date().getFullYear(),
                trimestres: [
                    { numero: 1, inicio: `${new Date().getFullYear()}-02-01`, fim: `${new Date().getFullYear()}-04-30` },
                    { numero: 2, inicio: `${new Date().getFullYear()}-05-01`, fim: `${new Date().getFullYear()}-07-31` },
                    { numero: 3, inicio: `${new Date().getFullYear()}-08-01`, fim: `${new Date().getFullYear()}-11-30` }
                ],
                codigosValidadeHoras: 4,
                pinLength: 4,
                primeiroAcesso: true
            };

            for (const [chave, valor] of Object.entries(defaults)) {
                const existing = await this.get(chave);
                if (existing === null) {
                    await this.set(chave, valor);
                }
            }
            return this.getAll();
        }
    };

    // ---- Backup/Restore ----
    const Backup = {
        async exportAll() {
            const data = {
                versao: DB_VERSION,
                exportadoEm: new Date().toISOString(),
                professores: await CRUD.getAll('professores'),
                turmas: await CRUD.getAll('turmas'),
                alunos: await CRUD.getAll('alunos'),
                presencas: await CRUD.getAll('presencas'),
                configuracoes: await CRUD.getAll('configuracoes')
            };
            return data;
        },

        async importAll(data, limparAntes = false) {
            if (limparAntes) {
                await Promise.all([
                    CRUD.clear('professores'),
                    CRUD.clear('turmas'),
                    CRUD.clear('alunos'),
                    CRUD.clear('presencas'),
                    CRUD.clear('configuracoes')
                ]);
            }

            const results = { professores: 0, turmas: 0, alunos: 0, presencas: 0, configuracoes: 0, erros: [] };

            for (const prof of data.professores || []) {
                try { await CRUD.put('professores', prof); results.professores++; }
                catch (e) { results.erros.push(`Professor ${prof.id}: ${e.message}`); }
            }
            for (const turma of data.turmas || []) {
                try { await CRUD.put('turmas', turma); results.turmas++; }
                catch (e) { results.erros.push(`Turma ${turma.id}: ${e.message}`); }
            }
            for (const aluno of data.alunos || []) {
                try { await CRUD.put('alunos', aluno); results.alunos++; }
                catch (e) { results.erros.push(`Aluno ${aluno.id}: ${e.message}`); }
            }
            for (const pres of data.presencas || []) {
                try { await CRUD.put('presencas', pres); results.presencas++; }
                catch (e) { results.erros.push(`Presença ${pres.id}: ${e.message}`); }
            }
            for (const config of data.configuracoes || []) {
                try { await CRUD.put('configuracoes', config); results.configuracoes++; }
                catch (e) { results.erros.push(`Config ${config.chave}: ${e.message}`); }
            }

            return results;
        },

        async clearAll() {
            await Promise.all([
                CRUD.clear('professores'),
                CRUD.clear('turmas'),
                CRUD.clear('alunos'),
                CRUD.clear('presencas'),
                CRUD.clear('configuracoes')
            ]);
        }
    };

    // ========================================
    // Export
    // ========================================
    return {
        init,
        CRUD,
        Professores,
        Turmas,
        Alunos,
        Presencas,
        Config,
        Backup,
        STORES
    };
})();

// Inicializar configurações padrão
document.addEventListener('DOMContentLoaded', () => {
    AppDB.Config.initDefaults().catch(console.error);
});
