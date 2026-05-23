const SHEET_NAME = "RSVP";

function doPost(event) {
  const sheet = getSheet();
  const payload = JSON.parse(event.postData.contents || "{}");

  sheet.appendRow([
    new Date(),
    payload.couple || "",
    payload.weddingDate || "",
    payload.name || "",
    payload.email || "",
    payload.attendance || "",
    payload.guests || "",
    payload.message || "",
  ]);

  sendConfirmationEmail(payload);

  return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(
    ContentService.MimeType.JSON,
  );
}

function getSheet() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = spreadsheet.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "Date reception",
      "Couple",
      "Date mariage",
      "Nom",
      "Email",
      "Presence",
      "Nombre invites",
      "Message",
    ]);
  }

  return sheet;
}

function sendConfirmationEmail(payload) {
  if (!payload.email) {
    return;
  }

  const isPresent = payload.attendance === "present";
  const subject = isPresent
    ? `Confirmation RSVP - ${payload.couple || "Mariage"}`
    : `Reponse RSVP recue - ${payload.couple || "Mariage"}`;

  const plainBody = isPresent
    ? `Bonjour ${payload.name || ""}, merci pour votre confirmation. Rendez-vous le ${payload.weddingDateDisplay || payload.weddingDate || ""} a ${payload.weddingTimeDisplay || ""}, ${payload.locationName || ""}.`
    : `Bonjour ${payload.name || ""}, merci pour votre reponse. Nous avons bien note que vous ne pourrez pas etre present.`;

  MailApp.sendEmail({
    to: payload.email,
    subject,
    body: plainBody,
    htmlBody: buildInvitationEmail(payload, isPresent),
  });
}

function buildInvitationEmail(payload, isPresent) {
  const couple = escapeHtml(payload.couple || "Notre mariage");
  const name = escapeHtml(payload.name || "cher invite");
  const date = escapeHtml(payload.weddingDateDisplay || payload.weddingDate || "");
  const time = escapeHtml(payload.weddingTimeDisplay || "");
  const location = escapeHtml(payload.locationName || "");
  const address = escapeHtml(payload.locationAddress || "");
  const guests = escapeHtml(payload.guests || "1");
  const mapsUrl = payload.mapsUrl || "#";

  const title = isPresent ? "Votre presence est confirmee" : "Votre reponse est bien recue";
  const message = isPresent
    ? `Nous avons hate de vous retrouver pour celebrer ce moment avec nous. Nombre d'invites confirme: ${guests}.`
    : "Merci d'avoir pris le temps de repondre. Votre message a bien ete transmis aux maries.";

  return `
    <div style="margin:0;padding:28px;background:#fbf7ef;font-family:Arial,sans-serif;color:#22231f;">
      <div style="max-width:620px;margin:0 auto;background:#fffdf8;border:1px solid #eadfce;border-radius:16px;overflow:hidden;">
        <div style="padding:34px 28px;text-align:center;background:#163f36;color:#fffdf8;">
          <div style="font-size:12px;letter-spacing:3px;text-transform:uppercase;color:#d6b574;">Invitation mariage</div>
          <h1 style="margin:14px 0 8px;font-family:Georgia,serif;font-size:42px;font-weight:400;line-height:1;">${couple}</h1>
          <p style="margin:0;font-size:16px;">${date}${time ? " - " + time : ""}</p>
        </div>
        <div style="padding:30px 28px;">
          <p style="margin:0 0 10px;font-size:16px;">Bonjour ${name},</p>
          <h2 style="margin:0 0 14px;font-family:Georgia,serif;font-size:30px;font-weight:400;color:#a94f5c;">${title}</h2>
          <p style="margin:0 0 22px;font-size:16px;line-height:1.6;color:#68645b;">${message}</p>
          <div style="padding:18px;border:1px solid #eadfce;border-radius:12px;background:#fbf7ef;">
            <strong style="display:block;margin-bottom:8px;color:#163f36;">${location}</strong>
            <span style="display:block;color:#68645b;">${address}</span>
          </div>
          <a href="${mapsUrl}" style="display:inline-block;margin-top:24px;padding:14px 20px;border-radius:999px;background:#a94f5c;color:#fffdf8;text-decoration:none;font-weight:bold;">Voir l'itineraire</a>
        </div>
      </div>
    </div>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
