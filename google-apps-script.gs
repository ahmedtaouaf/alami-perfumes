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
    const safe = value => String(value || '').replace(/[&<>"']/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#039;' })[char]);
    const perfumeList = order.parfums.map((name, index) => `<tr><td style="padding:11px 0;border-bottom:1px solid #eadfce;color:#9a7139;font-size:11px;font-family:Arial,sans-serif;letter-spacing:1px;width:40px;">0${index + 1}</td><td style="padding:11px 0;border-bottom:1px solid #eadfce;color:#37231a;font-size:16px;font-family:Georgia,serif;">${safe(name)}</td></tr>`).join('');
    MailApp.sendEmail({
      to: CONFIG.NOTIFY_EMAIL,
      subject: `Nouvelle commande Alami — ${order.nom}`,
      htmlBody: `<div style="margin:0;padding:28px 12px;background:#f4ede4;color:#37231a;">
        <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:620px;margin:0 auto;background:#fffaf4;border-collapse:collapse;">
          <tr><td style="padding:34px 38px 29px;background:#291914;text-align:center;color:#f8eee3;">
            <div style="font-family:Georgia,serif;font-size:33px;letter-spacing:4px;line-height:1;">ALAMI</div>
            <div style="margin-top:9px;font-family:Arial,sans-serif;font-size:9px;letter-spacing:5px;color:#d3ad70;">PERFUMES</div>
            <div style="width:46px;height:1px;background:#b18449;margin:20px auto 0;"></div>
            <div style="margin-top:16px;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#eadbcb;">Nouvelle commande reçue</div>
          </td></tr>
          <tr><td style="padding:34px 38px 8px;">
            <p style="margin:0 0 7px;color:#9a7139;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Coffret sélectionné</p>
            <table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f4e9dc;border-left:3px solid #b18449;"><tr><td style="padding:17px 18px;"><div style="font-family:Georgia,serif;font-size:22px;color:#37231a;">${safe(order.coffret)}</div><div style="margin-top:4px;font-family:Arial,sans-serif;font-size:12px;color:#8a6d59;">Total de la commande : <strong style="color:#9a7139;">${safe(order.prix)}</strong></div></td></tr></table>
          </td></tr>
          <tr><td style="padding:27px 38px 6px;"><p style="margin:0 0 12px;color:#9a7139;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Les 4 senteurs choisies</p><table role="presentation" cellpadding="0" cellspacing="0" width="100%">${perfumeList}</table></td></tr>
          <tr><td style="padding:27px 38px 36px;"><p style="margin:0 0 12px;color:#9a7139;font-family:Arial,sans-serif;font-size:10px;letter-spacing:2px;text-transform:uppercase;">Coordonnées de la cliente / du client</p><table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#fbf6ee;"><tr><td style="padding:18px 19px;font-family:Arial,sans-serif;font-size:13px;line-height:1.8;color:#584136;"><strong style="font-family:Georgia,serif;font-size:17px;color:#37231a;">${safe(order.nom)}</strong><br><a href="tel:${safe(order.telephone)}" style="color:#9a7139;text-decoration:none;">${safe(order.telephone)}</a><br>${safe(order.ville)}<br>${safe(order.adresse)}</td></tr></table></td></tr>
          <tr><td style="padding:20px 38px;background:#291914;text-align:center;color:#c8b09a;font-family:Arial,sans-serif;font-size:10px;letter-spacing:.5px;">ALAMI PERFUMES &nbsp;•&nbsp; MORE THAN A SCENT, IT’S A FEELING</td></tr>
        </table></div>`
    });
    return ContentService.createTextOutput(JSON.stringify({ok:true})).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ok:false,error:String(error)})).setMimeType(ContentService.MimeType.JSON);
  }
}
