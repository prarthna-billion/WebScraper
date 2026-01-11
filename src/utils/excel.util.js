const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

/**
 * Initialize Excel workbook and worksheet
 */
function createExcel(filePath) {
  const workbook = XLSX.utils.book_new();

  const worksheet = XLSX.utils.json_to_sheet([], {
    header: ["ProductID", "Name", "Price", "Size"]
  });

  XLSX.utils.book_append_sheet(workbook, worksheet, "Products");

  // Save empty file initially
  XLSX.writeFile(workbook, filePath);

  return { workbook, worksheet };
}

/**
 * Add a row to worksheet and write to file
 */
function addRow(workbook, worksheet, filePath, rowData, rowIndex) {
  XLSX.utils.sheet_add_json(
    worksheet,
    [rowData],
    { skipHeader: true, origin: rowIndex }
  );

  XLSX.writeFile(workbook, filePath);

  return rowIndex + 1;
}

module.exports = { createExcel, addRow };
