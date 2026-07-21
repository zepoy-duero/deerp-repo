const gBaseUrl = "/MyTickets";
const homeUrl = "/home";

const TicketAttachments = document.getElementById("TicketAttachments");
const previewContainer = document.getElementById("previewContainer");
const dropZone = document.getElementById("dropZone");
const $editTicketModal = $("#editTicketModal");
var selectedTicket = null;
let isEditingRequestedBy = false;
let selectedFiles = [];
let originalData = [];
var NewTicketId = null;

let NewTicket = {
    DeptCode:9,
    RequestedDate: null,
    TicketDescription: null,
    TicketSubject: null,
    TaskTypeCode: null,
}

let attachment = {
    AttachmentId: null,
    TicketId: null,
    AttachmentDate: null,
    AttachmentPath: null,
    SubfolderPath: null,
};
const validationConfig = {
    "#TicketDepartment": "Please select the department.",
    "#TicketRequestType": "Choose the type of your ",
    "#TIcketSubject": "Please indicate the ticket subject.",
    "#TicketDescription": "Describe the complete details.",
};
const inputSelectors = [
    "#SelectTicketOrganization",
    "#SelectTicketLocation",
    "#TicketDepartmentOptions",
    "#TaskTypeCode",
    "#TicketSubject"
];
const ticketsTable = $("#ticketsTable");
let CurrentUser = null;
let UserAssignee = null;


$(async function () {  
    // Fix: Destructure 'default' and rename it to 'TicketTable'
    //const { default: TicketTable } = await import("./test-refactor/table.js");

    //// Fix: Instantiation now works properly
    //let test = new TicketTable();
    //console.log(test.showTotalTicketsRecords('success'));
    ticketsTable.bootstrapTable('showLoading');
    let userData = await fetch(`/home/getUserDetails`);
    CurrentUser = await userData.json();
    console.log(CurrentUser)
    let dateToday = moment(CurrentUser.DATE_TODAY).format("MMM DD, YYYY");
    $("#DateRequested").empty().append(dateToday);
    await getAllTicket()

    bindEventHandlers();
    ticketsTable.bootstrapTable('hideLoading');
   
});

//-------FUNCTIONS------ 
function createManagerApprovalStatusOptions() {

    let options = `<option selected value="0" >Pending</option>
                             <option value="1">Approved</option>`;
    $("#approveByManager").empty().append(options)
}
async function getOrganizationOptions() {
    let organizations = await $.get(`support/employee-directory/getAllOrganizationList`);
    console.log(organizations)
    createTicketSelectOptions("select-organization", organizations);

    let selectedOrg = $("#SelectTicketOrganization").val();
    console.log(selectedOrg)
    await getLocationOptions(selectedOrg)
}
async function getLocationOptions(selectedOrg) {
    const filteredLoc = await $.get(`support/employee-directory/getFilteredLocationList`, {
        OrgCode: selectedOrg
    });
    createTicketSelectOptions("select-location", filteredLoc);
    
}
function createTicketSelectOptions(selector, data) {

    let html = ``;
    //let html = (selector === "select-organization")
    //    ? ""
    //    : `<option value="0">All</option>`;

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
function clearTicketFilterControl() {
    ticketsTable.bootstrapTable("clearFilterControl");
}
async function getAllSelectOptions() {
    try {
        await getUserOptions(1, 1, 9)
        await getAssigneeOptions(1,1,9)
        await getPriorityOptions(1,1,9);
        await getModuleOptions(1, 1, 9);
        await getTypeOptions(1, 1, 9)
        await getDurationUnitOptions(1, 1, 9);
        await getStatusOptions(1, 1, 9);
        createManagerApprovalStatusOptions();
      
    } catch(err) {
        toastr.error("There is an error on the server", "Error");
    }
}
function showEditRequestedBy() {
    // Switch to Edit Mode
    $("#DisplayRequestedByName").addClass("d-none");
    $("#SelectRequestedByName").removeClass("d-none");
    $("#editBtn").addClass("d-none");
    $("#checkBtn").removeClass("d-none");
}
function saveEditRequestedBy() {

    $("#DisplayRequestedByName").removeClass("d-none")
        .empty()
        .append($("#SelectRequestedByName").val());
    $("#SelectRequestedByName").addClass("d-none");
    $("#editBtn").removeClass("d-none");
    $("#checkBtn").addClass("d-none");
}

async function generateTicketEmailParams(ticket) {
    let emailParams = {
        RequestedByEmail: ticket.RequestedByEmail,
        ManagerEmailId: ticket.ManagerEmailId,
        TicketSubject: ticket.TicketSubject,
        StringTicketId: ticket.StringTicketId,
        RequestedByName: ticket.RequestedByName,
        RequestedDate: ticket.RequestedDate,
        TaskTypeName: ticket.TaskTypeName,
        TicketDescription: ticket.TicketDescription
    }
    return emailParams;
}
function closeEmailModal() {
  $("#editTicketModal").modal("toggle");
  $("#emailModal").modal("toggle");
}
function editDateRequested() {
  $("#dateRequestedField").toggleClass("d-none");
  $("#dateRequested").toggleClass("d-none");
  $("#editRequestDate").addClass("d-none");
  $("#saveRequestDate").removeClass("d-none");
}
function saveDateRequested() {
  $("#dateRequestedField").toggleClass("d-none");
  $("#dateRequested").toggleClass("d-none");
  $("#editRequestDate").removeClass("d-none");
  $("#saveRequestDate").addClass("d-none");
}
function toggleSearchBar() {
  $("#inpSearchParam").toggleClass("d-none");
}

function renderDropdown(list) {
  $("#employeedropdown").empty();

  if (list.length === 0) {
    $("#employeedropdown").append(
      '<div class="list-group-item text-muted">No results found</div>',
    );
    return;
  }

  list.forEach((emp) => {
    $("#employeedropdown").append(
      `<a href="#" class="list-group-item border-0 list-group-item-action"
                        data-id="${emp.id}"
                        data-name="${emp.name}">
                        ${emp.name}
                    </a>`,
    );
  });
}

//OPTIONS FOR COMBOS
async function getDepartmentOptions(OrgCode, LocCode) {
    itr = 0;
    departmentOptions = await $.get(`${gBaseUrl}/get-ticket-department-options`, {
        OrgCode,
        LocCode
    });
  
  let options = "";
  
    while (itr < departmentOptions.length) {
        if (departmentOptions[itr].VALUE == 9) {
            options += `<option selected value="${departmentOptions[itr].VALUE}"> ${departmentOptions[itr].TEXT} </option>`;
            itr++;
        } else {
            options += `<option value="${departmentOptions[itr].VALUE}"> ${departmentOptions[itr].TEXT} </option>`;
            itr++;
        }
       
    }
  console.log(options)
    $("#TicketDepartmentOptions").empty().append(options);
}

function renderFilePreview(file) {
  const fileItem = document.createElement("div");
  fileItem.className = "file-preview-item";

  const fileInfo = document.createElement("div");
  fileInfo.className = "file-info";

  // File Icon or Thumbnail
  let iconElement;

  if (file.type === "image/png") {
    iconElement = document.createElement("img");
    iconElement.className = "file-icon";
    iconElement.src = URL.createObjectURL(file);
  } else {
    iconElement = document.createElement("img");
    iconElement.className = "file-icon";

    if (file.type === "application/pdf") {
      iconElement.src = "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    } else {
      iconElement.src = "https://cdn-icons-png.flaticon.com/512/732/732220.png";
    }
  }

  const fileName = document.createElement("div");
  fileName.innerHTML = `
            <div><strong>${file.name}</strong></div>
            <small class="text-muted">${(file.size / 1024).toFixed(2)} KB</small>
        `;

  fileInfo.appendChild(iconElement);
  fileInfo.appendChild(fileName);

  // Remove Button
  const removeBtn = document.createElement("button");
  removeBtn.className = "btn btn-sm btn-outline-danger";
  removeBtn.innerText = "Remove";

  removeBtn.addEventListener("click", () => {
    selectedFiles = selectedFiles.filter((f) => f !== file);
    fileItem.remove();
  });

  fileItem.appendChild(fileInfo);
  fileItem.appendChild(removeBtn);

  previewContainer.appendChild(fileItem);
}
function handleFiles(files) {
  for (let file of files) {
    if (!isValidFileType(file)) {
      alert(`Invalid file type: ${file.name}`);
      continue;
    }

    selectedFiles.push(file);
    renderFilePreview(file);
  }
 
  TicketAttachments.value = '';
}
function isValidFileType(file) {
  const allowedTypes = [
    "image/png",
    "application/pdf",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  return allowedTypes.includes(file.type);
}
async function openSendEmailModal() {
  $("#editTicketModal").modal("toggle");
  $("#emailModal").modal("toggle");
}
async function selectCC() {
  $("#staticCC").hide();
  $("#addCC").toggleClass("d-none");
}
function assigneeSelected(event) {
    console.log(event.target.dataset.value);
    console.log(event.target.innerHTML);
    $("#assigneeDropdownSelect").empty().html(event.target.innerHTML)
    $("#assignedToName").val(event.target.innerHTML)
    $("#assignedToCode").val(event.target.dataset.value)
}
async function getAssigneeOptions(OrgCode, LocCode, DeptCode) {
  let usersOptions = await $.get(`${gBaseUrl}/get-assignee-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
  console.log(usersOptions)
  let options = "";
    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<li onclick="assigneeSelected(event)" class="dropdown-item" data-value="${i.VALUE}"> ${i.TEXT} </li >`;
        }
  });

    $("#assigneeList").empty().append(options);
}
async function getTicketRequestedByOptions(){
    let usersOptions = await $.get(`${gBaseUrl}/get-user-options`);
    let options = `<option  data-value=""> ${CurrentUser.EMP_NAME} </option >`;
    
    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<option  data-value="${i.VALUE}"> ${i.TEXT} </option >`;
        }
    });

    return options;
}
async function getUserOptions() {
  let usersOptions = await $.get(`${gBaseUrl}/get-user-options`);
    let options = "";

    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<li onclick="requestedBySelected(event)" class="dropdown-item" data-value="${i.VALUE}">${i.TEXT}</li>`;
        }
 
  });

    $("#userList").empty().append(options);
    $("#requestedByNameList").append(options)
    //$("#filterRequestedByName").append(options)
}
async function getPriorityOptions(OrgCode, LocCode, DeptCode) {
  let priorityOptions = await $.get(`${gBaseUrl}/get-priority-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
  console.log(priorityOptions);
    let options = "";
    priorityOptions.forEach(function (i) {
          options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
      });

    $("#priorityCode").empty().append(options);
  
}
async function getModuleOptions(OrgCode, LocCode, DeptCode) {
  let moduleOptions = await $.get(`${gBaseUrl}/get-module-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
  let options = "";
  moduleOptions.forEach(function (i) {
      options += `<li onclick="moduleSelected(event)" class="dropdown-item text-truncate" data-value="${i.VALUE}">${i.TEXT}</li>`;
  });

  $("#moduleList").empty().append(options);
}
async function getDurationUnitOptions() {
  let durationUnitOptions = await $.get(
    `${gBaseUrl}/get-duration-unit-options`,
    );
    console.log(durationUnitOptions)
    let options = "";
  
  durationUnitOptions.forEach(function (i) {
      options += `<option value="${i.TEXT}"> ${i.TEXT} </option>`;
     
  });

    $("#ticketDurationUnit").empty().append(options);
}
async function getStatusOptions(OrgCode, LocCode, DeptCode) {
  let statusOptions = await $.get(`${gBaseUrl}/get-status-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
  let options = "";
  statusOptions.forEach(function (i) {
    options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
  });

    $("#statusCode").empty().append(options);
    $("#filterStatus").append(options);
}
async function getTypeOptions(OrgCode, LocCode, DeptCode) {
  let typeOptions = await $.get(`${gBaseUrl}/get-type-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
    let options = "";
    let listOptions = "";

  typeOptions.forEach(function (i) {
      options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
      listOptions += `<li onclick="tasktypeSelected(event)" class="dropdown-item text-truncate" data-value="${i.VALUE}">${i.TEXT}</li>`;
  });
    $("#typeList").empty().append(listOptions);
    $("#TaskTypeCode").empty().append(options);
    
    //$("#filterType").empty().append(options);
}
async function getAllTicket() {
   
    const params = {
        OrgCode: 1,
        LocCode: 1,
        DeptCode: null,
    }

    let data = await $.get(`${gBaseUrl}/get-tickets`, params);
    console.log(data);

    showTotalTicketsRecords(data.length);
    window.originalData = data;

    ticketsTable.bootstrapTable('load', data);

}
function showTotalTicketsRecords(totalRecords) {
    $("#TicketsTotal").empty().append(
        `<div class="btn rounded-pill bg-main text-white text-center">
                <div class="badge fs-6 bg-danger rounded-pill text-white ms-0">${totalRecords}</div>
                <span class="text-center ms-1">Records</span>
        </div>`
    )
}
function uploadTicketAttachments() {
    var fileAttach = $('#TicketAttachments').val();
    console.log(fileAttach);
    return;
    if (fileAttach.files.length === 0) {
        alert('Please select a file first.');
        return;
    } else {
        console.log(fileAttach.files);
        return;
    }

        var formData = new FormData();
        // 'file' must match the parameter name in your backend controller
        formData.append('file', TicketAttachments.files[0]);

        $.ajax({
            url: 'MyTickets/upload-ticket-attachments', // Replace with your actual backend URL
            type: 'POST',
            data: formData,
            contentType: false, // Required: prevents jQuery from setting content-type header
            processData: false, // Required: prevents jQuery from converting data into a query string
            success: function (response) {
                alert('File uploaded successfully to server local disk!');
            },
            error: function (xhr, status, error) {
                alert('Upload failed: ' + error);
            }
        });

}

//---------CREATE NEW TICKET------------

function insertNewRow(response) {
    console.log(response)
    ticketsTable.bootstrapTable('insertRow', {
        index: 0,
        row: response,
       
    })
   ticketsTable.bootstrapTable('check', 0)
}
function resetCreateTicketForm() {
    $("#DisplayRequestedByName").empty().append(CurrentUser.EMP_NAME);
    $("#TicketSubject").val("").removeClass("is-valid").removeClass("is-invalid");
    $('#TicketDescription').summernote('reset');
    $("#TaskTypeCode").removeClass("is-valid").removeClass("is-invalid");
    $("#TicketDepartment").removeClass("is-valid").removeClass("is-invalid");
    //disableSubmitButton();
   
}

function loadingSubmitButton() {
    $("#submitTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...`);
}
function loadingSubmitEditButton() {
    $("#btnUpdateTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...`);
}
function enableSubmitEditButton() {
    $("#btnUpdateTicket").prop('disabled', false).empty().append('Update Ticket');
}
function disableSubmitButton() {
    $("#submitTicket").prop('disabled', true).empty().append('Submit Ticket');
   
}
function invalidInputsButton() {
    $("#submitTicket").attr('aria-label', 'Please fill all the required fields');
}
function enableSubmitButton() {
    $("#submitTicket").prop('disabled', false).empty().append('Submit Ticket');
}
function requestedBySelected(event) {
    console.log(event.target.dataset.value);
    console.log(event.target.innerHTML);

    // update visible display element so the selected name shows in the UI
    $("#displayRequestedByName").empty().html(event.target.innerHTML);
   

    // keep form values in hidden inputs (if present) for submission
    $("#editRequestedByName").val(event.target.innerHTML);
    $("#editRequestedByCode").val(event.target.dataset.value);
}
function moduleSelected(event) {
    console.log(event.target.dataset.value);
    console.log(event.target.innerHTML);
    $("#moduleDropdownSelect").empty().html(event.target.innerHTML)
    $("#moduleName").val(event.target.innerHTML)

}
function tasktypeSelected(event) {
    console.log(event.target.dataset.value);
    console.log(event.target.innerHTML);
    $("#typeDropdownSelect").empty().html(event.target.innerHTML)
    $("#taskTypeName").val(event.target.innerHTML)
    $("#taskTypeCode").val(event.target.dataset.value)

}

// Validate regular inputs and summernote content
async function validateFormData() {
    let validated = true;

    // iterate required controls (native HTML5 validation)
    inputSelectors.forEach(selector => {
        const $el = $(selector);

        // Reset old state
        $el.removeClass("is-invalid");
        $el.removeClass("is-valid");

        if ($el.length === 0) {
            // skip missing selectors
            return;
        }

        // Use native validity for selects/inputs
        if (!$el[0].checkValidity()) {
            validated = false;
            $el.addClass("is-invalid");

            // show bootstrap invalid feedback if present
            const feedback = $el.next(".invalid-feedback");
            if (feedback.length) feedback.show();
        } else {
            $el.addClass("is-valid");
        }
    });

    // Validate summernote (TicketDescription)
    if (!validateSummerNote()) {
        validated = false;
    }

    return validated;
}
function validateFirst() {
    var $form = $('#createTicketForm');

    // trigger browser validation UI if native required fields are missing
    if ($form.length && $form[0].checkValidity() === false) {
        // ensure summernote feedback is updated as well
        validateSummerNote();
        $form.addClass('was-validated');
        return false;
    }

    // run our combined validator (includes summernote check)
    const ok = validateFormData();
    if (!ok) {
        $form.addClass('was-validated');
    } else {
        $form.removeClass('was-validated');
    }
    return ok;
}
function toggleSubmitButton() {
    if (validateForm()) {
        enableSubmitButton();
    } else {
        disableSubmitButton()
    }
}


function validateSummerNote() {
    // If summernote instance exists, use its API; otherwise fall back to checking innerHTML
    const $editor = $('#TicketDescription');
    if ($editor.length === 0) return true;

    // If summernote has been initialized, .summernote('isEmpty') is available
    try {
        const isEmpty = $editor.summernote && $editor.summernote('isEmpty');
        if (isEmpty) {
            $("#summernoteInvalidFeedback").removeClass('d-none');
            return false;
        } else {
            $("#summernoteInvalidFeedback").addClass('d-none');
            return true;
        }
    } catch (err) {
        // fallback: read HTML and strip tags/spaces
        const html = $editor.html() || "";
        if (html.replace(/<[^>]*>/g, '').trim().length === 0) {
            $("#summernoteInvalidFeedback").removeClass('d-none');
            return false;
        } else {
            $("#summernoteInvalidFeedback").addClass('d-none');
            return true;
        }
    }
}
async function updateTicket(ticket) {
    let response = await $.put(`${gBaseUrl}/update-ticket`, ticket);
}
