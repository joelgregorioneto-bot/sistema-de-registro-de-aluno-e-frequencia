# Sistema de Chamada Digital
**Colégio Estadual Presidente Kennedy**

Sistema web para registro de presença de alunos via código PIN, com relatórios diários/trimestrais e exportação para Excel, CSV e PDF.

## 🚀 Funcionalidades

- **Autenticação** de professores (login/senha com hash bcrypt)
- **Gestão de Turmas** e Alunos (CRUD completo + importação CSV)
- **Chamada Digital** via PIN numérico (alunos marcam pelo celular)
- **Dashboard** com estatísticas em tempo real
- **Relatórios**: Diário (quantos vieram hoje) e Trimestral (% frequência)
- **Exportação**: Excel (.xlsx), CSV (UTF-8), PDF profissional
- **Offline-first**: Funciona 100% offline (IndexedDB)
- **Responsivo**: Funciona em desktop, tablet e celular

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript Vanilla (ES6+)
- **Banco**: IndexedDB (navegador)
- **Bibliotecas** (CDN):
  - bcryptjs - Hash de senhas
  - SheetJS (xlsx) - Exportação Excel/CSV
  - jsPDF + AutoTable - Exportação PDF
  - Chart.js - Gráficos (opcional)

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/joelgregorioneto-bot/sistema-de-registro-de-aluno-e-frequencia.git
cd sistema-de-registro-de-aluno-e-frequencia

# Sirva com qualquer servidor estático
# Opção 1: Python
python3 -m http.server 8000

# Opção 2: Node.js (serve)
npx serve .

# Opção 3: VS Code Live Server
# Clique com botão direito no index.html > "Open with Live Server"
```

Acesse: `http://localhost:8000`

## 🔐 Primeiro Acesso

1. Abra o sistema no navegador
2. Na tela de login, clique em "Cadastrar primeiro acesso"
3. Preencha: Nome, Email, Senha
4. O sistema criará dados de exemplo automaticamente

**Credenciais de teste (após seed):**
- Email: `professor@kennedy.edu.br`
- Senha: `123456`

## 📱 Como Usar

### Professor
1. **Login** → Dashboard
2. **Turmas** → "Nova Turma" → Define nome, disciplina, período
3. **Alunos** → Importa CSV ou cadastra manualmente
4. **Chamada** → Seleciona turma → "Iniciar Chamada" → Exibe PIN do dia
5. **Relatórios** → Diário ou Trimestral → "Exportar"

### Aluno
1. Acessa: `seu-sistema.com/checkin?turma=CODIGO_DA_TURMA`
2. Digita o **PIN do dia** (exibido pelo professor)
3. Seleciona seu nome na lista
4. Confirma → "Presença confirmada ✓"

## 📊 Estrutura do Projeto

```
sistema-chamada/
├── index.html              # Entry point
├── css/
│   ├── variables.css       # Design tokens (cores, espaçamento)
│   ├── styles.css          # Estilos principais
│   ├── components.css      # Componentes (modal, toast, table, etc)
│   └── print.css           # Estilos para PDF/impressão
├── js/
│   ├── app.js              # App principal + router
│   ├── auth.js             # Autenticação
│   ├── db.js               # IndexedDB wrapper
│   ├── ui.js               # Componentes UI (toast, modal, table)
│   ├── utils.js            # Helpers (datas, strings, validação)
│   ├── attendance.js       # Lógica de chamada (Fase 3)
│   ├── reports.js          # Relatórios (Fase 4)
│   └── export.js           # Exportação (Fase 5)
├── data/
│   └── seed.js             # Dados de exemplo
├── lib/                    # Fallbacks locais das libs CDN
└── assets/
    └── favicon.ico
```

## 🔧 Configuração

Edite `js/app.js` ou `data/seed.js` para personalizar:
- Nome da escola
- Períodos letivos (trimestres)
- Validade do PIN (padrão: 4 horas)
- Tamanho do PIN (padrão: 4 dígitos)

## 📤 Exportação de Dados

O sistema permite:
- **Backup completo** (JSON) - Configurações > Exportar Backup
- **Relatórios** - Excel/CSV/PDF por turma e período
- **Importação** - CSV de alunos (matrícula, nome, email opcional)

## 🔒 Segurança

- Senhas hasheadas com bcrypt (cost 10)
- PIN de chamada regenerado a cada sessão
- Validação anti-duplicata (aluno não marca 2x no mesmo dia)
- Sanitização de inputs (prevenção XSS)
- CSP configurado

## 📱 PWA (Futuro)

Para instalar como app:
1. Chrome/Edge: Menu > "Instalar aplicativo"
2. Safari iOS: Compartilhar > "Adicionar à Tela de Início"
3. Funciona offline após primeira carga

## 🐛 Solução de Problemas

**Dados não salvam?**
- Verifique se IndexedDB está habilitado (modo incógnito pode bloquear)
- Tente limpar cache do navegador

**Exportação PDF não funciona?**
- Permita pop-ups para o site
- Verifique console para erros de CDN

**PIN não funciona?**
- PIN expira em 4 horas por padrão
- Professor deve "Iniciar Chamada" para gerar novo PIN

## 📄 Licença

MIT License - Uso livre para fins educacionais.

---

**Desenvolvido para o Colégio Estadual Presidente Kennedy** 🏫
