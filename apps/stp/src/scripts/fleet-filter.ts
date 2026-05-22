export function initFleetFilter(): void {
  const buttons = document.querySelectorAll<HTMLButtonElement>("[data-filter]");
  const cards = document.querySelectorAll<HTMLElement>(".fleet-card");
  const empty = document.getElementById("fleet-empty");

  const applyFilter = (filter: string, activeBtn?: HTMLButtonElement) => {
    buttons.forEach((b) => {
      const active = b === activeBtn || (activeBtn === undefined && b.dataset.filter === filter);
      const isActive = activeBtn ? b === activeBtn : b.dataset.filter === filter;
      b.classList.toggle("bg-safety", isActive);
      b.classList.toggle("text-charcoal", isActive);
      b.classList.toggle("border", !isActive);
      b.classList.toggle("border-white/15", !isActive);
      b.classList.toggle("text-neutral-300", !isActive);
      b.setAttribute("aria-selected", isActive ? "true" : "false");
    });

    let visible = 0;
    cards.forEach((card) => {
      const category = card.dataset.category;
      const show = filter === "all" || category === filter;
      card.style.display = show ? "" : "none";
      if (show) visible++;
    });

    if (empty) empty.classList.toggle("hidden", visible > 0);
  };

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.dataset.filter ?? "all";
      const url = new URL(window.location.href);
      if (filter === "all") url.searchParams.delete("category");
      else url.searchParams.set("category", filter);
      window.history.replaceState({}, "", url);
      applyFilter(filter, btn);
    });
  });

  document.getElementById("fleet-empty")?.querySelector("[data-filter-all]")?.addEventListener("click", () => {
    const allBtn = document.querySelector<HTMLButtonElement>('[data-filter="all"]');
    allBtn?.click();
  });

  const params = new URLSearchParams(window.location.search);
  const initial = params.get("category") ?? "all";
  const initialBtn =
    document.querySelector<HTMLButtonElement>(`[data-filter="${initial}"]`) ??
    document.querySelector<HTMLButtonElement>('[data-filter="all"]');
  applyFilter(initial, initialBtn ?? undefined);
}
