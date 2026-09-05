const fs   = require("fs");
const path = require("path");
const base = __dirname;

const API_KEY     = process.argv[2];
const PROJECT_ID  = process.argv[3];
const APP_ID      = process.argv[4];
const SENHA_ADMIN = process.argv[5];

if (!API_KEY || !PROJECT_ID || !APP_ID || !SENHA_ADMIN) {
  console.log("ERRO:parametros insuficientes");
  process.exit(1);
}

/* ── firebase-config.js compartilhado ── */
const configJS = `const FIREBASE_CONFIG = {
  apiKey: "${API_KEY}",
  authDomain: "${PROJECT_ID}.firebaseapp.com",
  projectId: "${PROJECT_ID}",
  storageBucket: "${PROJECT_ID}.appspot.com",
  appId: "${APP_ID}"
};
const ADMIN_PASSWORD = "${SENHA_ADMIN}";
`;

fs.writeFileSync(path.join(base, "js", "firebase-config.js"), configJS);

/* ── Tela de login (gate.html) ── */
const gateHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>ANTI GOVERNO — Acesso</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0a0a0a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #fff;
      padding: 1rem;
    }
    .card {
      width: 100%;
      max-width: 22rem;
      background: #141414;
      border: 1px solid #222;
      border-radius: 1rem;
      padding: 2rem 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    h1 { font-size: 1.25rem; font-weight: 700; letter-spacing: -0.02em; }
    p  { font-size: 0.825rem; color: #666; }
    input {
      width: 100%;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 0.5rem;
      padding: 0.85rem 1rem;
      color: #fff;
      font: inherit;
      font-size: 0.9375rem;
      outline: none;
      letter-spacing: 0.05em;
      transition: border-color 0.2s;
    }
    input:focus { border-color: #555; }
    input::placeholder { color: #444; letter-spacing: 0; }
    button {
      width: 100%;
      padding: 0.9rem;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 0.5rem;
      font: inherit;
      font-size: 0.9375rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    button:hover { background: #ddd; }
    .erro {
      font-size: 0.8rem;
      color: #e55;
      text-align: center;
      display: none;
    }
    .erro.ativo { display: block; }
  </style>
</head>
<body>
<div class="card">
  <div>
    <h1>ANTI GOVERNO</h1>
    <p style="margin-top:0.4rem">Digite sua key de acesso para continuar.</p>
  </div>
  <input type="text" id="key" placeholder="DIARIA-xxxxxxxxxxxxxxxx" autocomplete="off" spellcheck="false">
  <button id="btn">Entrar</button>
  <p class="erro" id="erro">Key inválida ou expirada.</p>
</div>

<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script>
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

async function entrar() {
  const key  = document.getElementById("key").value.trim().toUpperCase();
  const erro = document.getElementById("erro");
  const btn  = document.getElementById("btn");
  erro.classList.remove("ativo");
  if (!key) return;

  btn.textContent = "Verificando...";
  btn.disabled = true;

  try {
    const doc = await db.collection("keys").doc(key).get();
    if (!doc.exists) throw new Error("inexistente");

    const dados = doc.data();
    const agora = Date.now();

    // Se já foi usada antes, verifica expiração
    if (dados.usada) {
      if (dados.expira < agora) {
        await db.collection("keys").doc(key).delete();
        throw new Error("expirada");
      }
    } else {
      // Primeiro uso — começa a contar agora
      const expira = agora + dados.dias * 24 * 60 * 60 * 1000;
      await db.collection("keys").doc(key).update({ usada: true, expira, primeiroUso: agora });
      dados.expira = expira;
    }

    // Salva no sessionStorage e vai para o site
    sessionStorage.setItem("ag:key", key);
    sessionStorage.setItem("ag:expira", dados.expira);
    window.location.href = "index.html";
  } catch (e) {
    erro.classList.add("ativo");
    btn.textContent = "Entrar";
    btn.disabled = false;
  }
}

document.getElementById("btn").addEventListener("click", entrar);
document.getElementById("key").addEventListener("keydown", e => {
  if (e.key === "Enter") entrar();
});
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(base, "gate.html"), gateHTML);

/* ── Painel admin ── */
const adminDir = path.join(base, "admin");
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir);

const adminHTML = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Admin — ANTI GOVERNO</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      min-height: 100svh;
      background: #0a0a0a;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: #fff;
      padding: 1.5rem 1rem 3rem;
    }
    .topo {
      max-width: 36rem;
      margin: 0 auto 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    h1 { font-size: 1.1rem; font-weight: 700; }
    .wrap { max-width: 36rem; margin: 0 auto; display: flex; flex-direction: column; gap: 1rem; }
    .card {
      background: #141414;
      border: 1px solid #222;
      border-radius: 1rem;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    h2 { font-size: 0.9375rem; font-weight: 600; color: #aaa; }
    .grid-dias {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 0.5rem;
    }
    .btn-dia {
      padding: 0.75rem 0;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 0.5rem;
      color: #fff;
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s, border-color 0.2s;
    }
    .btn-dia:hover { background: #2a2a2a; border-color: #444; }
    .btn-dia.ativo { background: #fff; color: #000; border-color: #fff; }
    .key-gerada {
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 0.5rem;
      padding: 0.85rem 1rem;
      font-family: "Courier New", monospace;
      font-size: 0.875rem;
      letter-spacing: 0.05em;
      color: #0f0;
      word-break: break-all;
      display: none;
    }
    .key-gerada.ativo { display: block; }
    .btn-gerar {
      padding: 0.9rem;
      background: #fff;
      color: #000;
      border: none;
      border-radius: 0.5rem;
      font: inherit;
      font-size: 0.9375rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 0.2s;
    }
    .btn-gerar:hover { background: #ddd; }
    .btn-copiar {
      padding: 0.75rem;
      background: transparent;
      color: #aaa;
      border: 1px solid #2a2a2a;
      border-radius: 0.5rem;
      font: inherit;
      font-size: 0.875rem;
      cursor: pointer;
      display: none;
      transition: color 0.2s;
    }
    .btn-copiar.ativo { display: block; }
    .btn-copiar:hover { color: #fff; }

    /* lista de keys */
    .key-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem 0;
      border-bottom: 1px solid #1e1e1e;
      font-size: 0.8125rem;
    }
    .key-item:last-child { border-bottom: 0; }
    .key-codigo { font-family: monospace; color: #ccc; word-break: break-all; }
    .key-expira { color: #666; white-space: nowrap; font-size: 0.75rem; }
    .btn-deletar {
      background: none;
      border: none;
      color: #e55;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      flex-shrink: 0;
    }
    .vazio { color: #444; font-size: 0.875rem; text-align: center; padding: 1rem 0; }

    /* login */
    #tela-login {
      min-height: 100svh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    #tela-admin { display: none; }
    .card-login {
      background: #141414;
      border: 1px solid #222;
      border-radius: 1rem;
      padding: 2rem 1.75rem;
      width: 100%;
      max-width: 20rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    input {
      width: 100%;
      background: #1e1e1e;
      border: 1px solid #2a2a2a;
      border-radius: 0.5rem;
      padding: 0.85rem 1rem;
      color: #fff;
      font: inherit;
      outline: none;
    }
    input:focus { border-color: #555; }
    .erro-login { font-size: 0.8rem; color: #e55; display: none; }
    .erro-login.ativo { display: block; }
    .btn-sair {
      background: none;
      border: 1px solid #2a2a2a;
      border-radius: 0.5rem;
      color: #666;
      font: inherit;
      font-size: 0.8rem;
      padding: 0.4rem 0.8rem;
      cursor: pointer;
    }
    .btn-sair:hover { color: #fff; }
  </style>
</head>
<body>

<!-- LOGIN -->
<div id="tela-login">
  <div class="card-login">
    <h1 style="font-size:1.1rem;font-weight:700">Painel Admin</h1>
    <input type="password" id="senha" placeholder="Senha" autocomplete="off">
    <button class="btn-gerar" id="btn-login">Entrar</button>
    <p class="erro-login" id="erro-login">Senha incorreta.</p>
  </div>
</div>

<!-- ADMIN -->
<div id="tela-admin">
  <div class="topo">
    <h1>Painel Admin — ANTI GOVERNO</h1>
    <button class="btn-sair" id="btn-sair">Sair</button>
  </div>

  <div class="wrap">
    <!-- Gerar key -->
    <div class="card">
      <h2>Gerar nova key</h2>
      <div class="grid-dias">
        <button class="btn-dia ativo" data-dias="1">1 dia</button>
        <button class="btn-dia" data-dias="3">3 dias</button>
        <button class="btn-dia" data-dias="5">5 dias</button>
        <button class="btn-dia" data-dias="7">7 dias</button>
        <button class="btn-dia" data-dias="15">15 dias</button>
      </div>
      <button class="btn-gerar" id="btn-gerar">Gerar key</button>
      <div class="key-gerada" id="key-gerada"></div>
      <button class="btn-copiar" id="btn-copiar">Copiar key</button>
    </div>

    <!-- Lista de keys -->
    <div class="card">
      <h2>Keys ativas</h2>
      <div id="lista-keys"><p class="vazio">Carregando...</p></div>
    </div>
  </div>
</div>

<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
<script src="../js/firebase-config.js"></script>
<script>
firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();

let diasSelecionado = 1;

/* ── Login ── */
document.getElementById("btn-login").addEventListener("click", () => {
  const senha = document.getElementById("senha").value;
  if (senha === ADMIN_PASSWORD) {
    document.getElementById("tela-login").style.display = "none";
    document.getElementById("tela-admin").style.display = "block";
    carregaKeys();
  } else {
    document.getElementById("erro-login").classList.add("ativo");
  }
});
document.getElementById("senha").addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("btn-login").click();
});
document.getElementById("btn-sair").addEventListener("click", () => {
  document.getElementById("tela-login").style.display = "flex";
  document.getElementById("tela-admin").style.display = "none";
});

/* ── Seleção de dias ── */
for (const btn of document.querySelectorAll(".btn-dia")) {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".btn-dia").forEach(b => b.classList.remove("ativo"));
    btn.classList.add("ativo");
    diasSelecionado = parseInt(btn.dataset.dias);
  });
}

/* ── Gerar key ── */
function geraCodigoKey(dias) {
  const prefixos = { 1: "DIARIA", 3: "TRIO", 5: "CINCO", 7: "SEMANA", 15: "QUINZENA" };
  const prefixo  = prefixos[dias] || "KEY";
  const rand     = Array.from(crypto.getRandomValues(new Uint8Array(12)))
    .map(b => b.toString(16).padStart(2, "0")).join("").toUpperCase();
  return prefixo + "-" + rand;
}

document.getElementById("btn-gerar").addEventListener("click", async () => {
  const btn  = document.getElementById("btn-gerar");
  btn.textContent = "Gerando...";
  btn.disabled = true;

  const key    = geraCodigoKey(diasSelecionado);
  const expira = Date.now() + diasSelecionado * 24 * 60 * 60 * 1000;

  try {
    await db.collection("keys").doc(key).set({ dias: diasSelecionado, criada: Date.now(), usada: false, expira: null });
    const campo  = document.getElementById("key-gerada");
    const copiar = document.getElementById("btn-copiar");
    campo.textContent = key;
    campo.classList.add("ativo");
    copiar.classList.add("ativo");
    carregaKeys();
  } catch(e) {
    alert("Erro: " + e.message);
  }

  btn.textContent = "Gerar key";
  btn.disabled = false;
});

document.getElementById("btn-copiar").addEventListener("click", async () => {
  const key = document.getElementById("key-gerada").textContent;
  await navigator.clipboard.writeText(key);
  document.getElementById("btn-copiar").textContent = "Copiado!";
  setTimeout(() => document.getElementById("btn-copiar").textContent = "Copiar key", 2000);
});

/* ── Lista keys ── */
async function carregaKeys() {
  const lista = document.getElementById("lista-keys");
  lista.innerHTML = "<p class='vazio'>Carregando...</p>";

  const snap  = await db.collection("keys").orderBy("criada", "desc").get();
  const agora = Date.now();

  if (snap.empty) {
    lista.innerHTML = "<p class='vazio'>Nenhuma key ativa.</p>";
    return;
  }

  lista.innerHTML = "";
  for (const doc of snap.docs) {
    const d      = doc.data();
    const expira = new Date(d.expira);
    const expirou = dados.usada && dados.expira < agora;
    const status  = !dados.usada ? "Aguardando uso" : expirou ? "Expirada" : "Expira " + new Date(dados.expira).toLocaleDateString("pt-BR");

    const item = document.createElement("div");
    item.className = "key-item";
    item.innerHTML = \`
      <span class="key-codigo" style="color:\${expirou ? '#555' : '#ccc'}">\${doc.id}</span>
      <span class="key-expira">\${status}</span>
      <button class="btn-deletar" data-key="\${doc.id}" title="Deletar">✕</button>
    \`;
    lista.append(item);
  }

  for (const btn of lista.querySelectorAll(".btn-deletar")) {
    btn.addEventListener("click", async () => {
      await db.collection("keys").doc(btn.dataset.key).delete();
      carregaKeys();
    });
  }
}
</script>
</body>
</html>
`;

fs.writeFileSync(path.join(adminDir, "index.html"), adminHTML);

/* ── Adiciona verificação de key no index.html principal ── */
const indexPath = path.join(base, "index.html");
let indexHTML   = fs.readFileSync(indexPath, "utf8");

const guardaScript = `
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore-compat.js"></script>
<script src="js/firebase-config.js"></script>
<script>
(function(){
  const key    = sessionStorage.getItem("ag:key");
  const expira = parseInt(sessionStorage.getItem("ag:expira") || "0");
  if (!key || Date.now() > expira) {
    window.location.replace("gate.html");
  }
})();
</script>`;

if (!indexHTML.includes("ag:key")) {
  indexHTML = indexHTML.replace("</head>", guardaScript + "\n</head>");
  fs.writeFileSync(indexPath, indexHTML);
}

console.log("OK");
