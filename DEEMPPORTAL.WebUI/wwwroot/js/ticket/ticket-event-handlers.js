function bindEventHandlers() {
   
    //----------EVENT LISTENERS----------------------------


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

        $("#editRequestedByName").text(text);
        $("#requestedBy").text(text)
        $("#requestedByCode").val(value);

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

        $("#assigneeDropdownSelect").html(text);
        $("#selectAssignee").val(value);
        
        $(".dropdown-menu").removeClass("show");
    });
    $("#selectAssignee").on("change", function () {
        if (selectedTicket.StatusName == 'New') {
            $("#statusCode").val(2);
            $("#statusName").val('Assigned');

        }
    })
    $("#moduleList").on("click", ".dropdown-item", function () {
        let text = $(this).text();
        let value = $(this).data("value");

        $("#moduleDropdownSelect").html(text);
        $("#selectModule").val(value);

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
    //BOUND TO SELECT DEPT COMPONENT
    $("#toggleOrgLoc").on('click', function () {
        $("#orgComponent,#locComponent").removeClass('col-md-4 d-none')
            .addClass('col-md-6');
        $(this).toggle('hide');
       
    });
    $("#toggleOrganization").on('click', function () {
        $("#SelectTicketOrganization")
            .prop('disabled', function (i, value) {
                return !value;
            })
    });
    $("#toggleLocation").on('click', function () {
        $("#SelectTicketLocation")
            .prop('disabled', function (i, value) {
                return !value;
            })
    });
    $("#changeOrganization").on("click", function () {
        $("#selectOrg,#SelectTicketOrganization").toggleClass("d-none");
        $(this).toggleClass("bi bi-pencil bi bi-sign-do-not-enter-fill");
    })
    $("#changeLocation").on("click", function () {
        $("#selectLoc,#SelectTicketLocation").toggleClass("d-none");
        $(this).toggleClass("bi bi-pencil bi bi-sign-do-not-enter-fill");
    })

    $("#openCreateTicketModal").on("click", async function (event) {
        await resetCreateTicketForm();
        await showCreateTicketModal(event);
        tooltip.show();
     
    })
   
    $("#TicketAttachments").on("change", function (e) {
    
        //console.log($(this));
        //return;
        handleFiles(e.target.files);
      
        

        if (e.target.files.length >= 1) {
            tooltip.hide();
        } else {
            tooltip.show();
        }
        //    console.log(e.target.files)
            //renderFilePreview(e.target.files)
    })
    $("#editTicketAttachments").on("change", function (e) {
        handleFiles(e.target.files);
        //    console.log(e.target.files)
        //renderFilePreview(e.target.files)
    })
    $("#dropZone").on("click", (e) => {
        const fileInput = document.getElementById('TicketAttachments');
        try {
            fileInput.showPicker(); // Opens the native OS file picker
        } catch (error) {
            console.error("Picker could not be opened:", error);
        }

    });
    //$("#editDropZone").on("click", () => { editTicketAttachments.click() });

    // File input change
    //$(TicketAttachments).on("change", (e) => {
    //    handleFiles(e.target.files);
    //    console.log(e.target.files)
    //    renderFilePreview(e.target.files)
    //});
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
    $("#getTicketAttachmentsId").on('click',  function () {
        console.log(selectedTicket)
        let attachments = getTicketAttachments(selectedTicket.TicketId);
        renderEditFilePreviewFromPath()
    })
    $("#returnToCreateTicketModal").on('click', function () {
           $("#createTicketModal").modal('show');

    })
    $("#isManagementApproval").on("change", function () {
        $("#managementApprovalRequired").toggleClass("d-none", !this.checked);
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






    $("#updateTicket").on("click", async function (event) {
        event.preventDefault();

        if (!validateFirst()) {
            toastr.error("All fields are required!", 'Validation failed', {
                timeOut: 3000,
            });
        } else {

            try {

            } catch (error) {

            }
        }
    });
    $("#cancelUploadAttachment").on("click", function () {
    
        $("#createTicketModal").modal('show');
       
    });
    $("#submitTicket").on("click", async function (event) {

        event.preventDefault();
        if (!validateFirst()) {
            toastr.error("All fields are required!", 'Validation failed', {
                timeOut: 3000,
            });
            return;
        } else {
            await submitNewTicket();
        }
    });
    $("#addAttachment").on('click', function () {
        $("#createTicketModal").modal('show');
        $("#TicketAttachments").click();
    })
    //async function confirmSubmitWithoutAttachment() {
    //    const result = confirm("Are you sure you want to submit this ticket without attachments?");

    //    // Evaluates the user's selection
    //    if (result) {
    //        await submitTicketRequest();
    //    } else {
    //        return; // User canceled the action
    //    }
    //}
    $("#confirmSubmitBtn").on('click', async function () {
        await submitTicketRequest();
    })
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
    // hook the edit attachments input to upload immediately after selection
    //$("#editTicketAttachments").on("change", function (e) {
    //    const files = Array.from(e.target.files || []);
    //    if (files.length === 0) return;
    //    uploadEditFiles(files);
    //    $(this).val(''); // clear input so same file can be re-selected later
    //});
    
    //$("#editTicketModal").on("hidden.bs.modal", function (event) {
        //toggleEditMode();
        //if ($("#toggleEditUserRequest").is('checked')) {
        //    $("#toggleEditUserRequest").trigger('change')
        //}
        //if ($("#toggleEditUserRequest").is('checked')) {

        //}
        //if ($("#toggleEditUserRequest").is('checked')) {

        //}
        //if ($("#toggleEditUserRequest").is('checked')) {

        //}
        
        //$("#toggleEditAssignment").trigger('change')
        //$("#toggleEditApprovals").trigger('change')
        //$("#toggleEditReview").trigger('change')
    //});
    $("#SelectTicketOrganization").on("change", async function () {
        await getLocationOptions($("#SelectTicketOrganization").val())
            .then(async function () {
                await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());

            });
            
        console.log($(this).val())
        $("#OrgCode").val($(this).val());

    });
    $("#changeOrgLoc").on("click", function () {
        $("#orgComponent,#locComponent").toggleClass('d-none');
    })
    $("#SelectTicketLocation").on("change", async function () {
        await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());
        $("#LocCode").val($(this).val());

    });
    $("#btnUpdateTicket").on("click", async function () {
        loadingSubmitEditButton();
        const updateParams = getUpdateTicketParams();
        console.log(updateParams)
        console.log(Object.keys(updateParams).length)
        //return 1;
        try {

            let response = await $.post(`MyTickets/update-ticket`, updateParams);
            console.log(response)
            selectedTicket = response;
            //UPDATE THE FORM VALUES ON THE OPEN MODAL
            updateModalFormValues(response)
            ticketsTable.bootstrapTable('updateByUniqueId', {
                id: response.TicketId,
                row: response,
                replace: true
            });
            toastr.success("You have successfully updated ticket " + response.StringTicketId + " details", "Success");
            enableSubmitEditButton();
        } catch (error) {
            toastr.error("Error while updating ticket information. Error: " + error, "Failed");
            enableSubmitEditButton();
        }


    });
    ticketsTable.on('click-row.bs.table', async function (e, row, $element, field) {
        // HEAD
        console.log(row.TicketId)
        activeAttachmentContainer = 'edit';
        toggleEditMode();
        selectedTicket = row;
        $("#editTicketModalTitle").empty().append('Update Ticket - ' + row.StringTicketId + " " + row.TicketSubject);
        //$("attachmentsPreviewContainer").empty();
       
        $("#ticketId").val(row.TicketId);
        $("#deptCode").val(row.DeptCode);
        $("#ticketNo").val(row.TicketNo);

        await getAllSelectOptions();
        await setUserRequestFormValue(row);
        await setAssignmentFormValue(row);
        await setApprovalsFormValue(row);
        await setReviewFormValue(row);

        // Optional: Open an edit modal if your form lives inside one
        // $('#editTicketModal').modal('show');
        $editTicketModal.modal('show');
    });
    //TRIGGER THE ATTACH FILE INPUT FIELD
    $("#editAttachBtn").on('click', function () {
        $("#editTicketAttachments").trigger("click");
    });
    //when user click edit button from the User Request Section
    $("#toggleEditUserRequest").on("change", function (event) {
  
        event.preventDefault();
        const switchElement = document.getElementById('toggleEditUserRequest');

        // Check the state (returns true if turned on, false if turned off)
        const isChecked = switchElement.checked;
        console.log(isChecked)
        //$("#toggleEditUserRequest").val(true)

        $("#userRequestEditBtn,#userRequestUpdateBtn").toggleClass('d-none');

        // make the RequestedBy field editable: show the select, hide the display
        $("#displayRequestedByName")
            .toggleClass('form-control-plaintext form-select fw-bold')
            .prop('disabled', function (i, val) {
                return !val; // Toggles the current state
            });
        $("#displayRequestedDate,#editRequestedDate").toggleClass('d-none')

        //$("#editTicketAttachments").toggleClass('d-none')
        $("#ticketSubject").prop("disabled", function (i, val) {
            return !val;
        });
        $("#ticketSubject").toggleClass('form-control-plaintext form-control');

        console.log(isChecked)
        if (isChecked) {
            $('#editTicketDescription').summernote('enable');
        } else {
            $('#editTicketDescription').summernote('disable');
        }
        $("#editAttachBtn").toggleClass('d-none');
    });

    $("#toggleEditAssignment").on("change", function (event) {
       
        event.preventDefault()
        // Get the element by its ID
        const switchElement = document.getElementById('toggleEditAssignment');

        // Check the state (returns true if turned on, false if turned off)
        const isChecked = switchElement.checked;
        console.log(isChecked)
        $("#assigneeDropdownSelect,#priorityCode,#moduleDropdownSelect,#typeDropdownSelect,#ticketDurationUnit")
            .toggleClass('form-control-plaintext form-select fw-bold')
            .prop('disabled', function (i, val) {
                return !val; // Toggles the current state
            });
        $("#ticketDuration").prop('disabled', function (i, val) {
            return !val; // Toggles the current state
        });
        $("#startDate,#finishDate").prop('disabled', function (i, val) {
            return !val; // Toggles the current state
        });
        $("#statusCode,#statusName ").toggleClass('d-none');

    });

    $("#toggleEditApprovals").on("change", function () {
      
        $("#approveByManager").toggleClass('form-control-plaintext text-muted form-select fw-bold')
            .prop('disabled', function (i, val) {
                return !val; // Toggles the current state
            });
    });
    $("#toggleEditReview").on("change", function () {
     
        $("#reviewedByName").prop('disabled', function (i, val) {
            return !val; // Toggles the current state
        });
        $("#reviewedDate").prop('disabled', function (i, val) {
            return !val; // Toggles the current state
        });
        $("#versionNo").prop('disabled', function (i, val) {
            return !val; // Toggles the current state
        });
        $("#remarks").prop('disabled', function (i, val) {
            return !val; // Toggles the current state
        });

    });

}
function getUserRequestFieldValues() {
    return {
        TicketId: selectedTicket.TicketId, //user request
        OrgCode: selectedTicket.OrgCode,
        LocCode: selectedTicket.LocCode,
        DeptCode: selectedTicket.DeptCode,
        TicketNo: selectedTicket.TicketNo,
        TicketSubject: $("#ticketSubject").val() ?? selectedTicket.TicketSubject,
        RequestedByCode: $("#editRequestedByCode").val() ?? selectedTicket.RequestedByCode,
        RequestedByName: $("#editRequestedByName").val() ?? selectedTicket.RequestedByName,
        RequestedDate: $("#editRequestedDate").val() ?? selectedTicket.RequestedDate,
        TicketDescription: $("#editTicketDescription").summernote('code'),
    };
}
function updateModalFormValues(ticket) {
    setUserRequestFormValue(ticket);
    setAssignmentFormValue(ticket);
    setApprovalsFormValue(ticket);
    setReviewFormValue(ticket);
}
function getAssignmentFieldValues() {
   
    return {
        AssignedToCode: $("#assignedToCode").val(), //assignment
        AssignedToName: $("#assignedToName").val(),
        PriorityCode: $("#priorityCode").val(),
        ModuleName: $("#moduleName").html(),
        TaskTypeCode: $("#taskTypeCode").val(),
        TicketDuration: $("#ticketDuration").val(),
        TicketDurationUnit: $("#ticketDurationUnit").val() ? $("#ticketDurationUnit").val() : 'Days',
        StartDate: $("#startDate").val(),
        FinishDate: $("#finishDate").val(),
        StatusCode: $("#statusCode").val()
    };
}
function getApprovalFieldValues() {
    return {
        DeptName: $("#deptName").val(),
        ApproveByManager: $("#approveByManager").val() ? true : false,
        IsManagementApproval: $("#isManagementApproval").is('checked'),
        ManagerEmailId: $("#managerEmailId").val(),
        RequestedByEmail: $("#requestedByEmail").val()
    }
}
function getReviewAndReleaseFieldValues() {
    return {
        VersionNo: $("#versionNo").val(),
        UpdatedBy: CurrentUser.EMP_NAME, //reviews
        UpdatedDate: $("#updatedDate").val(),
        ReviewedBy: $("#reviewedByName").val(),
        ReviewedDate: $("#reviewedDate").val(),
        Remarks: $("#remarks").val(),
        ManagerEmailId: selectedTicket.ManagerEmailId,
        RequestedByEmail: selectedTicket.RequestedByEmail
    }
}
function getUpdateTicketParams() {
    const updateTicketParams = {
        ...getUserRequestFieldValues(),
        ...getAssignmentFieldValues(),
        ...getApprovalFieldValues(),
        ...getReviewAndReleaseFieldValues()
    };
    console.log(updateTicketParams)
    return updateTicketParams;
}
async function setUserRequestFormValue(row) {
    //USER REQUEST
    //let userRequestData = {

    //}
     loadTicketAttachments(row.TicketId);
   
    $("#ticketSubject").val(row.TicketSubject);
    $("#editRequestedByCode").val(row.RequestedByCode);
    $("#editRequestedByName").val(row.RequestedByName);
    $("#displayRequestedByName").val(row.RequestedByName);

    $("#displayRequestedDate").val(moment(row.RequestedDate).format("MM-DD-YYYY"));
   
    $("#editRequestedDate").val(row.RequestedDate).attr('value',moment(row.RequestedDate).format('MM/DD/YYYY'));

    $('#editTicketDescription').summernote({
        height: 200,
        lang: 'en-US',
        toolbar: [
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['fontsize', ['fontsize']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
        ],

    });
    $("#editTicketDescription").summernote('code', row.TicketDescription);
    $("#editTicketDescription").summernote('disable');
   
   
}

async function setAssignmentFormValue(row) {
    console.log(row)
    //ASSIGNMENT
    //ASSIGNEE
    $("#assignedToCode").val(row.AssignedToCode);
    $("#assignedToName").val(row.AssignedToName);
    $("#assigneeDropdownSelect").html(row.AssignedToName ? row.AssignedToName : 'Not yet assigned');
    //PRIORITY
    $("#priorityCode").val(row.PriorityCode ? row.PriorityCode : 3);
    $("#ticketPriority").val(row.TicketPriority);
    //MODULE
    $("#moduleName").val(row.ModuleName);
    //TASKTYPE
    $("#taskTypeCode").val(row.TaskTypeCode ? row.TaskTypeCode : 1);
    $("#taskTypeName").val(row.TaskTypeName ? row.TaskTypeName : 'None selected');
    $("#typeDropdownSelect").html(row.TaskTypeName ? row.TaskTypeName : 'None selected');
    //DURATION
    $("#ticketDuration").val(row.TicketDuration ? row.TicketDuration : 0);
    $("#ticketDurationUnit").val(row.TicketDurationUnit ? row.TicketDurationUnit : 'Day');
    //START AND FINISH DATE
    $("#startDate").val(moment(row.StartDate).format("YYYY-MM-DD"));
    $("#finishDate").val(moment(row.FinishDate).format("YYYY-MM-DD"));
    //STATUS
    $("#statusCode").val(row.StatusCode ? row.StatusCode : 3);
    $("#statusName").val(row.StatusName ? row.StatusName : 'New');
    const section2 = document.getElementById('toggleEditAssignment');
    $("#statusName").toggleClass('btn btn-lg rounded-pill')
    $("#statusName").addClass(getStatusColor(row.StatusName ? row.StatusName : 'New'));
}
async function setApprovalsFormValue(row) {

    //APPROVALS
    $("#deptName").val(row.DeptName ? row.DeptName : 'Not yet Updated');
    $("#approveByManager").val(row.ApproveByManager ? 1 : 0);
    $("#isManagementApproval").prop('checked', row.IsManagementApproval ? row.IsManagementApproval : 0);
    $("#managerEmailId").val(row.ManagerEmailId ? row.ManagerEmailId : '');
    $("#requestedByEmail").val(row.RequestedByEmail ? row.RequestedByEmail : '');

    if ($("#isManagementApproval").is(':checked')) {
        $("#managementApprovalRequired").removeClass('d-none')
    }

}
async function setReviewFormValue(row) {
    //REVIEW/RELEASE
    $("#reviewedByName").val(row.ReviewedBy ? row.ReviewedBy : CurrentUser.EMP_NAME)

    $("#reviewedDate").val(row.Reviewed_Date ? row.reviewDate : moment().format("YYYY-MM-DD"));
    $("#versionNo").val(row.VersionNo ? row.VersionNo : 2.);
    $("#remarks").val(row.Remarks ? row.Remarks : 'No Data');

    $("#updatedBy").val(row.UpdatedBy);
    $("#updatedDate").val(row.UpdatedDate);
    $("#stringTicketId").val(row.StringTicketId ? row.StringTicketId : '');

}
//RESETS THE EDIT TICKET MODAL FORM FIELDS AND TOGGLE BUTTON TO ITS INITIAL STATE
function toggleEditMode() {
    const section1 = document.getElementById('toggleEditUserRequest');
    const section2 = document.getElementById('toggleEditAssignment');
    const section3 = document.getElementById('toggleEditApprovals');
    const section4 = document.getElementById('toggleEditReview');
    const s1 = section1.checked;
    const s2 = section2.checked;
    const s3 = section3.checked;
    const s4 = section4.checked;


    if (s1) {
        $("#toggleEditUserRequest").prop('checked', false).trigger('change');
    }
   
    if (s2) {
        $("#toggleEditAssignment").prop('checked', false).trigger('change');
    }
   
    if (s3) {
        $("#toggleEditApprovals").prop('checked', false).trigger('change');
    }
   
    if (s4) {
        $("#toggleEditReview").prop('checked', false).trigger('change');
    }
}

function getStatusColor(status) {
    switch (status) {
        case 'New': return 'btn-dark';
            break;
        case null: return 'd-none';
            break;
        case 'Assigned': return 'btn-danger';
            break;
        case 'In Progress': return 'btn-primary';
            break;
        case 'Testing': return 'btn-secondary';
            break;
        case 'Pending User': return 'btn-warning dark';
            break;
        case 'Pending Third Party': return 'btn-warning dark';
            break;
        case 'On Hold': return 'btn-warning dark';
            break;
        case 'Resolved': return 'btn-success text-white';
            break;
        case 'Closed': return 'btn-dark text-white';
            break;
        case 'Cancelled': return 'text-muted';
            break;
        default: return '';
            break;
    }
}

