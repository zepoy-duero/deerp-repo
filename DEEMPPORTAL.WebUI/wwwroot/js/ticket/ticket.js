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
//var exampleTriggerEl = document.getElementById('AttachmentTooltip');
//var tooltip = bootstrap.Tooltip.getOrCreateInstance(exampleTriggerEl)
//var formData = new FormData();
$(async function () {  
   
    ticketsTable.bootstrapTable('showLoading');
    selectedFiles = [];
    let userData = await fetch(`/home/getUserDetails`);
    CurrentUser = await userData.json();
    console.log(CurrentUser)
    let dateToday = moment(CurrentUser.DATE_TODAY).format("MMM DD, YYYY");

    await getAllTicket();
    bindEventHandlers();
    await bindCorrespondenceHandlers();
    ticketsTable.bootstrapTable('hideLoading');
    //$('#requestedDateFilter').val(moment().format("YYYY"))
    $('#requestedDateFilter').val('2026').trigger('change');
    $("#openCreateTicketModal").attr('disabled', false);
    $('#TicketDescription').summernote({
        disableDragAndDrop: true,
        height: 150,
        focus: false,
        lang: 'en-US',
        lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
        toolbar: [
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
            //['insert', ['link', 'picture', 'video']],
        ],

    });
    setTimeout(function () {
        $('.dropdown-line-height .dropdown-item[data-value="0.2"]').trigger('click');
    }, 100);

    $("#summernoteInvalidFeedback").removeClass('d-none').addClass('d-none')
});

//-------FUNCTIONS------ 
function createManagerApprovalStatusOptions() {

    let options = `<option selected value="0">⏳ Pending</option>
                                <option value="1">✅ Approved</option>`;
    $("#approveByManager").empty().append(options)
}
async function getOrganizationOptions() {
    let organizations = await $.get(`support/employee-directory/getAllOrganizationList`);
    console.log(organizations)
    createTicketSelectOptions("select-organization", organizations);

    let selectedOrg = $("#select-organization").val();
       
    await getLocationOptions(selectedOrg)
}
async function getLocationOptions(selectedOrg) {
    const filteredLoc = await $.get(`support/employee-directory/getFilteredLocationList`, {
        OrgCode: selectedOrg
    });
    console.log(filteredLoc)
    createTicketSelectOptions("select-location", filteredLoc);
    let selectedLoc = $("#select-location").val();
    await getDepartmentOptions(selectedOrg, selectedLoc)
}
//OPTIONS FOR COMBOS
async function getDepartmentOptions(OrgCode, LocCode) {
    itr = 0;
    departmentOptions = await $.get(`${gBaseUrl}/get-ticket-department-options`, {
        OrgCode,
        LocCode
    });
    console.log(departmentOptions)
    createTicketSelectOptions('select-department', departmentOptions)
    
}
function createTicketSelectOptions(selector, data) {
    let html = ``;
    switch (selector) {
        case "select-organization":
            for (const item of data) {
                if (item.VALUE == 1) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
            }
            $("#select-organization").empty().append(html);
            break;
        case "select-location":

            for (const item of data) {
                if (item.VALUE == 1) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
            }
            $("#select-location").empty().append(html);
            break;
        case "select-department":
            for (const item of data) {
                if (item.VALUE == 9) html += `<option selected value="${item.VALUE}">${item.TEXT}</option>`
                else html += `<option value="${item.VALUE}">${item.TEXT}</option>`
            }
            $("#select-department").empty().append(html);
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

function generateTicketEmailParams(ticket) {
    let emailParams = {
        RequestedByName: ticket.RequestedByName,
        RequestedDate: ticket.RequestedDate,
        TicketSubject: ticket.TicketSubject,
        TicketDeptName: ticket.DeptName,
        TicketDescription: ticket.TicketDescription,
        TaskTypeName: ticket.TaskTypeName,
        TicketId: ticket.TicketId,
        //ManagerEmailId: ticket.ManagerEmailId,
        ManagerEmailId: "radhika@dahbashi.com",
        RequestedByEmail: ticket.RequestedByEmail,
        TicketNo: ticket.TicketNo,
        StringTicketId: ticket.StringTicketId,
      
       
        
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


function showPreview(event) {
    console.log(event.target.src);
  

    // Open the URL in a new tab
    window.open(event.target.src, '_blank'); 
    //$("#AttachmentView").attr('src', event.target.src);
    //$("#imageModal").modal("show");
}
function showTicketAttachmentList(attachments) {
    let attachmentList = '';
    const editUserSwitch = document.getElementById('toggleEditUserRequest');
    const isSwitchOn = editUserSwitch.checked;
    if (attachments.length >= 1) {
        attachments.forEach(function (i) {
            let imgThumbnail = '';
            console.log(i)
            if (i.FileExtension.trim() === 'pdf') imgThumbnail = `img/pdf-icon.png`;
            else if (i.FileExtension.trim() === 'xlsx' || i.FileExtension === 'xls') imgThumbnail = `img/excel-icon.png`;
            else if (i.FileExtension.trim() === 'docs') imgThumbnail = `img/docs-icon.png`;
            else if (i.FileExtension.trim() === 'txt') imgThumbnail = `img/textfile-icon.png`;
            else {
                imgThumbnail = `img/image-icon.png`;
            }
            attachmentList += `<div class="file-preview-item px-3" data-attachment-id="${i.AttachmentId}">
            <div class="file-info">
        
                 <img class="file-icon"
                   src="${imgThumbnail}">
           
                 <div>
                     <div>
                         <span style="cursor: pointer;" class="text-decoration-underline text-primary" onclick="viewAttachment(${i.AttachmentId})">
                           <strong>${i.FileName}</strong>
                         </span>                      
                     </div>
                        <small class="text-muted">${i.FileSize} KB</small>
                    </div>
                </div>
                <div>
                  <div class="btn-toolbar ${isSwitchOn ? `` : `d-none`}" role="toolbar" aria-label="Toolbar with button groups">
                      <div class="btn-group me-2" role="group" aria-label="Second group">
                         <button 
                           type="button" 
                           id="downloadAttachmentBtn"
                           class="btn btn-primary"
                           onclick="downloadAttachment(${i.AttachmentId})"
                            >
                             <i class="bi bi-download"></i>
                        </button>
                       </div>
                      <div class="btn-group me-2" role="group" aria-label="Third group">
                           <button onclick="deleteTicketAttachment(${i.AttachmentId})"  type="button" class="btn btn-danger">
                              <i class="bi bi-trash"></i>
                            </button>
                      </div>
                   
                  
                   </div>

                </div>
            </div>`
        })
    }
    $("#attachmentsPreviewContainer").empty().append(attachmentList);
}
async function viewAttachment(attachmentId) {
 
    try {
        // 1. Fetch the absolute latest list of attachments to find our specific file metadata
        // (This saves an extra API call since we can grab it from your existing endpoint structure)
        let fileData = await $.get(`${gBaseUrl}/get-attachment`, { AttachmentId: attachmentId });
        let mimeType = getMimeTypeByExtension(fileData.FileName)
        showTicketAttachmentPreview(fileData.FileAttachment, fileData.FileName, mimeType);
   

    } catch (error) {
        console.error("Error loading file preview:", error);
        alert("An error occurred while attempting to preview the file.");
    }
}
function getMimeTypeByExtension(filename) {
    // 1. Get the extension (e.g., "photo.PNG" -> "png")
    const extension = filename.split('.').pop().toLowerCase();

    // 2. Define the lookup dictionary
    const mimeTypes = {
        // Images
        'jpg': 'image/jpeg',
        'jpeg': 'image/jpeg',
        'png': 'image/png',
        'gif': 'image/gif',
        'svg': 'image/svg+xml',
        'webp': 'image/webp',

        // Documents
        'pdf': 'application/pdf',
        'doc': 'application/msword',
        'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'xls': 'application/vnd.ms-excel',
        'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'txt': 'text/plain',

        // Archives
        'zip': 'application/zip',
        'rar': 'application/vnd.rar'
    };

    // 3. Return the match, or a fallback type if not found
    return mimeTypes[extension] || 'application/octet-stream';
}



// Download file from img element data (already base64 encoded)
async function downloadAttachment(attachmentId) {
   
    const file = await $.get(`${gBaseUrl}/get-attachment`, { AttachmentId: attachmentId });
   
    let fileName = file.FileName;
    let dataUrl = `data:${getMimeTypeByExtension(file.FileName)};base64,${file.FileAttachment}`;
    if (!fileName || !dataUrl) {
        console.error("File name and data URL are required.");
        toastr.error("Missing file information.", "Error");
        return;
    }

    try {
        // Convert data URL to blob
        const response = await fetch(dataUrl);
        const blob = await response.blob();
        console.log(response)
        // Create download link
        const url = window.URL.createObjectURL(blob);
        console.log(url)
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);

        toastr.success(`Downloaded: ${fileName}`, "Success");
    } catch (error) {
        console.error("Download error:", error);
        toastr.error("Failed to download file.", "Error");
    }
}
function openBase64InNewTab(base64Data) {
    // Extract content and content type
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'image/png' });
    const blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl, '_blank');
}


function renderFilePreview(file) {
  console.log(file)
  const fileItem = document.createElement("div");
  fileItem.className = "file-preview-item"; 

  const fileInfo = document.createElement("div");
  fileInfo.className = "file-info";

  // File Icon or Thumbnail
  let iconElement;

  if (file.type === "image/png" || file.type === "image/jpeg" ) {
    iconElement = document.createElement("img");
      iconElement.className = "file-icon";
      iconElement.setAttribute('id', 'openPreviewModal');

      if (activeAttachmentContainer == 'add') {
          iconElement.src = URL.createObjectURL(file);
      }
      if (activeAttachmentContainer == 'edit')
      {
          iconElement.src = URL.createObjectURL(file);
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
            <small class="form-text text-muted">${(file.size / 1024).toFixed(2)} KB</small>
        `;

    // Progress Bar
  const progressBar = document.createElement("progress");
  progressBar.className = "file-progress-bar me-2"; // 'me-2' adds Bootstrap spacing on the right
  progressBar.value = 50;
  progressBar.max = 100;

    
  fileInfo.appendChild(iconElement);
   
  fileInfo.appendChild(fileName);

  // Remove Button
    const removeBtn = document.createElement("button");
    removeBtn.className = "btn btn-danger";
    const i = document.createElement("i")
    i.className = "bi bi-trash"
    //removeBtn.className = "";
    removeBtn.appendChild(i);
  //removeBtn.innerText = "Remove";

  removeBtn.addEventListener("click", () => {
    selectedFiles = selectedFiles.filter((f) => f !== file);
    fileItem.remove();
  });

    fileItem.appendChild(fileInfo);
    //fileItem.appendChild(await Html.RenderPartialAsync("~/Views/Ticket/TicketViewComponents/_ProgressCircle.cshtml"));
  fileItem.appendChild(removeBtn);

  
    if (activeAttachmentContainer == 'add') previewContainer.appendChild(fileItem);
    else attachmentsPreviewContainer.append(fileItem);
}

async function handleFiles(files) {
    console.log(typeof files)
    if (files.length > 10) {
        alert(`Please select not more than 10 files`);
        return;
    }
  for (let file of files) {   
    if (!isValidFileSize(file)) {
        alert(`Please select a file under 2MB`);
          continue;
      }
     
      //if (!checkIfDuplicateFile(file)) {
      //    toastr.error('File duplicated', 'Error')
      //    continue;
      //}

      file.TicketId = null;
      //selectedFiles.push(file);
      
      renderFilePreview(file);
    
    }
  console.log(selectedFiles)
    //showTicketAttachmentList(selectedFiles); 
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

function isValidFileSize(file) {
    if (file.size / (1024 * 1024) > 2) {
        return false;
    } else {
        return true;
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
async function mapFileToModel(file) {
    // Convert the file to a byte array (Base64 string)
    const base64String = await convertFileToBase64(file);

    // Strip the data URL prefix (e.g., "data:image/png;base64,") to get pure base64
    const pureBase64 = base64String.split(',')[1];

    // Map directly to your C# Model properties
    const fileModel = {
        FileName: file.name.split('.').slice(0, -1).join('.'), // Name without extension
        FileExtension: '.' + file.name.split('.').pop(),       // e.g., ".png"
        FileSize: file.size,                                   // Size in bytes
        FileAttachment: pureBase64                             // Maps to byte[]
    };
    return fileModel;
}
// Helper function to read file as Base64
async function convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
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

async function deleteTicketAttachment(attachmentId) {
    console.log(attachmentId)
    if (!attachmentId) {
        toastr.error("Missing attachment ID.", "Error");
        return false;
    }

    // Confirm before delete
    if (!confirm("Are you sure you want to delete this attachment?")) {
        return false;
    }

    try {
        const response = await $.ajax({
            url: `${gBaseUrl}/delete-attachment?attachmentId=${attachmentId}`,
            type: 'POST'
        });

        if (response.success) {
            toastr.success("Attachment deleted successfully.", "Success");
            const element = document.querySelector(`[data-attachment-id="${attachmentId}"]`);
            if (element) {
                element.remove();
            }
            // Remove UI element
            //$(`[data-attachment-id="${attachmentId}"]`).fadeOut(300, function () {
            //    $(this).remove();
            //});

            return true;
        } else {
            toastr.error(response.message || "Failed to delete attachment.", "Error");
            return false;
        }
    } catch (error) {
        console.error("Delete attachment error:", error);
        toastr.error("An error occurred while deleting the attachment.", "Error");
        return false;
    }
}
function insertNewRow(response) {

        ticketsTable.bootstrapTable('insertRow', {
            index: 0,
            row: response,

        })
        ticketsTable.bootstrapTable('uncheck', 1)
        ticketsTable.bootstrapTable('check', 0)
    }
async function getCreateTicketSelectOptions() {
    try {
        await getOrganizationOptions();
        //await getLocationOptions($("#SelectTicketOrganization").val());
        //await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());
        await getTypeOptions(1, 1, 9);
        await getModuleOptions(1, 1, 9);
    } catch(error) {
        toastr.error("An error occured while fetching data from the server", "Error");
    }
   
} 

async function resetTicketDescription() {
   
    $('#TicketDescription').summernote({
        disableDragAndDrop: true,
        height: 150,
        focus: false,
        lang: 'en-US',
        lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
        toolbar: [
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
            //['insert', ['link', 'picture', 'video']],
        ],

    });
    setTimeout(function () {
        $('.dropdown-line-height .dropdown-item[data-value="0.2"]').trigger('click');
    }, 100);
  
    $("#summernoteInvalidFeedback").removeClass('d-none').addClass('d-none')
    return 1;
}

async function resetCreateTicketForm() {
    await getCreateTicketSelectOptions();
    selectedFiles = [];
    $('#TicketDescription').summernote('code', '');
    $("#createTicketForm").removeClass('was-validated').trigger('reset');
    $("#TaskTypeCode").removeClass("is-valid").removeClass("is-invalid");
    $("#select-organization").removeClass("is-valid").removeClass("is-invalid");
    $("#select-location").removeClass("is-valid").removeClass("is-invalid");
    $("#select-department").removeClass("is-valid").removeClass("is-invalid");
    $("#TicketSubject").val("").removeClass("is-valid").removeClass("is-invalid");
   
   
    $("#RequestedByName").empty().append(CurrentUser.EMP_NAME);
    $("#RequestedDate").empty().append(moment(CurrentUser.DATE_TODAY).format("DD-MM-YYYY"));
    $("#TicketAttachments").val(null);
    //resetTicketDescription();
    //$("#summernoteInvalidFeedback").removeClass('d-none').addClass('d-none')
    $("#previewContainer").empty();
    $('#TicketDescription').summernote({
        disableDragAndDrop: true,
        height: 150,
        focus: false,
        lang: 'en-US',
        lineHeights: ['0.2', '0.3', '0.4', '0.5', '0.6', '0.8', '1.0', '1.2', '1.4', '1.5', '2.0', '3.0'],
        toolbar: [
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['height', ['height']]
            //['insert', ['link', 'picture', 'video']],
        ],

    });
    setTimeout(function () {
        $('.dropdown-line-height .dropdown-item[data-value="0.2"]').trigger('click');
    }, 100);

    $("#summernoteInvalidFeedback").removeClass('d-none').addClass('d-none')
    $("#TicketSubject").trigger('focus');
    enableSubmitButton()
}
//configure the parameters

function getCreateTicketParams() {
    // Create a new FormData instance
    const fd = new FormData();
    // Define the raw parameter object
    var formData = {
        OrgCode: $('#select-organization').val(),
        LocCode: $('#select-location').val(),
        DeptCode: $('#select-department').val(),
        TaskTypeCode: $('#TaskTypeCode').val(),
        TicketSubject: $('#TicketSubject').val(),
        TicketDescription: $('#TicketDescription').summernote('code'),
        TicketAttachments: $('#TicketAttachments').val(),
    };
    console.log(formData)
    // Add extra user details
    formData.RequestedByCode = CurrentUser.USER_CODE;
    formData.RequestedDate = CurrentUser.DATE_TODAY;
    formData.RequestedByName = CurrentUser.EMP_NAME;

    // Append each property to the FormData object
    for (const key in formData) {
        if (formData.hasOwnProperty(key)) {
            // Handle null/undefined values safely by converting to empty strings
            fd.append(key, formData[key] !== null && formData[key] !== undefined ? formData[key] : '');
        }
    }

    return fd;
}


function loadingSubmitButton() {
        $("#submitTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Submitting...`);
    }
function loadingSendEmailButton() {
        $("#submitTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending email...`);
    }
function loadingUploadAttachmentButton() {
        $("#submitTicket").prop('disabled', true).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Uploading Attachment...`);
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
function checkIfDuplicateFile(file) {
    let duplicated = false;
    selectedFiles.forEach(function (i) {
        if (file.name == i.name && file.size == i.size) {
            duplicated = true;
            return false;
        } else return true;
    })
    return duplicated;
}
async function uploadTicketAttachments(TicketId) {
    if (selectedFiles.length >= 1) {
        loadingUploadAttachmentButton();
        const data = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            // Use the exact same key name to append multiple files as an array
            data.append('TicketAttachments', file);
        });
        data.append("TicketId", TicketId);
        try {
            //let response = await $.post(`${gBaseUrl}/upload-ticket-attachments?TicketId=${TicketId}`,data)
            let response = await $.ajax({
                url: 'MyTickets/upload-ticket-attachments',
                type: 'POST',
                data: data,
                contentType: false,
                processData: false
            });

            if (response) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error(error);
            toastr.error('Upload failed: ' + error.statusText);
            return false;
        } finally {
            enableSubmitButton();
        }
    } else {
        enableSubmitButton();
        return true;
    }
    
}
async function sendEmailNotification(params) {
 
    return await $.post(`${gBaseUrl}/send-email-notification`, params );   
}
//function getCreateTicketParams() {
//    const formElement = $('#createTicketForm')[0] //
//    let fd = new FormData(formElement)//generate the formData parameter
//    console.log()
//    return fd;
//}
async function notifyByEmail(newTicket) {
    loadingSendEmailButton();
    let sentEmail = await sendEmailNotification(generateTicketEmailParams(newTicket))//send email notification request
    if (sentEmail) {
        toastr.success("Email notifications are successfully sent", 'Success', {
            timeOut: 3000,
        });
    } else {
        toastr.error("Error while sending email notification", sentEmail, {
            timeOut: 3000,
        });
    }
    return sentEmail;
}
async function uploadAttachments(newTicket) {
  
    //send attachments upload request
   
        try {
            loadingUploadAttachmentButton();
            let uploaded = await uploadTicketAttachments(newTicket.TicketId); //upload the selected ticket attachment files
            if (uploaded) {
                toastr.success("You have successfully uploaded the attachments for the Ticket - " + newTicket.StringTicketId, "Success", {
                    timeOut: 3000,
                });
                $("#createTicketModal").modal('hide');
                return uploaded;
            } else {
                return;
            }
        } catch (error) {
            toastr.error("Something went wrong. Please contact your administrator.", "System Error");
            disableSubmitButton()
            return;
        }

}
async function submitNewTicket() {
    loadingSubmitButton();
    let params = getCreateTicketParams();
    console.log(params)
    //return;
    let newTicket = await createTicket(params);//send create ticket request
    clearTicketFilterControl();
    insertNewRow(newTicket);
        if (!newTicket) {
            toastr.error(newTicket.message, "Error")
            return;
        } else {
            toastr.success("You have successfully submitted a New Ticket - " + newTicket.StringTicketId, "Success", {
                timeOut: 3000,
            });
            let emailSent = await notifyByEmail(newTicket); //send email notification
                if (!emailSent) {
                    return;
                }
                else {
                    let attachmentsUploaded = await uploadAttachments(newTicket); //upload the ticket attachments
                    if (attachmentsUploaded) {
                        $("#createTicketModal").modal('hide');
                        return;
                    }
                }
        }
}
async function createTicket(params){
    const response = await fetch(`${gBaseUrl}/create-ticket`, {
        method: "POST",
        body: params
    });
    var res = await response.json()
   
    return res;
}
async function updateTicket(ticket) {
    let response = await $.put(`${gBaseUrl}/update-ticket`, ticket);
}
//GET ALL TICKET ATTACHMENTS
//async function getTicketAttachments(ticketId) {

    

//    return ticketId;
//}
async function loadTicketAttachments(ticketId) {

    $.ajax({
        url: "/MyTickets/get-ticket-attachments",
        type: "GET",
        data: {
            ticketId: ticketId
        },
        success: function (response) {
    
                console.log(response)
            showTicketAttachmentList(response)
            //handleFiles(response)
      
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
// ============================================================
// Ticket Attachment File Validation
// ============================================================

// Allowed file extensions
const allowedFileExtensions = [
    ".jpg",
    ".jpeg",
    ".png",

    ".pdf",
    ".txt",
    ".doc",
    ".docx",
    ".xls",
    ".xlsx",
    ".csv"
];

// Explicitly blocked extensions
const blockedFileExtensions = [
    ".exe",
    ".bat",
    ".sh",
    ".cmd",

    ".php",
    ".js",
    ".html",
    ".htm",
    ".aspx"
];

// Allowed MIME types
const allowedMimeTypes = [
    "image/jpeg",
    "image/png",

    "application/pdf",
    "text/plain",

    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

    "text/csv",
    "application/csv"
];


/**
 * Validate a single attachment file
 *
 * @param {File} file
 * @returns {Object}
 */
function validateAttachment(file) {

    if (!file) {
        return {
            valid: false,
            message: "No file was selected."
        };
    }

    // Get file extension
    const fileName = file.name || "";
    const extension = "." + fileName
        .split(".")
        .pop()
        .toLowerCase();

    // --------------------------------------------------------
    // 1. Always block explicitly prohibited extensions
    // --------------------------------------------------------

    if (blockedFileExtensions.includes(extension)) {
        return {
            valid: false,
            message: `The file "${fileName}" is not allowed. Executable and code files cannot be uploaded.`
        };
    }

    // --------------------------------------------------------
    // 2. Check if extension is in the allowed list
    // --------------------------------------------------------

    if (!allowedFileExtensions.includes(extension)) {
        return {
            valid: false,
            message: `The file "${fileName}" is not an allowed attachment type.`
        };
    }

    // --------------------------------------------------------
    // 3. Validate MIME type
    // --------------------------------------------------------

    if (file.type && !allowedMimeTypes.includes(file.type.toLowerCase())) {
        return {
            valid: false,
            message: `The file "${fileName}" has an invalid file type.`
        };
    }

    // --------------------------------------------------------
    // File is valid
    // --------------------------------------------------------

    return {
        valid: true,
        message: ""
    };
}


/**
 * Validate multiple selected files
 *
 * @param {FileList|Array} files
 * @returns {Object}
 */
function validateAttachmentFiles(files) {

    const validFiles = [];
    const invalidFiles = [];

    Array.from(files).forEach(function (file) {

        const result = validateAttachment(file);

        if (result.valid) {
            validFiles.push(file);
        } else {
            invalidFiles.push({
                file: file,
                message: result.message
            });
        }

    });

    return {
        valid: invalidFiles.length === 0,
        validFiles: validFiles,
        invalidFiles: invalidFiles
    };
}
function showTicketAttachmentPreview(base64Data, fileName, mimeType, isLocalFile = false) {
    if (!base64Data) return;

    // 1. Convert Base64 string from VARBINARY column into a safe local blob URL
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: mimeType });
    const fileUrl = URL.createObjectURL(blob);

    // 2. Extract extension
    const fileExtension = fileName.split('.').pop().toLowerCase();
    console.log(fileExtension)
    // 3. Update modal title with current file name
    $('#preview-filename').text('Preview: ' + fileName);

    let previewHtml = null;

    // 4. Route based on File Type
    if (fileExtension === 'pdf') {
        // PDF Handling (Native browser rendering)
        previewHtml = `<iframe src="${fileUrl}" class="w-100 h-100" style="border:none; min-height: 500px;"></iframe>`;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
        // Image Handling (Fixed syntax error on class quote closure)
        previewHtml = `<img src="${fileUrl}" class="img-fluid" style="max-height: 100%; object-fit: contain;" alt="Preview">`;
    } else {
        // Fallback for unhandled files
        previewHtml = `
            <div class="text-center p-5">
                <h5>Preview unavailable for this file format (.${fileExtension})</h5>
                <a href="${fileUrl}" download="${fileName}" class="btn btn-secondary mt-2">Download File Instead</a>
            </div>`;
    }

    // Inject into DOM
    $('#file-preview-zone').empty().html(previewHtml);

    // Open the modal
    $("#editTicketModal").modal('hide');
    $('#filePreviewModal').modal('show');

    // Memory Cleanup Event Hook
    $('#filePreviewModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        // ONLY revoke if it's a locally generated Blob URL to prevent breaking DB download links
        if (isLocalFile && fileUrl.startsWith('blob:')) {
            URL.revokeObjectURL(fileUrl);
        }
        $('#file-preview-zone').empty();
    });
}

