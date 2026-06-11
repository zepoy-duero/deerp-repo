const gBaseUrl = "/MyTickets";
const homeUrl = "/home";

const TicketAttachments = document.getElementById("TicketAttachments");
const previewContainer = document.getElementById("previewContainer");
const dropZone = document.getElementById("dropZone");
let isEditingRequestedBy = false;
let selectedFiles = [];
let originalData = [];
var NewTicketId = null;
let NewTicket = {
    DeptCode:9,
    TicketNo: null,
    RequestedDate: null,
    TicketDescription: '',
    TicketSubject: null,
    TaskTypeCode: null,
}
let EditTicket = {
    RequestedByCode: null,
    DeptCode: null,
    TicketNo: null,
    RequestedByName: null,
    RequestedDate: null,
    TicketSubject: null,
    StartDate: null,
    TicketDescription: null,
    TicketDuration: null,
    TicketDurationUnit: null,
    FinishDate: null,
    AssignedToCode: null,
    AssignedToName: null,
    ModuleName: null,
    PriorityCode: null,
    StatusCode: null,
    TaskTypeCode: null,
    ApproveByManager: null,
    IsManagementApproval: null,
    UpdatedBy: null,
    UpdatedDate: null,
    ReviewedBy: null,
    ReviewedDate: null,
    Remarks: null
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
    "#DeptCode",
    "#TicketRequestType",
    "#TIcketSubject",
    "#TicketDescription",
];
const ticketsTable = $("#ticketsTable");
let CurrentUser = null;

$(async function () {

    let userData = await fetch(`/home/getUserDetails`);
    CurrentUser = await userData.json();
    let dateToday = moment(CurrentUser.DATE_TODAY).format("MMM DD, YYYY");
    $("#RequestedDate").empty().append(dateToday);
    await getAllTicket()

    $('#TicketDescription').summernote({
        height: 200,
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],

            ['insert', ['link']],
            ['view', ['fullscreen']],
        ],
    });
    //----------EVENT LISTENERS----------------------------

   
    //------ROW CLICKED--------------
    ticketsTable.on("click-row.bs.table", async function (e, row, $element, field) {
        await getAllSelectOptions();

        $("#editTicketModal").modal("toggle");
        $("#editTicketModalTitle").empty().append('Update Ticket - ' + row.StringTicketId + " " + row.TicketSubject);
        $("#editTicketSubject").val(row.TicketSubject);
        $("#editTicketDescription").val(row.TicketDescription);
        $("#editUserDropdownSelect").html(row.RequestedByName);
        $("#assigneeDropdownSelect").html(row.AssignedToName ? row.AssignedToName : 'Not yet assigned');
        $("#dateRequested").empty().append(moment(row.RequestedDate).format("LL"));
        $("#editRequestedDate").val(row.RequestedDate);
        
        $('#editTicketDescription').summernote({
            height: 200,
            lang: 'en-US',
            toolbar: [
                ['style', ['style']],
                ['font', ['bold', 'underline', 'clear']],
                ['fontname', ['fontname']],
                ['fontsize', ['fontsize']],
                ['color', ['color']],
                ['para', ['ul', 'ol', 'paragraph']],
                ['table', ['table']],
                ['insert', ['link', 'picture', 'video']],
                ['view', ['fullscreen']],

            ],

        });
    });
    //--------------------------------
    //DATE RANGE PICKER
    $('input[name="datefilter"]').daterangepicker({
        autoUpdateInput: false,
        locale: {
            cancelLabel: 'Clear'
        }
    });

    $('input[name="datefilter"]').on('apply.daterangepicker', function (ev, picker) {
        $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
    });

    $('input[name="datefilter"]').on('cancel.daterangepicker', function (ev, picker) {
        $(this).val('');
    });
    // APPLY FILTER
    $("#btnFilter").on("click", function () {
        let searchText = $('#customSearch').val().toLowerCase();
        let fromDate = $("#dateFrom").val();
        let toDate = $("#dateTo").val();

        let filtered = originalData.filter((item) => {
            // 🔍 TEXT SEARCH (all fields)
            let matchText = Object.values(item).some((val) =>
                String(val).toLowerCase().includes(searchText),
            );

            // 📅 DATE FILTER
            let itemDate = item.dateSubmitted;

            let matchDate = true;

            if (fromDate && itemDate < fromDate) matchDate = false;
            if (toDate && itemDate > toDate) matchDate = false;

            return matchText && matchDate;
        });

        ticketsTable.bootstrapTable("load", filtered);
    });

    // RESET FILTER
    $("#btnResetFilter").on("click", function () {
        ticketsTable.bootstrapTable("clearFilterControl");
    });

    // COLUMN TOGGLE
    $(".toggle-column").on("change", function () {
        let field = $(this).data("field");

        $(this).is(":checked")
            ? ticketsTable.bootstrapTable("showColumn", field)
            : ticketsTable.bootstrapTable("hideColumn", field);
    });

    // Select item
    $("#userList").on("click", ".dropdown-item", function () {
        let text = $(this).text();
        let value = $(this).data("value");

        $("#dropdownSelect").text(text);
        $("#selectUser").val(value);

        $(".dropdown-menu").removeClass("show");
    });

    // Search filter
    $("#userSearchInput").on("keyup", function () {
        let search = $(this).val().toLowerCase();

        $("#userList li").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(search));
        });
    });
    $("#assigneeList").on("click", ".dropdown-item", function () {
        let text = $(this).text();
        let value = $(this).data("value");

        $("#dropdownSelect2").text(text);
        $("#selectAssignee").val(value);

        $(".dropdown-menu").removeClass("show");
    });

    // Search filter
    $("#assigneeSearchInput").on("keyup", function () {
        let search = $(this).val().toLowerCase();

        $("#assigneeList li").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(search));
        });
    });
    $("#moduleList").on("click", ".dropdown-item", function () {
        let text = $(this).text();
        let value = $(this).data("value");

        $("#dropdownSelect3").text(text);
        $("#selectModule").val(value);

        $(".dropdown-menu").removeClass("show");

    });
    // Search filter
    $("#moduleSearchInput").on("keyup", function () {
        let search = $(this).val().toLowerCase();

        $("#moduleList li").each(function () {
            let text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(search));
        });
    });

    $("#dateTo").on("change", function () {
        if ($("#dateTo").val() && $("#dateFrom").val()) {
            $("#dateFilter").removeClass("disabled");
        } else {
            $("#dateFilter").addClass("disabled");
        }
    });
    $("#createTicketModal").on('show.bs.modal',async function (event) {
        resetCreateTicketForm()
        await getDepartments(1, 1);
        //get options for requested by select component
        let RequestedByNameOptions = await getTicketRequestedByOptions();
        $("#SelectRequestedByName").empty().append(RequestedByNameOptions);

        await getTypeOptions(1, 1, 9);
        await getModuleOptions(1, 1, 9);
        await getTypeOptions(1, 1, 9);
    });
     
    $("#dropZone").on("click", () => { TicketAttachments.click() });

    // File input change
    $(TicketAttachments).on("change", (e) => {
        handleFiles(e.target.files);
    });
    // Drag events
    $("#dropZone").on("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    $("#dropZone").on("dragleave", () => {
        dropZone.classList.remove("dragover");
    });

    $("#dropZone").on("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        handleFiles(e.dataTransfer.files);
    });
    $(window).on("paste", (e) => {
        // Get items from the clipboard (using originalEvent for jQuery compatibility)
        const items = (e.originalEvent || e).clipboardData.items;
        const pastedFiles = [];

        for (const item of items) {
            if (item.type.indexOf("image") !== -1) {
                const blob = item.getAsFile();
                if (blob) {
                    // Wrap the blob in a File object to give it a name and timestamp
                    const file = new File([blob], `screenshot_${Date.now()}.png`, {
                        type: blob.type,
                    });
                    pastedFiles.push(file);
                }
            }
        }

        if (pastedFiles.length > 0) {
            handleFiles(pastedFiles);
        }
    });


    $("#isMajorChange").on("change", function () {
        $("#managementApproval").toggleClass("d-none", !this.checked);
    });

    // Search as user types
    $("#employeeSearch").on("keyup", function () {
        console.log("enter");
        let keyword = $(this).val().toLowerCase();

        if (keyword.length === 0) {
            $("#employeedropdown").hide();
            return;
        }

        let filtered = employees.filter((emp) =>
            emp.name.toLowerCase().includes(keyword),
        );

        renderDropdown(filtered);
        $("#employeedropdown").show();
    });

    $("#viewTicketDetailsBtn").on("click", () => {
        $("#editTicketModal").modal("toggle");
    });

    $("#submitTicket").on("click", async function (event) {
        
        disableSubmitButton(); //disable the submit button   
        event.preventDefault()


        var markupStr = $('#TicketDescription').summernote('code'); //get the data from the summernote

        var forms = document.querySelectorAll('.needs-validation'); //select all elements that has '.needs-validation'

        NewTicket.TicketSubject = $("#TicketSubject").val();
        NewTicket.TicketDescription = markupStr;
        NewTicket.TaskTypeCode = $("#TaskTypeCode").val();
        NewTicket.RequestedByCode = CurrentUser.USER_CODE;
        NewTicket.RequestedDate = $("#RequestedDate").val();
        NewTicket.RequestedByName = CurrentUser.EMP_NAME;

        Array.prototype.slice.call(forms).forEach(async function (form) {
                if (!form.checkValidity()) {
                    alert("Validation Failed")
                    toastr.error("Please fill all the required fields", "Ticket");
                }
                else {
                    try {
                        let response = await $.post(`${gBaseUrl}/create-ticket`, NewTicket);

                        let emailParams = await generateTicketEmailParams(response[0]);

                        $("#newTicketId").empty().append(response[0].TicketId);
                        console.log(response)
                        ticketsTable.bootstrapTable("clearFilterControl");
                        insertNewRow(response); //insert new ticket to table
                      
                        toastr.success("You have successfully submitted a New Ticket - " + response[0].StringTicketId, "Success");
                      
                        
                       
                        let sentEmail = await $.post(`${gBaseUrl}/send-email-notification`, emailParams);

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
                    
                    $("#createTicketModal").modal("hide");
                    //form.classList.add('was-validated')
                    //$("#successAlert").removeClass("d-none");

                    //setTimeout(function () {
                    //  $("#successAlert").addClass("d-none");
                    //}, 3000);
                    //$("#submitTicket").empty().append('Submit Ticket').removeClass('disabled');

                }
            });
    
    });
        // PREVIEW FILE
     $("#btnPreview").on("click", function () {
            let fileName = $(this)
                .closest(".attachment-item")
                .find(".file-name")
                .text();
            let fileUrl = "/img/" + fileName;

            $("#previewImage, #previewPdf, #previewOther").addClass("d-none");

            if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
                $("#previewImage").attr("src", fileUrl).removeClass("d-none");
            } else if (fileName.match(/\.(pdf)$/i)) {
                $("#previewPdf").attr("src", fileUrl).removeClass("d-none");
            } else {
                $("#previewOther").removeClass("d-none");
            }
            $("#attachmentPreviewContainer").toggleClass("d-none");
        });

        // DELETE FILE
    $(".btnDelete").on("click", function () {
            if (!confirm("Delete this file?")) return;

            let item = $(this).closest(".attachment-item");
            let fileName = item.find(".file-name").text();

            $.post("/Attachment/Delete", { fileName: fileName }, function () {
                item.remove();
            });
        });

        // RENAME FILE
    $(".btnRename").on("click", function () {
            let item = $(this).closest(".attachment-item");

            let newName = item.find(".file-input").val();

            $.post(
                "/Attachment/Rename",
                {
                    oldName: item.find(".file-name").text(),
                    newName: newName,
                },
                function () {
                    item.find(".file-name").text(newName);

                    alert("Renamed successfully!");
                },
            );
    });
    $("#createTicketModal").on("hidden.bs.modal", function (event) {
        resetCreateTicketForm();
        saveEditRequestedBy();
        
    });
    
   
});

//-------FUNCTIONS------  
async function getAllSelectOptions() {
    try {
        await getUserOptions()
        await getAssigneeOptions()
        await getPriorityOptions();
        await getModuleOptions();
        await getTypeOptions()
        await getDurationUnitOptions();
        await getStatusOptions();
      
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
function toggleEditRequestedBy() {

    isEditingRequestedBy = !isEditingRequestedBy;

    if (isEditingRequestedBy) {

        // Switch to Edit Mode
        $("#DisplayRequestedByName").addClass("d-none");
        $("#SelectRequestedByName").removeClass("d-none");
        $("#editBtn").addClass("d-none");
        $("#checkBtn").removeClass("d-none");



    } else {

        $("#DisplayRequestedByName").removeClass("d-none")
            .empty()
            .append($("#SelectRequestedByName").val());
        $("#SelectRequestedByName").addClass("d-none");
        $("#editBtn").removeClass("d-none");
        $("#checkBtn").addClass("d-none");
       
    }
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
async function getDepartments(OrgCode, LocCode) {
    itr = 0;
    departmentOptions = await $.get(`${gBaseUrl}/get-ticket-department-options`, {
        OrgCode,
        LocCode
    });
    console.log(departmentOptions)
  let options = "";
  
    while (itr < departmentOptions.length) {
        options += `<option value="${departmentOptions[itr].VALUE}"> ${departmentOptions[itr].TEXT} </option>`;
        itr++;
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
async function getAssigneeOptions(org_code, loc_code, dept_code) {
  let usersOptions = await $.get(`${gBaseUrl}/get-assignee-options`, {
    org_code,
    loc_code,
    dept_code,
  });
  let options = "";
    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<a onclick="" class="dropdown-item" data-value="${i.VALUE}"> ${i.TEXT} </a >`;
        }
  });

    $("#i").empty().append(options);

   
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

    $("#selectPriority").empty().append(options);
    $("#filterPriority").append(options);
}
async function getModuleOptions(OrgCode, LocCode, DeptCode) {
  let moduleOptions = await $.get(`${gBaseUrl}/get-module-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
  let options = "";
  moduleOptions.forEach(function (i) {
    options += `<li class="dropdown-item text-truncate" data-value="${i.VALUE}">${i.TEXT}</li>`;
  });

  $("#moduleList").empty().append(options);
}
async function getDurationUnitOptions() {
  let durationUnitOptions = await $.get(
    `${gBaseUrl}/get-duration-unit-options`,
  );
  let options = "";
  durationUnitOptions.forEach(function (i) {
    options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
  });

    $("#selectDurationUnit").empty().append(options);
 
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

    $("#selectStatus").empty().append(options);
    $("#filterStatus").append(options);
}
async function getTypeOptions(OrgCode, LocCode, DeptCode) {
  let typeOptions = await $.get(`${gBaseUrl}/get-type-options`, {
    OrgCode,
    LocCode,
    DeptCode,
  });
    let options = "<option value='null' class='active'>Request Type </option>";
  console.log(typeOptions);
  typeOptions.forEach(function (i) {
    options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
  });
    $("#TaskTypeCode").empty().append(options);

    $("#filterType").empty().append(options);
}
async function getAllTicket() {
    ticketsTable.bootstrapTable('showLoading');
    
    const DeptCode = null;
  
    let data = await $.get(`${gBaseUrl}/get-tickets`, { DeptCode: DeptCode });
    console.log(data);
   
    showTotalTicketsRecords(data.length);
    window.originalData = data;
    
    ticketsTable.bootstrapTable("load", data)
        .bootstrapTable('hideLoading');

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
            url: '/Upload/SaveFile', // Replace with your actual backend URL
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
        row: response[0],
       
    })
   ticketsTable.bootstrapTable('check', 0)
}
function resetCreateTicketForm() {
    $("#DisplayRequestedByName").empty().append(CurrentUser.EMP_NAME);
    $("#TicketSubject").val("").removeClass("is-valid").removeClass("is-invalid");
    $('#TicketDescription').summernote('reset');
    $("#TaskTypeCode").removeClass("is-valid").removeClass("is-invalid");
    $("#TicketDepartment").removeClass("is-valid").removeClass("is-invalid");
    enableSubmitButton();
}
function disableSubmitButton() {
    $("#submitTicket").empty().addClass('disabled').append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Loading...`)
}
function enableSubmitButton() {
    $("#submitTicket").empty().removeClass('disabled').append("Submit Ticket")
}
function requestedBySelected(event) {
    console.log(event.target.dataset.value);
    console.log(event.target.innerHTML);
    $("#filterRequestedByName").empty().append(filterRequestedByName)
}
function departmentSelected(event) {

    NewTicket.DeptCode = event.target.dataset.value;
    NewTicket.OrgCode = 1;
    NewTicket.LocCode = 1;
    $("#departmentDropdownSelect").empty().append(event.target.innerHTML)
}
async function validateFormData() {
    inputSelectors.forEach(selector => {
        const $el = $(selector);

        // Remove old validation state/tooltips
        $el.removeClass("is-invalid");
        const oldTooltip = bootstrap.Tooltip.getInstance($el[0]);
        if (oldTooltip) oldTooltip.dispose();

        if ($el.val().trim() === "") {
            validated = false;
            $el.addClass("is-invalid");

            // 3. Create the white tooltip with custom message
            new bootstrap.Tooltip($el[0], {
                title: validationConfig[selector],
                placement: "right",
                trigger: "manual",
                customClass: "white-tooltip"
            }).show();
        } else {
            $el.addClass("is-valid");
        }
    });

    return validated;
}