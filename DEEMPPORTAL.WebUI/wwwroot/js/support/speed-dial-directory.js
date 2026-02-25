const gBaseUrl = `/support/speed-dial-directory`;

let organizations = [];
let locations = [];
let selectedOrg = 0;
let selectedLoc = 0;
let searchString = ''

let filterParams = {
    orgCode: selectedOrg,
    locCode: selectedLoc,
    searchString: searchString,
}
var speedDialDirectory = []

$(async function () {
    const pHeight = $("#pageInner").parent().width();
    const pWidth = $("#pageInner").parent().height();
    console.log(pHeight,pWidth)
    //LOAD ALL NECESSARY DATA
    await loadOrganizations();
    await loadLocations();
    await loadSpeedDialDirectory(filterParams);
    //---- EVENT LISTENERS
    $("#select-organization").on("change", async () => {
        filterParams.orgCode = $("#select-organization").val()
        filterParams.locCode = 0;
        showSpinner();
        await loadLocations();
        console.log(filterParams);
        await loadSpeedDialDirectory(filterParams);
    });
    $("#select-location").on("change", async () => {
        showSpinner();
        filterParams.orgCode = $("#select-organization").val();
        filterParams.locCode = $("#select-location").val();
        await loadSpeedDialDirectory(filterParams);
    });
    $("#searchString").on("keyup", async () => {
        filterParams.searchString = $("#searchString").val()
        showSpinner()
        await loadSpeedDialDirectory(filterParams)
    });
    $("#exportToExcel").on("click", async () => {
        exportAsExcel();
    });
   //------------------------------------
})
//-------FUNCTIONS
async function loadOrganizations() {
    organizations = await $.get(`/support/employee-directory/getAllOrganizationList`);
    console.log(organizations)
    createSelectOptions("select-organization", organizations);

}

async function loadLocations() {
    const filteredLoc = await $.get(`/support/employee-directory/getFilteredLocationList`, {
        orgCode: $("#select-organization").val()
    });
    console.log(filteredLoc)
    createSelectOptions("select-location", filteredLoc);
}
async function loadSpeedDialDirectory(params) {
    showTableSpinner()
    speedDialDirectory = await $.get(
        `${gBaseUrl}/getAllSpeedDialDirectory`,
        params
    );
    hideTableSpinner()

    render(speedDialDirectory);
    //$("#summary").empty().append(employeeList.length)
}
//------CREATE THE SELECT FILTER ELEMENT
function createSelectOptions(selector, data) {
    let filterName = selector.slice(8)
     
    let html = (selector === "select-organization")
  
        ? ""
        : `<option value="0">All L${filterName}</option>`;

    for (const item of data) {
        html += `<option value="${item.VALUE}">${item.TEXT}</option>`;
    }

    $("#" + selector).html(html);
}
function render(speedDialDirectory) {

    spd = speedDialDirectory
    if (spd.length >= 1) {
        $("#speedDialTable tbody").empty();
        spd.forEach((s) => {
            $("#speedDialTable tbody").append(
                `
                <tr>
                        <td class="p-3" >${s.SPEEDDIAL_NUMBER}</td>
                        <td class="p-3" >${s.SPEEDDIAL_REMARK}</td>
                        <td class="p-3" >${s.SPEEDDIAL_TELEPHONE_NUMBER ?? `N/A`}</td>
                       
                    </tr>
                `
            )
        })
        //$("#tblfoot").empty().append(`
        //        <tr>
                       
        //                <td>${spd.length}</td>
        //            </tr>
        //        `)

    } else {
        $("#speedDialTable tbody").empty().append(`<div class="justify-center text-center">No data found</div>`)
    }
   
    $("#tblCaption").empty().append(`
        ${spd.length} Records
    `)

 }
// Function to show the spinner
function showTableSpinner() {
    document.querySelector('.overlay-spinner').classList.remove('d-none');
}

// Function to hide the spinner
function hideTableSpinner() {
    document.querySelector('.overlay-spinner').classList.add('d-none');
}

function spinnerComponent() {
    return `
        <div class="overlay-spinner">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>`;
}
//function exportToExcel() {
//    try {

//        // Convert JSON to worksheet
//        const worksheet = XLSX.utils.json_to_sheet(speedDialDirectory);
//        const headerCells = ["A1", "B1", "C1"];
       
//        // Create a new workbook and append the worksheet
//        const workbook = XLSX.utils.book_new();
//        XLSX.utils.book_append_sheet(workbook, worksheet, "Speed Dial Directory");

//        // Export the workbook as an Excel file
//        XLSX.writeFile(workbook, "Speed Dial Directory.xlsx");
//    } catch (error) {
//        console.error("Error exporting Excel:", error);
//        alert("Failed to export Excel file.");
//    }
//}
function exportAsExcel() {
    $(speedDialDirectory).prop("disabled", true)
    const request = new Request(`${gBaseUrl}/exportAsExcel?` + new URLSearchParams(filterParams).toString(), {
        method: "POST",
    })

    fetch(request)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            $(speedDialDirectory).prop("disabled", false)
            return response.blob();
        })
        .then((blob) => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `Speed Dial Directory.xlsx`;  // Set the file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);  // Clean up after the download
        })
}