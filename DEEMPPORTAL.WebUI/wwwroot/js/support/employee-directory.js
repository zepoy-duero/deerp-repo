const gBaseUrl = `/support/employee-directory`;

let organizations = [];
let locations = [];
let departments = [];
var emps = [];
$(async function () {
    await loadOrganizations();
    await loadLocations();
    await loadDepartments();
    await getAllEmployeeDirectory();

    // Event bindings
    $("#select-organization").on("change", async () => {
        showSpinner();
        await loadLocations();
        await getAllEmployeeDirectory()
    });
    $("#select-location").on("change", async () => {
        showSpinner()
        await loadDepartments();
        await getAllEmployeeDirectory()
    });
    $("#select-department").on("change", async () => {
        showSpinner()
        getAllEmployeeDirectory()
    });

    $("#search-input").on("keyup",searchEmployees);
});

// ---------------- SEARCH ----------------
function searchEmployees() {
    const value = $(this).val().toLowerCase().trim();

    $("#employeeContainer .card").each(function () {
        const name = $(this)
            .find(".emp-name")
            .text()
            .toLowerCase();

        // Hide/show the column wrapper
        $(this)
            .closest('[class^="col-"]')
            .toggle(name.includes(value));
    });
}



// ---------------- HELPERS ----------------
function showSpinner() {
    $("#employeeContainer").empty().append(spinnerComponent());
}

function spinnerComponent() {
    return `
        <div class="d-flex justify-content-center align-items-center">
            <div class="spinner-grow" style="width:3rem;height:3rem;"></div>
        </div>`;
}

// ---------------- LOAD DROPDOWNS ----------------
async function loadOrganizations() {
    organizations = await $.get(`${gBaseUrl}/getAllOrganizationList`);
    createSelectOptions("select-organization", organizations);
    
}

async function loadLocations() {
    const filteredLoc = await $.get(`${gBaseUrl}/getFilteredLocationList`, {
        orgCode: $("#select-organization").val()
    });
    createSelectOptions("select-location", filteredLoc);
}

async function loadDepartments() {
    const filteredDept = await $.get(`${gBaseUrl}/getFilteredDepartmentList`, {
        orgCode: $("#select-organization").val(),
        locCode: $("#select-location").val()
    });
    
    createSelectOptions("select-department", filteredDept);
    
}

function createSelectOptions(selector, data) {
    let html = (selector === "select-organization")
        ? ""
        : `<option value="0">All</option>`;

    for (const item of data) {
        html += `<option value="${item.VALUE}">${item.TEXT}</option>`;
    }

    $("#" + selector).html(html);
}

// ---------------- EMPLOYEE LIST ----------------
async function getAllEmployeeDirectory() {
    const filterParams = {
        orgCode: $("#select-organization").val(),
        locCode: $("#select-location").val(),
        deptCode: $("#select-department").val()
    };
    console.log(filterParams)
    const employeeList = await $.get(
        `${gBaseUrl}/getAllEmployeeDirectory`,
        filterParams
    );

    render("employeeContainer", employeeList);
    //$("#summary").empty().append(employeeList.length)
}

function render(containerId, employees) {
    const container = document.getElementById(containerId);
    emps = employees
    if (employees.length >= 1) {
        container.innerHTML = employees.map(createCard).join("");
    
    } else {
        $(container).empty().append(`<div class="text-center">No data found</div>`)
    }
    console.log(employees)
    
}

// ---------------- UTIL ----------------
function checkIfNull(val) {
    return val ?? "None";
}


/* ===============================
   Card Template
=============================== */
function createCard(emp) {
    return `
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 g employee-col">
            <div class="card border-${emp.IS_ACTIVE ? 'primary' : 'secondary'} text-center shadow-sm h-90">
                <div class="card-body">

                    <div class="position-relative">
                        <img src="data:image/jpg;base64,${emp.EMP_PHOTO}"
                             class="position-relative rounded-circle"
                             style="width:110px;height:110px;object-fit:cover;border: 3px solid ${emp.IS_ACTIVE ? '#198754' : '#6861ce'};" />

                        <span class="position-absolute bottom-40 start-60
                            badge rounded-circle
                            ${emp.IS_ACTIVE ? 'bg-success' : 'bg-secondary'}"
                            style="width:18px;height:18px;">
                        </span>
                    </div>

                    <div class="text-truncate">
                    <h6 class="mb-0 fw-bolder small emp-name">${emp.EMP_NAME}</h6>
                    <small class="text-truncate emp-position">${emp.EMP_POSITION}</small>
                    </div>
                    
                    <hr />
                    <div class="text-center text-truncate">
                        <div class="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt" viewBox="0 0 16 16">
                              <path d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"/>
                              <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                            </svg>
                           <small class="text-truncate emp-contacts">  ${emp.EMP_LOCATION}</small>
                        </div>
                        <div class="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-telephone" viewBox="0 0 16 16">
                              <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"/>
                            </svg>
                            <small class="text-truncate emp-contacts">${checkIfNull(emp.TELEPHONE_NO)}</small>
                        </div>
                        <div class="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-phone" viewBox="0 0 16 16">
                              <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2z"/>
                              <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
                            </svg>
                        <small class="text-truncate emp-contacts">${checkIfNull(emp.MOBILE_NO)}</small>
                        </div>
                        <div class="mb-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 640 640"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M376 32C504.1 32 608 135.9 608 264C608 277.3 597.3 288 584 288C570.7 288 560 277.3 560 264C560 162.4 477.6 80 376 80C362.7 80 352 69.3 352 56C352 42.7 362.7 32 376 32zM384 224C401.7 224 416 238.3 416 256C416 273.7 401.7 288 384 288C366.3 288 352 273.7 352 256C352 238.3 366.3 224 384 224zM352 152C352 138.7 362.7 128 376 128C451.1 128 512 188.9 512 264C512 277.3 501.3 288 488 288C474.7 288 464 277.3 464 264C464 215.4 424.6 176 376 176C362.7 176 352 165.3 352 152zM176.1 65.4C195.8 60 216.4 70.1 224.2 88.9L264.7 186.2C271.6 202.7 266.8 221.8 252.9 233.2L208.8 269.3C241.3 340.9 297.8 399.3 368.1 434.2L406.7 387C418 373.1 437.1 368.4 453.7 375.2L551 415.8C569.8 423.6 579.9 444.2 574.5 463.9L573 469.4C555.4 534.1 492.9 589.3 416.6 573.2C241.6 536.1 103.9 398.4 66.8 223.4C50.7 147.1 105.9 84.6 170.5 66.9L176 65.4z"/></svg>
                        <small class="text-truncate emp-contacts">${checkIfNull(emp.EXTENSION_NO)}</small>
                            </div>
                        <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-envelope" viewBox="0 0 16 16">
                          <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z"/>
                        </svg>
                        <small class="text-truncate emp-contacts">  ${checkIfNull(emp.EMAIL_ADDRESS)}</small>
                      
                        </div>
                    </div>

                </div>
            </div>
        </div>`;
    }