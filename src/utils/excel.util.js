// src/utils/excel.util.js
import ExcelJS from "exceljs";

// Named export
export function saveExcel(data, fileName, sheetName) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(sheetName);

  if (data.length > 0) {
    sheet.columns = Object.keys(data[0]).map((key) => ({ header: key, key }));
    sheet.addRows(data);
  }

  return workbook.xlsx.writeFile(fileName);
}
