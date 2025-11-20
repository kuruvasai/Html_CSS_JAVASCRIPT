document.addEventListener("DOMContentLoaded", initializeForm);

function initializeForm() {
  // Initialize form elements or event listeners here if needed
  console.log("Form Initialized - and our program execution started.");

  //1. Get and set a new Invoice Code to the InvoiceCode input field
  var newInvoiceCode = generateNewInvoiceCode();
  //2. Assign the generated code to invoice code text box
  document.getElementById("InvoiceCode").value = newInvoiceCode;

  //3. Store countries in an array for demo purpose in a array of object format
  storeCountriesInLocalStorage();

  //4.Bind countries to country dropdown
  bindCountriesToCountryDropdown();

  //5.bindEvents to text boxes like price, duty should allow only numbers
  bindEvents();


  //7. Goback button click

  function generateNewInvoiceCode() {
    var invoicesJson = localStorage.getItem("invoices");
    if (!invoicesJson) return "INV-001";

    var arrInvoices = JSON.parse(invoicesJson);
    let max = 0;
    arrInvoices.forEach((i) => {
      if (max < parseInt(i.Code.replace("INV-", ""))) {
        max = parseInt(i.Code.replace("INV-", ""));
      }
    });

    return 'INV-' +  ((max+1).toString().padStart(3, '0'));

  }

  function storeCountriesInLocalStorage() {
    var countries = [
      { id: 1, code: "IND", name: "India" },
      { id: 2, code: "USA", name: "United States" },
      { id: 3, code: "UK", name: "United Kingdom" },
      { id: 4, code: "AUS", name: "Australia" },
    ];
    // Store countries in local storage
    localStorage.setItem("countries", JSON.stringify(countries));
  }

  function bindCountriesToCountryDropdown() {
    var countrySelect = document.getElementById("CountryOfRegion");
    var countries = JSON.parse(localStorage.getItem("countries"));
    let options = "";
    countries.forEach((element) => {
      options += `<option value="${element.id}">${element.name}</option>`;
    });
    countrySelect.innerHTML += options;
  }

  function bindEvents() {
    let priceEl = document.getElementById("Price");
    let dutyEl = document.getElementById("Duty");
    let countryEl = document.getElementById("CountryOfRegion");
    let totalPriceEl = document.getElementById("TotalPrice");
    let saveButtonEl = document.getElementById("SaveForm");
    let manufacturingDateEl = document.getElementById("ManufacturingDate");
    let expiryDateEl = document.getElementById("ExpiryDate");
    let allMandatoryFields = document.querySelectorAll(
      "#InvoiceName, #CountryOfRegion, #ManufacturingDate, #ExpiryDate, #Price, #Duty"
    );
    allMandatoryFields.forEach((obj) => {
      obj.addEventListener("focusin", function () {
        this.classList.remove("is-valid");
        this.classList.remove("is-invalid");
      });
      obj.addEventListener("blur", function () {
        console.log('hi')
        if (this.value.length > 0) {
          this.classList.add("is-valid");
          this.classList.remove("is-invalid");
        } else {
          this.classList.add("is-invalid");
          this.classList.remove("is-valid");
        }
      });
    }); 
   

    priceEl.addEventListener("keydown", allowOnlyDecimalNumbers);
    dutyEl.addEventListener("keydown", allowOnlyDecimalNumbers);

    priceEl.addEventListener("keydown", calculateTotalPrice);
    dutyEl.addEventListener("keydown", calculateTotalPrice);
    priceEl.addEventListener("change", calculateTotalPrice);
    dutyEl.addEventListener("change", calculateTotalPrice);
    countryEl.addEventListener("change", calculateTotalPrice);
    saveButtonEl.addEventListener("click", saveInvoice);

    //Manufacturing date - max attribute - currentdate
    // allowed formats'yyyy-mm-dd' 'mm-dd-yyyy'
    totalPriceEl.setAttribute("readonly", "readonly");

    let currentDate = new Date();
    let currentDateStr =
      new Date().getFullYear().toString() +
      "-" +
      (new Date().getMonth() + 1).toString().padStart(2, "0") +
      "-" +
      new Date().getDate().toString().padStart(2, "0");

    manufacturingDateEl.setAttribute("max", currentDateStr);
    expiryDateEl.setAttribute("min", currentDateStr);

    manufacturingDateEl.addEventListener("blur", restrictManufacturingDate);
    expiryDateEl.addEventListener("blur", restrictExpiryDate);

    document
      .getElementById("Description")
      .addEventListener("input", restrictTheDescriptionLength);
   
  }

  function allowOnlyDecimalNumbers(evt) {
    //if(event.key == '0')
    //allow only numbers from 0-9 of main key board & number pad
    //. (only 1 dot)
    //backspace, delete, arrow left, arrow right, tab, arrow down, arrow up
    //enter

    var charCode = evt.which ? evt.which : evt.keyCode;

    // Allow numbers (0-9)
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }

    // Allow a single decimal point
    if (charCode === 46 || charCode === 190) {
      // ASCII code for '.'
      // Check if the input already contains a decimal point
      if (evt.target.value.indexOf(".") === -1) {
        return true;
      }
    }

    // Allow backspace, delete, arrow keys, etc. (non-printable characters)
    if (charCode === 0 || charCode === 8) {
      // 0 for some browsers, 8 for backspace
      return true;
    }

    evt.preventDefault();

    //return false; // Block all other characters
  }

  function calculateTotalPrice(e) {
    let priceEl = document.getElementById("Price");
    let dutyEl = document.getElementById("Duty");
    let countryEl = document.getElementById("CountryOfRegion");
    let totalPriceEl = document.getElementById("TotalPrice");

    let selectedCountry = countryEl.value;

    if (selectedCountry == 1) {
      dutyEl.value = "0.00";
      document.getElementById("duty-div").style.display = "none";
    } else {
      document.getElementById("duty-div").style.display = "block";
    }

    let priceValue = Number(priceEl.value);
    let dutyValue = Number(dutyEl.value);

    totalPriceEl.value = isNaN(priceValue + dutyValue)
      ? 0
      : (priceValue + dutyValue).toFixed(2);
  }

  function saveInvoice() {
    /*
    getallcontrolvalues
    validate those values
    if everything looks good then i need to save the invoice 
    details into the LS
    else 
      we need to show some kind of error msg / alert / error - indication to the user
      and don't save it into LS/DB
      */
    console.log("getallcontrolvalues -Start");
    var invoiceCode = document.getElementById("InvoiceCode").value;
    var invoiceName = document.getElementById("InvoiceName").value;
    var country = document.getElementById("CountryOfRegion").value;
    var countryDisplayName = document.getElementById("CountryOfRegion").selectedOptions[0].text;
    let manufacturingDate = document.getElementById("ManufacturingDate").value;
    let expiryDate = document.getElementById("ExpiryDate").value;
    let price = document.getElementById("Price").value;
    let duty = document.getElementById("Duty").value;
    let description = document.getElementById("Description").value;
    console.log("getallcontrolvalues -End");

    console.log("validation -Start");
    let isValidForm = true;
    if (invoiceName.length == 0){
      //alert('Please provide inovoice name');
      document.getElementById("InvoiceName").classList.add("is-invalid");
      isValidForm = false;
      //return;
    } else {
      document.getElementById("InvoiceName").classList.add("is-valid");
    }
    if (country.length == 0) {
      document.getElementById("CountryOfRegion").classList.add("is-invalid");
      isValidForm = false;
      //return;
    } else {
      document.getElementById("CountryOfRegion").classList.add("is-valid");
    }
    if (manufacturingDate.length == 0) {
      document.getElementById("ManufacturingDate").classList.add("is-invalid");
      isValidForm = false;
      //return;
    } else {
      document.getElementById("ManufacturingDate").classList.add("is-valid");
    }
    if (expiryDate.length == 0) {
      document.getElementById("ExpiryDate").classList.add("is-invalid");
      isValidForm = false;
      //return;
    } else {
      document.getElementById("ExpiryDate").classList.add("is-valid");
    }
    if (price.length == 0) {
      document.getElementById("Price").classList.add("is-invalid");
      isValidForm = false;
      //return;
    } else {
      document.getElementById("Price").classList.add("is-valid");
    }
    if (country != 1) {
      if (duty.length == 0) {
        document.getElementById("Duty").classList.add("is-invalid");
        isValidForm = false;
        //return;
      } else {
        document.getElementById("Duty").classList.add("is-valid");
      }
    }

    if (isValidForm == false) {
      return;
    }    

    console.log("validation -End");

    if(!confirm('Are you sure you want to save invoice data?'))
      return;

    console.log("Object Prep -Start");
    var invoiceObj = {
      Code: invoiceCode,
      Name: invoiceName,
      country: country,
      countryDisplayName: countryDisplayName,
      mfgDate: manufacturingDate,
      expDate: expiryDate,
      price: price,
      duty: duty,
      desc: description,
    };
    console.log("Object Prep -End; invoiceObj:" + JSON.stringify(invoiceObj));
    var invoicesJson = localStorage.getItem("invoices");
    var arrInvoices = JSON.parse(invoicesJson);
    if(arrInvoices == null){
      arrInvoices = [];
    }
    else{
      arrInvoices.push(invoiceObj);
    }
    localStorage.setItem("invoices", JSON.stringify(arrInvoices));
    location.href = "InvoiceList.html";
    //debugger;
  }

  function restrictManufacturingDate(event) {
    let manufacturingDateEl = document.getElementById("ManufacturingDate");
    //'22-09-2025' = ['2','2','-', '0','9','-','2','0','2','5']
    let arrDate = manufacturingDateEl.value.split("-");
    //'2025-09-22' => ['2025', '09', '22']
    let mfgDateObj = new Date(arrDate[0] + "-" + arrDate[1] + "-" + arrDate[2]);

    if (new Date() < mfgDateObj) {
      manufacturingDateEl.value = "";
      alert("Manufacturing date should not be the future date");
    }
  }

  function restrictExpiryDate(event) {
    let expiryDateEl = document.getElementById("ExpiryDate");
    //'22-09-2025' = ['2','2','-', '0','9','-','2','0','2','5']
    let arrDate = expiryDateEl.value.split("-");
    //'2025-09-22' => ['2025', '09', '22']
    let expDateObj = new Date(arrDate[0] + "-" + arrDate[1] + "-" + arrDate[2]);

    if (new Date() > expDateObj) {
      expiryDateEl.value = "";
      alert(
        "Product is expired and cannot be sold!!!\n Expiry date should be future date only."
      );
    }
  }

  function restrictTheDescriptionLength(evt){
    
    document.getElementById("noOfChars").innerText = this.value.length;
  }
  function edit(){
  document.getElementById("InvoiceCode").value = invoiceObj.Code
  document.getElementById("InvoiceName").value = invoiceObj.Name
  document.getElementById("CountryOfRegion").value = invoiceObj.country
  document.getElementById("ManufacturingDate").value = invoiceObj.mfgDate
  document.getElementById("ExpiryDate").value = invoiceObj.expDate
  document.getElementById("Price").value = invoiceObj.price
  document.getElementById("Duty").value = invoiceObj.duty
  document.getElementById("Description").value = invoiceObj.desc
  }
  edit();x

}
