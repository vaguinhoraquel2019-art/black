/* Página de doação: só o copiar-link do cartão. O QR e o botão de ir para
   o PixGG são HTML puro, e a cortina que abre ao entrar mora no `site.js`. */

const LINK = "https://pixgg.com/rochwxs";

/* ------------------------------------------------------------------ *
 * Copiar o link do cartão
 * ------------------------------------------------------------------ */

document.getElementById("copiar-link")?.addEventListener("click", async (evento) => {
  const aviso = document.getElementById("aviso-copia");
  const botao = evento.currentTarget;
  try {
    await navigator.clipboard.writeText(LINK);
    botao.textContent = "Link copiado";
    aviso.textContent = "link copiado";
    window.setTimeout(() => {
      botao.textContent = "Copiar o link";
      aviso.textContent = "pixgg.com/rochwxs";
    }, 2200);
  } catch {
    /* sem permissão: o endereço continua escrito na tela para copiar à mão */
    aviso.textContent = "copie à mão: pixgg.com/rochwxs";
  }
});
