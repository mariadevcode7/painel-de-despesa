# Painel de Despesas

Aplicacao web de controle de despesas pessoais feita com Vite, TypeScript Vanilla, HTML e CSS.

## Executar

```bash
npm install
npm run dev
```

Para gerar a versao de producao:

```bash
npm run build
```

Os dados sao persistidos no `localStorage` do navegador usando a chave `despesas`.

## Deploy

O workflow `.github/workflows/deploy-pages.yml` publica automaticamente o projeto no GitHub Pages sempre que houver um push na branch `main`.

Depois da primeira execucao do workflow, a aplicacao ficara disponivel em:

https://mariadevcode7.github.io/painel-de-despesa/

No repositorio do GitHub, configure **Settings > Pages > Source** como **GitHub Actions**.
