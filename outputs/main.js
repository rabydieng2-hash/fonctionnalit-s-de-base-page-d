const formatWhatsAppMessage = (property) => {
  const text = `Bonjour Teranga Immo, je souhaite avoir plus d'informations sur le bien : ${property.title} à ${property.location}.`;
  return `https://wa.me/15077190505?text=${encodeURIComponent(text)}`;
};

const renderPropertyCard = (property) => `
  <article class="property-card">
    <a class="property-image-link" href="detail.html?id=${property.id}" aria-label="Voir ${property.title}">
      <img src="${property.image}" alt="${property.title}" loading="lazy">
      <span>${property.type}</span>
    </a>
    <div class="property-card-body">
      <p class="price">${property.price}</p>
      <h3>${property.title}</h3>
      <p class="location">${property.location} · ${property.area}</p>
      <p>${property.description}</p>
      <div class="card-actions">
        <a class="button button-primary" href="detail.html?id=${property.id}">Détails</a>
        <a class="button button-ghost" href="${formatWhatsAppMessage(property)}" target="_blank" rel="noopener">WhatsApp</a>
      </div>
    </div>
  </article>
`;

const filterProperties = (type, zone) => {
  const normalizedZone = zone.trim().toLowerCase();
  return properties.filter((property) => {
    const typeMatch = !type || property.type === type;
    const zoneMatch = !normalizedZone || property.location.toLowerCase().includes(normalizedZone);
    return typeMatch && zoneMatch;
  });
};

const setupNavigation = () => {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
};

const setupHomePage = () => {
  const featured = document.querySelector("#featuredProperties");
  if (featured) {
    featured.innerHTML = properties.slice(0, 3).map(renderPropertyCard).join("");
  }

  const homeSearch = document.querySelector("#homeSearch");
  if (homeSearch) {
    homeSearch.addEventListener("submit", (event) => {
      event.preventDefault();
      const formData = new FormData(homeSearch);
      const params = new URLSearchParams();
      if (formData.get("type")) params.set("type", formData.get("type"));
      if (formData.get("zone")) params.set("zone", formData.get("zone"));
      window.location.href = `biens.html?${params.toString()}`;
    });
  }
};

const setupListingsPage = () => {
  const container = document.querySelector("#allProperties");
  const form = document.querySelector("#listingSearch");
  const line = document.querySelector("#resultsLine");
  if (!container || !form) return;

  const params = new URLSearchParams(window.location.search);
  form.elements.type.value = params.get("type") || "";
  form.elements.zone.value = params.get("zone") || "";

  const render = () => {
    const results = filterProperties(form.elements.type.value, form.elements.zone.value);
    container.innerHTML = results.length
      ? results.map(renderPropertyCard).join("")
      : `<p class="empty-state">Aucun bien ne correspond à cette recherche. Essayez une autre zone ou un autre type.</p>`;
    if (line) {
      line.textContent = `${results.length} bien${results.length > 1 ? "s" : ""} trouvé${results.length > 1 ? "s" : ""}`;
    }
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    render();
  });

  form.addEventListener("reset", () => {
    window.setTimeout(render, 0);
  });

  render();
};

const setupDetailPage = () => {
  const detail = document.querySelector("#propertyDetail");
  if (!detail) return;

  const params = new URLSearchParams(window.location.search);
  const property = properties.find((item) => item.id === params.get("id")) || properties[0];
  document.title = `${property.title} | Teranga Immo`;

  detail.innerHTML = `
    <section class="detail-hero">
      <div class="detail-gallery">
        ${property.gallery.map((image, index) => `<img src="${image}" alt="${property.title} photo ${index + 1}">`).join("")}
      </div>
      <aside class="detail-panel">
        <p class="eyebrow">${property.type}</p>
        <h1>${property.title}</h1>
        <p class="price">${property.price}</p>
        <p class="location">${property.location} · ${property.area}</p>
        <p>${property.description}</p>
        <ul class="highlights">
          ${property.highlights.map((highlight) => `<li>${highlight}</li>`).join("")}
        </ul>
        <div class="detail-actions">
          <a class="button button-primary" href="${formatWhatsAppMessage(property)}" target="_blank" rel="noopener">Demander une visite</a>
          <a class="button button-ghost" href="contact.html">Contact agence</a>
        </div>
      </aside>
    </section>
  `;
};

const setupContactForm = () => {
  const form = document.querySelector("#contactForm");
  const status = document.querySelector("#formStatus");
  if (!form || !status) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const message = [
      "Bonjour Teranga Immo,",
      `Nom : ${data.get("name")}`,
      `Téléphone : ${data.get("phone")}`,
      `Projet : ${data.get("project")}`,
      `Message : ${data.get("message")}`
    ].join("\n");
    status.textContent = "Votre demande est prête. WhatsApp va s'ouvrir pour l'envoi.";
    window.open(`https://wa.me/15077190505?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    form.reset();
  });
};

setupNavigation();
if (typeof properties !== "undefined") {
  setupHomePage();
  setupListingsPage();
  setupDetailPage();
}
setupContactForm();
