const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'client_responses.xlsx');

function buildExcelFile(category, data) {
    try {
        let workbook;
        const sheetName = category === "Services" ? "Services" : "Goods";

        // Check if the Excel file already exists
        if (fs.existsSync(filePath)) {
            // If exists, read the existing workbook
            workbook = XLSX.readFile(filePath);
        } else {
            // If not exists, create a new workbook
            workbook = XLSX.utils.book_new();
        }

        let worksheet;
        if (workbook.Sheets[sheetName]) {
            // Sheet exists, convert it to JSON, add new data, convert back to a worksheet
            worksheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(worksheet);
            json.push(data); // Assume data is an object; push it into the array
            worksheet = XLSX.utils.json_to_sheet(json, {origin: -1}); // Reuse the worksheet
        } else {
            // Sheet does not exist, create a new sheet from data
            worksheet = XLSX.utils.json_to_sheet([data]); // Create a new worksheet from data
            XLSX.utils.book_append_sheet(workbook, worksheet, sheetName); // Append new worksheet to workbook
        }

        workbook.Sheets[sheetName] = worksheet; // Make sure the updated or new worksheet is set in the workbook
        XLSX.writeFile(workbook, filePath); // Write the workbook to file
        console.log('Excel file successfully updated.');
    } catch (error) {
        console.error('Error creating/updating Excel file:', error);
    }
}
module.exports = { buildExcelFile };