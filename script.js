let processedResults = []; // Array to hold the processed results

function calculatePayout() {
    const sellingPrice = parseFloat(document.getElementById("sellingPrice").value) || 0;
    const gstProduct = parseFloat(document.getElementById("gstProduct").value) || 0;
    const commissionPercent = parseFloat(document.getElementById("commissionPercent").value) || 0;

    const gstAmount = (sellingPrice * gstProduct) / 100;
    document.getElementById("gstAmount").innerText = gstAmount.toFixed(2);

    const sellingPriceIncGST = sellingPrice + gstAmount;
    document.getElementById("sellingPriceIncGST").innerText = sellingPriceIncGST.toFixed(2);

    const commissionAmount = (sellingPriceIncGST * commissionPercent) / 100;
    document.getElementById("commissionAmount").innerText = commissionAmount.toFixed(2);

    const gstOnCommission = (commissionAmount * 18) / 100;
    document.getElementById("gstOnCommission").innerText = gstOnCommission.toFixed(2);

    const sellerPayoutInBank = sellingPriceIncGST - commissionAmount - gstOnCommission;
    document.getElementById("sellerPayoutInBank").innerText = sellerPayoutInBank.toFixed(2);

    const gstInputAmount = commissionAmount * ((18 - gstProduct) / 100);
    document.getElementById("gstInputAmount").innerText = gstInputAmount.toFixed(2);

    const totalSellerPayout = sellerPayoutInBank + gstInputAmount;
    document.getElementById("totalSellerPayout").innerText = totalSellerPayout.toFixed(2);
}

// Bulk Upload functions (stubbed out for now)
function downloadTemplate() {
    // Download a sample Excel template (Placeholder functionality)
    //alert('Downloading sample template...');
    const templateData = [
        ["SKU ID", "SKU Title", "Price (Excluding GST)", "GST%", "Commission%"]
    ];
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    XLSX.utils.book_append_sheet(wb, ws, "Template");
    XLSX.writeFile(wb, "settlement_template.xlsx");
}

function uploadAndProcessFile() {
    // Placeholder for file upload and processing functionality
    //alert('Processing file...');
    const file = document.getElementById("fileUpload").files[0];
    if (!file) {
        alert("Please select a file.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        const data = e.target.result;
        const wb = XLSX.read(data, { type: 'binary' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });

        processedResults = rows.slice(1).map((row, index) => {
            const sellingPrice = parseFloat(row[2]) || 0;
            const gstProduct = parseFloat(row[3]) || 0;
            const commissionPercent = parseFloat(row[4]) || 0;

            const gstAmount = (sellingPrice * gstProduct) / 100;
            const sellingPriceIncGST = sellingPrice + gstAmount;
            const commissionAmount = (sellingPriceIncGST * commissionPercent) / 100;
            const gstOnCommission = (commissionAmount * 18) / 100;
            const sellerPayoutInBank = sellingPriceIncGST - commissionAmount - gstOnCommission;
            const gstInputAmount = commissionAmount * ((18 - gstProduct) / 100);
            const totalSellerPayout = sellerPayoutInBank + gstInputAmount;

            return [
                row[0], row[1], row[2], row[3], row[4], 
                gstAmount.toFixed(2), sellingPriceIncGST.toFixed(2), 
                commissionAmount.toFixed(2), gstOnCommission.toFixed(2), 
                sellerPayoutInBank.toFixed(2), gstInputAmount.toFixed(2), 
                totalSellerPayout.toFixed(2)
            ];
        });
        alert("File processed successfully!");
    };
    reader.readAsBinaryString(file);
}

function downloadResults() {
    // Placeholder for downloading the results
    //alert('Downloading results...');
    if (processedResults.length === 0) {
        alert("Please upload and process a file first.");
        return;
    }

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([[
        "SKU ID", "SKU Title", "Price (Excluding GST)", "GST%", "Commission%", 
        "GST Amount", "Selling Price Inc. of GST", "Commission Amount", 
        "GST on Commission", "Seller Payout in Bank", "GST Input Amount", 
        "Total Seller Payout"
    ]].concat(processedResults));

    XLSX.utils.book_append_sheet(wb, ws, "Results");
    XLSX.writeFile(wb, "settlement_results.xlsx");
}
