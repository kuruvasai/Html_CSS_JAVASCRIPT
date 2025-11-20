document.addEventListener("DOMContentLoaded", function(){
  //GetAll Invoices
  //Bind Invoices to the Grid/table
  function GetAllInvoices(){
    var invoicesJson = localStorage.getItem("invoices");
    var arrInvoices = JSON.parse(invoicesJson);
    return arrInvoices;
  }

  function BindInvoicesToGrid(){
    //getall invoices
    //i will array of invoices if we have 10 invoices i will get array of 10
    //i need to loop through all invoices 
    //for each of these invoices
    //i need to add a row in the html table

    
    let arrInvoices = GetAllInvoices();
    let counter = 0;
    let trsHTML = '';
    arrInvoices.forEach(invoiceObj => {
      trsHTML+=`<tr>
              <td>${++counter}</td>
              <td>${invoiceObj.Code}</td>
              <td>${invoiceObj.Name}</td>
              <td>${invoiceObj.countryDisplayName}</td>
              <td>${invoiceObj.price}</td>
              <td>${invoiceObj.duty}</td>
              <td>${invoiceObj.mfgDate}-${invoiceObj.expDate}</td>
              <td>
              <a class='edit-invoice' invoice-code='${invoiceObj.Code}'>Edit</a>
              <a class='delete-invoice' invoice-code='${invoiceObj.Code}'>Delete</a>
              <a class='view-invoice' invoice-code='${invoiceObj.code} '>View</a>
              </td>
              </tr>`
    });
    if(!trsHTML){
      trsHTML = '<td colspan="8">No invoices found</td>';
    }
    document.getElementById('tblInvoice-body').innerHTML = trsHTML;

    var allDeleteAnchorLinks =  document.querySelectorAll('.delete-invoice');
    allDeleteAnchorLinks.forEach(a=> {
      a.addEventListener('click', deleteInvoice);
    })
    var allEditAnchorLinks =  document.querySelectorAll('.edit-invoice');
    allEditAnchorLinks.forEach(a=> {
      a.addEventListener('click', function(){
        let invoiceCode = this.getAttribute('invoice-code');
        location.href='ManageInvoice.html?code=' + invoiceCode;
      });
    })
  }

  function deleteInvoice(evt){
    if(!confirm('are you sure you want to delete invoice?'))
      return;

    let arrInvoices = GetAllInvoices();
    let invoiceCode = this.getAttribute('invoice-code');
    arrInvoices = arrInvoices.filter(x=> x.Code != invoiceCode);
    localStorage.setItem('invoices', JSON.stringify(arrInvoices));
    BindInvoicesToGrid();
  }

  BindInvoicesToGrid();

  var allViewAnchorLinks =  document.querySelectorAll('.view-invoice');
  allViewAnchorLinks.forEach(a=> {
    a.addEventListener('click', viewinvoice);
  });


  function viewinvoice(evt){   
   if(!confirm('are you sure you want to view invoice?'))
      return;
    let arrInvoices = GetAllInvoices();
    let invoiceCode = this.getAttribute('invoice-code');
    arrInvoices = arrInvoices.filter(x=> x.Code == invoiceCode);
    
    location.href='ViewInvoice.html?code=' + invoiceCode;
  };
});
