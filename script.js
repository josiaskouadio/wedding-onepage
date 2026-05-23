const config = window.WEDDING_SITE;

function setText(selector, value) {
  document.querySelectorAll(selector).forEach((node) => {
    node.textContent = value;
  });
}

function hydrateContent() {
  document.title = `${config.couple.headline} - Mariage`;

  const bindings = {
    initials: config.couple.initials,
    headline: config.couple.headline,
    subtitle: config.couple.subtitle,
    dateDisplay: config.wedding.dateDisplay,
    timeDisplay: config.wedding.timeDisplay,
    locationName: config.wedding.locationName,
    locationAddress: config.wedding.locationAddress,
    deadline: config.rsvp.deadline,
  };

  Object.entries(bindings).forEach(([key, value]) => setText(`[data-bind="${key}"]`, value));

  document.querySelector('[data-image="hero"]').src = config.images.hero;
  document.querySelector('[data-image="portrait"]').src = config.images.portrait;
  document.querySelector('[data-link="maps"]').href = config.wedding.mapsUrl;
  document.querySelector('[data-link="email"]').href = `mailto:${config.rsvp.email}`;

  const gallery = document.querySelector("[data-gallery]");
  gallery.innerHTML = config.images.gallery
    .map((src, index) => `<img src="${src}" alt="Souvenir du couple ${index + 1}" loading="lazy" />`)
    .join("");

  const timeline = document.querySelector("[data-timeline]");
  timeline.innerHTML = config.timeline
    .map(
      (item) => `
        <article>
          <time>${item.time}</time>
          <h3>${item.title}</h3>
          <p>${item.text}</p>
        </article>
      `,
    )
    .join("");
}

function startCountdown() {
  const target = new Date(config.wedding.dateISO).getTime();
  const values = {
    days: document.querySelector('[data-time="days"]'),
    hours: document.querySelector('[data-time="hours"]'),
    minutes: document.querySelector('[data-time="minutes"]'),
    seconds: document.querySelector('[data-time="seconds"]'),
  };

  function render() {
    const remaining = Math.max(0, target - Date.now());
    const days = Math.floor(remaining / 86_400_000);
    const hours = Math.floor((remaining % 86_400_000) / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1_000);

    values.days.textContent = String(days).padStart(3, "0");
    values.hours.textContent = String(hours).padStart(2, "0");
    values.minutes.textContent = String(minutes).padStart(2, "0");
    values.seconds.textContent = String(seconds).padStart(2, "0");
  }

  render();
  window.setInterval(render, 1000);
}

function setupRsvp() {
  const form = document.querySelector("[data-rsvp-form]");
  const status = document.querySelector("[data-form-status]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    status.textContent = "Envoi en cours...";

    const payload = Object.fromEntries(new FormData(form).entries());
    payload.couple = config.couple.headline;
    payload.weddingDate = config.wedding.dateISO;
    payload.createdAt = new Date().toISOString();

    try {
      const response = await fetch(config.rsvp.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("RSVP request failed");
      }

      localStorage.setItem(`rsvp-${config.couple.initials}`, JSON.stringify(payload));
      status.textContent = "Merci, votre reponse est bien enregistree.";
      form.reset();
    } catch (error) {
      const message = encodeURIComponent(
        `Bonjour, voici ma reponse RSVP pour ${config.couple.headline}: ${JSON.stringify(payload)}`,
      );
      status.innerHTML = `Impossible d'envoyer automatiquement. <a href="https://wa.me/${config.rsvp.whatsapp.replace(/\D/g, "")}?text=${message}">Envoyer par WhatsApp</a>`;
    }
  });
}

hydrateContent();
startCountdown();
setupRsvp();
