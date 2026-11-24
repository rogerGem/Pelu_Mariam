// =========================================================================
// CONFIGURACIÓN DE PELUQUERÍA MARIAM
// Número extraído del cartel: 68414604 (con código de país 591)
// =========================================================================
const WHATSAPP_NUMBER = "59168414604";

// Cantidad de fotos en cada carpeta (img/hombres, img/ninos, img/damas)
const TOTAL_PHOTOS_PER_CATEGORY = 700;

// Extensión de tus imágenes ("jpg", "png", "webp")
const IMAGE_EXTENSION = "jpg";

const CATEGORY_LABELS = {
  hombres: "Hombres",
  ninos: "Niños",
  damas: "Damas"
};

// Referencias al DOM
const galleryGrid = document.getElementById("galleryGrid");
const tabButtons = document.querySelectorAll(".tab-btn");
const scrollTopBtn = document.getElementById("scrollTopBtn");

// Referencias del visor en pantalla completa (Lightbox)
const lightboxModal = document.getElementById("lightboxModal");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxWhatsapp = document.getElementById("lightboxWhatsapp");
const lightboxClose = document.getElementById("lightboxClose");

let currentCategory = "hombres";

// Icono SVG de WhatsApp
const WHATSAPP_ICON = `
  <svg viewBox="0 0 32 32" aria-hidden="true">
    <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.256.588 4.458 1.706 6.4L3.2 28.8l6.584-1.726A12.74 12.74 0 0 0 16.004 28.8c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.8-12.8-12.8zm0 23.438a10.6 10.6 0 0 1-5.406-1.48l-.388-.23-3.906 1.024 1.042-3.808-.252-.402a10.58 10.58 0 0 1-1.624-5.642c0-5.864 4.772-10.636 10.636-10.636 5.864 0 10.636 4.772 10.636 10.636 0 5.864-4.772 10.638-10.638 10.638zm5.834-7.966c-.32-.16-1.892-.934-2.186-1.04-.294-.108-.508-.16-.72.16-.214.32-.826 1.04-1.014 1.254-.186.214-.374.24-.694.08-.32-.16-1.35-.498-2.572-1.588-.95-.848-1.592-1.896-1.778-2.216-.186-.32-.02-.494.14-.654.144-.144.32-.374.48-.56.16-.186.214-.32.32-.534.108-.214.054-.4-.026-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.524-.54-.72-.55h-.614c-.214 0-.56.08-.854.4-.294.32-1.12 1.094-1.12 2.668s1.146 3.094 1.306 3.308c.16.214 2.256 3.444 5.466 4.83.764.33 1.36.526 1.824.674.766.244 1.464.21 2.016.126.614-.092 1.892-.774 2.158-1.52.268-.748.268-1.388.188-1.52-.08-.134-.294-.214-.614-.374z"/>
  </svg>
`;

// Construye la URL absoluta de la imagen (funciona automáticamente al subirlo a GitHub Pages)
function getAbsoluteImageUrl(relativePath) {
  return new URL(relativePath, window.location.href).href;
}

// Genera el enlace de WhatsApp con el texto "quiero este corte" y la foto del corte elegido
function buildWhatsAppLink(categoryKey, index, relativeImagePath) {
  const categoryName = CATEGORY_LABELS[categoryKey];
  const code = String(index).padStart(3, "0");
  const fullImageUrl = getAbsoluteImageUrl(relativeImagePath);

  const message = `Hola Peluquería Mariam, quiero este corte: *${categoryName} #${code}*\nVer foto del corte: ${fullImageUrl}`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

// Abre la fotografía en pantalla completa
function openLightbox(relativeImagePath, categoryKey, index) {
  const categoryName = CATEGORY_LABELS[categoryKey];
  const code = String(index).padStart(3, "0");

  lightboxImg.src = relativeImagePath;
  lightboxCaption.textContent = `${categoryName} #${code}`;
  lightboxWhatsapp.href = buildWhatsAppLink(categoryKey, index, relativeImagePath);
  lightboxWhatsapp.innerHTML = `${WHATSAPP_ICON} Quiero este corte`;

  lightboxModal.classList.add("open");
  lightboxModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

// Cierra el visor de pantalla completa
function closeLightbox() {
  lightboxModal.classList.remove("open");
  lightboxModal.setAttribute("aria-hidden", "true");
  lightboxImg.src = "";
  document.body.style.overflow = "";
}

// Renderiza las 100 fotos de la categoría seleccionada
function renderGallery(categoryKey) {
  const fragment = document.createDocumentFragment();
  const categoryName = CATEGORY_LABELS[categoryKey];

  for (let i = 1; i <= TOTAL_PHOTOS_PER_CATEGORY; i++) {
    const code = String(i).padStart(3, "0");
    // Ruta local: img/hombres/1.jpg, img/ninos/1.jpg, img/damas/1.jpg
    const relativePath = `img/${categoryKey}/${i}.${IMAGE_EXTENSION}`;
    const waLink = buildWhatsAppLink(categoryKey, i, relativePath);

    const card = document.createElement("article");
    card.className = "look-card";

    card.innerHTML = `
      <div class="image-wrapper" data-img="${relativePath}" data-cat="${categoryKey}" data-idx="${i}">
        <span class="look-badge">#${code}</span>
        <img src="${relativePath}" alt="Corte ${categoryName} #${code}" loading="lazy">
      </div>
      <div class="card-action">
        <a href="${waLink}" target="_blank" rel="noopener noreferrer" class="whatsapp-btn">
          ${WHATSAPP_ICON}
          Quiero este corte
        </a>
      </div>
    `;

    fragment.appendChild(card);
  }

  galleryGrid.innerHTML = "";
  galleryGrid.appendChild(fragment);
}

// Delegación de eventos para abrir cualquier foto en pantalla completa al darle clic
galleryGrid.addEventListener("click", (e) => {
  const wrapper = e.target.closest(".image-wrapper");
  if (wrapper) {
    const imgPath = wrapper.dataset.img;
    const cat = wrapper.dataset.cat;
    const idx = wrapper.dataset.idx;
    openLightbox(imgPath, cat, idx);
  }
});

// Eventos de cierre del Lightbox
lightboxClose.addEventListener("click", closeLightbox);
lightboxModal.addEventListener("click", (e) => {
  if (e.target === lightboxModal) {
    closeLightbox();
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightboxModal.classList.contains("open")) {
    closeLightbox();
  }
});

// Cambio de categoría (Hombres, Niños, Damas)
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentCategory = btn.dataset.category;
    renderGallery(currentCategory);
  });
});

// Botón volver arriba
window.addEventListener("scroll", () => {
  scrollTopBtn.style.display = window.scrollY > 450 ? "block" : "none";
});

scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Carga inicial por defecto en "Hombres"
renderGallery("hombres");