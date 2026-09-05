/* ================================================================== *
 * site.js — partes compartilhadas do site Black (página única)
 *
 * 1. Navegação por âncora — marca a aba ativa conforme a seção visível
 * 2. Menu do celular
 * 3. Cortina de doação
 * 4. Foto do Discord via Lanyard
 * ================================================================== */

const PIXGG   = "https://pixgg.com/rochwxs";
const AUTOR_ID = "1127070909027590235";

/* ------------------------------------------------------------------ *
 * 1. NAVEGAÇÃO POR ÂNCORA
 *
 * Atualiza aria-current nas abas conforme a seção visível na tela,
 * usando IntersectionObserver. Também fecha o menu ao clicar num link.
 * ------------------------------------------------------------------ */

const abaLinks = document.querySelectorAll(".aba-link");

function marcaAba(secaoId) {
  for (const link of abaLinks) {
    const ativa = link.dataset.secao === secaoId;
    if (ativa) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  }
}

/* Observa qual seção ocupa mais espaço na viewport */
const secoes = document.querySelectorAll(".pagina-secao");

const observer = new IntersectionObserver(
  (entradas) => {
    /* Pega a seção com maior intersecção visível */
    let melhor = null;
    let melhorRatio = 0;
    for (const entrada of entradas) {
      if (entrada.intersectionRatio > melhorRatio) {
        melhorRatio = entrada.intersectionRatio;
        melhor = entrada.target.id;
      }
    }
    if (melhor) marcaAba(melhor);
  },
  { threshold: [0, 0.25, 0.5, 0.75, 1] }
);

for (const secao of secoes) observer.observe(secao);

/* Ao clicar numa aba fecha o menu celular e marca imediatamente */
for (const link of abaLinks) {
  link.addEventListener("click", () => {
    marcaAba(link.dataset.secao);
    fechaMenu();
  });
}

/* Marca a seção correta ao carregar a página (suporte a deep link) */
function secaoDoHash() {
  const hash = location.hash.replace("#", "");
  const ids = [...secoes].map((s) => s.id);
  return ids.includes(hash) ? hash : ids[0];
}

marcaAba(secaoDoHash());

window.addEventListener("hashchange", () => marcaAba(secaoDoHash()));

/* ------------------------------------------------------------------ *
 * 2. MENU DO CELULAR
 * ------------------------------------------------------------------ */

const botaoMenu = document.getElementById("abrir-menu");
const menu      = document.getElementById("menu-celular");

function fechaMenu() {
  if (!menu || menu.hidden) return;
  menu.hidden = true;
  botaoMenu?.setAttribute("aria-expanded", "false");
  botaoMenu?.setAttribute("aria-label", "Abrir menu");
}

botaoMenu?.addEventListener("click", () => {
  const aberto = !menu.hidden;
  menu.hidden = aberto;
  botaoMenu.setAttribute("aria-expanded", String(!aberto));
  botaoMenu.setAttribute("aria-label", aberto ? "Abrir menu" : "Fechar menu");
});

document.addEventListener("click", (evento) => {
  if (menu?.hidden) return;
  if (
    !menu.contains(evento.target) &&
    evento.target !== botaoMenu &&
    !botaoMenu?.contains(evento.target)
  ) {
    fechaMenu();
  }
});

/* ------------------------------------------------------------------ *
 * 3. CORTINA DE DOAÇÃO
 *
 * Abre uma vez por visita (sessionStorage). Links com href="#doar"
 * também abrem a cortina ao ser clicados.
 * ------------------------------------------------------------------ */

const CHAVE_VISITA = "black:cortina";

function montaCortina() {
  const cortina = document.createElement("div");
  cortina.className = "cortina";
  cortina.id = "cortina";
  cortina.innerHTML = `
    <div class="painel-doar" role="dialog" aria-modal="true" aria-labelledby="painel-titulo" tabindex="-1">
      <button class="fechar" type="button" data-fechar aria-label="Fechar">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor"
             stroke-width="2" stroke-linecap="round" aria-hidden="true">
          <path d="m6 6 12 12M18 6 6 18" />
        </svg>
      </button>

      <div class="topo-painel">
        <img class="foto-lanyard" src="images/marca.webp" alt="" width="112" height="112" decoding="async" />
        <p class="kicker">Doação para</p>
        <h2 id="painel-titulo">BLACK</h2>
        <p class="arroba">pixgg.com/rochwxs</p>
        <p class="chamada">
          Doe para ajudar o projeto e a criar mais bots e scripts totalmente gratuitos!
        </p>
      </div>

      <figure class="qr qr-painel">
        <img src="images/qr-pix.png" alt="QR code que abre a página de doação pixgg.com/rochwxs"
             width="370" height="370" loading="lazy" decoding="async" />
        <figcaption>aponte a câmera</figcaption>
      </figure>

      <div class="acoes-painel">
        <a class="botao" href="${PIXGG}" target="_blank" rel="noopener noreferrer" data-ir>
          Ir para o PixGG
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </a>
        <button class="botao vazado" type="button" data-copiar>Copiar o link</button>
      </div>

      <p class="nota-painel">
        O pix é finalizado lá no PixGG — nada é cobrado aqui. Se não for doar agora,
        <button type="button" class="agora-nao" data-fechar>fecha aqui</button> que o resto do site
        continua igual.
      </p>
    </div>`;
  document.body.append(cortina);
  return cortina;
}

let cortina      = null;
let focoAnterior = null;

function fechaCortina() {
  if (!cortina || cortina.hidden) return;
  cortina.hidden = true;
  document.body.classList.remove("travado");
  if (focoAnterior instanceof HTMLElement) focoAnterior.focus();
}

function abreCortina() {
  cortina     ??= montaCortina();
  focoAnterior = document.activeElement;
  cortina.hidden = false;
  document.body.classList.add("travado");
  cortina.querySelector(".painel-doar").focus();

  for (const alvo of cortina.querySelectorAll("[data-fechar]")) {
    alvo.addEventListener("click", fechaCortina);
  }
  cortina.addEventListener("click", (evento) => {
    if (evento.target === cortina) fechaCortina();
  });
  cortina.querySelector("[data-ir]").addEventListener("click", () => {
    window.setTimeout(fechaCortina, 400);
  });
  cortina.querySelector("[data-copiar]").addEventListener("click", async (evento) => {
    const botao = evento.currentTarget;
    try {
      await navigator.clipboard.writeText(PIXGG);
      botao.textContent = "Link copiado";
      window.setTimeout(() => (botao.textContent = "Copiar o link"), 2200);
    } catch {
      botao.textContent = "pixgg.com/rochwxs";
    }
  });
}

document.addEventListener("keydown", (evento) => {
  if (evento.key !== "Escape") return;
  fechaCortina();
  fechaMenu();
});

if (!sessionStorage.getItem(CHAVE_VISITA)) {
  try {
    sessionStorage.setItem(CHAVE_VISITA, "1");
  } catch {
    /* armazenamento bloqueado: abre mesmo assim */
  }
  abreCortina();
}

/* Links internos que apontam para #doar abrem a cortina */
for (const gatilho of document.querySelectorAll('a[href="#doar"]')) {
  gatilho.addEventListener("click", (evento) => {
    evento.preventDefault();
    abreCortina();
  });
}

/* ------------------------------------------------------------------ *
 * 4. FOTO DO DISCORD (Lanyard)
 *
 * Atualiza todas as .foto-lanyard com o avatar real do Discord.
 * Sem Lanyard ou fora do ar, fica o brasão.
 * ------------------------------------------------------------------ */

async function carregaFoto() {
  const fotos = document.querySelectorAll(".foto-lanyard");
  if (fotos.length === 0) return;

  try {
    const resposta = await fetch(`https://api.lanyard.rest/v1/users/${AUTOR_ID}`);
    const corpo    = await resposta.json();
    if (!corpo.success) return;

    const perfil = corpo.data.discord_user;
    if (!perfil.avatar) return;

    const animado = perfil.avatar.startsWith("a_");
    const url = `https://cdn.discordapp.com/avatars/${perfil.id}/${perfil.avatar}.${
      animado ? "gif" : "png"
    }?size=256`;

    for (const foto of fotos) foto.src = url;
  } catch {
    /* fica o brasão */
  }
}

carregaFoto();
