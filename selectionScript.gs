/**
 * Google Apps Script — Cabin Selection Handler
 *
 * Deployment steps:
 * 1. Create a new Google Sheet and add header row:
 *    Timestamp | Group | Members | Cabin Type | Room Types | Drink Pkg | Dinner Pkg | FAS Plus | Tips | Deposit Type | Total | Deposit | Balance | Per Person
 * 2. Go to Extensions > Apps Script, paste this code.
 * 3. Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 4. Copy the deployment URL into the APPS_SCRIPT_URL constant in index.html.
 */

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    // Write to sheet
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    sheet.appendRow([
      new Date().toLocaleString(),
      data.group        || '',
      data.members      || '',
      data.cabinType     || '',
      data.roomTypes     || '',
      data.drinkPkg      || 'No',
      data.dinnerPkg     || 'No',
      data.fasPlus       || 'No',
      data.tips          || '',
      data.depositType   || '',
      data.total         || '',
      data.deposit       || '',
      data.balance       || '',
      data.perPerson     || ''
    ]);

    // Send email
    var subject = 'Cabin Selection: ' + data.group;
    var htmlBody = buildEmailHtml(data);
    MailApp.sendEmail({
      to: 'dasatizabal@gmail.com',
      subject: subject,
      htmlBody: htmlBody
    });

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function buildEmailHtml(data) {
  var html = '<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">';
  html += '<h2 style="color:#0d9488;">New Cabin Selection</h2>';
  html += '<table style="width:100%;border-collapse:collapse;">';

  var rows = [
    ['Group',          data.group],
    ['Members',        data.members],
    ['Cabin Type',     data.cabinType],
    ['Room Type(s)',   data.roomTypes],
    ['Drink Package',  data.drinkPkg],
    ['Dinner Package', data.dinnerPkg],
    ['FAS Plus',       data.fasPlus],
    ['Tips',           data.tips],
    ['Deposit Type',   data.depositType],
    ['Total Price',    data.total],
    ['Deposit',        data.deposit],
    ['Balance Due',    data.balance],
    ['Per Person Avg', data.perPerson]
  ];

  for (var i = 0; i < rows.length; i++) {
    var bg = i % 2 === 0 ? '#f9fafb' : '#ffffff';
    html += '<tr style="background:' + bg + ';">';
    html += '<td style="padding:8px 12px;font-weight:600;border-bottom:1px solid #e5e7eb;">' + rows[i][0] + '</td>';
    html += '<td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">' + rows[i][1] + '</td>';
    html += '</tr>';
  }

  html += '</table>';
  html += '<p style="margin-top:1rem;color:#6b7280;font-size:0.875rem;">Submitted at ' + new Date().toLocaleString() + '</p>';
  html += '</div>';
  return html;
}
