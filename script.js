(function () {
  "use strict";

  const burgerBtn = document.getElementById("burgerBtn");
  const mobileMenu = document.getElementById("mobileMenu");
  const header = document.querySelector(".header");

  function setMenu(open) {
    if (!burgerBtn || !mobileMenu) return;
    burgerBtn.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener("click", () => {
      const isOpen = burgerBtn.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);
    });

    mobileMenu.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (a) setMenu(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") setMenu(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 820) setMenu(false);
    });
  }

  function getHeaderOffset() {
    const h = header ? header.getBoundingClientRect().height : 0;
    return h + 10;
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#" || href.length < 2) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      setMenu(false);

      const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  // Scroll reveal
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && items.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    items.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i * 45, 260)}ms`;
      io.observe(el);
    });
  } else {
    items.forEach((el) => el.classList.add("is-visible"));
  }

  // Map
  const mapEl = document.getElementById("map");
  if (mapEl && typeof window.L !== "undefined") {
    const astanaCenter = [51.1282, 71.4304];
    const map = L.map("map", { scrollWheelZoom: false }).setView(astanaCenter, 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap"
    }).addTo(map);

    // Replace with exact coordinates when available:
    const loc11 = { name: "Школа-лицей №11 им. Ө. Жәнібеков", coords: [51.1600, 71.4700] };
    const loc71 = { name: "Школа-лицей №71", coords: [51.1050, 71.3900] };

    const icon = L.divIcon({
      className: "custom-pin",
      html: `
        <div style="
          width:40px;height:40px;border-radius:16px;
          background:#ffd400;border:1px solid rgba(15,17,21,.25);
          display:grid;place-items:center;font-weight:1000;
          box-shadow:0 18px 60px rgba(0,0,0,.20);
        "><span style="font-size:18px;">⚽</span></div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40]
    });

    const m1 = L.marker(loc11.coords, { icon }).addTo(map)
      .bindPopup(`<strong>${loc11.name}</strong><br/>ASTANA JAS Football School`);
    const m2 = L.marker(loc71.coords, { icon }).addTo(map)
      .bindPopup(`<strong>${loc71.name}</strong><br/>ASTANA JAS Football School`);

    const group = L.featureGroup([m1, m2]);
    map.fitBounds(group.getBounds().pad(0.25));

    map.on("click", () => map.scrollWheelZoom.enable());
    map.on("mouseout", () => map.scrollWheelZoom.disable());
  }
})();
