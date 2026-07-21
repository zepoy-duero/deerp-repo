const empDirectoryUrl = `/support/employee-directory`;
const empFirefighterUrl = `/support/certified-firefighting-operator`;
const empFirstAiderUrl = `/support/certified-first-aider`;
let organizations = [];
let locations = [];
let departments = [];
var emps = [];
var certifiedUserToRemove = null;
var certifiedUserNameToRemove =''
var isPageReload = true;
var selectedEmp = null;
var isHR = false;
var cardColumn = null;
$(async function () {
    isHR = await checkIfCurrentUserHR();
    showSpinner();

    await loadOrganizations();
    await loadLocations();
    await loadDepartments();
    await currentPageRequest();
   
   
    isPageReload = false;
    // Event bindings
    $("#select-organization").on("change", async (e) => {
        showSpinner();

        await loadLocations();
        await loadDepartments();
        await currentPageRequest();
    });
    $("#select-location").on("change", async () => {
        console.log($("#select-location").val())
        showSpinner()
        if ($("#select-location").val() == 11) {
            $("#select-department").val('17');
        }
        await loadDepartments();
        await currentPageRequest()
    });
    $("#select-department").on("change", async () => {
        showSpinner()
        await currentPageRequest()
    });

    $("#search-input").on("keyup", searchEmployees);

    $("#select-status").on("change", async function () {
        console.log($("#select-status option:selected").text());
        showSpinner();
        await getAllEmployeeDirectory()
    });

    $("#addFirefighterModal").on('show.bs.modal', async function () {
      await  createUserSelectOptions();

    });
    $('#addFirefighterModal').on('hidden.bs.modal', function () {
        $("#FirefighterSearchInput").blur();
    });
    $("#submitCertifiedFirefighter").on("click", async function () {
        showAddFirefighterSpinner();
        try {
            let newFirefighter = await addCertifiedFirefighter();
            console.log(newFirefighter)
            toastr.success("Successfully added a new Certified Firefighter Employee");
           
               
            $("#closeAddModal").click();
            prependEmployeeCardList(newFirefighter);
            resetAddFirefighterBtn
            //showSpinner()
            //await getAllEmployeeFirefighters();
           
        } catch (error) {
            toastr.error("Error adding certified firefighter: " + error.message);

        }
    });
   
    $("#chooseFirefighterEmployeeBtn").on("click", function () {
        $("#FirefighterSearchInput").focus();
    })
    $("#FirefighterSearchInput").on("keyup", function () {
        let search = $(this).val().toLowerCase();

        $("#selectFireFighterEmployee li").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(search));
        });
    });
    $("#confirmationModal").on("hidden.bs.modal", function () {
        this.blur();
    })
   
    $("#confirmAction").on("click", async function () {
        if (await $.get(`${empFirefighterUrl}/remove-certified-firefighter`
            , { USER_CODE: certifiedUserToRemove })) {
            toastr.success(certifiedUserNameToRemove + " has been successfully removed from the list")
            cardColumn.remove();
            $("#confirmationModal").modal('hide');
        } else {
            toastr.error("Failed to removed " + certifiedUserNameToRemove + " from the list")
        }
    });
  
});
function confirmRemove(event) {
    event.preventDefault();
    certifiedUserNameToRemove = event.target.dataset.name;
    certifiedUserToRemove = event.target.dataset.usercode;
    console.log(event.target.dataset)
    if (event.target.classList.contains('remove-btn')) {
        // Find the parent grid column (.card-wrapper) and remove it entirely
        cardColumn = event.target.closest('.employee-col');
        //cardColumn.remove();
        $("#confirmationModal").modal('show');
        $("#confirmationMsg").html(`<span class="text-nowrap">Are you sure to remove <strong>${certifiedUserNameToRemove}</strong>?</span>`)

    }
}
// ---------------- SEARCH ----------------,
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
async function currentPageRequest() {

    switch (getCurrentPageRoute()) {
        case empDirectoryUrl:
                        await getAllEmployeeDirectory();
            break;
        case empFirefighterUrl:
                        await getAllEmployeeFirefighters();
            break;
        case empFirstAiderUrl:
                        await getAllEmployeeFirstAiders();
            break;
    }
}
function filterByStatus() {
    const value = $(this).val().toLowerCase().trim();
    console.log(value)
    if (value == 'all') {
        $("#employeeContainer .card").each(function () {
            const status = $(this)
                .find("#emp_status")
                .text()
                .toLowerCase();
            // Hide/show the column wrapper
            $(this)
                .closest('[class^="col-"]')
                .toggle(status.includes(''));
        });
      
    } else {
         $("#employeeContainer .card").each(function () {
                const status = $(this)
                    .find("#emp_status")
                    .text()
                    .toLowerCase();
                // Hide/show the column wrapper
                $(this)
                    .closest('[class^="col-"]')
                 .toggle(status.includes(value));

            
         });
        
    }
   
}

// ---------------- HELPERS ----------------
function showSpinner() {

    $("#employeeContainer").empty().append(spinnerComponent());
}
function spinnerComponent() {
    return `
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="spinner-grow" style="width:3rem;height:3rem;">
           
            </div>
 <span class="blink align-middle ms-2">Fetching data ...</span>
        </div>`;
}
// ---------------- LOAD DROPDOWNS ----------------
async function loadOrganizations() {
    organizations = await $.get(`${empDirectoryUrl}/getAllOrganizationList`);
    createSelectOptions("select-organization", organizations);
}
async function loadLocations() {
    const filteredLoc = await $.get(`${empDirectoryUrl}/getFilteredLocationList`, {
        orgCode: $("#select-organization").val()
    });
    createSelectOptions("select-location", filteredLoc);
}
async function loadDepartments() {
    filterItems = {
        orgCode: $("#select-organization").val(),
        locCode: $("#select-location").val()
    }

    const filteredDept = await $.get(`${empDirectoryUrl}/getFilteredDepartmentList`, {
        orgCode: $("#select-organization").val(),
        locCode: $("#select-location").val()
    });
    createSelectOptions("select-department", filteredDept); 
}
function createSelectOptions(selector, data) {
    
    let html = `<option value="0">All</option>`;
    //let html = (selector === "select-organization")
    //    ? ""
    //    : `<option value="0">All</option>`;

    switch (selector) {
                case "select-organization":
                    for (const item of data) {
                        if (item.VALUE == 1) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                        else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
                    }
                    $("#" + selector).html(html);
                    break;
                case "select-location":

                    for (const item of data) {
                        if (item.VALUE == 1) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                        else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
                    }
                    $("#" + selector).html(html);
                    break;
        case "select-department":
                    if ($("#select-location").val() == 11) {
                        html = '';
                    }
                    for (const item of data) {
                        if (item.VALUE == 19) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                        else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
                    }
                    $("#" + selector).html(html);
                    break;
            }
   
}
function getCurrentPageRoute() {
    const params = window.location.pathname;
    return params;
}

// ---------------- EMPLOYEE LIST ----------------
async function getAllEmployeeDirectory() {
    
    const filterParams = {
        orgCode: $("#select-organization").val(),
        locCode: $("#select-location").val(),
        deptCode: ($("#select-location").val() == 11) ? 17 : $("#select-department").val(),
        status: $("#select-status option:selected").text(),
        //isFirefighter: 
    };
    console.log(filterParams);
    showTotalRecordsSpinner()
    let employeeList = await $.get(
        `${empDirectoryUrl}/getAllEmployeeDirectory`,
            filterParams
    );
   
    showTotalRecords(employeeList.length);
    await render("employeeContainer", employeeList);
    
    
    
    //$("#summary").empty().append(employeeList.length)
}
async function getAllEmployeeFirefighters() {

    const filterParams = {
        orgCode: $("#select-organization").val(),
        locCode: 0,
        deptCode: 0,
        status: $("#select-status option:selected").text(),
        //isFirefighter: 
    };

    showTotalRecordsSpinner()
    let employeeList = await $.get(
        `${empFirefighterUrl}/getAllEmployeeFirefighters`,
        filterParams
    );

    showTotalRecords(employeeList.length);
    await render("employeeContainer", employeeList)

}
async function getAllEmployeeFirstAiders() {
    const filterParams = {
        orgCode: $("#select-organization").val(),
        locCode: 0,
        deptCode: 0,
        status: $("#select-status option:selected").text(),
        //isFirefighter: 
    };

    showTotalRecordsSpinner()
    let employeeList = await $.get(
        `${empFirstAiderUrl}/getAllEmployeeFirstAiders`,
        filterParams
    );

    showTotalRecords(employeeList.length);
   await render("employeeContainer", employeeList);
}
function showTotalRecordsSpinner() {
    $("#EmployeeDirectoryTotal").empty().append(
            `<div id="" class="btn rounded-pill bg-main text-white text-center">
                  <div class="spinner-border spinner-border-sm" role="status">
                      <span class="visually-hidden">Loading...</span>
                  </div>
                        <span class="blink align-middle ms-2">Loading...</span>
             </div>`
        )
}
function activateButtonSpinner(selector) {
    $(selector).prop('disabled', true);

    $(selector).empty().append(
        `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Loading...`);
}
function deactivateButtonSpinner(selector) {
    $(selector).prop('disabled', false);
    $(selector).empty().append(`Confirm`);
}
function showAddFirefighterSpinner() {
    $("#submitBtnSpinner").toggleClass('d-none');
    $('#submitCertifiedFirefighter').prop('disabled', true);
    $("#submitCertifiedFirefighter").html('Updating...');
}
function resetAddFirefighterBtn() {
    $("#submitBtnSpinner").toggleClass('d-none');
    $('#submitCertifiedFirefighter').prop('disabled', false);
    $("#submitCertifiedFirefighter").html('Update');
}
function showTotalRecords(totalRecords) {
    $("#EmployeeDirectoryTotal").empty().append(
        `<div class="btn rounded-pill bg-main text-white text-center">
                <div class="badge fs-6 bg-danger rounded-pill text-white mx-1">${totalRecords}</div>
         Records
        </div>`
    )
}
async function render(containerId, employees) {
    const container = document.getElementById(containerId);
    emps = employees
    if (employees.length >= 1) {
        container.innerHTML = employees.map(createCard).join("");
    
    } else {
        $(container).empty().append(`<div class="text-center">No data found</div>`)
    }
    
}
function prependEmployeeCardList(employees) {
    let empCard = createCard(employees[0]);
    $("#employeeContainer").prepend(empCard)
}
// ---------------- UTIL ----------------
function checkIfNull(val) {
    return val ?? "None";
}
async function getProfilePic(EMP_CODE) {
    let empPhoto = await $.get(`${empDirectoryUrl}/getProfilePic?`, { EMP_CODE: EMP_CODE });
    console.log(empPhoto)
}
async function addCertifiedFirefighter() {
        
     return await $.get(`${empFirefighterUrl}/add-certified-firefighter`, { USER_CODE: selectedEmp });
      
      
}
async function getUserOptions() {
    let usersOptions = await $.get(`/MyTickets/get-user-options`);
    let options = ``;

    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<option value="${i.VALUE}">${i.TEXT}</option>`;
        }
    });

    return options;
}
function employeeFirefighterSelected(event) {
    selectedEmp = event.target.dataset.value;
    $("#selectFirefighters").val(selectedEmp);
    $("#chooseFirefighterEmployeeBtn").empty().append(event.target.innerHTML);
   
    console.log(selectedEmp);

   
}


async function checkIfCurrentUserHR() {
    const response = await fetch(`/home/getUserDetails`);
    if (!response.ok) {
        console.error('Failed to fetch user details');
        return;
    }

    const data = await response.json();

    if (data.DEPT_NAME == 'Human Resource' || data.USER_CODE == 1) return true;
    else return false;

}
async function createUserSelectOptions() {
    let usersOptions = await $.get(`${empFirefighterUrl}/get-user-firefighter-options`);
    console.log(usersOptions)
    let options = ``;

    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<li onclick="employeeFirefighterSelected(event)" class="dropdown-item" data-value="${i.VALUE}">${i.TEXT}</li>`;
        }
    });
   
    $("#selectFireFighterEmployee").empty().append(options);
}

// Search filter

/* ===============================
   Card Template
=============================== */
 function createCard(emp) {
    
    return `
        <div class="col-xl-2 col-lg-3 col-md-4 col-sm-6 employee-col">
            <div id="empCard" class="card border-${emp.IS_ACTIVE ? 'primary' : 'secondary'} text-center shadow-sm h-90 position-relative">
                <div class="card-body">                    
                    <div class="position-relative">
                        <img src="data:image/jpg;base64,${emp.EMP_PHOTO}"
                             class="position-relative rounded-circle"
                             style="width:110px;height:110px;object-fit:cover;border: 3px solid ${emp.IS_ACTIVE ? '#198754' : '#6861ce'};" />
       
                    </div>

                    <div class="text-truncate">
                    <span class="mb-0 fs-6 fw-bolder small emp-name">${emp.EMP_NAME}</span><br />
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
                        <div class="d-none" id="emp_status">${emp.EMP_STATUS}</div>
                        </div>
                    </div>

                </div>
                ${isHR && getCurrentPageRoute() == '/support/certified-firefighting-operator' 
                ?
                `<div  class="card-footer card-footer-sm align-item-end">
                    <button
                        onmouseover="this.style.color='red',this.style.fontWeight='bold'"
                        onmouseout="this.style.color='black',this.style.fontWeight='normal'"
                        onclick="confirmRemove(event)"
                        data-usercode="${emp.USER_CODE}"
                        data-name="${emp.EMP_NAME}"  
                        class="btn remove-btn removeCardFooter">
                        Remove <i class="bi bi-trash text-danger"></i>
                    </button>
                </div>` : ''
                }
                
            </div>
        </div>`;
}


