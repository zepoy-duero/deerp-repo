const gBaseUrl = "/MyTickets";
const homeUrl = "/home";

const TicketAttachments = document.getElementById("TicketAttachments");
const previewContainer = document.getElementById("previewContainer");
const dropZone = document.getElementById("dropZone");
let selectedFiles = [];
let originalData = [];
var userData = null;
var NewTicketId = null;
let NewTicket = {
    DeptCode:9,
    TicketNo: null,
    RequestedDate: moment().format('YYYY-MM-DD, h:mm:ss a'),
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
    "#TicketRequestType": "Choose the type of your request.",
    "#TIcketSubject": "Please indicate the ticket subject.",
    "#TicketDescription": "Describe the complete details.",
};
const inputSelectors = [
    "#DeptCode",
    "#TicketRequestType",
    "#TIcketSubject",
    "#TicketDescription",
];


$(async function () {
    //await getTicketData();
    await initTicket();
    await getAllTicket();
    await getAssigneeOptions(1, 1, 9);
    await getPriorityOptions(1, 1, 9);
    await getDurationUnitOptions();
    await getStatusOptions(1, 1, 9);

    await getDepartments();
    await getUserOptions();
    await getTypeOptions(1, 1, 9);
    await getModuleOptions(1, 1, 9);
    
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
    $('#filterRequestedByName').on('change', function () {
        $("#table").bootstrapTable('filterBy', {
            RequestedByName: $('#filterType').val() ? $('#filterType').val() : '',
            TaskTypeCode: $('#filterType').val(),
            StatusCode: $('#filterStatus').val(),
            PriorityCode: $('#filterPriority').val()
        })
    })
    $('#filterType').on('change',function () {
        $("#table").bootstrapTable('filterBy', {
            RequestedByName: $('#filterType').val(),
            TaskTypeCode: $('#filterType').val(),
            StatusCode: $('#filterStatus').val(),
             PriorityCode: $('#filterPriority').val()
        })
    })
    $('#filterStatus').on('change', function () {
        $("#table").bootstrapTable('filterBy', {
            RequestedByName: $('#filterType').val(),
            TaskTypeCode: $('#filterType').val(),
            StatusCode: $('#filterStatus').val(),
            PriorityCode: $('#filterPriority').val()
        })
    })
    $('#filterPriority').on('change', function () {
        $("#table").bootstrapTable('filterBy', {
            RequestedByName: $('#filterType').val(),
            TaskTypeCode: $('#filterType').val(),
            StatusCode: $('#filterStatus').val(),
            PriorityCode: $('#filterPriority').val()
        })
    })
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
        //let searchText = $('#customSearch').val().toLowerCase();
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

        $("#table").bootstrapTable("load", filtered);
    });

    // RESET FILTER
    $("#btnResetFilter").on("click", function () {
        $("#customSearch").val("");
        $("#dateFrom").val("");
        $("#dateTo").val("");

        $("#table").bootstrapTable("load", originalData);
    });

    // 🔥 LIVE SEARCH (optional)
    $("#customSearch").on("keyup", function () {
        $("#btnFilter").click();
    });

    // COLUMN TOGGLE
    $(".toggle-column").on("change", function () {
        let field = $(this).data("field");

        $(this).is(":checked")
            ? $("#table").bootstrapTable("showColumn", field)
            : $("#table").bootstrapTable("hideColumn", field);
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
    $("#openCreateTicketModal").on("click", async function () {

        await getDepartments();
        await getUserOptions();
        await getTypeOptions(1, 1, 9);
        await getModuleOptions(1, 1, 9);
        await getTypeOptions(1, 1, 9);
    });
    // Click to open file dialog
    $("#dropZone").on("click", () => TicketAttachments.click());

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

    $("#table").on("click-row.bs.table", function (e, row, $element, field) {
        $("#editTicketModal").modal("toggle");
        $("#editTicketSubject").val(row.TicketSubject);
        $("#editTicketDescription").val(row.TicketDescription);
        $("#editUserDropdownSelect").html(row.RequestedByName);
        $("#assigneeDropdownSelect").html(row.AssignedToName ? row.AssignedToName : 'Not yet assigned' );
        //$("#editUserDropdownSelect").val(row.RequestedByName);
        $("#editRequestedDate").val(row.RequestedDate);
        console.log(row.TicketSubject)
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

    // Click selection
    $("#employeedropdown").on("click", ".list-group-item-action", function (e) {
        e.preventDefault();

        let id = $(this).data("id");
        let name = $(this).data("name");

        $("#hiddenInput").val(id); // store EmployeeId
        $("#employeeSearch").val(name); // show Employee Name
        $("#employeedropdown").hide();
    });

    // Hide dropdown if clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#employeeSearch, #employeedropdown").length) {
            $("#employeedropdown").hide();
        }
    });
    

    $("#viewTicketDetailsBtn").on("click", () => {
        $("#editTicketModal").modal("toggle");
    });

  $("#submitTicket").on("click", async function (event) {
      event.preventDefault()
      uploadTicketAttachments()
      return;
      var markupStr = $('#TicketDescription').summernote('code');

      console.log(markupStr)
    
   
      console.log($("#createTicketForm"));
      //return;
      var forms = document.querySelectorAll('.needs-validation');
 
      NewTicket.TicketNo = 1;
      
      NewTicket.TicketSubject = $("#TicketSubject").val();
      //NewTicket.TicketDescription = $("#TicketDescription").val();
      NewTicket.TicketDescription = markupStr;
      NewTicket.TaskTypeCode = $("#TicketRequestType").val();
      console.log(NewTicket)
      Array.prototype.slice.call(forms)
          .forEach(async function (form) {
              console.log(form)
              if (!form.checkValidity()) {
                
                  alert("Validation Failed")
                  //event.stopPropagation()
              }
            
              else {
            
                  let response = await $.post(`${gBaseUrl}/create-ticket`, NewTicket);
                  console.log(response)
                  $("#newTicketId").empty().append(response[0].TicketId)
                  $("#table").bootstrapTable('insertRow', {
                      index: 0,
                      row: response[0],
                  })
                    form.classList.add('was-validated')
                    $("#successAlert").removeClass("d-none");

                    setTimeout(function () {
                      $("#successAlert").addClass("d-none");
                  }, 3000);
              }

                 
          })
   
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
});
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
function getStatus(i) {
  if (i % 2 == 1)
    return '<span class="badge bg-success rounded-pill">Completed</span>';
  else return '<span class="badge bg-primary rounded-pill">In Progress</span>';
}

//async function selectUsers() {
//  let params = {
//    org_code: 1,
//    gsearchParam: encodeURIComponent(""),
//    gPagNo: 1,
//  };

//  let data = await $.get(`/manage/users/getUsers`, params);
//  console.log(data);
//}

//OPTIONS FOR COMBOS
async function getDepartments() {
  departmentOptions = await $.get(
    `support/employee-directory/getAllDepartmentList`,
  );
  console.log(departmentOptions);
  let options = `<a class="dropdown-item text-muted" value="0"> -- Choose department -- </a>`;
  departmentOptions.forEach(function (i) {
    if (i.ORG_CODE == 1 && i.LOC_CODE == 1)
      options += `<a onclick="departmentSelected(event)" class="dropdown-item" data-value="${i.VALUE}"> ${i.TEXT} </a >`;
  });
  $("#departmentList").empty().append(options);
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
            options += `<li class="dropdown-item text-nowrap" data-value="${i.VALUE}">${i.TEXT}</li>`;
        }
  });

    $("#assigneeList").empty().append(options);
    $("#filterAssignedTo").append(options);
   
}
async function getUserOptions(searchString) {
  let usersOptions = await $.get(`${gBaseUrl}/get-user-options`);
    let options = "";
    console.log(usersOptions);
    usersOptions.forEach(function (i) {
        if (i.TEXT != '') {
            options += `<li class="dropdown-item text-nowrap" data-value="${i.VALUE}">${i.TEXT}</li>`;
        }
 
  });

    $("#userList").empty().append(options);
    $("#requestedByNameList").append(options)
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
    let options = "<option value='0' class='active'>Request Type </option>";
  console.log(typeOptions);
  typeOptions.forEach(function (i) {
    options += `<option value="${i.VALUE}"> ${i.TEXT} </option>`;
  });
    $("#TaskTypeCode").empty().append(options);

    $("#filterType").empty().append(options);
}

async function getAllTicket() {
    console.log(bootstrap.Tooltip.VERSION);
    const DeptCode = 9;

  let data = await $.get(`${gBaseUrl}/get-tickets`, { DeptCode: DeptCode });
    console.log(data);
    $("#ticketTblBody").empty();
    data.forEach(function (d,i) {
        $("#ticketTblBody").append(`
        <tr class="p-0 m-0" data-index="${i}">
           
            <td class="text-nowrap text-small">${d.DeptName + d.TicketId}</td>
            <td class="text-nowrap text-small">${d.RequestedByName}</td>
            <td class="text-nowrap text-small">${d.TicketSubject}</td>
             <td class="text-nowrap text-small">${d.AssignedToName}</td>
            <td class="text-nowrap">${i.DeptName}</td>
            <td class="text-nowrap text-small">${d.RequestedDate}</td>
            <td class="text-nowrap text-small">${d.TaskTypeName}</td>
            <td class="text-nowrap text-small">${d.StatusName}</td>
             <td class="text-nowrap text-small">${d.PriorityName}</td>
            </tr>
        `)
    })
    showTotalTicketsRecords(data.length);
    window.originalData = data;
 
    
  // CHECK IF ALREADY INITIALIZED
  if ($("#table").data("bootstrap.table")) {
    // JUST LOAD NEW DATA
    $("#table").bootstrapTable("load", data);
  } else {
    // INITIALIZE ONLY ONCEfilter
    $("#table").bootstrapTable({
        buttonsOrder: ['btnAdd', 'columns', 'fullscreen'],
        data: data,
        refreshOptions: {
            buttonsOrder: ['btnAdd', 'columns', 'fullscreen']
        }
    });
  }

   
}
//function requestedBySelected(event) {
//    EditTicket.DeptCode = event.target.dataset.value;

//    $("#departmentDropdownSelect").empty().append(event.target.innerHTML)
//}
function departmentSelected(event) {
    //console.log(event.target.innerHTML);
    //console.log(event.target.dataset.value);

    NewTicket.DeptCode = event.target.dataset.value;
    
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
async function initTicket() {
    const response = await fetch(`${homeUrl}/getUserDetails`);

    if (!response.ok) {
        console.error("Failed to fetch user details");
        return;
    }

    userData = await response.json();
    console.log(userData);
    let currentDate = new Date();
    NewTicket.RequestedByName = userData.EMP_NAME,
        $("#requestedBy").text(userData.EMP_NAME);
    $("#requestDate").text(currentDate.toISOString().slice(0, 10));

    for (i = 1; i < 5; i++) {
        $("#tblTickets tbody")
            .append(`<tr data-bs-toggle="modal" data-bs-target="editTicketModal">
                                           
                                           <td class="text-start">
                                           <span>
                                             <i class="fas fa-pen-to-square fs-5 text-primary btn"></i>
                                           </span>
                                             <span> MIS#${1}</span>
                                            </td>
                                            <td class="text-start">Landrex Rebruera</td>
                                            <td class="text-start">Add EMployee Directory</td>
                                            <td class="text-start">02-05-2026</td>
                                            <td class="text-start">
                                                <span id="statusBadge" class="badge badge-sm rounded-pill bg-darkgreen  text-white">Completed</span>
                                            </td>
                                            
                                        </tr>`);
    }
}
function showTotalTicketsRecords(totalRecords) {
    $("#TicketsTotal").empty().append(
        `<div class="btn rounded-pill bg-main text-white">
                <div class="badge fs-6 bg-danger rounded-circle text-white ms-0">${totalRecords}</div>
         <span class="align-middle ms-1">Records</span>
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