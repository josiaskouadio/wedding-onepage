# Wedding Onepage

Template one-page pour creer des sites de mariage elegants et rapides a deployer sur Vercel.

## Personnaliser un mariage

1. Ouvrir `site.config.js`.
2. Remplacer les noms, la date ISO, le lieu, les liens et les images.
3. Modifier les textes dans `index.html` si le couple veut une histoire plus personnelle.

## Apercu local

```bash
npm run dev
```

Puis ouvrir `http://localhost:4173`.

La date du compte a rebours utilise `wedding.dateISO`. Garder le format ISO, par exemple:

```js
dateISO: "2026-09-12T16:30:00+02:00"
```

## RSVP

Le formulaire envoie les reponses vers `/api/rsvp`.

Sur Vercel, ajoutez une variable d'environnement `RSVP_WEBHOOK_URL` si vous voulez recevoir les reponses dans un outil externe comme Make, Zapier, Airtable, Notion ou Google Sheets. Sans webhook, l'API valide la reponse mais ne la stocke pas durablement.

## Deployer sur Vercel

1. Mettre le projet sur GitHub.
2. Dans Vercel, choisir **Add New Project** puis importer le depot.
3. Laisser les reglages par defaut: c'est un site statique avec une fonction `/api/rsvp`.
4. Ajouter `RSVP_WEBHOOK_URL` dans **Project Settings > Environment Variables** si necessaire.
5. Deployer.

Pour un domaine personnalise, l'ajouter dans **Project Settings > Domains**.
