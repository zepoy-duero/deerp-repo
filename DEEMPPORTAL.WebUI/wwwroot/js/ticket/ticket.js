const gBaseUrl = "/MyTickets";
const homeUrl = "/home";

//const TicketAttachments = $("#TicketAttachments")
const attachmentsPreviewContainer = $("#attachmentsPreviewContainer");
const previewContainer = document.getElementById("previewContainer");
const dropZone = document.getElementById("dropZone");
const $editTicketModal = $("#editTicketModal");
const confirmationDialog = document.getElementById("confirmationDialog");
var selectedTicket = null;
let isEditingRequestedBy = false;
let selectedFiles = [];
let originalData = [];
var NewTicketId = null;
var activeAttachmentContainer = null;
let NewTicket = {
    OrgCode: 1,
    LocCode: 1,
    DeptCode:9,
    RequestedDate: null,
    TicketDescription: null,
    TicketSubject: null,
    TaskTypeCode: null,
    TicketAttachments: []
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

let CurrentUser = null;
let UserAssignee = null;
const ticketsTable = $("#ticketsTable");
var exampleTriggerEl = document.getElementById('AttachmentTooltip');
var tooltip = bootstrap.Tooltip.getOrCreateInstance(exampleTriggerEl)
var formData = new FormData();
$(async function () {  
     // Returns a Bootstrap tooltip instance
    
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
    await getAllTicket();

    bindEventHandlers();
    ticketsTable.bootstrapTable('hideLoading');
    //$('#requestedDateFilter').val(moment().format("YYYY"))
   
   
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
        //ManagerEmailId: ticket.ManagerEmailId,
        ManagerEmailId: "radhika@dahbashi.com",
        TicketSubject: ticket.TicketSubject,
        StringTicketId: ticket.StringTicketId,
        RequestedByName: ticket.RequestedByName,
        RequestedDate: moment(ticket.RequestedDate).format('DD-MM-YYY hh:mm:ss'),
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
function showPreview(event) {
    console.log(event.target.src);
  

    // Open the URL in a new tab
    window.open(event.target.src, '_blank'); 
    //$("#AttachmentView").attr('src', event.target.src);
    //$("#imageModal").modal("show");
}
function renderFilePreview(file) {
    console.log(file)
  const fileItem = document.createElement("div");
    fileItem.className = "file-preview-item";
    fileItem.setAttribute('type', 'button'); 
    fileItem.setAttribute('onclick', 'showPreview(event)'); 

  const fileInfo = document.createElement("div");
  fileInfo.className = "file-info";

  // File Icon or Thumbnail
  let iconElement;

  if (file.type === "image/png") {
    iconElement = document.createElement("img");
    iconElement.className = "file-icon";
      if (activeAttachmentContainer == 'add') {
          iconElement.src = URL.createObjectURL(file);
      } else {
          iconElement.src = file.url;
      }
    
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
  console.log(fileName)
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

    if (activeAttachmentContainer == 'add') previewContainer.appendChild(fileItem);
    else attachmentsPreviewContainer.append(fileItem);
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
 
    // Clear the native file input safely — avoid referencing an undefined variable.
    // Try by id first, then by common selector as fallback.
    const fileInput = document.getElementById("TicketAttachments") || document.querySelector('input[type="file"][name="files"]');
    if (fileInput) {
        try {
            fileInput.value = "";
        } catch (e) {
            // Some older browsers or custom inputs might throw; ignore silently.
            console.warn("Could not clear file input value", e);
        }
    }
}
function isValidFileType(file) {

    const allowedTypes = [
        // PDF
        "application/pdf",

        // Microsoft Word
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        // Microsoft Excel
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        // Microsoft PowerPoint
        "application/vnd.ms-powerpoint",
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",

        // Text
        "text/plain",
        "text/csv",

        // Archives
        "application/zip",
        "application/x-rar-compressed"
    ];

    // Allow all image formats
    if (file.type.startsWith("image/")) {
        return true;
    }

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
//---------CREATE NEW TICKET------------
function setSummernoteValue(e) {
    var file = e.target.files[0];

    if (file) {
        var reader = new FileReader();

        // Read the file based on its type
        if (file.type.match('image.*')) {
            // Handle images: Convert to Base64 and insert as an <img> tag
            reader.onload = function (event) {
                var imageHtml = '<img src="' + event.target.result + '" alt="' + file.name + '" class="img-fluid" />';
                $('#Attachments').summernote('pasteHTML', imageHtml);
            };
            reader.readAsDataURL(file);
        } else if (file.type.match('text.*')) {
            // Handle text files: Read text content and insert it directly
            reader.onload = function (event) {
                var textContent = event.target.result;
                $('#Attachments').summernote('code', textContent);
            };
            reader.readAsText(file);
        } else {
            // Handle other files: Create a downloadable anchor link
            reader.onload = function (event) {
                var linkHtml = '<a href="' + event.target.result + '" download="' + file.name + '">' + file.name + '</a>';
                $('#Attachments').summernote('pasteHTML', linkHtml);
            };
            reader.readAsDataURL(file);
        }
    }
}
async function uploadTicketAttachments(ticketId) {
        var fileAttach = $('#TicketAttachments')[0].files;
        console.log(fileAttach)
        if (fileAttach.length === 0) {
            alert('Please select a file first.');
            return;
        }

        var formData = new FormData();
        for (var i = 0; i < fileAttach.length; i++) {
            formData.append('files', fileAttach[i]);
        }
        formData.append('ticketId', ticketId);

        try {
            let uploadedAttachments = await $.ajax({
                url: 'MyTickets/upload-ticket-attachments',
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false
            });

            console.log(uploadedAttachments);
            toastr.success('Success uploading ticket attachments');
        } catch (error) {
            console.error(error);
            toastr.error('Upload failed: ' + error.statusText);
        }
    }
function insertNewRow(response) {
        console.log(response)
        ticketsTable.bootstrapTable('insertRow', {
            index: 0,
            row: response,

        })
        ticketsTable.bootstrapTable('check', 0)
    }
   
async function showCreateTicketModal(event) {
    event.preventDefault();
    activeAttachmentContainer = 'add';
    await getOrganizationOptions();
    await getLocationOptions($("#SelectTicketOrganization").val());
    await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());
    $("#selectOrg").val($("#SelectTicketOrganization").find('option:selected').text())
    $("#selectLoc").val($("#SelectTicketLocation").find('option:selected').text())
    // get options for requested by select component and populate edit-select
    let RequestedByNameOptions = await getTicketRequestedByOptions();
    $("#SelectRequestedByName").empty().append(RequestedByNameOptions);

    // set display and hidden values for current user
    $("#DisplayRequestedByName").html(CurrentUser.EMP_NAME);
    $("#displayRequestedBy").html(CurrentUser.EMP_NAME);
    $("#requestedBy").val(CurrentUser.EMP_NAME);
    $("#requestedByCode").val(CurrentUser.USER_CODE);

    // set the date input and display (keep display readable)
    $("#dateRequested").val(CurrentUser.DATE_TODAY);
    if (typeof moment !== "undefined") {
        $("#dateRequestedField").empty().append(moment(CurrentUser.DATE_TODAY).format("MM-DD-YYYY"));
    } else {
        $("#dateRequestedField").empty().append(moment(CurrentUser.DATE_TODAY).format("MM-DD-YYYY"));
    }
    await getTypeOptions(1, 1, 9);
    await getModuleOptions(1, 1, 9);
   
}
async function resetCreateTicketForm() {

    formData.append('OrgCode', 1);
    formData.append('LocCode', 1);
    formData.append('DeptCode', 9);
    formData.append('RequestedByCode', CurrentUser.USER_CODE);
    formData.append('RequestedByName', CurrentUser.EMP_NAME);
    formData.append('RequestedDate', CurrentUser.DATE_TODAY);
    formData.append('TaskTypeCode', $('#TaskTypeCode').val() ?? 1);
    formData.append('TicketSubject', $('#TicketSubject').val());
    formData.append('TicketDescription', $('#TicketDescription').val());
    formData.append('TicketAttachments', $('#TicketAttachments')[0].files[0]);
    console.log(Object.fromEntries(formData));
        
        $("#createTicketForm").removeClass('was-validated')
        $("#DisplayRequestedByName").empty().append(CurrentUser.EMP_NAME);
        $("#TicketSubject").val("").removeClass("is-valid").removeClass("is-invalid");
        //$('#TicketDescription').summernote('reset');
        $("#summernoteInvalidFeedback").addClass('d-none')

        $("#TaskTypeCode").removeClass("is-valid").removeClass("is-invalid");
        $("#TicketDepartmentOptions").removeClass("is-valid").removeClass("is-invalid");
        $("#SelectTicketLocation").removeClass("is-valid").removeClass("is-invalid");
        $("#SelectTicketOrganization").removeClass("is-valid").removeClass("is-invalid");
        $("#TicketDepartment").removeClass("is-valid").removeClass("is-invalid");
        $('#TicketDescription').summernote({
            height: 100,
            lang: 'en-US',
            toolbar: [
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                //['insert', ['link', 'picture', 'video']],
            ],

        });
        $("#TicketAttachmentContainer").summernote({
            height: 250,
            toolbar: false,
            
        });
        $('#TicketDescription').summernote('reset');
    }
function getCreateTicketParams() {
    var formData = {
        OrgCode: $('#SelectOrganization').val(),
        LocCode: $('#SelectLocation').val(),
        DeptCode: $('#TicketDepartmentOptions').val(), // Hidden input storing the ID
        TaskTypeCode: $('#TaskTypeCode').val(),
        TicketSubject: $('#TicketSubject').val(),
        TicketDescription: $('#TicketDescription').val(),
        TicketAttachments: $('#TicketAttachments').val(),
    };
    formData.RequestedByCode = CurrentUser.USER_CODE;
    formData.RequestedDate = CurrentUser.DATE_TODAY;
    formData.RequestedByName = CurrentUser.EMP_NAME;

    return formData;

}
//function setDefaultTicketParams() {
//    var param = new FormData();
//    param.append() = 
//     formData = {
//        OrgCode: $('#SelectOrganization').val(),
//        LocCode: $('#SelectLocation').val(),
//        DeptCode: $('#TicketDepartmentOptions').val(), // Hidden input storing the ID
//        TaskTypeCode: $('#TaskTypeCode').val(),
//        TicketSubject: $('#TicketSubject').val(),
//        TicketDescription: $('#TicketDescription').val(),
//        TicketAttachments: $('#TicketAttachments').val(),
//    };
//    formData.RequestedByCode = CurrentUser.USER_CODE;
//    formData.RequestedDate = CurrentUser.DATE_TODAY;
//    formData.RequestedByName = CurrentUser.EMP_NAME;

//    return formData;

//}
function loadingSubmitButton() {
        $("#submitTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Submitting...`);
    }
function loadingSendEmailButton() {
        $("#submitTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending email...`);
    }
function loadingSubmitEditButton() {
        $("#btnUpdateTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Updating ...`);
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
        const $editor = $('#TicketDescription').summernote();
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
function checkIfDuplicateFile(ticketFiles) {
    // Prevent duplicate files
    const alreadyExists =
        Array.from(ticketFiles.files)
            .some(existingFile =>
                existingFile.name === file.name &&
                existingFile.size === file.size
            );

    if (alreadyExists) {
        return 0;
    } else {
        return 1;
    }
}

async function submitNewTicket() {
    const formElement = $('#createTicketForm')[0]
    console.log(formElement)


    const fd = new FormData(formElement)
    console.log(Object.fromEntries(fd));
    //return;
    loadingSubmitButton();
    try {
        const response = await fetch(`${gBaseUrl}/create-ticket`, {
            method: "POST",
            body: fd
        });
        var res = await response.json()
        if (!response.ok) {
            toastr.error(res.message, "Error")
            enableSubmitButton()
     
        }
       
        console.log(res)
        enableSubmitButton()
        clearTicketFilterControl(); //reset filter control
        insertNewRow(response); //insert the newly added ticket to the tickets table
            toastr.success("You have successfully submitted a New Ticket - " + res.StringTicketId, "Success", {
                timeOut: 3000,
            });
    } catch (error) {
        console.error("Submission failed:", error);
        toastr.error("Something went wrong. Please contact your administrator.", "System Error");
    } finally {
        enableSubmitButton();
    }
}
async function submitTicketRequest() {
 

        var markupStr = $('#TicketDescription').summernote('code'); //get the data from the summernote
        NewTicket.OrgCode = $("#SelectTicketOrganization").val();
        NewTicket.LocCode = $("#SelectTicketLocation").val();
        NewTicket.DeptCode = $("#TicketDepartmentOptions").val();
        NewTicket.TicketSubject = $("#TicketSubject").val();
        NewTicket.TicketDescription = markupStr;
        NewTicket.TaskTypeCode = $("#TaskTypeCode").val();
        NewTicket.RequestedByCode = CurrentUser.USER_CODE;
        NewTicket.RequestedDate = CurrentUser.DATE_TODAY;
        NewTicket.RequestedByName = CurrentUser.EMP_NAME;
        NewTicket.RequestedByEmail = CurrentUser.EMAIL_ADDRESS;
        NewTicket.TicketAttachments = $("#TicketAttachments").val();
  
    const form = $("#createTicketForm");

    const fd = new FormData(form)
    fd.append('RequestedByCode', CurrentUser.USER_CODE);
    fd.append('RequestedDate', CurrentUser.DATE_TODAY);
    fd.append('RequestedByName', CurrentUser.EMP_NAME);
    fd.append('RequestedByEmail', CurrentUser.EMAIL_ADDRESS);
    console.log(fd);
    return;


        try {
            loadingSubmitButton(); //disable the submit button  
            //SUBMIT TICKET
            let response = await $.post(`${gBaseUrl}/create-ticket`, NewTicket);
            console.log(response);
            toastr.success("You have successfully submitted a New Ticket - " + response.StringTicketId, "Success", {
                timeOut: 3000,
            });
            clearTicketFilterControl(); //reset filter control
            insertNewRow(response);    //insert new ticket to table
            //CLOSE THE MODAL
            $("#createTicketModal").modal("hide");

            //UPLOAD TICKET ATTACHMENTS ON THE LOCAL SERVER MACHINE
            //await uploadTicketAttachments(response.TicketId);
            //RESET THE FORM
            await resetCreateTicketForm();
            //SEND EMAIL NOTIFICATION
            let emailParams = await generateTicketEmailParams(response);
            toastr.info("Sending email notification in progress", 'Success', {
                timeOut: 3000,
            });
            $("#newTicketId").empty().append(response.TicketId);






            let sentEmail = await $.post(`${gBaseUrl}/send-email-notification`, emailParams);

            loadingSendEmailButton();
            if (sentEmail) {
                toastr.success("Email notifications are successfully sent", 'Success', {
                    timeOut: 3000,
                });

            }
            else {
                toastr.error("Error while sending email notification", sentEmail, {
                    timeOut: 3000,
                });
            }


        } catch (err) {
            toastr.error("The server responded with an error - " + err, "Failed", {
                timeOut: 3000,
            });

        }
        enableSubmitButton();
    }

async function updateTicket(ticket) {
    let response = await $.put(`${gBaseUrl}/update-ticket`, ticket);
}
//GET ALL TICKET ATTACHMENTS
async function getTicketAttachments(ticketId) {

    

    return ticketId;
}
function loadTicketAttachments(ticketId) {

    //const $attachmentList = $("#attachmentList");
    //const $loading = $("#attachmentsLoading");
    //const $noAttachments = $("#noAttachments");
    //const $attachmentCount = $("#attachmentCount");

    //// Reset UI
    attachmentsPreviewContainer.empty();
    //$attachmentList.empty();
    //$noAttachments.addClass("d-none");
    //$loading.removeClass("d-none");
    //$attachmentCount.text("0");

    $.ajax({
        url: "/MyTickets/get-ticket-attachments",
        type: "GET",
        data: {
            ticketId: ticketId
        },
        success: function (response) {
            console.log(response)
            //$loading.addClass("d-none");

            if (!response.success || response.count === 0) {

                //$noAttachments.removeClass("d-none");

                return;
            }

            //$attachmentCount.text(response.count);
            handleFiles(response.files)
            //$.each(response.files, function (index, file) {
            //    //renderFilePreview(file)
            //    console.log(file)
            //    const fileIcon = getAttachmentIcon(file.fileType);

            //    const attachmentHtml = `
            //        <a href="${file.fileUrl}"
            //           target="_blank"
            //           class="list-group-item list-group-item-action">

            //            <div class="d-flex justify-content-between align-items-center">

            //                <div class="d-flex me-3">
            //                    <i class="${fileIcon} fs-4"></i>
            //                </div>

            //                <div class="d-flex">

            //                    <div class="text-truncate fw-semibold"
            //                         title="${escapeHtml(file.fileName)}">

            //                        ${escapeHtml(file.fileName)}

            //                    </div>

            //                    <small class="text-muted">
            //                        ${file.extension.toUpperCase()}
            //                    </small>

            //                </div>

            //                <div class="d-flex ms-auto">
            //                    <i class="bi bi-box-arrow-up-right"></i>
            //                </div>

            //            </div>

            //        </a>
            //    `;
            
            //    attachmentsPreviewContainer.append(attachmentHtml);
            //});
        },

        error: function (xhr) {

            $loading.addClass("d-none");

            $attachmentList.html(`
                <div class="alert alert-danger m-3 mb-0">
                    <i class="bi bi-exclamation-triangle me-2"></i>
                    Unable to load ticket attachments.
                </div>
            `);

            console.error("GetTicketAttachments error:", xhr);
        }
    });
}
function escapeHtml(value) {
    return $("<div>")
        .text(value)
        .html();
}
function getAttachmentIcon(fileType) {

    switch (fileType) {

        case "image":
            return "bi bi-file-earmark-image text-success";

        case "pdf":
            return "bi bi-file-earmark-pdf text-danger";

        case "word":
            return "bi bi-file-earmark-word text-primary";

        case "excel":
            return "bi bi-file-earmark-excel text-success";

        case "powerpoint":
            return "bi bi-file-earmark-ppt text-warning";

        case "archive":
            return "bi bi-file-earmark-zip text-secondary";

        case "text":
            return "bi bi-file-earmark-text text-secondary";

        default:
            return "bi bi-file-earmark text-secondary";
    }
}
// upload helper used by edit modal attachment input
async function uploadEditFiles(files) {
    if (!files || files.length === 0) return [];

    const results = [];

    for (const file of files) {
        const formData = new FormData();
        formData.append('file', file);

        // include ticketId if editing an existing ticket
        const ticketId = selectedTicket && selectedTicket.TicketId ? selectedTicket.TicketId : null;
        const url = ticketId ? `${gBaseUrl}/upload-ticket-attachments?ticketId=${ticketId}` : `${gBaseUrl}/upload-ticket-attachments`;

        try {
            const resp = await fetch(url, {
                method: 'POST',
                body: formData,
                credentials: 'same-origin', // keep cookies/auth
            });

            if (!resp.ok) {
                console.error('Upload failed', resp.statusText);
                continue;
            }

            const data = await resp.json();
            // endpoint returns array; get first saved entry
            const entry = Array.isArray(data) ? data[0] : data;
            results.push(entry);

            // render preview using returned SavedPath
            if (entry && entry.SavedPath) {
                renderEditFilePreviewFromPath(entry.SavedPath, entry.OriginalFileName);
            }
        } catch (err) {
            console.error("uploadEditFiles error:", err);
        }
    }

    // append to global selectedFiles if desired (we keep only metadata)
    if (!window.selectedFiles) window.selectedFiles = [];
    window.selectedFiles.push(...results);
    return results;
}

// small helper to render preview from server path
function renderEditFilePreviewFromPath(path, displayName) {
    const $container = $("#attachmentsPreviewContainer");
    const $item = $("<div>").addClass("file-preview-item");
    const $info = $("<div>").addClass("file-info");

    const ext = (displayName || path).split('.').pop().toLowerCase();
    const $icon = $("<img>").addClass("file-icon");

    if (["png", "jpg", "jpeg", "gif"].includes(ext)) {
        $icon.attr("src", path);
    } else if (ext === "pdf") {
        $icon.attr("src", "https://cdn-icons-png.flaticon.com/512/337/337946.png");
    } else {
        $icon.attr("src", "https://cdn-icons-png.flaticon.com/512/732/732220.png");
    }

    const $fileName = $(`
        <div>
            <div><strong>${displayName}</strong></div>
            <small class="text-muted">${path}</small>
        </div>
    `);

    $info.append($icon).append($fileName);

    const $remove = $("<button>")
        .addClass("btn btn-sm btn-outline-danger")
        .text("Remove")
        .on("click", function () {
            // Optionally: call backend to delete DB record / file. For now just remove UI and local selectedFiles.
            $(this).closest(".file-preview-item").remove();
        });

    $item.append($info).append($remove);
    $container.append($item);
}

