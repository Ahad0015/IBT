const STORAGE_KEY = "signups";

const PHONE = /^(?:\+251|0)9\d{8}$/;

const form = document.querySelector("#signup");
const nameInput = document.querySelector("#name");
const phoneInput = document.querySelector("#phone");
const errorEl = document.querySelector("#error");
const successEl = document.querySelector("#success");
const countEl = document.querySelector("#signupCount");


function loadSignups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
}

function saveSignups(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function validate({ name, phone }) {
  if (!name) return "Please enter your name.";
  if (name.length < 2) return "Name is too short.";
  if (!phone) return "Phone is required.";
  if (!PHONE.test(phone)) return "Enter a valid Ethiopian phone number.";
  return "";
}

function showError(text) {
  errorEl.textContent = text;
  successEl.textContent = "";
}

function showSuccess(text) {
  successEl.textContent = text;
  errorEl.textContent = "";
}

function clearMessages() {
  errorEl.textContent = "";
  successEl.textContent = "";
}

function updateCount(list) {
  countEl.innerHTML = `<strong>${list.length}</strong> ${
    list.length === 1 ? "person has" : "people have"
  } signed up so far.`;
}

updateCount(loadSignups());

form.addEventListener("submit", (e) => {
  e.preventDefault();
  clearMessages();

  const name = nameInput.value.trim();
  const phone = phoneInput.value.trim();

  const error = validate({ name, phone });
  if (error) {
    showError(error);
    return;
  }

  const signups = loadSignups();
  signups.push({ name, phone, joinedAt: new Date().toISOString() });
  saveSignups(signups);

  updateCount(signups);
  showSuccess(`Welcome, ${name}! Your spot is saved.`);
  form.reset();
});