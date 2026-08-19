# Painel de Despesas

Aplicação web para controle simples de despesas pessoais. O usuário pode registrar seus gastos, acompanhar o saldo mensal e visualizar como o dinheiro está distribuído por categoria.

## Funcionalidades

- Cadastro de despesas com descrição, valor, categoria e mês/ano.
- Categorias criadas livremente pelo usuário.
- Total geral das despesas.
- Total gasto por categoria.
- Saldo mensal baseado em um orçamento opcional.
- Filtro de despesas por mês.
- Remoção individual de despesas.
- Limpeza completa dos lançamentos e reinício do painel.
- Identificação do usuário no cabeçalho com nome e iniciais.
- Persistência dos dados no navegador usando `localStorage`.
- Interface responsiva com suporte a telas menores.

## Tecnologias

- Vite
- TypeScript Vanilla
- HTML5
- CSS3
- GitHub Actions
- GitHub Pages

O projeto não utiliza React, Vue ou Angular.

## Requisitos

- Node.js 20 ou superior
- npm

## Instalação e execução

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

Depois, abra a URL exibida pelo Vite, normalmente:

```text
http://localhost:5173/
```

## Build de produção

Para verificar os tipos e gerar os arquivos finais:

```bash
npm run build
```

Os arquivos de produção são gerados na pasta `dist/`.

Para visualizar o build localmente:

```bash
npm run preview
```

## Persistência

As despesas são armazenadas no `localStorage` do navegador com a chave `despesas`.

O orçamento mensal é salvo separadamente para cada mês. Os dados permanecem disponíveis ao recarregar a página no mesmo navegador.

## Deploy no GitHub Pages

O workflow `.github/workflows/deploy-pages.yml` gera e publica automaticamente o projeto quando um commit é enviado para a branch `main`.

Também é possível iniciar o workflow manualmente pela aba **Actions** do GitHub.

No repositório, configure a origem do Pages em:

**Settings > Pages > Source > GitHub Actions**

Após a primeira publicação, o projeto ficará disponível em:

https://mariadevcode7.github.io/painel-de-despesa/

## Estrutura principal

```text
.
├── .github/workflows/
│   ├── ci.yml
│   └── deploy-pages.yml
├── src/
│   ├── main.ts
│   ├── style.css
│   └── types.ts
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

## Scripts disponíveis

| Script | Descrição |
| --- | --- |
| `npm run dev` | Inicia o servidor de desenvolvimento. |
| `npm run build` | Executa a verificação TypeScript e gera o build. |
| `npm run preview` | Serve o build de produção localmente. |
