const XLSX = require('xlsx');

const saveToExcel = (data, filename) => {
    // Create worksheet from JSON data
    const ws = XLSX.utils.json_to_sheet(data);
    // Create a new workbook
    const wb = XLSX.utils.book_new();
    // Append the sheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, "WineData");
    // Write the file to the root directory
    XLSX.writeFile(wb, filename);
    return filename;
};

module.exports = { saveToExcel };