# Planejamento: Sistema de Registro de Alunos (Chamada Digital)

## 1. Visão Geral
Sistema web (HTML/CSS/JS vanilla) para registro de presença via código numérico/PIN, com autenticação de professores, relatórios diários/trimestrais e exportação para PDF/Excel/CSV.

---

## 2. Arquitetura e Tecnologias

### Frontend
- **HTML5 + CSS3 + JavaScript Vanilla (ES6+)**
- Estrutura modular: `index.html`, `css/styles.css`, `js/app.js`, `js/auth.js`, `js/attendance.js`, `js/reports.js`, `js/export.js`
- LocalStorage/IndexedDB para persistência local (offline-first)
- Chart.js para gráficos de frequência (opcional, via CDN)

### Backend (Simulado/Local)
- **IndexedDB** para armazenamento estruturado no navegador
- Dados: alunos, turmas, professores, registros de presença, configurações
- Sincronização futura com backend real (Firebase/Supabase/Node.js) preparada

### Bibliotecas Externas (CDN)
- **SheetJS (xlsx)** - Exportação Excel/CSV
- **jsPDF + jsPDF-AutoTable** - Exportação PDF
- **Chart.js** - Gráficos de frequência (opcional)

---

## 3. Modelo de Dados

### Entidades Principais

```javascript
// Professor
{
  id: "prof_001",
  nome: "João Silva",
  email: "joao@escola.com",
  senhaHash: "hash_bcrypt",
  turmas: ["turma_1", "turma_2"]
}

// Turma
{
  id: "turma_1",
  nome: "3º Ano A - Matemática",
  codigoAcesso: "MAT3A2024", // Código PIN da turma
  professorId: "prof_001",
  alunos: ["alu_001", "alu_002", ...],
  anoLetivo: 2024,
  periodo: "1º Trimestre"
}

// Aluno
{
  id: "alu_001",
  nome: "Maria Santos",
  matricula: "20240001",
  turmaId: "turma_1",
  email: "maria@aluno.com" // opcional
}

// Registro de Presença
{
  id: "pres_001",
  alunoId: "alu_001",
  turmaId: "turma_1",
  data: "2024-03-15",
  timestamp: "2024-03-15T07:30:00Z",
  metodo: "pin", // ou "manual"
  status: "presente" // "presente", "atrasado", "justificado", "falta"
}

// Configuração do Sistema
{
  anoLetivoAtual: 2024,
  trimestres: [
    { numero: 1, inicio: "2024-02-01", fim: "2024-04-30" },
    { numero: 2, inicio: "2024-05-01", fim: "2024-07-31" },
    { numero: 3, inicio: "2024-08-01", fim: "2024-11-30" }
  ],
  codigosValidadeHoras: 4 // PIN expira em 4h
}
```

---

## 4. Funcionalidades por Módulo

### 4.1 Autenticação (auth.js)
- [ ] Login professor (email + senha)
- [ ] Hash de senha com bcryptjs (client-side)
- [ ] Sessão persistente (sessionStorage + remember me)
- [ ] Logout
- [ ] Recuperação de senha (simulada - admin reseta)
- [ ] Cadastro de novo professor (primeiro acesso)

### 4.2 Gestão de Turmas e Alunos (app.js)
- [ ] CRUD Turmas: criar, editar, excluir, listar
- [ ] Gerar código PIN único por turma (alfanumérico 8-10 chars)
- [ ] CRUD Alunos: importar CSV/Excel, adicionar manual, editar, excluir
- [ ] Vincular aluno à turma
- [ ] Visualizar lista de alunos por turma

### 4.3 Registro de Presença (attendance.js)
**Tela do Professor:**
- [ ] Selecionar turma
- [ ] Gerar/Exibir PIN do dia (regenera a cada dia ou aula)
- [ ] Botão "Iniciar Chamada" - abre modal com PIN grande + QR code opcional
- [ ] Lista em tempo real: quem já marcou (nome + horário)
- [ ] Marcar manualmente (para alunos sem celular)
- [ ] Fechar chamada (define horário limite)

**Tela do Aluno (acesso via /checkin?turma=XXX):**
- [ ] Pede código PIN da turma
- [ ] Seleciona próprio nome da lista da turma
- [ ] Confirma presença → registra timestamp
- [ ] Feedback visual: "Presença confirmada ✓"
- [ ] Impede duplicata no mesmo dia

### 4.4 Relatórios e Dashboards (reports.js)
**Dashboard Principal:**
- [ ] Cards resumo: Total alunos, Presentes hoje, Ausentes hoje, % Frequência dia
- [ ] Gráfico de frequência semanal (últimos 7 dias)
- [ ] Top 5 alunos com menor frequência (alerta)

**Relatório Diário:**
- [ ] Lista completa: Aluno | Matrícula | Status | Horário
- [ ] Filtros: Turma, Data, Status
- [ ] Totais: Presentes, Ausentes, Atrasados, Justificados

**Relatório Trimestral:**
- [ ] Por aluno: Total aulas | Presenças | Faltas | % Frequência
- [ ] Destacar abaixo de 75% (vermelho), 75-85% (amarelo), >85% (verde)
- [ ] Por turma: Média de frequência da turma
- [ ] Filtro por trimestre (1º, 2º, 3º)

### 4.5 Exportação (export.js)
- [ ] **Excel (.xlsx)**: Múltiplas abas (Diário, Trimestral, Alunos, Resumo)
- [ ] **CSV**: Encoding UTF-8 com BOM para Excel brasileiro
- [ ] **PDF**: Layout profissional com cabeçalho da escola, rodapé paginado
  - Relatório diário: 1 página por turma
  - Relatório trimestral: Tabela completa + página de resumo
- [ ] Botão "Exportar" em cada tela de relatório
- [ ] Nome do arquivo: `frequencia_TURMA_YYYY-MM-DD.xlsx`

---

## 5. Telas/Rotas (Single Page Application)

| Rota | Descrição | Acesso |
|------|-----------|--------|
| `/` | Login / Dashboard (se logado) | Público/Privado |
| `/login` | Tela de login | Público |
| `/turmas` | Listar/gerenciar turmas | Professor |
| `/turmas/nova` | Criar turma | Professor |
| `/turmas/:id/alunos` | Gerenciar alunos da turma | Professor |
| `/chamada/:turmaId` | Tela de chamada (professor) | Professor |
| `/checkin?turma=:id` | Tela de check-in (aluno) | Público (com PIN) |
| `/relatorios/diario` | Relatório de presença do dia | Professor |
| `/relatorios/trimestral` | Relatório trimestral | Professor |
| `/configuracoes` | Configurações do sistema | Professor |

---

## 6. Fluxo de Uso Principal

```
1. Professor acessa sistema → Login
2. Cria turma "3ºA Matemática" → Sistema gera PIN: "MAT3A2024"
3. Importa alunos via CSV ou cadastra manualmente
4. No dia da aula:
   a. Professor entra em /chamada/3A-Matemática
   b. Clica "Iniciar Chamada" → PIN do dia exibido (ex: "7842")
   c. Alunos acessam /checkin?turma=3A-Matemática no celular
   d. Alunos digitam PIN "7842" → Selecionam nome → Confirmam
   e. Professor vê lista atualizando em tempo real
   f. Professor clica "Encerrar Chamada"
5. Fim do dia/trimestre:
   a. Professor vai em Relatórios → Diário ou Trimestral
   b. Filtra se necessário
   c. Clica "Exportar Excel/PDF/CSV"
   d. Entrega à coordenação
```

---

## 7. Estrutura de Arquivos

```
/home/aluno/sistema-chamada/
├── index.html              # Entry point + router simples
├── css/
│   ├── styles.css          # Estilos principais
│   ├── components.css      # Componentes reutilizáveis
│   ├── print.css           # Estilos para PDF/impressão
│   └── variables.css       # CSS Custom Properties (tema)
├── js/
│   ├── app.js              # Inicialização, roteamento, estado global
│   ├── auth.js             # Autenticação, sessão, hash senha
│   ├── db.js               # IndexedDB wrapper (CRUD genérico)
│   ├── attendance.js       # Lógica de chamada/check-in
│   ├── reports.js          # Cálculos e renderização de relatórios
│   ├── export.js           # Exportação Excel/CSV/PDF
│   ├── ui.js               # Utilitários UI: modais, toasts, tabelas
│   └── utils.js            # Helpers: datas, formatação, validação
├── lib/                    # Bibliotecas locais (fallback CDN)
│   ├── xlsx.min.js
│   ├── jspdf.umd.min.js
│   ├── jspdf.autotable.min.js
│   └── chart.min.js
├── data/
│   └── seed.js             # Dados de exemplo para teste
├── assets/
│   ├── logo.png
│   └── favicon.ico
└── README.md
```

---

## 8. Segurança e Validações

- [ ] Senhas: hash com bcryptjs (cost 10) - nunca armazenar em texto plano
- [ ] PIN de chamada: regenerado a cada sessão, válido por 4h
- [ ] Validação: aluno não pode marcar 2x no mesmo dia/turma
- [ ] Rate limiting: máximo 5 tentativas de PIN errado por IP/hora
- [ ] Sanitização: escapar HTML em inputs (prevenir XSS)
- [ ] CSP: Content Security Policy restritiva

---

## 9. Cronograma de Implementação

### Fase 1: Fundação (Semana 1)
- [ ] Estrutura HTML/CSS base + roteador
- [ ] IndexedDB wrapper (db.js)
- [ ] Autenticação completa (login, logout, sessão)
- [ ] Seed de dados de teste

### Fase 2: Gestão (Semana 2)
- [ ] CRUD Turmas + geração de PIN
- [ ] CRUD Alunos + importação CSV
- [ ] Validações e UI polida

### Fase 3: Chamada (Semana 3)
- [ ] Tela professor: iniciar/encerrar, PIN do dia, lista tempo real
- [ ] Tela aluno: check-in via PIN
- [ ] Sincronização em tempo real (polling ou BroadcastChannel)

### Fase 4: Relatórios (Semana 4)
- [ ] Dashboard com cards + gráfico
- [ ] Relatório diário com filtros
- [ ] Relatório trimestral com cálculos de %

### Fase 5: Exportação (Semana 5)
- [ ] Exportação Excel (múltiplas abas)
- [ ] Exportação CSV
- [ ] Exportação PDF (layout profissional)
- [ ] Testes de integração

### Fase 6: Polimento (Semana 6)
- [ ] Responsividade mobile
- [ ] Acessibilidade (ARIA, contraste, teclado)
- [ ] Tratamento de erros + logs
- [ ] Documentação README + manual usuário

---

## 10. Próximos Passos

1. **Confirmar** se o planejamento atende suas necessidades
2. **Definir** nome da escola/instituição para personalizar relatórios
3. **Escolher** se quer dados de exemplo (seed) realistas para testar
4. **Iniciar** implementação pela Fase 1

---

## 11. Observações Importantes

- **Offline-first**: Sistema funciona 100% offline após primeiro carregamento
- **Privacidade**: Dados ficam no navegador do professor (IndexedDB)
- **Backup**: Implementar botão "Exportar Backup Completo" (JSON)
- **Migração futura**: Estrutura preparada para backend (Firebase/Supabase)
- **LGPD**: Não coleta dados sensíveis desnecessários; opção "Limpar Todos os Dados"
