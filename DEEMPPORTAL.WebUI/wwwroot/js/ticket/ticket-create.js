$(async function () {
    await getCurrentUser();
    await initSummerNote();
    await getOrganizationOptions();
    await getLocationOptions($("#SelectTicketOrganization").val());
    await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());
    await getTypeOptions();
    
});

//-----------------------------FUNCTIONS-----------------------------
async function getCurrentUser() {
    try {
        let userData = await fetch(`/home/getUserDetails`);
        CurrentUser = await userData.json();
        fillRequestedBy(CurrentUser.EMP_NAME);
        fillRequestedDate(CurrentUser.DATE_TODAY);
    } catch (error) {
        toastr.error("Failed to fetch user details", 'Error', {
            timeOut: 3000,
        });
    }
   
}
async function initSummerNote() {
    $('#TicketDescription').summernote({
        height: 200,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],

            ['insert', ['link', 'picture']],
            ['view', ['fullscreen']],
        ],
    });
}
function fillRequestedBy(EMP_NAME) {
    $("#RequestedBy").empty().append(EMP_NAME);
}
function fillRequestedDate(DATE_TODAY) {
    $("#RequestedDate").empty().append(moment(DATE_TODAY).format("MMM DD, YYYY"));
}

 async function getOrganizationOptions() {
    let organizations = await $.get(`support/employee-directory/getAllOrganizationList`);
    createTicketSelectOptions("select-organization", organizations);

    //let selectedOrg = $("#SelectTicketOrganization").val();
    //await getLocationOptions(selectedOrg)
}
async function getLocationOptions(selectedOrg) {
    const filteredLoc = await $.get(`support/employee-directory/getFilteredLocationList`, {
        orgCode: selectedOrg
    });
    createTicketSelectOptions("select-location", filteredLoc); 

}
async function getDepartmentOptions(OrgCode, LocCode) {
    itr = 0;
    departmentOptions = await $.get(`${gBaseUrl}/get-ticket-department-options`, {
        OrgCode,
        LocCode
    });
  
    let options = "";

    while (itr < departmentOptions.length) {
        if (departmentOptions[itr] == 19) {
            options = `<option selected value="${departmentOptions[itr].VALUE}"> ${departmentOptions[itr].TEXT} </option>` + options;
            itr++;
        } else {
            options += `<option value="${departmentOptions[itr].VALUE}"> ${departmentOptions[itr].TEXT} </option>`;
            itr++;
        }

    }

    $("#TicketDepartmentOptions").empty().append(options);
}
async function getTypeOptions(OrgCode, LocCode, DeptCode) {
    let typeOptions = await $.get(`${gBaseUrl}/get-type-options`, {
        OrgCode,
        LocCode,
        DeptCode,
    });
    let options = "<option value='null' class='active'>Request Type </option>";

    typeOptions.forEach(function (i) {
        options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
    });
    $("#TaskTypeCode").empty().append(options);

    //$("#filterType").empty().append(options);
}
function createTicketSelectOptions(selector, data) {

    let html = ``;
    switch (selector) {
        case "select-organization":
            for (const item of data) {
                if (item.VALUE == 1) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
            }
            $("#SelectTicketOrganization").html(html);
            break;
        case "select-location":

            for (const item of data) {
                if (item.VALUE == 1) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
            }
            $("#SelectTicketLocation").html(html);
            break;
        case "select-department":
            for (const item of data) {
                if (item.VALUE == 19) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
            }
            $("#SelectTicketDepartment").html(html);
            break;
    }
}