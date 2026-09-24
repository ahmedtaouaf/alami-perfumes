# Connexion gratuite : Google Sheets + e-mail

1. Créez un nouveau tableau dans [Google Sheets](https://sheets.new), par exemple **Commandes Alami**.
2. Copiez son identifiant : dans l'URL, c'est la partie située entre `/d/` et `/edit`.
3. Dans le tableau : **Extensions → Apps Script**. Effacez le code présent et collez le contenu de `google-apps-script.gs`.
4. Dans `CONFIG`, remplacez `SPREADSHEET_ID` par l'identifiant du tableau et `NOTIFY_EMAIL` par l'adresse qui doit recevoir les commandes.
5. Cliquez sur **Deploy → New deployment → Web app**. Choisissez : *Execute as Me* et accès **Anyone** (pas « Only myself »). Autorisez les permissions Google demandées.
6. Copiez l'URL qui se termine par `/exec`.
7. Dans `app.js`, remplacez la valeur vide de `ORDER_API_URL` par cette URL, entre les guillemets.
8. Publiez le dossier du site mis à jour et testez une commande. Ouvrir l'URL `/exec` dans un navigateur doit afficher `{"ok":true,"service":"Alami orders receiver"}`. Si vous obtenez une erreur 401, ouvrez **Deploy → Manage deployments → Edit**, vérifiez l'accès **Anyone**, puis créez une nouvelle version et déployez-la.

Chaque commande crée une ligne dans l'onglet **Commandes** et envoie un e-mail automatiquement. Ne mettez jamais de mot de passe dans le site.
