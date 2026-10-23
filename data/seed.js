/**
 * Dados de Exemplo (Seed) - Sistema de Chamada Digital
 * Colégio Estadual Presidente Kennedy
 * 
 * Execute no console: await Seed.run()
 * Ou aguarde auto-inicialização se for primeiro acesso
 */

window.Seed = (function() {
    'use strict';

    // ========================================
    // Dados de Exemplo
    // ========================================
    const professorExemplo = {
        nome: 'Professor Exemplo',
        email: 'professor@kennedy.edu.br',
        senha: '123456'
    };

    const turmasExemplo = [
        {
            nome: '3º Ano A - Matemática',
            disciplina: 'Matemática',
            anoLetivo: 2024,
            periodo: '1º Trimestre',
            codigoAcesso: 'MAT3A2024'
        },
        {
            nome: '3º Ano B - Português',
            disciplina: 'Português',
            anoLetivo: 2024,
            periodo: '1º Trimestre',
            codigoAcesso: 'POR3B2024'
        },
        {
            nome: '2º Ano A - História',
            disciplina: 'História',
            anoLetivo: 2024,
            periodo: '1º Trimestre',
            codigoAcesso: 'HIS2A2024'
        }
    ];

    const alunosExemplo = {
        '3º Ano A - Matemática': [
            { nome: 'Ana Silva Santos', matricula: '20240001' },
            { nome: 'Bruno Oliveira Costa', matricula: '20240002' },
            { nome: 'Carla Ferreira Lima', matricula: '20240003' },
            { nome: 'Daniel Souza Pereira', matricula: '20240004' },
            { nome: 'Eduarda Rodrigues Alves', matricula: '20240005' },
            { nome: 'Felipe Martins Gonçalves', matricula: '20240006' },
            { nome: 'Gabriela Ribeiro Carvalho', matricula: '20240007' },
            { nome: 'Henrique Almeida Nunes', matricula: '20240008' },
            { nome: 'Isabela Dias Martins', matricula: '20240009' },
            { nome: 'João Pedro Barbosa', matricula: '20240010' },
            { nome: 'Laura Cardoso Melo', matricula: '20240011' },
            { nome: 'Lucas Gomes Rocha', matricula: '20240012' },
            { nome: 'Mariana Castro Sousa', matricula: '20240013' },
            { nome: 'Nathan Oliveira Santos', matricula: '20240014' },
            { nome: 'Olívia Fernandes Lima', matricula: '20240015' },
            { nome: 'Pedro Henrique Silva', matricula: '20240016' },
            { nome: 'Rafaela Costa Pereira', matricula: '20240017' },
            { nome: 'Samuel Rodrigues Alves', matricula: '20240018' },
            { nome: 'Tatiane Martins Gonçalves', matricula: '20240019' },
            { nome: 'Vinícius Ribeiro Carvalho', matricula: '20240020' },
            { nome: 'Yasmin Almeida Nunes', matricula: '20240021' },
            { nome: 'Arthur Dias Martins', matricula: '20240022' },
            { nome: 'Beatriz Barbosa Silva', matricula: '20240023' },
            { nome: 'Cauã Cardoso Melo', matricula: '20240024' },
            { nome: 'Davi Gomes Rocha', matricula: '20240025' },
            { nome: 'Ester Castro Sousa', matricula: '20240026' },
            { nome: 'Fernanda Oliveira Santos', matricula: '20240027' },
            { nome: 'Gabriel Fernandes Lima', matricula: '20240028' },
            { nome: 'Helena Silva Costa', matricula: '20240029' },
            { nome: 'Igor Pereira Alves', matricula: '20240030' },
            { nome: 'Júlia Gonçalves Carvalho', matricula: '20240031' },
            { nome: 'Kevin Nunes Dias', matricula: '20240032' },
            { nome: 'Larissa Martins Barbosa', matricula: '20240033' },
            { nome: 'Miguel Melo Cardoso', matricula: '20240034' },
            { nome: 'Nicole Rocha Gomes', matricula: '20240035' },
            { nome: 'Otávio Sousa Castro', matricula: '20240036' },
            { nome: 'Pietra Santos Oliveira', matricula: '20240037' },
            { nome: 'Rafael Lima Fernandes', matricula: '20240038' },
            { nome: 'Sofia Costa Silva', matricula: '20240039' },
            { nome: 'Thiago Alves Pereira', matricula: '20240040' }
        ],
        '3º Ano B - Português': [
            { nome: 'Adriana Silva Santos', matricula: '20240101' },
            { nome: 'Bernardo Oliveira Costa', matricula: '20240102' },
            { nome: 'Camila Ferreira Lima', matricula: '20240103' },
            { nome: 'Diego Souza Pereira', matricula: '20240104' },
            { nome: 'Elaine Rodrigues Alves', matricula: '20240105' },
            { nome: 'Fábio Martins Gonçalves', matricula: '20240106' },
            { nome: 'Giovana Ribeiro Carvalho', matricula: '20240107' },
            { nome: 'Heitor Almeida Nunes', matricula: '20240108' },
            { nome: 'Iara Dias Martins', matricula: '20240109' },
            { nome: 'Jorge Pedro Barbosa', matricula: '20240110' },
            { nome: 'Karina Cardoso Melo', matricula: '20240111' },
            { nome: 'Leandro Gomes Rocha', matricula: '20240112' },
            { nome: 'Lívia Castro Sousa', matricula: '20240113' },
            { nome: 'Marcelo Oliveira Santos', matricula: '20240114' },
            { nome: 'Natalia Fernandes Lima', matricula: '20240115' },
            { nome: 'Otávio Henrique Silva', matricula: '20240116' },
            { nome: 'Patrícia Costa Pereira', matricula: '20240117' },
            { nome: 'Ricardo Rodrigues Alves', matricula: '20240118' },
            { nome: 'Sabrina Martins Gonçalves', matricula: '20240119' },
            { nome: 'Tiago Ribeiro Carvalho', matricula: '20240120' },
            { nome: 'Ursula Almeida Nunes', matricula: '20240121' },
            { nome: 'Victor Dias Martins', matricula: '20240122' },
            { nome: 'Vanessa Barbosa Silva', matricula: '20240123' },
            { nome: 'Wesley Cardoso Melo', matricula: '20240124' },
            { nome: 'Xênia Gomes Rocha', matricula: '20240125' },
            { nome: 'Yuri Castro Sousa', matricula: '20240126' },
            { nome: 'Zilda Santos Oliveira', matricula: '20240127' },
            { nome: 'Alexandre Lima Fernandes', matricula: '20240128' },
            { nome: 'Bianca Costa Silva', matricula: '20240129' },
            { nome: 'César Alves Pereira', matricula: '20240130' }
        ],
        '2º Ano A - História': [
            { nome: 'Amanda Silva Santos', matricula: '20240201' },
            { nome: 'Bernardo Oliveira Costa', matricula: '20240202' },
            { nome: 'Clara Ferreira Lima', matricula: '20240203' },
            { nome: 'Daniel Souza Pereira', matricula: '20240204' },
            { nome: 'Elisa Rodrigues Alves', matricula: '20240205' },
            { nome: 'Felipe Martins Gonçalves', matricula: '20240206' },
            { nome: 'Giulia Ribeiro Carvalho', matricula: '20240207' },
            { nome: 'Henrique Almeida Nunes', matricula: '20240208' },
            { nome: 'Isabela Dias Martins', matricula: '20240209' },
            { nome: 'João Pedro Barbosa', matricula: '20240210' },
            { nome: 'Larissa Cardoso Melo', matricula: '20240211' },
            { nome: 'Lucas Gomes Rocha', matricula: '20240212' },
            { nome: 'Mariana Castro Sousa', matricula: '20240213' },
            { nome: 'Nathan Oliveira Santos', matricula: '20240214' },
            { nome: 'Olívia Fernandes Lima', matricula: '20240215' },
            { nome: 'Pedro Henrique Silva', matricula: '20240216' },
            { nome: 'Rafaela Costa Pereira', matricula: '20240217' },
            { nome: 'Samuel Rodrigues Alves', matricula: '20240218' },
            { nome: 'Tatiane Martins Gonçalves', matricula: '20240219' },
            { nome: 'Vinícius Ribeiro Carvalho', matricula: '20240220' },
            { nome: 'Yasmin Almeida Nunes', matricula: '20240221' },
            { nome: 'Arthur Dias Martins', matricula: '20240222' },
            { nome: 'Beatriz Barbosa Silva', matricula: '20240223' },
            { nome: 'Cauã Cardoso Melo', matricula: '20240224' },
            { nome: 'Davi Gomes Rocha', matricula: '20240225' },
            { nome: 'Ester Castro Sousa', matricula: '20240226' },
            { nome: 'Fernanda Oliveira Santos', matricula: '20240227' },
            { nome: 'Gabriel Fernandes Lima', matricula: '20240228' },
            { nome: 'Helena Silva Costa', matricula: '20240229' },
            { nome: 'Igor Pereira Alves', matricula: '20240230' }
        ]
    };

    // ========================================
    // Gera Presenças Aleatórias (últimos 30 dias)
    // ========================================
    function gerarPresencasAleatorias(turmaId, alunos, dias = 30) {
        const presencas = [];
        const hoje = new Date();
        const statusOptions = ['presente', 'presente', 'presente', 'presente', 'presente', 'atrasado', 'justificado', 'falta'];
        // Peso: 5 presente, 1 atrasado, 1 justificado, 1 falta = ~78% frequência
        
        for (let d = dias - 1; d >= 0; d--) {
            const data = new Date(hoje);
            data.setDate(data.getDate() - d);
            
            // Pula finais de semana
            const diaSemana = data.getDay();
            if (diaSemana === 0 || diaSemana === 6) continue;
            
            const dataISO = data.toISOString().split('T')[0];
            
            // Cada aula tem ~85% de chance de ter ocorrido
            if (Math.random() > 0.15) {
                for (const aluno of alunos) {
                    // Aluno tem presença baseada no peso
                    const rand = Math.random();
                    let status;
                    if (rand < 0.65) status = 'presente';
                    else if (rand < 0.75) status = 'atrasado';
                    else if (rand < 0.85) status = 'justificado';
                    else status = 'falta';
                    
                    if (status !== 'falta') {
                        const horaBase = 7 + Math.floor(Math.random() * 2); // 7h ou 8h
                        const minuto = Math.floor(Math.random() * 60);
                        const timestamp = new Date(data);
                        timestamp.setHours(horaBase, minuto, 0, 0);
                        
                        if (status === 'atrasado') {
                            timestamp.setHours(horaBase + 1, minuto, 0, 0); // Atrasado 1h
                        }
                        
                        presencas.push({
                            turmaId,
                            alunoId: aluno.id,
                            data: dataISO,
                            timestamp: timestamp.toISOString(),
                            metodo: Math.random() > 0.3 ? 'pin' : 'manual',
                            status
                        });
                    }
                }
            }
        }
        
        return presencas;
    }

    // ========================================
    // Execução do Seed
    // ========================================
    async function run() {
        console.log('🌱 Iniciando seed de dados...');
        
        try {
            // Verifica se já existe professor
            const existingProf = await AppDB.Professores.getByEmail(professorExemplo.email);
            if (existingProf) {
                console.log('✅ Dados já existem, pulando seed');
                return { success: true, message: 'Dados já existentes' };
            }

            // 1. Cria professor
            console.log('👨‍🏫 Criando professor...');
            const senhaHash = await Auth.hashPassword(professorExemplo.senha);
            const professor = await AppDB.Professores.create({
                nome: professorExemplo.nome,
                email: professorExemplo.email,
                senhaHash
            });
            console.log('✅ Professor criado:', professor.nome);

            // 2. Cria turmas e alunos
            console.log('🏫 Criando turmas e alunos...');
            const turmasCriadas = [];
            
            for (const turmaData of turmasExemplo) {
                const turma = await AppDB.Turmas.create({
                    ...turmaData,
                    professorId: professor.id
                });
                turmasCriadas.push(turma);
                console.log(`✅ Turma: ${turma.nome} (Código: ${turma.codigoAcesso})`);
                
                // Alunos da turma
                const alunosTurma = alunosExemplo[turma.nome] || [];
                const alunosCriados = [];
                
                for (const alunoData of alunosTurma) {
                    const aluno = await AppDB.Alunos.create({
                        ...alunoData,
                        turmaId: turma.id,
                        email: `${alunoData.matricula}@aluno.kennedy.edu.br`
                    });
                    alunosCriados.push(aluno);
                }
                
                console.log(`   👥 ${alunosCriados.length} alunos cadastrados`);
                
                // 3. Gera presenças aleatórias
                console.log(`   📅 Gerando presenças dos últimos 30 dias...`);
                const presencas = gerarPresencasAleatorias(turma.id, alunosCriados, 30);
                
                for (const presenca of presencas) {
                    try {
                        await AppDB.Presencas.create(presenca);
                    } catch (e) {
                        // Ignora duplicatas
                    }
                }
                console.log(`   ✅ ${presencas.length} registros de presença criados`);
            }

            // 4. Configurações adicionais
            await AppDB.Config.set('escolaNome', 'Colégio Estadual Presidente Kennedy');
            await AppDB.Config.set('primeiroAcesso', false);

            console.log('🎉 Seed concluído com sucesso!');
            console.log('');
            console.log('📋 Credenciais de acesso:');
            console.log(`   Email: ${professorExemplo.email}`);
            console.log(`   Senha: ${professorExemplo.senha}`);
            console.log('');
            console.log('🔑 Códigos de acesso das turmas:');
            turmasCriadas.forEach(t => {
                console.log(`   ${t.nome}: ${t.codigoAcesso}`);
            });

            return { success: true, professor, turmas: turmasCriadas };

        } catch (error) {
            console.error('❌ Erro no seed:', error);
            return { success: false, error: error.message };
        }
    }

    // ========================================
    // Limpar todos os dados
    // ========================================
    async function clear() {
        console.log('🗑️ Limpando todos os dados...');
        await AppDB.Backup.clearAll();
        console.log('✅ Dados limpos');
        return { success: true };
    }

    // ========================================
    // Exportar backup
    // ========================================
    async function exportBackup() {
        const data = await AppDB.Backup.exportAll();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `backup-chamada-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        return data;
    }

    // ========================================
    // Auto-run se primeiro acesso
    // ========================================
    async function autoInit() {
        const primeiroAcesso = await AppDB.Config.get('primeiroAcesso');
        if (primeiroAcesso !== false) {
            // Aguarda um pouco para garantir que tudo carregou
            setTimeout(() => run(), 1000);
        }
    }

    // Auto-inicializa
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', autoInit);
    } else {
        autoInit();
    }

    // ========================================
    // Export
    // ========================================
    return {
        run,
        clear,
        exportBackup,
        professorExemplo,
        turmasExemplo,
        alunosExemplo
    };
})();

// Disponibiliza globalmente para console
window.Seed = window.Seed;
