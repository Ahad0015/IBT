const KEY = "birrbudget";

const state = {
    categories: [],
    transactions: [],
    search: "",
};

const status = document.querySelector("#status");
const form = document.querySelector("#entry-form");
const descInput = document.querySelector("#description");
const amountInput = document.querySelector("#amount");
const typeInput = document.querySelector("#type");
const categoryInput = document.querySelector("#category");
const errorEl = document.querySelector("#form-error");
const searchInput = document.querySelector("#search");
const listEl = document.querySelector("#transaction-list");
                     // summery
const totalIncomeEl = document.querySelector("#total-income");
const totalExpenseEl = document.querySelector("#total-expense");
const totalBalanceEl = document.querySelector("#total-balance");

function fillCategoryOptions() {
    const type = typeInput.value;
    const matching = state.categories.filter(c => c.type === type);
    categoryInput.innerHTML = matching
        .map(c => `<option value="${c.id}">${c.label}</option>`)
        .join("");
}

function render() {
const term = state.search.toLowerCase();

    const shown = state.transactions.filter(t => {
    const cat = state.categories.find(c => c.id === t.category);
    const catLabel = cat ? cat.label.toLowerCase() : "";
    return (
        t.description.toLowerCase().includes(term) ||
        catLabel.includes(term)
    );
    });

    if (shown.length === 0) {
    listEl.innerHTML = "<li>No transactions yet.</li>";
    } else {
    listEl.innerHTML = shown
        .slice()
        .reverse()
        .map(t => {
        const cat = state.categories.find(c => c.id === t.category);
        const catLabel = cat ? cat.label : t.category;
        const sign = t.type === "income" ? "+" : "-";
        return `
            <li data-id="${t.id}">
            <div class="tx-info">
                <span class="tx-desc">${t.description}</span>
                <span class="tx-cat">${catLabel}</span>
            </div>
            <div>
                <span class="tx-amount ${t.type}">${sign}${t.amount.toFixed(2)} ETB</span>
                <button class="rm" type="button">Remove</button>
            </div>
            </li>`;
        })
        .join("");
    }

    renderTotals();
}

function renderTotals() {
    const income = state.transactions
    .filter(t => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

    const expense = state.transactions
    .filter(t => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

    totalIncomeEl.textContent = income.toFixed(2);
    totalExpenseEl.textContent = expense.toFixed(2);
    totalBalanceEl.textContent = (income - expense).toFixed(2);
}

async function loadCategories() {
    status.textContent = "Loading categories...";
    try {
    const res = await fetch("data/categories.json");
    if (!res.ok) throw new Error("HTTP " + res.status);
    state.categories = await res.json();
    status.textContent = "";
    fillCategoryOptions();
    render();
    } catch (err) {
    status.textContent = "Could not load categories.";
    }
}

function save() {
    localStorage.setItem(KEY, JSON.stringify(state.transactions));
}

function load() {
    const saved = localStorage.getItem(KEY);
    if (!saved) return;
    try {
    state.transactions = JSON.parse(saved);
    } catch (err) {
    state.transactions = [];
    }
}

typeInput.addEventListener("change", fillCategoryOptions);

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const description = descInput.value.trim();
    const amount = Number(amountInput.value);

    if (!description) {
    errorEl.textContent = "Please enter a description.";
    return;
    }
    if (!amount || amount <= 0) {
    errorEl.textContent = "Please enter an amount greater than 0.";
    return;
    }

    errorEl.textContent = "";

    const entry = {
    id: Date.now(),
    description,
    amount,
    type: typeInput.value,
    category: categoryInput.value,
};

    state.transactions.push(entry);
    save();
    render();
    form.reset();
    fillCategoryOptions();
});

listEl.addEventListener("click", (e) => {
    if (!e.target.matches(".rm")) return;
    const id = Number(e.target.closest("li").dataset.id);
    state.transactions = state.transactions.filter(t => t.id !== id);
    save();
    render();
});

searchInput.addEventListener("input", (e) => {
    state.search = e.target.value;
    render();
});

async function init() {
    load();
    await loadCategories();
}

init();
