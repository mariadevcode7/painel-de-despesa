import './style.css';
import type { Despesa } from './types';

const STORAGE_KEY = 'despesas';
const USER_NAME_KEY = 'nomeUsuario';
const MONTHLY_BUDGET_KEY = 'orcamentoMensal';
const currency = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
const monthFormatter = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' });

const app = document.querySelector<HTMLDivElement>('#app');
if (!app) throw new Error('Elemento principal da aplicação não encontrado.');

let despesas = loadExpenses();
let filtroMes = '';
const currentMonth = new Date().toISOString().slice(0, 7);
let orcamentoMensal = loadMonthlyBudget(currentMonth);
let nomeUsuario = formatUserName(loadUserName());
if (!nomeUsuario) nomeUsuario = requestUserName();
const iniciais = getInitials(nomeUsuario);
document.title = `Painel de ${nomeUsuario}`;

app.innerHTML = `
  <div class="shell">
    <header class="topbar">
      <a class="brand" href="/" aria-label="Painel de ${escapeHtml(nomeUsuario)} - início">
        <span class="brand-mark">${iniciais}</span>
        <span><strong id="user-name">${escapeHtml(nomeUsuario)}</strong><small>controle pessoal</small></span>
      </a>
      <div class="topbar-date"><span class="status-dot"></span><span id="today-label"></span></div>
    </header>

    <main class="dashboard">
      <section class="intro">
        <div>
          <p class="eyebrow">visão geral financeira</p>
          <h1>Seu dinheiro,<br /><em>em perspectiva.</em></h1>
          <p class="intro-copy">Registre o que importa, acompanhe seus hábitos e tome decisões com mais clareza.</p>
        </div>
        <div class="intro-deco" aria-hidden="true"><span></span><span></span><span></span></div>
      </section>

      <section class="metrics" aria-label="Resumo financeiro">
        <article class="metric-card metric-primary">
          <div class="metric-heading"><span>Total no período</span><span class="metric-icon">↗</span></div>
          <strong id="total-value">R$ 0,00</strong>
          <span class="metric-foot" id="expense-count">0 despesas registradas</span>
        </article>
        <article class="metric-card">
          <div class="metric-heading"><span>Maior categoria</span><span class="metric-icon subtle">◌</span></div>
          <strong id="top-category">—</strong>
          <span class="metric-foot" id="top-category-value">Nenhum gasto ainda</span>
        </article>
        <article class="metric-card metric-accent">
          <div class="metric-heading"><span>Saldo deste mês</span><span class="metric-icon">◎</span></div>
          <strong id="month-value">—</strong>
          <label class="budget-label" for="monthly-budget">Quanto você terá este mês?</label>
          <input id="monthly-budget" class="budget-input" type="number" min="0.01" step="0.01" placeholder="Opcional · R$ 0,00" />
          <span class="metric-foot" id="month-label"></span>
        </article>
      </section>

      <div class="content-grid">
        <section class="expenses-panel">
          <div class="section-header">
            <div><p class="eyebrow">lançamentos</p><h2>Despesas recentes</h2></div>
            <div class="filter-wrap">
              <label for="month-filter">Filtrar mês</label>
              <input id="month-filter" type="month" />
            </div>
          </div>
          <div id="expense-list" class="expense-list"></div>
        </section>

        <aside class="sidebar">
          <div class="form-header"><p class="eyebrow">novo lançamento</p><h2>Adicionar despesa</h2></div>
          <form id="expense-form" novalidate>
            <label for="description">Descrição<input id="description" name="description" type="text" placeholder="Ex: supermercado" autocomplete="off" required /></label>
            <label for="amount">Valor<input id="amount" name="amount" type="number" min="0.01" step="0.01" placeholder="0,00" required /></label>
            <label for="category">Categoria<input id="category" name="category" type="text" placeholder="Ex: alimentação" autocomplete="off" required /></label>
            <label for="expense-month">Mês e ano<input id="expense-month" name="month" type="month" required /></label>
            <p id="form-error" class="form-error" role="alert"></p>
            <button class="primary-button" type="submit"><span>Adicionar despesa</span><b>+</b></button>
          </form>
          <div class="category-summary"><div class="summary-title"><p class="eyebrow">distribuição</p><h3>Por categoria</h3></div><div id="category-list"></div></div>
          <button id="clear-all" class="clear-button" type="button">Limpar todas as despesas <span>↗</span></button>
        </aside>
      </div>
    </main>
    <footer><span>PAINEL DE DESPESAS</span><span>dados salvos neste navegador</span></footer>
  </div>
`;

const form = document.querySelector<HTMLFormElement>('#expense-form')!;
const monthInput = document.querySelector<HTMLInputElement>('#expense-month')!;
const filterInput = document.querySelector<HTMLInputElement>('#month-filter')!;
const error = document.querySelector<HTMLParagraphElement>('#form-error')!;
const monthlyBudgetInput = document.querySelector<HTMLInputElement>('#monthly-budget')!;

monthInput.value = currentMonth;
if (orcamentoMensal !== null) monthlyBudgetInput.value = String(orcamentoMensal);
document.querySelector<HTMLSpanElement>('#today-label')!.textContent = monthFormatter.format(new Date());
document.querySelector<HTMLSpanElement>('#month-label')!.textContent = monthFormatter.format(new Date());

monthlyBudgetInput.addEventListener('change', () => {
  const value = monthlyBudgetInput.value.trim();
  orcamentoMensal = value ? Number(value) : null;
  if (orcamentoMensal !== null && (!Number.isFinite(orcamentoMensal) || orcamentoMensal <= 0)) {
    orcamentoMensal = null;
    monthlyBudgetInput.value = '';
  }
  saveMonthlyBudget(currentMonth, orcamentoMensal);
  render();
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const descricao = String(data.get('description') ?? '').trim();
  const categoria = String(data.get('category') ?? '').trim();
  const mesAno = String(data.get('month') ?? '');
  const valor = Number(data.get('amount'));

  if (!descricao || !categoria || !mesAno || !Number.isFinite(valor) || valor <= 0) {
    error.textContent = 'Preencha todos os campos com valores válidos.';
    return;
  }

  despesas = [{ id: crypto.randomUUID(), descricao, categoria, mesAno, valor }, ...despesas];
  saveExpenses();
  form.reset();
  monthInput.value = currentMonth;
  error.textContent = '';
  render();
});

filterInput.addEventListener('change', () => {
  filtroMes = filterInput.value;
  renderExpenses();
});

document.querySelector<HTMLButtonElement>('#clear-all')!.addEventListener('click', () => {
  if (!despesas.length && orcamentoMensal === null) return;
  if (window.confirm('Tem certeza que deseja apagar todas as despesas?')) {
    despesas = [];
    orcamentoMensal = null;
    saveExpenses();
    saveMonthlyBudget(currentMonth, null);
    monthlyBudgetInput.value = '';
    localStorage.removeItem(USER_NAME_KEY);
    nomeUsuario = requestUserName();
    document.title = `Painel de ${nomeUsuario}`;
    document.querySelector<HTMLElement>('#user-name')!.textContent = nomeUsuario;
    document.querySelector<HTMLElement>('.brand-mark')!.textContent = getInitials(nomeUsuario);
    render();
  }
});

document.querySelector('#expense-list')!.addEventListener('click', (event) => {
  const target = event.target as HTMLElement;
  const button = target.closest<HTMLButtonElement>('[data-remove]');
  if (!button) return;
  despesas = despesas.filter((expense) => expense.id !== button.dataset.remove);
  saveExpenses();
  render();
});

function loadExpenses(): Despesa[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed: unknown = JSON.parse(stored);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isExpense);
  } catch {
    return [];
  }
}

function loadUserName() {
  return localStorage.getItem(USER_NAME_KEY)?.trim() ?? '';
}

function requestUserName() {
  const resposta = window.prompt('Como você gostaria de chamar seu painel?');
  const nome = formatUserName(resposta?.trim() || 'Usuário');
  localStorage.setItem(USER_NAME_KEY, nome);
  return nome;
}

function formatUserName(nome: string) {
  return nome
    .trim()
    .toLocaleLowerCase('pt-BR')
    .split(/\s+/)
    .filter(Boolean)
    .map((parte) => parte.charAt(0).toLocaleUpperCase('pt-BR') + parte.slice(1))
    .join(' ');
}

function getInitials(nome: string) {
  const partes = nome.split(/\s+/).filter(Boolean);
  if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}

function isExpense(value: unknown): value is Despesa {
  if (!value || typeof value !== 'object') return false;
  const expense = value as Record<string, unknown>;
  return typeof expense.id === 'string' && typeof expense.descricao === 'string' && typeof expense.valor === 'number' && Number.isFinite(expense.valor) && typeof expense.categoria === 'string' && typeof expense.mesAno === 'string';
}

function saveExpenses() { localStorage.setItem(STORAGE_KEY, JSON.stringify(despesas)); }
function loadMonthlyBudget(month: string) {
  const stored = localStorage.getItem(`${MONTHLY_BUDGET_KEY}-${month}`);
  if (!stored) return null;
  const value = Number(stored);
  return Number.isFinite(value) && value > 0 ? value : null;
}
function saveMonthlyBudget(month: string, value: number | null) {
  const key = `${MONTHLY_BUDGET_KEY}-${month}`;
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, String(value));
}
function visibleExpenses() { return filtroMes ? despesas.filter((expense) => expense.mesAno === filtroMes) : despesas; }
function total(expenses: Despesa[]) { return expenses.reduce((sum, expense) => sum + expense.valor, 0); }
function formatMonth(month: string) { return month ? monthFormatter.format(new Date(`${month}-02T12:00:00`)) : ''; }

function render() {
  const currentMonthTotal = total(despesas.filter((expense) => expense.mesAno === currentMonth));
  const monthlyBalance = orcamentoMensal === null ? null : orcamentoMensal - currentMonthTotal;
  const groups = groupByCategory(despesas);
  const top = groups[0];
  document.querySelector('#total-value')!.textContent = currency.format(total(despesas));
  document.querySelector('#expense-count')!.textContent = `${despesas.length} ${despesas.length === 1 ? 'despesa registrada' : 'despesas registradas'}`;
  document.querySelector('#month-value')!.textContent = monthlyBalance === null ? '—' : currency.format(monthlyBalance);
  document.querySelector('#month-value')!.classList.toggle('negative-value', monthlyBalance !== null && monthlyBalance < 0);
  document.querySelector('#month-label')!.textContent = monthlyBalance === null ? 'Informe um valor opcional acima' : `${currency.format(currentMonthTotal)} já utilizado`;
  document.querySelector('#top-category')!.textContent = top?.name ?? '—';
  document.querySelector('#top-category-value')!.textContent = top ? currency.format(top.value) : 'Nenhum gasto ainda';
  renderExpenses();
  renderCategories(groups);
}

function renderExpenses() {
  const list = document.querySelector<HTMLDivElement>('#expense-list')!;
  const items = visibleExpenses();
  if (!items.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-mark">○</span><h3>${despesas.length ? 'Nenhuma despesa neste mês' : 'Nenhuma despesa cadastrada'}</h3><p>${despesas.length ? 'Altere o filtro para ver outros lançamentos.' : 'Adicione seu primeiro lançamento ao lado.'}</p></div>`;
    return;
  }
  list.innerHTML = items.map((expense) => `<article class="expense-item"><div class="expense-badge">${escapeHtml(expense.categoria.slice(0, 1).toUpperCase())}</div><div class="expense-info"><strong>${escapeHtml(expense.descricao)}</strong><span>${escapeHtml(expense.categoria)} · ${formatMonth(expense.mesAno)}</span></div><strong class="expense-amount">${currency.format(expense.valor)}</strong><button class="remove-button" type="button" data-remove="${expense.id}" aria-label="Remover ${escapeHtml(expense.descricao)}">×</button></article>`).join('');
}

function groupByCategory(expenses: Despesa[]) {
  const grouped = new Map<string, number>();
  expenses.forEach((expense) => grouped.set(expense.categoria, (grouped.get(expense.categoria) ?? 0) + expense.valor));
  return [...grouped.entries()].map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value);
}

function renderCategories(groups: { name: string; value: number }[]) {
  const list = document.querySelector<HTMLDivElement>('#category-list')!;
  list.innerHTML = groups.length ? groups.slice(0, 5).map((group, index) => `<div class="category-row"><span class="category-color color-${index % 5}"></span><span>${escapeHtml(group.name)}</span><strong>${currency.format(group.value)}</strong></div>`).join('') : '<p class="muted">As categorias aparecerão aqui.</p>';
}

function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[character] ?? character); }

render();
