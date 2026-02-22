const escapeCsvCell = (value) => {
  const normalized = String(value ?? "");
  const escaped = normalized.replace(/"/g, '""');
  return `"${escaped}"`;
};

const buildCsv = (headers, rows) => {
  const csvRows = [headers.map(escapeCsvCell).join(",")];

  rows.forEach((row) => {
    csvRows.push(row.map(escapeCsvCell).join(","));
  });

  return csvRows.join("\n");
};

module.exports = {
  buildCsv,
};

