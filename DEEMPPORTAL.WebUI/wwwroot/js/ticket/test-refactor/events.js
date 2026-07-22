function bindEventHandlers() {
    //----------EVENT LISTENERS----------------------------

    
    // RESET FILTER
    $("#btnResetFilter").on("click", function () {
        ticketsTable.bootstrapTable("clearFilterControl");
    });

    // COLUMN TOGGLE
    $(".toggle-column").on("change", function () {
        let field = $(this).data("field"); submi

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

    $("#createTicketModal").on('show.bs.modal', async function (event) {
        resetCreateTicketForm();

        await getOrganizationOptions();
        await getLocationOptions($("#SelectTicketOrganization").val());
        await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());

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
            $("#dateRequestedField").empty().append(moment(CurrentUser.DATE_TODAY).format("MMM DD, YYYY"));
        } else {
            $("#dateRequestedField").empty().append(CurrentUser.DATE_TODAY);
        }

        // initialize summernote for create form only if not already initialized
        const $td = $('#TicketDescription');
        if ($td.length && $td.next('.note-editor').length === 0) {
            $td.summernote({
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
        }

        await getTypeOptions(1, 1, 9);
        await getModuleOptions(1, 1, 9);
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
    $("#submitTicket").on("click", async function (event) {
        event.preventDefault();

        if (!validateFirst()) {
            toastr.error("All fields are required!", 'Validation failed', {
                timeOut: 3000,
            });
            return;
        } else {


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

            console.log(NewTicket);


            try {
                loadingSubmitButton(); //disable the submit button  
                let response = await $.post(`${gBaseUrl}/create-ticket`, NewTicket);
                let emailParams = await generateTicketEmailParams(response);
                console.log(response)
                $("#newTicketId").empty().append(response.TicketId);

                clearTicketFilterControl(); //reset filter control
                insertNewRow(response);    //insert new ticket to table

                toastr.success("You have successfully submitted a New Ticket - " + response.StringTicketId, "Success");
                disableSubmitButton();
                resetCreateTicketForm();

                let sentEmail = await $.post(`${gBaseUrl}/send-email-notification`, emailParams);

                if (sentEmail) {
                    toastr.success("Email notifications are successfully sent", 'Success', {
                        timeOut: 2000,
                    });
                }
                else {
                    toastr.error("Error while sending email notification", sentEmail, {
                        timeOut: 2000,
                    });
                }
                $("#createTicketModal").modal("hide");
            } catch (err) {
                toastr.error("The server responded with an error - " + err, "Failed", {
                    timeOut: 3000,
                });
                enableSubmitButton()
            }


        }
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

        //saveEditRequestedBy();
    });
    $("#editTicketModal").on("hidden.bs.modal", function (event) {
        $("#toggleEditUserRequest").trigger('change');
        $("#toggleEditUserRequest").trigger('change');
        $("#toggleEditUserRequest").trigger('change');
        $("#toggleEditUserRequest").trigger('change');
    });
    $("#SelectTicketOrganization").on("change", async function () {
        await getLocationOptions($("#SelectTicketOrganization").val());
        await getDepartmentOptions($("#SelectTicketOrganization").val(), $("#SelectTicketLocation").val());

    });
    $("#SelectTicketLocation").on("change", async function () {
        await getDepartmentOptions($("#+").val(), $("#SelectTicketLocation").val());

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

        //toggleEditMode();
        selectedTicket = row;
        $("#editTicketModalTitle").empty().append('Update Ticket - ' + row.StringTicketId + " " + row.TicketSubject);

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


        $("#ticketSubject").prop("disabled", function (i, val) {
            return !val;
        });
        $("#ticketSubject").toggleClass('form-control-plaintext form-control');

        console.log($('#ticketSubject').prop('disabled') == true)
        if (isChecked) {
            $('#ticketDescription').summernote('enable');
        } else {
            $('#ticketDescription').summernote('disable');
        }
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
        $("#ticketDuration,#approveByManager").toggleClass('form-control-plaintext form-control fw-bold')
            .prop('disabled', function (i, val) {
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
        TicketSubject: $("#ticketSubject").val(),
        RequestedByCode: $("#editRequestedByCode").val(),
        RequestedByName: $("#editRequestedByName").val(),
        RequestedDate: $("#editRequestedDate").val(),
        TicketDescription: $("#ticketDescription").val(),
    };
}
function getAssignmentFieldValues() {
    console.log($("#ticketDurationUnit").text())
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
    $("#ticketSubject").val(row.TicketSubject);
    $("#editRequestedByCode").val(row.RequestedByCode);
    $("#editRequestedByName").val(row.RequestedByName);
    $("#displayRequestedByName").val(row.RequestedByName);

    $("#displayRequestedDate").val(moment(row.RequestedDate).format("MM-DD-YYYY"));
    $("#editRequestedDate").val(moment(row.RequestedDate).format("YYYY-MM-DD"));

    $('#ticketDescription').summernote({
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
    $("#ticketDescription").summernote('code', row.TicketDescription);
    $("#ticketDescription").summernote('disable');
    //$('#attachmentsPreviewContainer').summernote({
    //            height: 200,
    //            lang: 'en-US',
    //            toolbar: [

    //                ['insert', ['picture']],


    //            ],

    //        });
    //$("#ticketAttachments").val(row.TicketAttachments);
}

async function setAssignmentFormValue(row) {
    console.log(row)
    //ASSIGNMENT
    $("#assignedToCode").val(row.AssignedToCode);
    $("#assignedToName").val(row.AssignedToName);
    $("#assigneeDropdownSelect").html(row.AssignedToName ? row.AssignedToName : 'Not yet assigned');
    $("#priorityCode").val(row.PriorityCode ? row.PriorityCode : 3);
    $("#ticketPriority").val(row.TicketPriority);
    $("#moduleName").val(row.ModuleName);
    $("#taskTypeCode").val(row.TaskTypeCode ? row.TaskTypeCode : 1);
    $("#taskTypeName").val(row.TaskTypeName ? row.TaskTypeName : 'None selected');
    $("#typeDropdownSelect").html(row.TaskTypeName ? row.TaskTypeName : 'None selected');
    $("#ticketDuration").val(row.TicketDuration ? row.TicketDuration : 0);
    $("#ticketDurationUnit").val(row.TicketDurationUnit ? row.TicketDurationUnit : 'Day');

    $("#startDate").val(moment(row.StartDate).format("YYYY-MM-DD"));
    $("#finishDate").val(moment(row.FinishDate).format("YYYY-MM-DD"));
    $("#statusCode").val(row.StatusCode ? row.StatusCode : 3);
    $("#statusName").val(row.StatusName ? row.StatusName : 'Not Scheduled');
    //$("#statusName").addClass('btn  border-0 no-box-shadow rounded-pill')
    $("#statusName").addClass(getStatusColor(row.StatusName ? row.StatusName : 'Not Scheduled'));
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

function toggleEditMode() {

    $("#toggleEditUserRequest").prop('checked', false);
    $("#toggleEditAssignment").prop('checked', false);
    $("#toggleEditApprovals").prop('checked', false);
    $("#toggleEditReview").prop('checked', false);
}
function getStatusColor(status) {
    switch (status) {
        case 'Not Scheduled': return 'btn-black';
            break;
        case null: return 'd-none';
            break;
        case 'In Progress': return 'btn-danger';
            break;
        case 'Testing': return 'btn-primary';
            break;
        case 'Maintenance': return 'btn-warning dark';
            break;
        case 'Complete': return 'btn-success text-white';
            break;
        default: return '';
            break;
    }
}

