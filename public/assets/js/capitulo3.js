const ID_MODULO = 3;
const SCROLL_OFFSET = 150;
let historiaConcluida = false;

function obterToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
    return null;
  }

  return token;
}

function rolarParaElemento(seletor, offset = SCROLL_OFFSET) {
  const alvo = document.querySelector(seletor);

  if (!alvo) return;

  const posicaoAlvo =
    alvo.getBoundingClientRect().top + window.scrollY - offset;

  window.scrollTo({
    top: posicaoAlvo,
    behavior: "smooth",
  });
}

function configurarScrollParaBotoes() {
  document.querySelectorAll("[data-scroll-to]").forEach((botao) => {
    botao.addEventListener("click", () => {
      rolarParaElemento(botao.dataset.scrollTo);
    });
  });
}

function ajustarScrollPorHashInicial() {
  const hash = window.location.hash;

  if (!hash) return;

  setTimeout(() => {
    rolarParaElemento(hash);
  }, 250);
}

function configurarRevealNoScroll() {
  const elementos = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
      });
    },
    {
      threshold: 0.18,
    },
  );

  elementos.forEach((el) => observer.observe(el));
}

function configurarProgressoVisual() {
  const secoes = document.querySelectorAll("[data-step]");
  const marcadores = document.querySelectorAll(
    ".chapter-progress .progress-item",
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const step = entry.target.dataset.step;

        marcadores.forEach((marcador) => {
          marcador.classList.toggle("active", marcador.dataset.step === step);
        });
      });
    },
    {
      threshold: 0.45,
    },
  );

  secoes.forEach((secao) => observer.observe(secao));
}

function configurarDailyBook() {
  const dailyBook = document.querySelector(".daily-book");

  if (!dailyBook) return;

  dailyBook.addEventListener("click", () => {
    dailyBook.classList.toggle("is-open");
    dailyBook.setAttribute(
      "aria-expanded",
      String(dailyBook.classList.contains("is-open")),
    );
  });
}

function configurarPergaminhoRetrospectiva() {
  const pergaminho = document.querySelector(".retrospectiva-scroll");

  if (!pergaminho) return;

  pergaminho.addEventListener("click", () => {
    pergaminho.classList.toggle("is-open");
    pergaminho.setAttribute(
      "aria-expanded",
      String(pergaminho.classList.contains("is-open")),
    );
  });
}

function configurarFogueiraBurningdown() {
  const fogueira = document.getElementById("btnFogueiraBurningdown");

  if (!fogueira) return;

  fogueira.addEventListener("click", () => {
    sessionStorage.setItem("origemBurningdown", "capitulo3");
    sessionStorage.setItem("retornoBurningdown", "/capitulo3#fogueira");

    window.location.href = "/burningdown";
  });
}

function definirPortalLiberado(liberado) {
  historiaConcluida = liberado;

  const portal = document.getElementById("portalScene");
  const linkPortal = document.querySelector(".ampulheta-link");

  if (portal) {
    portal.classList.toggle("is-locked", !liberado);
  }

  if (!linkPortal) return;

  if (liberado) {
    linkPortal.href = linkPortal.dataset.href || "/desafio3";
    linkPortal.removeAttribute("aria-disabled");
    linkPortal.removeAttribute("tabindex");
  } else {
    linkPortal.removeAttribute("href");
    linkPortal.setAttribute("aria-disabled", "true");
    linkPortal.setAttribute("tabindex", "-1");
  }
}

function configurarPortalDoDesafio() {
  definirPortalLiberado(false);

  const linkPortal = document.querySelector(".ampulheta-link");

  if (!linkPortal) return;

  linkPortal.addEventListener("click", (event) => {
    if (historiaConcluida) return;

    event.preventDefault();
  });
}

async function concluirHistoria() {
  const token = obterToken();
  const btnConcluir = document.getElementById("btnConcluirHistoria");
  const status = document.getElementById("statusHistoria");

  if (!token) return;

  if (btnConcluir) {
    btnConcluir.disabled = true;
    btnConcluir.textContent = "Registrando progresso...";
  }

  if (status) {
    status.textContent = "A dungeon esta registrando sua jornada...";
  }

  try {
    const response = await fetch(
      `/api/progresso/historia/${ID_MODULO}/concluir`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Nao foi possivel registrar o progresso.",
      );
    }

    localStorage.setItem("moduloAtual", ID_MODULO);

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (status) {
      status.textContent =
        "Historia concluida. A terceira porta foi liberada. Entre pela ampulheta para enfrentar o desafio.";
    }

    definirPortalLiberado(true);
  } catch (error) {
    console.error(error);

    if (status) {
      status.textContent = "Erro ao registrar progresso. Tente novamente.";
    }

    if (btnConcluir) {
      btnConcluir.disabled = false;
      btnConcluir.textContent = "Tentar concluir novamente";
    }
  }
}

function configurarConclusaoHistoria() {
  const btnConcluir = document.getElementById("btnConcluirHistoria");

  if (btnConcluir) {
    btnConcluir.addEventListener("click", concluirHistoria);
  }
}

async function carregarEstadoHistoria() {
  const token = obterToken();

  if (!token) return;

  try {
    const response = await fetch("/api/progresso/mapa", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) return;

    const modulo = data.modulos.find((m) => Number(m.id_modulo) === ID_MODULO);

    if (!modulo?.historia_concluida) return;

    const btnConcluir = document.getElementById("btnConcluirHistoria");
    const status = document.getElementById("statusHistoria");

    if (btnConcluir) {
      btnConcluir.classList.add("hidden");
    }

    if (status) {
      status.textContent =
        "Historia concluida. A terceira porta foi liberada. Entre pela ampulheta para enfrentar o desafio.";
    }

    definirPortalLiberado(true);
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  obterToken();
  configurarPortalDoDesafio();
  await carregarEstadoHistoria();

  configurarScrollParaBotoes();
  ajustarScrollPorHashInicial();
  configurarRevealNoScroll();
  configurarProgressoVisual();
  configurarDailyBook();
  configurarPergaminhoRetrospectiva();
  configurarConclusaoHistoria();
  configurarFogueiraBurningdown();

  if (typeof verificarEAtualizarNavbar === "function") {
    verificarEAtualizarNavbar();
  }
});
