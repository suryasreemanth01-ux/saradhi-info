const XLSX = require('xlsx');
const path = require('path');
const fs = require('fs');

const DATA_DIR = path.join(__dirname, '../data');
const EXCEL_PATH = path.join(DATA_DIR, 'owners.xlsx');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize Excel file if it doesn't exist
const initializeExcel = () => {
  if (!fs.existsSync(EXCEL_PATH)) {
    const headers = [
      'ID',
      'Property Type',
      'House Number',
      'Building Name',
      'Flat Number',
      'Owner Name',
      'Owner Phone',
      'Date/Time'
    ];
    
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.book_append_sheet(wb, ws, 'Owners');
    XLSX.writeFile(wb, EXCEL_PATH);
    console.log('✅ Excel file initialized at:', EXCEL_PATH);
  }
};

// Get next ID
const getNextId = () => {
  try {
    if (!fs.existsSync(EXCEL_PATH)) {
      return 1;
    }
    
    const wb = XLSX.readFile(EXCEL_PATH);
    const ws = wb.Sheets['Owners'];
    const data = XLSX.utils.sheet_to_json(ws);
    
    if (data.length === 0) {
      return 1;
    }
    
    const maxId = Math.max(...data.map(row => row.ID || 0));
    return maxId + 1;
  } catch (error) {
    console.error('Error getting next ID:', error);
    return 1;
  }
};

// Add a new owner record
const addOwnerRecord = async (ownerData) => {
  try {
    // Initialize Excel if needed
    initializeExcel();
    
    // Read existing data
    const wb = XLSX.readFile(EXCEL_PATH);
    const ws = wb.Sheets['Owners'];
    const existingData = XLSX.utils.sheet_to_json(ws);
    
    // Create new record
    const newRecord = {
      ID: getNextId(),
      'Property Type': ownerData.propertyType,
      'House Number': ownerData.houseNumber || '-',
      'Building Name': ownerData.buildingName || '-',
      'Flat Number': ownerData.flatNumber || '-',
      'Owner Name': ownerData.ownerName,
      'Owner Phone': ownerData.ownerPhone,
      'Date/Time': new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    };
    
    // Add to existing data
    existingData.push(newRecord);
    
    // Convert to worksheet
    const newWs = XLSX.utils.json_to_sheet(existingData);
    
    // Auto-size columns (optional but nice)
    const columns = Object.keys(newRecord);
    const colWidths = columns.map(col => ({ wch: Math.max(col.length, 15) }));
    newWs['!cols'] = colWidths;
    
    // Replace the sheet
    wb.Sheets['Owners'] = newWs;
    
    // Write file
    XLSX.writeFile(wb, EXCEL_PATH);
    
    console.log(`✅ New record added: ${newRecord['Owner Name']} (ID: ${newRecord.ID})`);
    
    return {
      success: true,
      message: 'Record added successfully'
    };
  } catch (error) {
    console.error('Error adding owner record:', error);
    return {
      success: false,
      message: 'Failed to save record to Excel file'
    };
  }
};

module.exports = {
  addOwnerRecord,
  initializeExcel
};
