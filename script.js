const bookingEmail = "vikram.bhardwaj200710@gmail.com";
const byId = (id) => document.getElementById(id);

function readList(key, fallback = []) {
  try {
    const list = JSON.parse(localStorage.getItem(key));
    return Array.isArray(list) ? list : fallback;
  } catch {
    return fallback;
  }
}

function prepareDraft(link, subject, lines, recipient = bookingEmail) {
  const body = encodeURIComponent(lines.join("\n").replace(/\r?\n/g, "\r\n"));
  link.href = "mailto:" + recipient + "?subject=" + encodeURIComponent(subject) + "&body=" + body;
  link.hidden = false;
}

// Mobile menu
const menu = byId("primary-nav");
const menuButton = byId("nav-toggle");
menuButton.onclick = () => {
  const open = menu.classList.toggle("is-open");
  menuButton.setAttribute("aria-expanded", open);
};
document.addEventListener("click", (event) => {
  if (menu.contains(event.target) || menuButton.contains(event.target)) return;
  menu.classList.remove("is-open");
  menuButton.setAttribute("aria-expanded", false);
});

// Filter the cards already written in categories.html.
const categoryGrid = byId("categories-grid");
if (categoryGrid) {
  const cards = categoryGrid.querySelectorAll("article");
  const filters = document.querySelectorAll("[data-category-filter]");
  const search = byId("category-search");
  let group = "All";

  function filterCategories(selectedGroup = group) {
    group = selectedGroup;
    const query = search.value.trim().toLowerCase();
    let count = 0;
    for (const card of cards) {
      const matchesGroup = group === "All" || card.dataset.categoryGroup === group;
      const matchesSearch = card.textContent.toLowerCase().includes(query);
      card.hidden = !matchesGroup || !matchesSearch;
      if (!card.hidden) count++;
    }
    for (const button of filters) {
      button.setAttribute("aria-pressed", button.dataset.categoryFilter === group);
    }
    byId("categories-count").textContent = "Showing " + count + " of " + cards.length + " categories";
    byId("categories-empty").hidden = count > 0;
  }

  for (const button of filters) {
    button.onclick = () => filterCategories(button.dataset.categoryFilter);
  }
  byId("reset-cat-btn").onclick = () => {
    search.value = "";
    filterCategories("All");
  };
  search.oninput = () => filterCategories();
  filterCategories();
}

// Read the checklist progress on the home page.
const checklistCount = byId("metric-checklist");
if (checklistCount) {
  const checked = readList("recircuit_checklist_v1", ["prep-backup", "prep-cards"]);
  checklistCount.textContent = checked.length + " / 5";
}

// The pickup form opens an email draft.
const pickup = byId("pickup-form");
if (pickup) {
  const fields = pickup.elements;
  const draft = byId("pickup-draft-link");
  const feedback = byId("pickup-form-feedback");
  const category = new URLSearchParams(location.search).get("category");
  fields.category.value = category || "";
  if (fields.category.selectedIndex < 0) fields.category.value = "";

  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  fields.pickupDate.min = today.getFullYear() + "-" + month + "-" + day;
  if (!fields.pickupDate.value) fields.pickupDate.value = fields.pickupDate.min;

  pickup.oninput = () => {
    draft.hidden = true;
    draft.removeAttribute("href");
    feedback.hidden = true;
  };
  pickup.onsubmit = (event) => {
    event.preventDefault();
    prepareDraft(draft, "ReCircuit Pickup Request", [
      "Name: " + fields.fullName.value.trim(),
      "Email: " + fields.email.value.trim(),
      "Phone: " + fields.phone.value.trim(),
      "Address: " + fields.address.value.trim(),
      "Category: " + fields.category.selectedOptions[0].text,
      "Item count: " + fields.quantity.value,
      "Preferred date: " + fields.pickupDate.value,
      "Time window: " + fields.timeWindow.value,
      "",
      "Handling notes: " + (fields.notes.value.trim() || "None")
    ]);
    feedback.hidden = false;
    draft.click();
  };
}

// Contact page
const contact = byId("contact-form");
if (contact) {
  const contactEmail = byId("primary-contact-link").pathname;
  const status = byId("copy-email-status");
  byId("copy-email-btn").onclick = async () => {
    try {
      await navigator.clipboard.writeText(contactEmail);
      status.textContent = "Email address copied.";
    } catch {
      status.textContent = contactEmail;
    }
    status.hidden = false;
  };

  contact.onsubmit = (event) => {
    event.preventDefault();
    const fields = contact.elements;
    const name = fields.name.value.trim();
    const topic = fields.topic.value;
    prepareDraft(byId("contact-mailto-link"), "ReCircuit inquiry: " + topic, [
      "Name: " + name,
      "Email: " + fields.email.value.trim(),
      "Topic: " + topic,
      "",
      fields.message.value.trim()
    ], contactEmail);
    byId("contact-form-feedback").hidden = false;
    contact.reset();
  };
}

// Drop-off checklist and directory
const checklist = byId("prep-checklist");
if (checklist) {
  const boxes = checklist.querySelectorAll("input");
  const storageKey = "recircuit_checklist_v1";
  const saved = readList(storageKey, ["prep-backup", "prep-cards"]);
  const progressText = byId("prep-progress-text");
  const progressFill = byId("prep-progress-fill");

  function updateProgress() {
    const checkedIds = [];
    for (const box of boxes) {
      box.parentElement.classList.toggle("is-checked", box.checked);
      if (box.checked) checkedIds.push(box.id);
    }
    progressText.textContent = `${checkedIds.length} of ${boxes.length} completed`;
    progressFill.style.width = Math.round(checkedIds.length * 100 / boxes.length) + "%";
    return checkedIds;
  }

  function saveProgress() {
    const checkedIds = updateProgress();
    try {
      localStorage.setItem(storageKey, JSON.stringify(checkedIds));
    } catch {
      // The checklist still works when browser storage is unavailable.
    }
  }

  for (const box of boxes) box.checked = saved.includes(box.id);
  updateProgress();
  checklist.addEventListener("change", saveProgress);
  byId("reset-checklist-btn").addEventListener("click", () => {
    for (const box of boxes) box.checked = false;
    saveProgress();
  });

  const search = byId("facility-search");
  const table = byId("facility-list");
  const rows = table.querySelectorAll("tbody tr");

  search.addEventListener("input", () => {
    const query = search.value.trim().toLowerCase();
    let matches = 0;
    for (const row of rows) {
      row.hidden = !row.textContent.toLowerCase().includes(query);
      if (!row.hidden) matches++;
    }
    table.hidden = matches === 0;
    byId("facility-no-matches").hidden = matches > 0;
  });
}

setUpDropoff();
