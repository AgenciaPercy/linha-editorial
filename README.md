# Aprovação de Linha Editorial

Sistema colaborativo para agência e cliente aprovarem conteúdos editoriais pelo mesmo link, sem login — apenas um link com token seguro (`/aprovacao/[slug]?token=...`).

## Stack

- Next.js 14 (App Router) + TypeScript
- TailwindCSS
- Prisma + PostgreSQL
- Deploy: Railway
- Upload de imagens: disco local / Railway Volume (servido via `/api/uploads/[filename]`)

O banco de dados é a única fonte de verdade. `localStorage` não é usado para nada relacionado à aprovação (apenas, opcionalmente, preferências visuais).

## Rodando localmente

### 1. Pré-requisitos

- Node.js 18+
- Um banco PostgreSQL acessível (local, Docker ou Railway)

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Copie `.env.example` para `.env` e ajuste:

```bash
cp .env.example .env
```

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
ADMIN_PASSWORD=""
UPLOAD_DIR="./uploads-data"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 4. Rodar migrations

```bash
npx prisma migrate dev
```

### 5. Popular o banco com o projeto de exemplo (Eletrofitas)

```bash
npx prisma db seed
```

O comando imprime o link de aprovação gerado (slug + token).

### 6. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

- App de aprovação: `http://localhost:3000/aprovacao/<slug>?token=<token>`
- Admin: `http://localhost:3000/admin`

## Estrutura

```
src/
  app/
    aprovacao/[slug]/page.tsx   # página pública de aprovação (valida token no servidor)
    admin/                      # painel simples de gestão de projetos/conteúdos
    api/                        # rotas de API (projetos, conteúdos, upload, admin)
  components/                   # ApprovalApp, ContentCard, SummaryBar, FilterBar, etc.
  lib/                          # prisma client, token, upload, auth, export de relatório
  types/                        # tipos compartilhados e cálculo de resumo
prisma/
  schema.prisma                 # Project, ContentItem, ActivityLog
  seed.ts                       # seed do projeto "Eletrofitas"
```

## Modelo de dados (resumo)

- **Project**: cliente/projeto, slug único, token de acesso, título, período, status.
- **ContentItem**: cada conteúdo da linha editorial, com campos editoriais (semana, formato, ideia, legenda, hashtags etc.), decisões de aprovação (legenda/design: manter ou alterar + solicitação) e status final (pendente / aprovado / ajustar / não usar).
- **ActivityLog**: histórico de alterações (autosave e finalização), opcional.

## Funcionalidades

- Acesso único por link com token — token inválido mostra "Acesso negado".
- Cards expansíveis (abrem/fecham só pelo cabeçalho, nunca pelos botões internos).
- Blocos de decisão de legenda e design (manter/alterar) com campo de solicitação e autosave (debounce).
- Status final por conteúdo (aprovado / precisa ajustar / não usar agora).
- Upload de imagem separado para agência e cliente, com preview e remoção.
- Resumo automático com contadores e barra de progresso.
- Filtros por busca, semana, formato e status.
- Botão único "Finalizar aprovação": salva tudo, mostra resumo final e baixa uma cópia HTML da devolutiva (não substitui o salvamento online).
- Admin (`/admin`) sem autenticação obrigatória no MVP: criar/editar/duplicar projetos, gerenciar conteúdos, copiar link público. Pronto para proteger com `ADMIN_PASSWORD` (basta definir a variável — o front já envia o header `x-admin-password`).

## Deploy no Railway

### Opção A — pelo dashboard (GitHub)

1. Suba este repositório para o GitHub.
2. No Railway, crie um projeto novo e adicione um serviço **PostgreSQL**.
3. Adicione um segundo serviço conectado ao repositório do GitHub (branch `main`).
4. Nas variáveis do serviço da aplicação, configure:
   - `DATABASE_URL` = `${{Postgres.DATABASE_URL}}` (referência ao serviço Postgres)
   - `ADMIN_PASSWORD` (opcional)
   - `UPLOAD_DIR` = `/data/uploads` (caminho dentro do Volume — veja abaixo)
   - `NEXT_PUBLIC_BASE_URL` = URL pública gerada pelo Railway
5. Crie um **Volume** no serviço da aplicação e monte em `/data` (ou no caminho escolhido em `UPLOAD_DIR`), para as imagens enviadas persistirem entre deploys.
6. Deploy automático a cada push na branch `main`.

### Opção B — via CLI

```bash
railway login
railway init --name aprovacao-editorial
railway add --database postgres
railway up
railway variables set ADMIN_PASSWORD=sua-senha UPLOAD_DIR=/data/uploads
```

O `npm run start` já executa `prisma migrate deploy` automaticamente antes de iniciar o servidor, então as migrations sobem sozinhas em cada deploy.

## Notas de armazenamento de imagens

As imagens não usam base64/localStorage. Elas são salvas em disco (`UPLOAD_DIR`, padrão `./uploads-data`) e servidas pela rota `/api/uploads/[filename]`. A URL salva no banco é relativa (`/api/uploads/<arquivo>`), o que facilita trocar depois para Cloudinary/S3/R2: basta adaptar `src/lib/upload.ts` para fazer upload externo e retornar a URL pública do provedor — nenhuma outra parte do sistema precisa mudar.
