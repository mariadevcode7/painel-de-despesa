# PRD — Painel de Despesas

## 1. Visão geral

### Nome do projeto

**Painel de Despesas**

### Objetivo

Criar uma aplicação web para controle de despesas pessoais, permitindo ao usuário:

* Adicionar despesas.
* Informar valor, categoria e mês/ano.
* Visualizar o total das despesas.
* Visualizar o total gasto por categoria.
* Remover despesas individualmente.
* Limpar todas as despesas.
* Manter os dados salvos no navegador através do `localStorage`.
* Recomeçar o controle financeiro quando desejar.

O projeto deve priorizar **simplicidade, organização, responsividade e facilidade de manutenção**.

---

# 2. Stack

* **Vite** — gerenciamento do projeto e build.
* **TypeScript Vanilla** — lógica da aplicação e manipulação do DOM.
* **HTML5** — estrutura da aplicação.
* **CSS3** — estilização e responsividade.
* **GitHub Actions** — automação de tarefas do projeto.
* **LocalStorage** — persistência dos dados no navegador.

Não utilizar frameworks como React, Vue ou Angular.

---

# 3. Requisitos funcionais

## RF01 — Adicionar despesa

O usuário deve conseguir adicionar uma nova despesa através de um formulário.

Cada despesa deverá possuir:

* `id`
* descrição da despesa
* valor
* categoria
* mês/ano

### Estrutura conceitual

```ts
type Despesa = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  mesAno: string;
};
```

O `id` deve ser único para cada despesa.

---

## RF02 — Descrição da despesa

O formulário deve possuir um campo para que o usuário informe o nome ou descrição da despesa.

Exemplos:

* Supermercado
* Internet
* Energia
* Combustível
* Aluguel

O campo deve ser obrigatório.

---

## RF03 — Valor da despesa

O usuário deve informar o valor da despesa.

O valor deve ser tratado como `number` na aplicação.

Exemplo:

```text
R$ 150,00
```

O sistema deve impedir o cadastro de uma despesa sem valor válido.

---

## RF04 — Categoria

A aplicação deve permitir que o usuário informe livremente a categoria da despesa.

A área de categoria deve possuir um **input** para criação da categoria.

Exemplos:

* Alimentação
* Transporte
* Moradia
* Lazer
* Saúde
* Educação

O usuário não deve ficar limitado a categorias previamente cadastradas.

A categoria informada deve ser associada à despesa no momento do cadastro.

---

## RF05 — Mês/ano

O formulário deve permitir informar o mês e o ano referentes à despesa.

Exemplo:

```text
Agosto / 2026
```

O mês/ano deve ser armazenado junto com a despesa.

---

## RF06 — Exibir despesas

Após o cadastro, a despesa deve aparecer na área principal da aplicação.

Cada card deve apresentar:

* descrição;
* valor;
* categoria;
* mês/ano;
* botão para remover a despesa.

---

## RF07 — Remover despesa

Cada card de despesa deve possuir um botão para remover aquela despesa individualmente.

Ao remover:

1. A despesa deve ser removida da lista.
2. O `localStorage` deve ser atualizado.
3. O total geral deve ser recalculado.
4. O valor da categoria correspondente deve ser atualizado.
5. A interface deve refletir imediatamente a alteração.

---

## RF08 — Total geral

A sidebar deve apresentar o valor total de todas as despesas cadastradas.

Exemplo:

```text
Total de despesas

R$ 2.450,00
```

O valor deve ser atualizado automaticamente sempre que uma despesa for:

* adicionada;
* removida;
* excluída através do botão "Limpar tudo".

---

## RF09 — Total por categoria

Abaixo do card de total geral, a sidebar deve apresentar as categorias cadastradas.

Cada categoria deve exibir:

* nome da categoria;
* valor total gasto naquela categoria.

Exemplo:

```text
Categorias

Alimentação       R$ 850,00
Transporte        R$ 400,00
Moradia           R$ 1.200,00
```

O valor de cada categoria deve ser calculado automaticamente a partir das despesas cadastradas.

---

## RF10 — Limpar todas as despesas

A aplicação deve possuir um botão:

**"Limpar tudo"**

Ao clicar:

* todas as despesas devem ser removidas;
* o `localStorage` deve ser atualizado;
* o total geral deve voltar para `R$ 0,00`;
* os valores das categorias devem ser zerados/removidos;
* os cards de despesas devem desaparecer;
* a interface deve retornar ao estado inicial.

Antes de executar a ação, recomenda-se apresentar uma confirmação ao usuário para evitar exclusão acidental.

---

## RF11 — Persistência dos dados

Todas as despesas cadastradas devem ser armazenadas no `localStorage`.

Ao recarregar a página:

* os dados devem ser recuperados;
* as despesas devem continuar aparecendo;
* o total geral deve ser recalculado;
* os valores por categoria devem ser reconstruídos.

O usuário não deve perder seus dados simplesmente por atualizar ou fechar o navegador.

---

## RF12 — Estado vazio

Quando não existirem despesas cadastradas, a aplicação deve apresentar uma mensagem indicando que não existem despesas.

Exemplo:

```text
Nenhuma despesa cadastrada.
```

O total deve apresentar:

```text
R$ 0,00
```

---

# 4. Requisitos técnicos

## RT01 — Estrutura do projeto

O projeto deve utilizar **Vite + TypeScript Vanilla**.

Sugestão de organização:

```text
src/
├── types.ts
├── main.ts
├── style.css
└── ...
```

A estrutura pode ser expandida conforme a necessidade do projeto, mas deve permanecer simples e organizada.

---

## RT02 — Tipagem

Todos os tipos TypeScript criados no projeto devem ficar no arquivo:

```text
src/types.ts
```

Não criar `interface`.

Utilizar exclusivamente `type`.

Exemplo:

```ts
type Despesa = {
  id: string;
  descricao: string;
  valor: number;
  categoria: string;
  mesAno: string;
};
```

---

## RT03 — Eventos

Nenhuma ação deve ser executada diretamente no HTML.

Não utilizar eventos inline como:

```html
<button onclick="removerDespesa()">Remover</button>
```

Todos os eventos devem ser registrados no TypeScript.

Exemplo:

```ts
botao.addEventListener("click", removerDespesa);
```

O HTML deve ser responsável apenas pela estrutura.

---

## RT04 — Manipulação do DOM

A interação com a interface deve ser realizada através do TypeScript.

Responsabilidades do TypeScript:

* capturar elementos;
* ouvir eventos;
* validar formulário;
* criar despesas;
* renderizar despesas;
* remover despesas;
* calcular totais;
* atualizar categorias;
* manipular `localStorage`;
* atualizar a interface.

---

## RT05 — LocalStorage

As despesas devem ser armazenadas no `localStorage`.

A aplicação deve:

### Salvar

```ts
localStorage.setItem(...)
```

### Recuperar

```ts
localStorage.getItem(...)
```

### Converter dados

Utilizar:

```ts
JSON.stringify()
```

e

```ts
JSON.parse()
```

A aplicação deve possuir uma chave única para os dados do painel.

Exemplo:

```text
despesas
```

---

## RT06 — Cálculo dos valores

O sistema deve calcular:

### Total geral

A soma do valor de todas as despesas.

### Total por categoria

A soma dos valores das despesas pertencentes à mesma categoria.

Os cálculos devem ser derivados dos dados armazenados, evitando manter valores duplicados sem necessidade.

---

## RT07 — Formatação monetária

Os valores exibidos na interface devem ser apresentados no padrão brasileiro de moeda.

Exemplo:

```text
R$ 1.250,50
```

O valor armazenado deve permanecer como `number`, enquanto a formatação deve ocorrer apenas na apresentação.

---

## RT08 — Geração de ID

Cada despesa deve possuir um identificador único.

O ID pode ser gerado utilizando uma solução nativa do JavaScript, como:

```ts
crypto.randomUUID()
```

---

## RT09 — Validação

Antes de adicionar uma despesa, o sistema deve verificar:

* descrição preenchida;
* valor válido;
* valor maior que zero;
* categoria preenchida;
* mês/ano informado.

Caso exista algum problema, o usuário deve receber uma mensagem clara indicando o que precisa ser corrigido.

---

## RT10 — Código simples

O código deve priorizar:

* funções pequenas;
* nomes descritivos;
* responsabilidades bem definidas;
* baixo acoplamento;
* evitar repetição desnecessária;
* evitar lógica excessivamente complexa;
* facilitar futuras alterações.

Não implementar abstrações desnecessárias apenas para aumentar a quantidade de código.

---

## RT11 — GitHub Actions

O projeto deve utilizar **GitHub Actions** para automação.

Inicialmente, a automação deve ser preparada para executar tarefas como:

* instalar dependências;
* executar o build;
* verificar se o projeto consegue ser compilado corretamente.

O workflow deve ficar dentro de:

```text
.github/
└── workflows/
```

---

# 5. Requisitos visuais

## RV01 — Layout geral

A aplicação deve possuir três áreas principais:

```text
┌──────────────────────────────────────────────┐
│ Header                                       │
│ Título                         Mês / Ano     │
├──────────────┬───────────────────────────────┤
│              │                               │
│   Sidebar    │          Main                 │
│              │                               │
│ Total        │   Adicionar despesa           │
│              │                               │
│ Categorias   │   Cards de despesas           │
│              │                               │
│              │                               │
└──────────────┴───────────────────────────────┘
```

---

## RV02 — Header

O header deve possuir:

### Lado esquerdo

Título do projeto:

```text
Painel de Despesas
```

### Lado direito

Mês e ano atual ou período selecionado.

Exemplo:

```text
Agosto / 2026
```

---

## RV03 — Sidebar

A sidebar deve ficar localizada na lateral esquerda em telas maiores.

Deve conter:

### Card de total

Exibir:

```text
Total de despesas

R$ 2.450,00
```

### Categorias

Abaixo do total, apresentar as categorias e seus respectivos valores.

---

## RV04 — Área principal

O `main` deve conter:

1. Card para adicionar despesa.
2. Área de listagem das despesas.
3. Botão "Limpar tudo".

---

## RV05 — Card de adicionar despesa

O formulário deve conter:

```text
Nova despesa
[ Descrição ]

Valor
[ R$ 0,00 ]

Categoria
[ Digite uma categoria ]

Mês/Ano
[ Mês/Ano ]

[ Adicionar despesa ]
```

Os campos devem possuir labels claros e acessíveis.

---

## RV06 — Card de despesa

Cada despesa adicionada deve ser apresentada em um card.

Exemplo:

```text
Supermercado

R$ 250,00

Alimentação
Agosto / 2026

[ Remover ]
```

---

## RV07 — Botão limpar tudo

O botão deve ficar visualmente separado das ações individuais.

O texto deve deixar clara a ação:

```text
Limpar tudo
```

Por ser uma ação destrutiva, o botão deve possuir destaque visual adequado.

---

## RV08 — Variáveis CSS

As cores e fontes utilizadas no projeto devem ser definidas através de variáveis CSS.

Exemplo:

```css
:root {
  --cor-fundo: #262626;
  --cor-branco: #ffffff;
  --cor-primaria: #1850bf;
  --cor-perigo: #dc0807;
  --cor-sucesso: #01db4e;

  --fonte-principal: Arial, sans-serif;
}
```

Os valores devem ser utilizados através das variáveis:

```css
background-color: var(--cor-fundo);
color: var(--cor-branco);
```

Evitar repetir valores de cores diretamente em diversos seletores.

---

# 6. Responsividade

O projeto deve ser responsivo e funcionar adequadamente em:

* desktop;
* notebook;
* tablet;
* celular.

### Desktop

Sidebar posicionada à esquerda e conteúdo principal ao lado.

### Tablet

A estrutura deve se adaptar à largura disponível, reduzindo espaçamentos e tamanhos quando necessário.

### Mobile

A sidebar deve deixar de ocupar uma coluna lateral fixa.

Uma possibilidade é reorganizar o layout:

```text
Header

Total

Categorias

Adicionar despesa

Despesas
```

Os cards devem ocupar a largura disponível.

Nenhum elemento deve causar rolagem horizontal desnecessária.

---

# 7. Fluxo principal da aplicação

## Inicialização

Ao abrir a aplicação:

1. Carregar dados do `localStorage`.
2. Converter os dados para o formato utilizado pela aplicação.
3. Renderizar as despesas.
4. Calcular o total geral.
5. Calcular os valores por categoria.
6. Atualizar a interface.

---

## Adicionar despesa

Fluxo:

```text
Usuário preenche formulário
        ↓
Clica em "Adicionar despesa"
        ↓
Validar dados
        ↓
Criar objeto Despesa
        ↓
Adicionar ao array
        ↓
Salvar no localStorage
        ↓
Atualizar interface
        ↓
Limpar formulário
```

---

## Remover despesa

Fluxo:

```text
Usuário clica em "Remover"
        ↓
Identificar despesa pelo ID
        ↓
Remover do array
        ↓
Atualizar localStorage
        ↓
Recalcular valores
        ↓
Atualizar interface
```

---

## Limpar tudo

Fluxo:

```text
Usuário clica em "Limpar tudo"
        ↓
Solicitar confirmação
        ↓
Limpar array
        ↓
Limpar localStorage
        ↓
Zerar total
        ↓
Remover valores das categorias
        ↓
Atualizar interface
```

---

# 8. Regras de negócio

### RN01

Uma despesa não pode ser cadastrada sem descrição.

### RN02

O valor da despesa deve ser maior que zero.

### RN03

Uma despesa deve possuir uma categoria.

### RN04

Uma despesa deve possuir mês/ano.

### RN05

Cada despesa deve possuir um ID único.

### RN06

O total geral deve ser a soma de todas as despesas.

### RN07

O total de uma categoria deve considerar somente as despesas pertencentes àquela categoria.

### RN08

A remoção de uma despesa deve atualizar imediatamente os totais.

### RN09

O botão "Limpar tudo" deve remover todas as despesas armazenadas.

### RN10

Os dados devem permanecer disponíveis após o recarregamento da página.

---

# 9. Acessibilidade

A interface deve seguir boas práticas básicas de acessibilidade:

* utilizar `<label>` nos campos;
* utilizar elementos HTML semânticos;
* botões com textos descritivos;
* manter contraste adequado;
* permitir navegação por teclado;
* não depender somente de cores para comunicar informações;
* fornecer mensagens claras para erros de validação.

---

# 10. Critérios de aceitação

O projeto será considerado funcional quando:

* [ ] O usuário conseguir adicionar uma despesa.
* [ ] A despesa possuir ID único.
* [ ] A descrição for armazenada corretamente.
* [ ] O valor for armazenado como `number`.
* [ ] O usuário puder criar categorias livremente.
* [ ] O mês/ano for armazenado.
* [ ] A despesa aparecer em um card após o cadastro.
* [ ] O usuário conseguir remover uma despesa individualmente.
* [ ] O total geral for atualizado automaticamente.
* [ ] O total por categoria for calculado automaticamente.
* [ ] O botão "Limpar tudo" remover todas as despesas.
* [ ] O total voltar para zero após limpar tudo.
* [ ] Os dados permanecerem após atualizar a página.
* [ ] O projeto utilizar `localStorage`.
* [ ] Todos os eventos estiverem no TypeScript.
* [ ] Não existirem eventos inline no HTML.
* [ ] Todos os tipos estiverem em `src/types.ts`.
* [ ] Nenhum tipo utilizar `interface`.
* [ ] Cores e fontes estiverem organizadas em variáveis CSS.
* [ ] O layout funcionar em dispositivos móveis.
* [ ] O projeto executar o build do Vite sem erros.
* [ ] O GitHub Actions conseguir executar o workflow definido.

---

# 11. Princípios de implementação

O desenvolvimento deve seguir estes princípios:

1. **Simplicidade antes de complexidade.**
2. **TypeScript responsável pela lógica e eventos.**
3. **HTML responsável pela estrutura.**
4. **CSS responsável pela apresentação.**
5. **Dados centralizados em um array de despesas.**
6. **LocalStorage responsável pela persistência.**
7. **Tipos centralizados em `src/types.ts`.**
8. **Nenhuma `interface`; utilizar `type`.**
9. **Nenhuma ação inline no HTML.**
10. **Funções pequenas e com responsabilidades claras.**
11. **Layout responsivo desde o início.**
12. **Evitar código duplicado e abstrações desnecessárias.**

# 12. Resultado esperado

Ao final, o usuário deverá ter um painel financeiro simples no qual consiga cadastrar e acompanhar suas despesas de forma visual.

A aplicação deverá permitir visualizar rapidamente:

* **quanto foi gasto no total;**
* **quanto foi gasto em cada categoria;**
* **quais despesas foram cadastradas;**
* **em qual mês/ano cada despesa ocorreu.**

Todos os dados devem permanecer salvos no navegador e a aplicação deve funcionar sem necessidade de backend.
