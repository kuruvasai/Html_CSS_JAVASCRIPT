document.addEventListener('DOMContentLoaded', function () {
    const bindData = document.getElementById('viewdata');
    if (!bindData) {
        console.error("Element with id 'viewdata' not found on the page.");
        return;
    }

    const params = new URLSearchParams(window.location.search);
    const requestedCode = params.get('code');

    const invoicesJson = localStorage.getItem('invoices');
    if (!invoicesJson) {
        bindData.innerHTML = '<p>No invoices found in localStorage.</p>';
        return;
    }

    let arrInvoices;
    try {
        arrInvoices = JSON.parse(invoicesJson);
    } catch (err) {
        console.error('Failed to parse invoices from localStorage', err);
        bindData.innerHTML = '<p>Unable to read invoice data (corrupt).</p>';
        return;
    }

    if (!Array.isArray(arrInvoices)) {
        // If a single object was stored, normalize to array
        if (arrInvoices && typeof arrInvoices === 'object') {
            arrInvoices = [arrInvoices];
        } else {
            bindData.innerHTML = '<p>No valid invoices available.</p>';
            return;
        }
    }

    let invoiceObj;
    if (requestedCode) {
        invoiceObj = arrInvoices.find((inv) => inv.Code == requestedCode);
    } else {
        // If no code provided, show the last invoice by default
        invoiceObj = arrInvoices[arrInvoices.length - 1];
    }

    if (!invoiceObj) {
        bindData.innerHTML = '<p>Invoice not found.</p>';
        return;
    }

    bindData.innerHTML = `
        <p>Code: ${invoiceObj.Code || ''}</p>
        <p>Name: ${invoiceObj.Name || ''}</p>
        <p>Country: ${invoiceObj.countryDisplayName || invoiceObj.country || ''}</p>
        <p>Price: ${invoiceObj.price || ''}</p>
    `;
});