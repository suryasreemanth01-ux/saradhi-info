const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../data');
const EXCEL_PATH = path.join(DATA_DIR, 'owners.xlsx');

// Get all records from Excel
const getAllRecordsFromExcel = async () => {
  try {
    if (!fs.existsSync(EXCEL_PATH)) {
      return [];
    }
    
    const wb = XLSX.readFile(EXCEL_PATH);
    const ws = wb.Sheets['Owners'];
    const data = XLSX.utils.sheet_to_json(ws);
    return data;
  } catch (error) {
    console.error('Error reading Excel:', error);
    return [];
  }
};

module.exports = {
  getAllRecordsFromExcel
};
