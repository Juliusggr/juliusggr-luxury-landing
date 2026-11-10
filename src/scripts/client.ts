import { site } from "../data/site";

type Lang = "es" | "en";

function boot() {
  if (document.documentElement.dataset.ready === "1") return;
  document.documentElement.dataset.ready = "1";

  const root = document.documentElement;
  const menu = document.querySelector<HTMLElement>("[data-menu]");
  const menuButton = document.querySelector<HTMLButtonElement>("[data-menu-button]");
  const palette = document.querySelector<HTMLElement>("[data-palette]");
  const paletteInput = document.querySelector<HTMLInputElement>("[data-palette-input]");
  const paletteList = document.querySelector<HTMLElement>("[data-palette-list]");
  const paletteEmpty = document.querySelector<HTMLElement>("[data-palette-empty]");
  const toast = document.querySelector<HTMLElement>("#toast");
  const cursor = document.querySelector<HTMLElement>("#cursor-label");
  const hero = document.querySelector<HTMLElement>("[data-hero]");
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const desktop = window.matchMedia("(min-width: 768px)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  const lang = (): Lang => (root.lang === "en" ? "en" : "es");

  function applyLabels() {
    const key = lang() === "en" ? "data-label-en" : "data-label-es";
    const altKey = lang() === "en" ? "data-alt-en" : "data-alt-es";
    const phKey = lang() === "en" ? "data-ph-en" : "data-ph-es";
    document.querySelectorAll<HTMLElement>("[data-label-es]").forEach((node) => {
      const value = node.getAttribute(key);
      if (value) node.setAttribute("aria-label", value);
    });
    document.querySelectorAll<HTMLImageElement>("[data-alt-es]").forEach((node) => {
      const value = node.getAttribute(altKey);
      if (value) node.alt = value;
    });
    document.querySelectorAll<HTMLInputElement>("[data-ph-es]").forEach((node) => {
      const value = node.getAttribute(phKey);
      if (value) node.placeholder = value;
    });
    document.title = site.title[lang()];
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", site.description[lang()]);
  }

  function setLang(next: Lang) {
    root.lang = next;
    localStorage.setItem("lang", next);
    applyLabels();
  }

  function setTheme(next: "dark" | "light") {
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", next === "light" ? "#F4F1EA" : "#0B261C");
  }

  function showToast() {
    if (!toast) return;
    toast.classList.add("is-on");
    window.setTimeout(() => toast.classList.remove("is-on"), 1800);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email);
      showToast();
    } catch {
      const field = document.createElement("textarea");
      field.value = site.email;
      document.body.append(field);
      field.select();
      document.execCommand("copy");
      field.remove();
      showToast();
    }
  }

  function setMenu(open: boolean) {
    if (!menu || !menuButton) return;
    menu.hidden = !open;
    menuButton.setAttribute("aria-expanded", open ? "true" : "false");
    menuButton.setAttribute("aria-label", open ? (lang() === "en" ? "Close menu" : "Cerrar menú") : lang() === "en" ? "Open menu" : "Abrir menú");
    if (open) menu.querySelector<HTMLElement>("a, button")?.focus();
  }

  function visibleActions() {
    return [...(paletteList?.querySelectorAll<HTMLButtonElement>("[data-action]") ?? [])].filter((item) => !item.hidden);
  }

  function selectAction(next: HTMLButtonElement | undefined) {
    paletteList?.querySelectorAll("[data-action]").forEach((item) => item.classList.remove("is-selected"));
    next?.classList.add("is-selected");
  }

  function filterPalette(query: string) {
    const needle = query.trim().toLowerCase();
    const items = [...(paletteList?.querySelectorAll<HTMLButtonElement>("[data-action]") ?? [])];
    let picked = false;
    items.forEach((item) => {
      const hay = `${item.dataset.keywords ?? ""} ${item.textContent ?? ""}`.toLowerCase();
      const show = needle.length === 0 || hay.includes(needle);
      item.hidden = !show;
      item.classList.remove("is-selected");
      if (show && !picked) {
        item.classList.add("is-selected");
        picked = true;
      }
    });
    if (paletteEmpty) paletteEmpty.hidden = picked;
  }

  function setPalette(open: boolean) {
    if (!palette || !paletteInput) return;
    palette.hidden = !open;
    document.body.classList.toggle("overflow-hidden", open);
    if (open) {
      setMenu(false);
      filterPalette("");
      paletteInput.value = "";
      paletteInput.focus();
    }
  }

  function downloadCv() {
    const anchor = document.createElement("a");
    anchor.href = lang() === "en" ? "/cv-en.pdf" : "/cv-es.pdf";
    anchor.download = "";
    document.body.append(anchor);
    anchor.click();
    anchor.remove();
  }

  function runAction(action: string | undefined) {
    if (!action) return;
    if (action === "copy-email") void copyEmail();
    if (action === "download-cv") downloadCv();
    if (action === "open-github") window.open(site.github, "_blank", "noopener");
    if (action === "open-linkedin" && site.linkedin) window.open(site.linkedin, "_blank", "noopener");
    if (action === "toggle-lang") setLang(lang() === "en" ? "es" : "en");
    if (action === "toggle-theme") setTheme(root.dataset.theme === "light" ? "dark" : "light");
    setPalette(false);
  }

  menuButton?.addEventListener("click", () => setMenu(menu?.hidden !== false));
  document.querySelector("[data-menu-close]")?.addEventListener("click", () => setMenu(false));
  menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.querySelectorAll<HTMLButtonElement>("[data-set-lang]").forEach((button) => {
    button.addEventListener("click", () => setLang(button.dataset.setLang === "en" ? "en" : "es"));
  });
  document.querySelectorAll<HTMLButtonElement>("[data-set-theme]").forEach((button) => {
    button.addEventListener("click", () => setTheme(button.dataset.setTheme === "light" ? "light" : "dark"));
  });
  document.querySelector("[data-open-palette]")?.addEventListener("click", () => setPalette(true));
  document.querySelectorAll<HTMLButtonElement>("[data-copy-email]").forEach((button) => {
    button.addEventListener("click", () => void copyEmail());
  });

  palette?.addEventListener("click", (event) => {
    if (event.target === palette) setPalette(false);
  });
  paletteInput?.addEventListener("input", () => filterPalette(paletteInput.value));
  paletteList?.addEventListener("click", (event) => {
    const target = (event.target as HTMLElement | null)?.closest<HTMLButtonElement>("[data-action]");
    if (target) runAction(target.dataset.action);
  });

  window.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    if ((event.metaKey || event.ctrlKey) && key === "k") {
      event.preventDefault();
      setPalette(palette?.hidden !== false);
      return;
    }
    if (event.key === "Escape") {
      setPalette(false);
      setMenu(false);
    }
    if (palette?.hidden === false && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      const items = visibleActions();
      const current = items.findIndex((item) => item.classList.contains("is-selected"));
      const next = event.key === "ArrowDown" ? (current + 1) % items.length : (current - 1 + items.length) % items.length;
      selectAction(items[next]);
      items[next]?.scrollIntoView({ block: "nearest" });
    }
    if (palette?.hidden === false && event.key === "Enter") {
      event.preventDefault();
      runAction(visibleActions().find((item) => item.classList.contains("is-selected"))?.dataset.action);
    }
  });

  const slides = [...document.querySelectorAll<HTMLElement>("[data-slide]")];
  let slideIndex = 0;
  if (slides.length > 1 && !reduce.matches) {
    window.setInterval(() => {
      const reel = document.querySelector(".hero-reel");
      if (reel?.matches(":hover")) return;
      slides[slideIndex]?.classList.remove("is-on");
      slideIndex = (slideIndex + 1) % slides.length;
      slides[slideIndex]?.classList.add("is-on");
    }, 1000);
  }

  const cards = [...document.querySelectorAll<HTMLButtonElement>("[data-focus-card]")];
  let cardIndex = 0;
  let cardTimer = 0;
  const activateCard = (index: number) => {
    cardIndex = index;
    cards.forEach((card, position) => card.classList.toggle("is-active", position === index));
  };
  const startCards = () => {
    if (reduce.matches || cards.length < 2) return;
    window.clearInterval(cardTimer);
    cardTimer = window.setInterval(() => activateCard((cardIndex + 1) % cards.length), 3800);
  };
  cards.forEach((card, index) => card.addEventListener("click", () => activateCard(index)));
  document.querySelector("[data-focus-row]")?.addEventListener("mouseenter", () => window.clearInterval(cardTimer));
  document.querySelector("[data-focus-row]")?.addEventListener("mouseleave", startCards);
  startCards();

  const paint = () => {
    if (hero && desktop.matches && !reduce.matches) {
      const travel = hero.offsetHeight - window.innerHeight;
      const progress = travel <= 0 ? 0 : Math.min(1, Math.max(0, -hero.getBoundingClientRect().top / travel));
      hero.style.setProperty("--p", progress.toFixed(4));
    } else {
      hero?.style.setProperty("--p", "0");
    }
    const turn = `${window.scrollY * 0.12}deg`;
    document.querySelectorAll<HTMLElement>(".star").forEach((star) => {
      star.style.transform = `rotate(${turn})`;
    });
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        paint();
        ticking = false;
      });
    },
    { passive: true },
  );
  window.addEventListener("resize", paint);
  paint();

  if (cursor && finePointer.matches) {
    document.querySelectorAll<HTMLElement>("[data-cursor]").forEach((target) => {
      target.addEventListener("mouseenter", () => cursor.classList.add("is-on"));
      target.addEventListener("mouseleave", () => cursor.classList.remove("is-on"));
      target.addEventListener("mousemove", (event) => {
        cursor.style.transform = `translate(${event.clientX + 18}px, ${event.clientY + 18}px)`;
      });
    });
  }

  window.addEventListener("load", () => {
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const metric = document.querySelector<HTMLElement>("[data-metric]");
    if (navigation && metric && navigation.duration > 0) {
      metric.textContent = `${Math.round(navigation.duration)} ms · `;
    }
  });

  applyLabels();
}

document.addEventListener("astro:page-load", boot);
if (document.readyState !== "loading") boot();
else document.addEventListener("DOMContentLoaded", boot);
