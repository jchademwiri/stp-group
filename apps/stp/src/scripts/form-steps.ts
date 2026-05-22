export function initFormSteps(formId: string): void {
  const form = document.getElementById(formId);
  if (!form) return;

  const panels = form.querySelectorAll<HTMLElement>("[data-step-panel]");
  const nextBtn = form.querySelector<HTMLButtonElement>("[data-step-next]");
  const backBtn = form.querySelector<HTMLButtonElement>("[data-step-back]");
  const submitBtn = form.querySelector<HTMLButtonElement>("[data-step-submit]");
  const currentEl = form.querySelector("[data-step-current]");
  let step = 1;
  const maxStep = panels.length;

  const showStep = (n: number) => {
    step = n;
    panels.forEach((p) => {
      const n = Number(p.dataset.stepPanel);
      p.hidden = n !== step;
    });
    if (currentEl) currentEl.textContent = String(step);
    if (backBtn) backBtn.hidden = step === 1;
    if (nextBtn) nextBtn.hidden = step === maxStep;
    if (submitBtn) submitBtn.hidden = step !== maxStep;
  };

  const validateStep = (n: number): boolean => {
    const panel = form.querySelector<HTMLElement>(`[data-step-panel="${n}"]`);
    if (!panel) return true;
    const fields = panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input, select, textarea",
    );
    for (const field of fields) {
      if (field.name === "website") continue;
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  };

  nextBtn?.addEventListener("click", () => {
    if (!validateStep(step)) return;
    if (step < maxStep) showStep(step + 1);
  });

  backBtn?.addEventListener("click", () => {
    if (step > 1) showStep(step - 1);
  });

  showStep(1);
}
