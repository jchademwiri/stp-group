/**
 * Shared form utilities: sessionStorage persistence and inline field validation.
 */

const STORAGE_PREFIX = "stp-form-";

/**
 * Saves form field values to sessionStorage on every change,
 * restores them on page load, and clears storage on successful submit.
 */
export function initFormPersistence(formId: string): void {
  const form = document.getElementById(formId) as HTMLFormElement | null;
  if (!form) return;

  const storageKey = STORAGE_PREFIX + formId;

  // Restore saved values on page load
  try {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      const data = JSON.parse(saved) as Record<string, string>;
      for (const [name, value] of Object.entries(data)) {
        const field = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          `[name="${name}"]`,
        );
        if (field && "value" in field) {
          field.value = value;
        }
      }
    }
  } catch {
    // sessionStorage may be unavailable
  }

  // Debounced save on input/change
  let timer: ReturnType<typeof setTimeout>;
  const save = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      const fd = new FormData(form);
      const data: Record<string, string> = {};
      for (const [key, val] of fd.entries()) {
        if (typeof val === "string") data[key] = val;
      }
      try {
        sessionStorage.setItem(storageKey, JSON.stringify(data));
      } catch {
        // quota exceeded or unavailable
      }
    }, 250);
  };

  form.addEventListener("input", save);
  form.addEventListener("change", save);

}

/**
 * Explicitly clears persisted form data from sessionStorage.
 * Call this after a successful form submission.
 */
export function clearFormPersistence(formId: string): void {
  try {
    sessionStorage.removeItem(STORAGE_PREFIX + formId);
  } catch {
    // storage unavailable
  }
}

/**
 * Adds real-time validation feedback on blur and input for required fields.
 * Shows green border on valid, red border + error text on invalid.
 */
export function initInlineValidation(formId: string): void {
  const form = document.getElementById(formId);
  if (!form) return;

  const fields = form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
    "input:not([type=hidden]):not([name=website]), select, textarea",
  );

  fields.forEach((field) => {
    const isRequired = field.hasAttribute("required");
    if (!isRequired) return; // only validate required fields

    // Create a feedback element after the field
    const feedback = document.createElement("span");
    feedback.className = "mt-1 hidden items-center gap-1 text-xs";
    feedback.setAttribute("role", "alert");
    feedback.setAttribute("aria-live", "polite");

    field.insertAdjacentElement("afterend", feedback);

    const validate = () => {
      const value = field.value.trim();
      const isEmpty = value === "";

      // Untouched / empty - reset to neutral
      if (isEmpty) {
        field.classList.remove("border-red-400", "border-green-400");
        field.classList.add("border-white/15");
        feedback.className = "mt-1 hidden items-center gap-1 text-xs";
        field.removeAttribute("aria-invalid");
        return;
      }

      const valid = field.checkValidity();
      field.setAttribute("aria-invalid", String(!valid));

      if (valid) {
        field.classList.remove("border-red-400", "border-white/15");
        field.classList.add("border-green-400");
        feedback.className = "mt-1 hidden items-center gap-1 text-xs";
      } else {
        field.classList.remove("border-green-400", "border-white/15");
        field.classList.add("border-red-400");
        feedback.className = "mt-1 flex items-center gap-1 text-xs text-red-400";
        feedback.innerHTML =
          '<svg class="h-3 w-3 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg> Please fill in this field';
      }
    };

    field.addEventListener("blur", validate);
    field.addEventListener("input", validate);
  });

  // Listen for step-transition validation events (dispatched by form-steps)
  // so inline visual feedback shows when "Next" is clicked on empty fields
  form.addEventListener("stp:validate", () => {
    const visiblePanel = form.querySelector<HTMLElement>("[data-step-panel]:not([hidden])");
    if (!visiblePanel) return;
    const panelFields = visiblePanel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      "input:not([type=hidden]):not([name=website]), select, textarea",
    );
    panelFields.forEach((field) => {
      // Dispatch blur on each field to trigger the validate closure
      field.dispatchEvent(new Event("blur"));
    });
  });
}
