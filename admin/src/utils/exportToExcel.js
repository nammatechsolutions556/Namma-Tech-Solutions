import * as XLSX from 'xlsx';

export const exportToExcel = (data, filename) => {
    // Check if data is empty
    if (!data || data.length === 0) {
        alert("No data available to export.");
        return;
    }

    // Create a new workbook and worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    // Append worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    // Generate an Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};
