
/* =====================================================
   Nova Living Resort - Part 3 JavaScript
   ===================================================== */

/* ---------- Mobile menu ---------- */
function initNav() {
  const btn = document.querySelector(".nav-toggle");
  const list = document.querySelector("nav ul");
  if (!btn || !list) return;
  btn.addEventListener("click", () => {
    const open = list.classList.toggle("open");
    btn.setAttribute("aria-expanded", open);
  });
}

/* ---------- Scroll animation ---------- */
function initFadeIn() {
  const els = document.querySelectorAll(".fade-in");
  if (!("IntersectionObserver" in window)) {
    els.forEach(e => e.classList.add("visible"));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add("visible");
        obs.unobserve(en.target);
      }
    });
  }, { threshold: 0.1 });
  els.forEach(e => obs.observe(e));
}

/* ---------- Accordion (about page FAQ) ---------- */
function initAccordion() {
  document.querySelectorAll(".accordion-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const panel = btn.nextElementSibling;
      const isOpen = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", !isOpen);
      panel.classList.toggle("open", !isOpen);
      panel.style.maxHeight = isOpen ? null : panel.scrollHeight + "px";
    });
  });
}

/* ---------- Tabs (services page) ---------- */
function initTabs() {
  const btns = document.querySelectorAll(".tab-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", () => {
      btns.forEach(b => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
      });
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
      btn.classList.add("active");
      btn.setAttribute("aria-selected", "true");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });
}

/* ---------- Gallery lightbox (services page) ---------- */
function initLightbox() {
  const box = document.getElementById("lightbox");
  if (!box) return;
  const big = document.getElementById("lightbox-img");
  const close = () => { box.hidden = true; };
  document.querySelectorAll(".gallery img").forEach(img => {
    img.addEventListener("click", () => {
      big.src = img.src;
      big.alt = img.alt;
      box.hidden = false;
    });
  });
  box.addEventListener("click", e => {
    if (e.target === box || e.target.classList.contains("lightbox-close")) close();
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });
}

/* ---------- Dynamic services: built with JS, searchable, filterable, sortable ---------- */
/* EDIT these names, descriptions and prices to match your real services */
const SERVICES = [
  { name: "VIP Suite", category: "rooms", price: 7000, desc: "Spacious, elegantly furnished suite with a family friendly layout." },
  { name: "Family Room", category: "rooms", price: 3500, desc: "Comfortable room designed for parents and kids." },
  { name: "Chef's Dinner", category: "dining", price: 450, desc: "Custom menu prepared by our professional chefs." },
  { name: "Kids Menu Lunch", category: "dining", price: 150, desc: "Healthy and fun meals for children." },
  { name: "Spa & Wellness Package", category: "activities", price: 900, desc: "Relaxing treatments for individuals and couples." },
  { name: "Family & Kids Activities", category: "activities", price: 250, desc: "Supervised activities for the whole family." }
];

function initServices() {
  const list = document.getElementById("service-list");
  if (!list) return;
  const search = document.getElementById("service-search");
  const filter = document.getElementById("service-filter");
  const sort = document.getElementById("service-sort");
  const count = document.getElementById("service-count");

  function render() {
    const q = search.value.trim().toLowerCase();
    const items = SERVICES.filter(s =>
      (filter.value === "all" || s.category === filter.value) &&
      (s.name + " " + s.desc + " " + s.category).toLowerCase().includes(q)
    );
    if (sort.value === "name") items.sort((a, b) => a.name.localeCompare(b.name));
    if (sort.value === "price-asc") items.sort((a, b) => a.price - b.price);
    if (sort.value === "price-desc") items.sort((a, b) => b.price - a.price);

    list.innerHTML = "";
    items.forEach(s => {
      const card = document.createElement("article");
      card.className = "card";
      const h = document.createElement("h3");
      h.textContent = s.name;
      const p = document.createElement("p");
      p.textContent = s.desc;
      const pr = document.createElement("p");
      pr.className = "price";
      pr.textContent = "From R" + s.price.toLocaleString("en-ZA");
      card.append(h, p, pr);
      list.appendChild(card);
    });
    count.textContent = items.length
      ? items.length + " service(s) found."
      : "No services match your search.";
  }
  [search, filter, sort].forEach(el => el.addEventListener("input", render));
  render();
}

/* ---------- Modal (enquiries page) ---------- */
function initModal() {
  const modal = document.getElementById("modal");
  const open = document.getElementById("open-modal");
  if (!modal || !open) return;
  open.addEventListener("click", () => { modal.hidden = false; });
  modal.addEventListener("click", e => {
    if (e.target === modal || e.target.classList.contains("modal-close")) modal.hidden = true;
  });
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") modal.hidden = true;
  });
}

/* =====================================================
   FORM VALIDATION
   ===================================================== */
function setError(field, msg) {
  const group = field.closest(".form-group");
  const span = group ? group.querySelector(".error") : null;
  if (span) span.textContent = msg;
  field.classList.toggle("invalid", !!msg);
  field.classList.toggle("valid", !msg && field.value !== "");
}

function validateField(f) {
  const v = f.value.trim();

  if (f.type === "checkbox") {
    if (f.required && !f.checked) { setError(f, "Please tick this box to continue."); return false; }
    setError(f, "");
    return true;
  }
  if (f.required && !v) { setError(f, "This field is required."); return false; }
  if (f.id === "fullname" && !/^[A-Za-z\u00C0-\u024F' -]{2,60}$/.test(v)) {
    setError(f, "Enter a valid name (letters only, at least 2).");
    return false;
  }
  if (f.type === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) {
    setError(f, "Enter a valid email address, e.g. name@example.com.");
    return false;
  }
  if (f.type === "tel" && v && !/^0\d{9}$/.test(v)) {
    setError(f, "Phone must be 10 digits and start with 0.");
    return false;
  }
  if (f.tagName === "TEXTAREA" && v.length < 10) {
    setError(f, "Please enter at least 10 characters.");
    return false;
  }
  if (f.type === "number" && v && (+v < +f.min || +v > +f.max)) {
    setError(f, "Enter a number between " + f.min + " and " + f.max + ".");
    return false;
  }
  setError(f, "");
  return true;
}

function validateForm(form) {
  let ok = true;
  form.querySelectorAll("input, select, textarea").forEach(f => {
    if (!validateField(f)) ok = false;
  });
  return ok;
}

/* Checks each field while the user types or leaves the field */
function liveValidate(form) {
  form.querySelectorAll("input, select, textarea").forEach(f => {
    f.addEventListener("blur", () => validateField(f));
    f.addEventListener("input", () => {
      if (f.classList.contains("invalid")) validateField(f);
    });
    f.addEventListener("change", () => {
      if (f.type === "checkbox") validateField(f);
    });
  });
}

/* AJAX submission: sends the form in the background without reloading the page.
   While YOUR_FORM_ID is not replaced, it simulates a successful send. */
async function ajaxSubmit(form) {
  const url = form.getAttribute("action");
  if (!url || url.includes("YOUR_FORM_ID")) {
    await new Promise(r => setTimeout(r, 600));
    return true;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

function showBox(box, html, ok) {
  box.innerHTML = html;
  box.classList.toggle("fail", !ok);
  box.hidden = false;
  box.scrollIntoView({ behavior: "smooth", block: "center" });
}

/* Stops visitors typing HTML into the page */
function esc(s) {
  return s.replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

/* =====================================================
   ENQUIRIES PAGE: validation + processed response
   ===================================================== */
/* EDIT these rates to your real prices */
const RATES = {
  "luxury-suite": 7000,      /* per night */
  "spa-wellness": 900,       /* per guest */
  "fine-dining": 450,        /* per guest */
  "family-activities": 250   /* per guest */
};
const LABELS = {
  "luxury-suite": "VIP Suite Accommodation",
  "spa-wellness": "Spa & Wellness Package",
  "fine-dining": "Fine Dining Experience",
  "family-activities": "Family & Kids Activities"
};

function initEnquiryForm() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  const box = document.getElementById("enquiry-response");

  const today = new Date().toISOString().split("T")[0];
  form.checkin.min = today;
  form.checkout.min = today;
  liveValidate(form);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const type = form.elements["service-intrest"].value;
    const name = esc(form.fullname.value.trim());
    const guests = +form.guests.value || 1;
    let cost, summary;

    if (type === "luxury-suite") {
      if (!form.checkin.value || !form.checkout.value) {
        setError(form.checkin, "Select check-in and check-out dates for a suite.");
        return;
      }
      const ci = new Date(form.checkin.value);
      const co = new Date(form.checkout.value);
      if (co <= ci) {
        setError(form.checkout, "Check-out must be after check-in.");
        return;
      }
      const nights = Math.round((co - ci) / 86400000);
      cost = RATES[type] * nights;
      summary = nights + " night(s) for " + guests + " guest(s)";
    } else {
      cost = RATES[type] * guests;
      summary = guests + " guest(s)";
    }

    const reply =
      "<h2>Thank you, " + name + "!</h2>" +
      "<p>" + LABELS[type] + ": the estimated cost for " + summary +
      " is <strong>R" + cost.toLocaleString("en-ZA") + "</strong>.</p>" +
      "<p>Availability looks good. Our team will contact you within 24 hours to finalise your arrangements.</p>";

    const ok = await ajaxSubmit(form);
    showBox(box, ok ? reply : "<p>Sorry, something went wrong sending your enquiry. Please try again.</p>", ok);
    if (ok) {
      form.reset();
      form.querySelectorAll(".valid").forEach(f => f.classList.remove("valid"));
    }
  });
}

/* =====================================================
   CONTACT PAGE: validation + email
   ===================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const box = document.getElementById("contact-response");
  liveValidate(form);

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validateForm(form)) return;

    const fullname = form.fullname.value.trim();
    const body =
      "Name: " + fullname + "\n" +
      "Email: " + form.email.value.trim() + "\n" +
      "Phone: " + form.phone.value.trim() + "\n" +
      "Type: " + form.message_type.value + "\n\n" +
      "Message:\n" + form.message.value.trim();

    /* Email compiled from the form: the visitor can send it to the resort */
    const mailto =
      "mailto:reception@novalivingresort.com" +
      "?subject=" + encodeURIComponent(form.message_type.value + " - " + fullname) +
      "&body=" + encodeURIComponent(body);

    const ok = await ajaxSubmit(form);
    const reply =
      "<h2>Message ready!</h2>" +
      "<p>Thank you, " + esc(fullname) + ". Your message has been compiled into an email.</p>" +
      "<p><a class=\"btn\" href=\"" + mailto + "\">Send email</a></p>";

    showBox(box, ok ? reply : "<p>Sorry, we could not send your message. Please try again.</p>", ok);
    if (ok) form.reset();
  });
}

/* =====================================================
   MAP (contact page, Leaflet + OpenStreetMap)
   ===================================================== */
function initMap() {
  const el = document.getElementById("map");
  if (!el || typeof L === "undefined") return;

  /* CHANGE these numbers to your resort's real latitude and longitude */
  const position = [-33.9249, 18.4241];

  const map = L.map("map").setView(position, 13);
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 19
  }).addTo(map);
  L.marker(position).addTo(map)
    .bindPopup("<b>Nova Living Resort</b><br>100 Nova Luxury Drive, Coast Edge Estate")
    .openPopup();
}

/* =====================================================
   FOOTER: today's date, live clock and copyright year
   ===================================================== */
function initFooterDate() {
  const dateEl = document.getElementById("footer-date");
  const yearEl = document.getElementById("footer-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  if (!dateEl) return;

  function update() {
    const now = new Date();
    dateEl.textContent =
      now.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) +
      " | " + now.toLocaleTimeString("en-ZA");
  }
  update();
  setInterval(update, 1000);
}

/* =====================================================
   START everything when the page has loaded
   ===================================================== */
document.addEventListener("DOMContentLoaded", () => {
  initNav();
  initFadeIn();
  initAccordion();
  initTabs();
  initLightbox();
  initServices();
  initModal();
  initEnquiryForm();
  initContactForm();
  initMap();
  initFooterDate();
});