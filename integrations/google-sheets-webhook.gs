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
