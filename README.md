# Andaimes Pro - Sistema SaaS de Gestão de Orçamentos

Sistema completo de gestão de orçamentos para lojas de andaimes com assinatura mensal de R$ 99,90.

## 🚀 Funcionalidades

### Para Lojas de Andaimes
- ✅ **Dashboard Completo** - Métricas, alertas e visão geral dos orçamentos
- ✅ **Gestão de Orçamentos** - Listagem, filtros, visualização detalhada e exportação
- ✅ **Formulário Personalizado** - URL única por loja para receber orçamentos
- ✅ **Integração WhatsApp** - Envio automático de orçamentos via WhatsApp
- ✅ **Sistema de Assinatura** - Pagamento mensal com Stripe
- ✅ **Configurações Avançadas** - Dados da loja, segurança e personalização

### Para Clientes
- ✅ **Formulário Intuitivo** - Seleção de tipos de andaime (1x1, 1x1.50, 1x2.00)
- ✅ **Cálculo Automático** - Quantidades por altura e número de torres
- ✅ **Envio via WhatsApp** - Orçamento formatado enviado diretamente

## 🛠️ Stack Tecnológica

- **Frontend**: React.js + TypeScript + Next.js 14
- **Backend**: Next.js API Routes + Node.js
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT com refresh tokens
- **Pagamentos**: Stripe
- **UI/UX**: Tailwind CSS + shadcn/ui
- **Deploy**: Vercel (frontend) + Railway/Supabase (database)

## 📦 Instalação

### Pré-requisitos
- Node.js 18+
- PostgreSQL 14+
- Conta Stripe (para pagamentos)

### 1. Clone o repositório
\`\`\`bash
git clone https://github.com/seu-usuario/andaimes-pro.git
cd andaimes-pro
\`\`\`

### 2. Instale as dependências
\`\`\`bash
npm install
\`\`\`

### 3. Configure as variáveis de ambiente
\`\`\`bash
cp .env.example .env.local
\`\`\`

Edite o arquivo `.env.local` com suas configurações:
- `DATABASE_URL`: String de conexão PostgreSQL
- `JWT_SECRET`: Chave secreta para JWT
- `STRIPE_SECRET_KEY`: Chave secreta do Stripe
- `STRIPE_PUBLISHABLE_KEY`: Chave pública do Stripe

### 4. Configure o banco de dados
\`\`\`bash
# Execute as migrações
npm run db:migrate

# Popule com dados de exemplo (opcional)
npm run db:seed
\`\`\`

### 5. Execute o projeto
\`\`\`bash
npm run dev
\`\`\`

Acesse `http://localhost:3000`

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais
- **users** - Dados das lojas e proprietários
- **subscriptions** - Status e detalhes das assinaturas
- **budget_requests** - Solicitações de orçamento dos clientes
- **payments** - Histórico de pagamentos
- **audit_logs** - Logs de auditoria do sistema

### Scripts SQL
- `scripts/001-create-database-schema.sql` - Criação das tabelas
- `scripts/002-seed-sample-data.sql` - Dados de exemplo

## 🔐 Segurança

- ✅ Senhas criptografadas com bcrypt (12 rounds)
- ✅ JWT com refresh tokens
- ✅ Rate limiting em rotas públicas
- ✅ Validação de entrada em todos os endpoints
- ✅ Headers de segurança (helmet.js)
- ✅ Sanitização de dados
- ✅ Logs de auditoria

## 💳 Sistema de Pagamentos

### Integração Stripe
- Pagamento mensal de R$ 99,90
- Suporte a cartões de crédito
- Webhooks para atualizações automáticas
- Histórico completo de transações
- Renovação automática

### Fluxo de Pagamento
1. Usuário se cadastra
2. Escolhe o plano profissional
3. Preenche dados do cartão
4. Stripe processa o pagamento
5. Sistema ativa a assinatura
6. Formulário fica disponível

## 📱 Formulário de Orçamento

### Tipos de Andaime Suportados
- **1x1m** - Alturas: 2M, 3M, 4M, 5M
- **1x1.50m** - Alturas: 2M até 10M
- **1x2.00m** - Alturas: 2M até 10M

### Componentes Calculados
- Painéis metálicos
- Pisos metálicos
- Diagonais
- Rodas com rolamento
- Sapatas ajustáveis
- Guarda-corpos (com/sem porta)
- Escadas (1m e 2m)

## 🚀 Deploy

### Vercel (Recomendado)
\`\`\`bash
# Instale a CLI do Vercel
npm i -g vercel

# Deploy
vercel --prod
\`\`\`

### Variáveis de Ambiente (Produção)
Configure no painel da Vercel:
- `DATABASE_URL`
- `JWT_SECRET`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

## 📊 Monitoramento

### Health Check
- Endpoint: `GET /api/health`
- Verifica conexão com banco de dados
- Status da aplicação

### Logs
- Logs de auditoria no banco
- Logs de erro no console
- Métricas de uso (opcional)

## 🧪 Testes

\`\`\`bash
# Testes unitários
npm run test

# Testes de integração
npm run test:integration

# Coverage
npm run test:coverage
\`\`\`

## 📝 API Documentation

### Autenticação
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Cadastro
- `POST /api/auth/refresh` - Refresh token
- `POST /api/auth/forgot-password` - Recuperar senha

### Orçamentos
- `GET /api/budgets` - Listar orçamentos
- `POST /api/budgets` - Criar orçamento
- `PUT /api/budgets/:id` - Atualizar orçamento
- `DELETE /api/budgets/:id` - Excluir orçamento

### Pagamentos
- `POST /api/payments/create-intent` - Criar intenção de pagamento
- `POST /api/payments/confirm` - Confirmar pagamento
- `POST /api/webhooks/stripe` - Webhook Stripe

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

- Email: suporte@andaimes-pro.com
- WhatsApp: (41) 99763-0212
- Documentação: https://docs.andaimes-pro.com

---

**Andaimes Pro** - Transformando a gestão de orçamentos de andaimes no Brasil 🇧🇷
