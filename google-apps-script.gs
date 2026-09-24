/* Alami Perfumes — Réception gratuite des commandes (Google Sheets + e-mail)
   1. Créez un Google Sheet vide.
   2. Extensions > Apps Script, remplacez le code par ce fichier.
   3. Remplacez les deux valeurs de CONFIG puis déployez comme "Web app".
*/
const CONFIG = {
  SPREADSHEET_ID: 'COLLEZ_ICI_L_ID_DU_GOOGLE_SHEET',
  NOTIFY_EMAIL: 'COLLEZ_ICI_VOTRE_EMAIL',
  SHEET_NAME: 'Commandes'
};

// Permet de tester l'URL /exec dans un navigateur sans erreur « doGet introuvable ».
function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ ok: true, service: 'Alami orders receiver' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    const order = JSON.parse(e.postData.contents);
    const spreadsheet = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    let sheet = spreadsheet.getSheetByName(CONFIG.SHEET_NAME);
    if (!sheet) {
      sheet = spreadsheet.insertSheet(CONFIG.SHEET_NAME);
      sheet.appendRow(['Date', 'Coffret', 'Prix', 'Parfum 1', 'Parfum 2', 'Parfum 3', 'Parfum 4', 'Client', 'Téléphone', 'Ville', 'Adresse']);
      sheet.getRange(1, 1, 1, 11).setFontWeight('bold').setBackground('#a4773c').setFontColor('#ffffff');
      sheet.setFrozenRows(1);
    }
    sheet.appendRow([new Date(), order.coffret, order.prix, ...order.parfums, order.nom, order.telephone, order.ville, order.adresse]);
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: `Nouvelle commande Alami — ${order.nom}`,
      htmlBody: `<h2>Nouvelle commande Alami Perfumes</h2><p><b>Coffret :</b> ${order.coffret} · ${order.prix}</p><p><b>Parfums :</b><br>• ${order.parfums.join('<br>• ')}</p><hr><p><b>Client :</b> ${order.nom}<br><b>Téléphone :</b> ${order.telephone}<br><b>Ville :</b> ${order.ville}<br><b>Adresse :</b> ${order.adresse}</p>`
    });
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(error)})).setMimeType(ContentService.MimeType.JSON);
  }
}
