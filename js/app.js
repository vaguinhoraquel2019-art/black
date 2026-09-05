/* ================================================================== *
 * app.js — lógica unificada do site Black
 *
 * Cobre três áreas:
 *   1. Convite do Discord (seção Início)
 *   2. Acervo de apostilas com filtros (seção Apostilas)
 *   3. Copiar link do PixGG (seção Doar)
 * ================================================================== */

/* ------------------------------------------------------------------ *
 * 1. CONVITE DO DISCORD
 * ------------------------------------------------------------------ */

const CONVITE = "zunder";

const numero = (n) => n.toLocaleString("pt-BR");

async function carregaConvite() {
  try {
    const resposta = await fetch(
      `https://discord.com/api/v10/invites/${CONVITE}?with_counts=true`
    );
    if (!resposta.ok) return;
    const dados = await resposta.json();

    const online = document.getElementById("qtd-online");
    const membros = document.getElementById("qtd-membros");

    if (typeof dados.approximate_presence_count === "number") {
      online.textContent = `${numero(dados.approximate_presence_count)} online`;
    }
    if (typeof dados.approximate_member_count === "number") {
      membros.textContent = `${numero(dados.approximate_member_count)} membros`;
    }
    if (dados.guild?.description) {
      const desc = document.querySelector(".descricao");
      if (desc) desc.textContent = dados.guild.description;
    }
  } catch {
    /* sem rede: fica o traço */
  }
}

carregaConvite();

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") carregaConvite();
});

/* ------------------------------------------------------------------ *
 * 2. ACERVO DE APOSTILAS
 * ------------------------------------------------------------------ */

const estado = { bimestre: "todos", etapa: "todas", busca: "" };

const BIMESTRES = [1, 2, 3];

const semAcento = (t) =>
  t
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[º°ª]/g, "")
    .toLowerCase();

const megabytes = (bytes) => `${Math.round(bytes / 1048576)} MB`;

function tituloCaderno(caderno) {
  const m = caderno.materias;
  return m.length < 2 ? m[0] : `${m.slice(0, -1).join(", ")} e ${m[m.length - 1]}`;
}

function serieDe(id) {
  return SERIES.find((s) => s.id === id);
}

/* Filtros ---------------------------------------------------------- */

function montaGrupo(elemento, opcoes, campo) {
  if (!elemento) return;
  elemento.innerHTML = "";
  for (const opcao of opcoes) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "pastilha";
    botao.setAttribute("role", "radio");
    botao.dataset.valor = String(opcao.id);
    botao.textContent = opcao.rotulo;
    botao.addEventListener("click", () => {
      estado[campo] = opcao.id;
      desenha();
    });
    elemento.append(botao);
  }
}

function marcaGrupo(elemento, valor) {
  if (!elemento) return;
  for (const botao of elemento.querySelectorAll(".pastilha")) {
    botao.setAttribute("aria-checked", String(botao.dataset.valor === String(valor)));
  }
}

/* Acervo ----------------------------------------------------------- */

function filtra() {
  const termo = semAcento(estado.busca).trim();
  return CADERNOS.filter((c) => {
    if (estado.bimestre !== "todos" && c.bimestre !== estado.bimestre) return false;
    const serie = serieDe(c.serie);
    if (estado.etapa !== "todas" && serie.etapa !== estado.etapa) return false;
    if (!termo) return true;
    const alvo = semAcento(
      `${serie.rotulo} ${serie.busca} ${c.materias.join(" ")} ${c.bimestre} bimestre`
    );
    return termo.split(/\s+/).every((parte) => alvo.includes(parte));
  });
}

function cartao(caderno) {
  const serie = serieDe(caderno.serie);
  const nome = tituloCaderno(caderno);
  const ficha = `${caderno.paginas} páginas · ${megabytes(caderno.bytes)}`;

  const item = document.createElement("li");
  item.innerHTML = `
    <a class="caderno" href="${caderno.url}" target="_blank" rel="noopener noreferrer"
       aria-label="Abrir ${serie.rotulo}, ${nome}, ${caderno.bimestre}º bimestre, em PDF no acervo da Secretaria da Educação">
      <div class="topo">
        <p class="kicker">${caderno.bimestre}º bimestre</p>
        ${caderno.gabarito ? '<span class="selo">com gabarito</span>' : ""}
      </div>
      <h4>${nome}</h4>
      <ul class="materias">
        ${caderno.materias.map((m) => `<li>${m}</li>`).join("")}
      </ul>
      <div class="rodape">
        <span class="num">${ficha}</span>
        <span class="abrir">Abrir
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor"
               stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M7 17 17 7M9 7h8v8" />
          </svg>
        </span>
      </div>
    </a>`;
  return item;
}

function desenha() {
  marcaGrupo(document.getElementById("filtro-bimestre"), estado.bimestre);
  marcaGrupo(document.getElementById("filtro-etapa"), estado.etapa);

  const achados = filtra();
  const acervo = document.getElementById("acervo");
  if (!acervo) return;
  acervo.innerHTML = "";

  if (achados.length === 0) {
    const vazio = document.createElement("div");
    vazio.className = "vazio";
    vazio.innerHTML = `<p>Nenhum caderno com esse filtro.</p>`;
    const limpar = document.createElement("button");
    limpar.type = "button";
    limpar.textContent = "Limpar filtros";
    limpar.addEventListener("click", () => {
      estado.bimestre = "todos";
      estado.etapa = "todas";
      estado.busca = "";
      const campoBusca = document.getElementById("busca");
      if (campoBusca) campoBusca.value = "";
      desenha();
    });
    vazio.append(limpar);
    acervo.append(vazio);
  }

  for (const etapa of ETAPAS) {
    const series = SERIES.filter((s) => s.etapa === etapa.id)
      .map((serie) => ({
        serie,
        itens: achados
          .filter((c) => c.serie === serie.id)
          .sort((a, b) => a.bimestre - b.bimestre || tituloCaderno(a).localeCompare(tituloCaderno(b))),
      }))
      .filter((g) => g.itens.length > 0);

    if (series.length === 0) continue;

    const bloco = document.createElement("section");
    bloco.className = "etapa";
    bloco.innerHTML = `
      <header>
        <h2>${etapa.rotulo}</h2>
        <p class="kicker">${etapa.nota}</p>
      </header>`;

    for (const { serie, itens } of series) {
      const secao = document.createElement("section");
      secao.className = "serie";
      secao.id = `serie-${serie.id}`;
      secao.innerHTML = `<h3>${serie.rotulo}</h3>`;
      const grade = document.createElement("ul");
      grade.className = "grade";
      for (const caderno of itens) grade.append(cartao(caderno));
      secao.append(grade);
      bloco.append(secao);
    }

    acervo.append(bloco);
  }

  const aviso = document.getElementById("aviso-resultado");
  if (aviso) {
    aviso.textContent =
      achados.length === 0
        ? "Nenhum caderno encontrado."
        : `${achados.length} ${achados.length === 1 ? "caderno" : "cadernos"} na lista.`;
  }
}

/* Inicializa filtros e acervo -------------------------------------- */

montaGrupo(
  document.getElementById("filtro-bimestre"),
  [{ id: "todos", rotulo: "Todos" }, ...BIMESTRES.map((b) => ({ id: b, rotulo: `${b}º` }))],
  "bimestre"
);

montaGrupo(
  document.getElementById("filtro-etapa"),
  [{ id: "todas", rotulo: "Todas" }, ...ETAPAS.map((e) => ({ id: e.id, rotulo: e.curto }))],
  "etapa"
);

document.getElementById("busca")?.addEventListener("input", (evento) => {
  estado.busca = evento.target.value;
  desenha();
});

desenha();

/* ------------------------------------------------------------------ *
 * 3. COPIAR LINK DO PIXGG (seção Doar)
 * ------------------------------------------------------------------ */

const LINK_PIX = "https://pixgg.com/rochwxs";

document.getElementById("copiar-link")?.addEventListener("click", async (evento) => {
  const aviso = document.getElementById("aviso-copia");
  const botao = evento.currentTarget;
  try {
    await navigator.clipboard.writeText(LINK_PIX);
    botao.textContent = "Link copiado";
    if (aviso) aviso.textContent = "link copiado";
    window.setTimeout(() => {
      botao.textContent = "Copiar o link";
      if (aviso) aviso.textContent = "pixgg.com/rochwxs";
    }, 2200);
  } catch {
    if (aviso) aviso.textContent = "copie à mão: pixgg.com/rochwxs";
  }
});
