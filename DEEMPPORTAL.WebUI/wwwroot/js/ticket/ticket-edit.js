
"use strict";

/*
 * ============================================================
 * EDIT / UPDATE TICKET
 * ============================================================
 */

const editTicketConfig = {

    baseUrl: "/MyTickets",

    updateTicketUrl:
        "/MyTickets/update-ticket",

    uploadAttachmentsUrl:
        "/MyTickets/upload-ticket-attachments"

};


// ============================================================
// STATE
// ============================================================

let editTicketFiles = [];

let currentEditTicketId = null;


// ============================================================
// INITIALIZATION
// ============================================================

$(async function () {

    initializeEditTicket();

});


function initializeEditTicket() {

    initializeEditTicketEvents();

    initializeEditAttachmentEvents();

};


// ============================================================
// OPEN EDIT TICKET
// ============================================================

async function openEditTicket(ticketId) {

    if (!ticketId) {

        console.error(
            "TicketId is required."
        );

        return;

    }


    currentEditTicketId =
        parseInt(ticketId);


    resetEditTicketForm();


    try {

        const ticket =
            await getTicketDetails(
                currentEditTicketId
            );


        if (!ticket) {

            toastr.error(
                "Ticket information was not found.",
                "Error"
            );

            return;

        }


        populateEditTicketForm(
            ticket
        );


        $("#editTicketModal")
            .modal("show");


    }
    catch (error) {

        console.error(
            "Unable to load ticket:",
            error
        );


        toastr.error(
            "Unable to load ticket information.",
            "Error"
        );

    }

}


// ============================================================
// GET TICKET
// ============================================================

async function getTicketDetails(
    ticketId
) {

    return await $.ajax({

        url:
            `${ editTicketConfig.baseUrl } /get-ticket`,

type: "GET",

    data: {
    ticketId: ticketId
}

    });

}


// ============================================================
// POPULATE EDIT FORM
// ============================================================

function populateEditTicketForm(
    ticket
) {

    currentEditTicketId =
        ticket.TicketId;


    // Hidden Ticket ID

    $("#EditTicketId")
        .val(ticket.TicketId);


    // Organization

    $("#EditSelectTicketOrganization")
        .val(ticket.OrgCode);


    // Location

    $("#EditSelectTicketLocation")
        .val(ticket.LocCode);


    // Department

    $("#EditTicketDepartmentOptions")
        .val(ticket.DeptCode);


    // Subject

    $("#EditTicketSubject")
        .val(ticket.TicketSubject || "");


    // Description

    if (
        $("#EditTicketDescription").length
    ) {

        $("#EditTicketDescription")
            .summernote(
                "code",
                ticket.TicketDescription || ""
            );

    }


    // Duration

    $("#EditTicketDuration")
        .val(
            ticket.TicketDuration ?? ""
        );


    // Duration Unit

    $("#EditTicketDurationUnit")
        .val(
            ticket.TicketDurationUnit || ""
        );


    // Start Date

    $("#EditStartDate")
        .val(
            formatDateForInput(
                ticket.StartDate
            )
        );


    // Finish Date

    $("#EditFinishDate")
        .val(
            formatDateForInput(
                ticket.FinishDate
            )
        );


    // Assigned To

    $("#EditAssignedToCode")
        .val(
            ticket.AssignedToCode ?? ""
        );


    // Priority

    $("#EditPriorityCode")
        .val(
            ticket.PriorityCode ?? ""
        );


    // Status

    $("#EditStatusCode")
        .val(
            ticket.StatusCode ?? ""
        );


    // Task Type

    $("#EditTaskTypeCode")
        .val(
            ticket.TaskTypeCode ?? ""
        );


    // Manager Approval

    $("#EditApproveByManager")
        .prop(
            "checked",
            ticket.ApproveByManager === true
        );


    // Management Approval

    $("#EditIsManagementApproval")
        .prop(
            "checked",
            ticket.IsManagementApproval === true
        );


    // Remarks

    $("#EditRemarks")
        .val(
            ticket.Remarks || ""
        );

}


// ============================================================
// DATE FORMAT
// ============================================================

function formatDateForInput(
    value
) {

    if (!value) {

        return "";

    }


    const date =
        new Date(value);


    if (isNaN(date.getTime())) {

        return "";

    }


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


// ============================================================
// GET UPDATE DATA
// ============================================================

function getUpdateTicketData() {

    const description =
        getEditTicketDescription();


    return {

        TicketId:
            parseInt(
                $("#EditTicketId").val()
            ),

        OrgCode:
            getNullableInt(
                $("#EditSelectTicketOrganization").val()
            ),

        LocCode:
            getNullableInt(
                $("#EditSelectTicketLocation").val()
            ),

        DeptCode:
            getNullableInt(
                $("#EditTicketDepartmentOptions").val()
            ),

        TicketSubject:
            $("#EditTicketSubject").val(),

        TicketDescription:
            description,

        TicketDuration:
            getNullableInt(
                $("#EditTicketDuration").val()
            ),

        TicketDurationUnit:
            $("#EditTicketDurationUnit").val(),

        StartDate:
            getInputDate(
                "#EditStartDate"
            ),

        FinishDate:
            getInputDate(
                "#EditFinishDate"
            ),

        AssignedToCode:
            getNullableInt(
                $("#EditAssignedToCode").val()
            ),

        PriorityCode:
            getNullableInt(
                $("#EditPriorityCode").val()
            ),

        StatusCode:
            getNullableInt(
                $("#EditStatusCode").val()
            ),

        TaskTypeCode:
            getNullableInt(
                $("#EditTaskTypeCode").val()
            ),

        ApproveByManager:
            $("#EditApproveByManager")
                .is(":checked"),

        IsManagementApproval:
            $("#EditIsManagementApproval")
                .is(":checked"),

        Remarks:
            $("#EditRemarks").val(),

        UpdatedBy:
            window.CurrentUser
                ? CurrentUser.EMP_NAME
                : null

    };

}


// ============================================================
// SUMMERNOTE
// ============================================================

function getEditTicketDescription() {

    const $editor =
        $("#EditTicketDescription");


    if (
        !$editor.length
    ) {

        return "";

    }


    return $editor.summernote(
        "code"
    );

}


// ============================================================
// HELPERS
// ============================================================

function getNullableInt(
    value
) {

    if (
        value === undefined ||
        value === null ||
        value === ""
    ) {

        return null;

    }


    const parsed =
        parseInt(value);


    return isNaN(parsed)
        ? null
        : parsed;

}


function getInputDate(
    selector
) {

    const value =
        $(selector).val();


    return value || null;

}


// ============================================================
// VALIDATION
// ============================================================

function validateEditTicket() {

    const form =
        $("#editTicketForm")[0];


    if (!form) {

        return true;

    }


    let valid =
        form.checkValidity();


    if (
        $("#EditTicketDescription").length
    ) {

        const description =
            $("<div>")
                .html(
                    getEditTicketDescription()
                )
                .text()
                .trim();


        if (!description) {

            valid = false;

            $("#editSummernoteInvalidFeedback")
                .removeClass("d-none");

        }
        else {

            $("#editSummernoteInvalidFeedback")
                .addClass("d-none");

        }

    }


    $("#editTicketForm")
        .addClass("was-validated");


    return valid;

}


// ============================================================
// UPDATE TICKET
// ============================================================

async function updateTicket() {

    if (
        !validateEditTicket()
    ) {

        return;

    }


    const ticketData =
        getUpdateTicketData();


    if (
        !ticketData.TicketId
    ) {

        toastr.error(
            "Ticket ID is missing.",
            "Error"
        );

        return;

    }


    try {

        setUpdateButtonLoading();


        /*
         * ----------------------------------------------------
         * STEP 1
         * Update ticket information
         * ----------------------------------------------------
         */

        const response =
            await $.ajax({

                url:
                    editTicketConfig.updateTicketUrl,

                type: "PUT",

                contentType:
                    "application/json; charset=utf-8",

                data:
                    JSON.stringify(ticketData)

            });


        /*
         * ----------------------------------------------------
         * STEP 2
         * Upload newly selected attachments
         * ----------------------------------------------------
         */

        if (
            editTicketFiles.length > 0
        ) {

            await uploadEditTicketAttachments(
                ticketData.TicketId
            );

        }


        /*
         * ----------------------------------------------------
         * STEP 3
         * Success
         * ----------------------------------------------------
         */

        toastr.success(
            "Ticket has been successfully updated.",
            "Success",
            {
                timeOut: 3000
            }
        );


        /*
         * Refresh ticket information if the
         * function exists in your main ticket JS.
         */

        if (
            typeof refreshTicketDetails ===
            "function"
        ) {

            await refreshTicketDetails(
                ticketData.TicketId
            );

        }


        if (
            typeof loadTickets ===
            "function"
        ) {

            await loadTickets();

        }


        $("#editTicketModal")
            .modal("hide");


    }
    catch (error) {

        console.error(
            "Update ticket failed:",
            error
        );


        toastr.error(
            getAjaxErrorMessage(
                error
            ),
            "Update Failed"
        );

    }
    finally {

        resetUpdateButton();

    }

}


// ============================================================
// UPLOAD EDIT ATTACHMENTS
// ============================================================

async function uploadEditTicketAttachments(
    ticketId
) {

    if (
        editTicketFiles.length === 0
    ) {

        return;

    }


    const formData =
        new FormData();


    editTicketFiles.forEach(
        function (file) {

            formData.append(
                "files",
                file
            );

        }
    );


    formData.append(
        "ticketId",
        ticketId
    );


    try {

        await $.ajax({

            url:
                editTicketConfig.uploadAttachmentsUrl,

            type: "POST",

            data:
                formData,

            contentType: false,

            processData: false

        });


    }
    catch (error) {

        console.error(
            "Attachment upload failed:",
            error
        );


        toastr.warning(
            "Ticket was updated, but attachment upload failed.",
            "Attachment Upload"
        );

    }

}


// ============================================================
// ATTACHMENT EVENTS
// ============================================================

function initializeEditAttachmentEvents() {

    $("#EditTicketAttachments").on(
        "change",
        function (event) {

            handleEditTicketFiles(
                event.target.files
            );

        }
    );


    $("#editDropZone").on(
        "click",
        function () {

            const input =
                document.getElementById(
                    "EditTicketAttachments"
                );


            if (!input) {
                return;
            }


            if (
                typeof input.showPicker ===
                "function"
            ) {

                input.showPicker();

            }
            else {

                input.click();

            }

        }
    );


    $("#editDropZone").on(
        "dragover",
        function (event) {

            event.preventDefault();

            $(this).addClass(
                "dragover"
            );

        }
    );


    $("#editDropZone").on(
        "dragleave",
        function () {

            $(this).removeClass(
                "dragover"
            );

        }
    );


    $("#editDropZone").on(
        "drop",
        function (event) {

            event.preventDefault();

            $(this).removeClass(
                "dragover"
            );


            const files =
                event.originalEvent
                    .dataTransfer
                    .files;


            handleEditTicketFiles(
                files
            );

        }
    );

}


// ============================================================
// HANDLE EDIT FILES
// ============================================================

function handleEditTicketFiles(
    files
) {

    if (!files) {
        return;
    }


    for (
        const file of files
    ) {

        if (
            !isValidEditFileType(file)
        ) {

            toastr.warning(
                `Invalid file type: ${file.name}`,
                "Attachment"
            );

            continue;

        }


        editTicketFiles.push(file);

        renderEditFilePreview(
            file
        );

    }


    $("#EditTicketAttachments")
        .val("");

}


// ============================================================
// EDIT FILE VALIDATION
// ============================================================

function isValidEditFileType(
    file
) {

    const allowedTypes = [

        "application/pdf",

        "application/msword",

        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",

        "application/vnd.ms-excel",

        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

        "application/vnd.ms-powerpoint",

        "application/vnd.openxmlformats-officedocument.presentationml.presentation",

        "text/plain",

        "text/csv",

        "application/zip",

        "application/x-rar-compressed"

    ];


    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        return true;

    }


    return allowedTypes.includes(
        file.type
    );

}


// ============================================================
// EDIT FILE PREVIEW
// ============================================================

function renderEditFilePreview(
    file
) {

    const fileItem =
        document.createElement("div");


    fileItem.className =
        "file-preview-item";


    const fileInfo =
        document.createElement("div");


    fileInfo.className =
        "file-info";


    const icon =
        document.createElement("img");


    icon.className =
        "file-icon";


    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        icon.src =
            URL.createObjectURL(file);

    }
    else if (
        file.type ===
        "application/pdf"
    ) {

        icon.src =
            "https://cdn-icons-png.flaticon.com/512/337/337946.png";

    }
    else {

        icon.src =
            "https://cdn-icons-png.flaticon.com/512/732/732220.png";

    }


    const fileName =
        document.createElement("div");


    fileName.innerHTML = `
        <div>
            <strong>
                ${escapeHtml(
        file.name
    )}
            </strong>
        </div>

        <small class="text-muted">
            ${formatEditFileSize(
        file.size
    )}
        </small>
    `;


    fileInfo.appendChild(icon);

    fileInfo.appendChild(fileName);


    const removeButton =
        document.createElement("button");


    removeButton.type =
        "button";


    removeButton.className =
        "btn btn-sm btn-outline-danger";


    removeButton.innerText =
        "Remove";


    removeButton.addEventListener(
        "click",
        function () {

            editTicketFiles =
                editTicketFiles.filter(
                    function (item) {

                        return item !== file;

                    }
                );


            fileItem.remove();

        }
    );


    fileItem.appendChild(
        fileInfo
    );

    fileItem.appendChild(
        removeButton
    );


    $("#editPreviewContainer")
        .append(fileItem);

}


// ============================================================
// EDIT FILE SIZE
// ============================================================

function formatEditFileSize(
    bytes
) {

    if (!bytes) {

        return "0 KB";

    }


    const kb =
        bytes / 1024;


    if (kb < 1024) {

        return `${kb.toFixed(2)} KB`;

    }


    return `${(
        kb / 1024
    ).toFixed(2)} MB`;

}


// ============================================================
// RESET EDIT FORM
// ============================================================

function resetEditTicketForm() {

    editTicketFiles = [];

    currentEditTicketId = null;


    $("#editTicketForm")
        .removeClass(
            "was-validated"
        );


    $("#editPreviewContainer")
        .empty();


    $("#EditTicketAttachments")
        .val("");


    if (
        $("#EditTicketDescription").length
    ) {

        $("#EditTicketDescription")
            .summernote(
                "code",
                ""
            );

    }


    $("#editSummernoteInvalidFeedback")
        .addClass("d-none");


    $("#updateTicketButton")
        .prop(
            "disabled",
            false
        )
        .html(
            "Update Ticket"
        );

}


// ============================================================
// BUTTON
// ============================================================

function setUpdateButtonLoading() {

    $("#updateTicketButton")
        .prop(
            "disabled",
            true
        )
        .html(`
            <span
                class="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true">
            </span>
            Updating...
        `);

}


function resetUpdateButton() {

    $("#updateTicketButton")
        .prop(
            "disabled",
            false
        )
        .html(
            "Update Ticket"
        );

}


// ============================================================
// EVENTS
// ============================================================

function initializeEditTicketEvents() {

    /*
     * Use this when your ticket list has:
     *
     * <button
     *     class="btn-edit-ticket"
     *     data-ticket-id="123">
     *     Edit
     * </button>
     */

    $(document).on(
        "click",
        ".btn-edit-ticket",
        async function () {

            const ticketId =
                $(this).data(
                    "ticket-id"
                );


            await openEditTicket(
                ticketId
            );

        }
    );


    /*
     * Update button
     */

    $("#updateTicketButton").on(
        "click",
        async function (event) {

            event.preventDefault();

            await updateTicket();

        }
    );


    /*
     * Department changes
     */

    $("#EditTicketDepartmentOptions")
        .on(
            "change",
            async function () {

                await loadEditTicketTypes();

            }
        );


    /*
     * Organization changes
     */

    $("#EditSelectTicketOrganization")
        .on(
            "change",
            async function () {

                const orgCode =
                    $(this).val();


                await loadEditTicketLocations(
                    orgCode
                );

            }
        );


    /*
     * Location changes
     */

    $("#EditSelectTicketLocation")
        .on(
            "change",
            async function () {

                await loadEditTicketDepartments();

            }
        );

}


// ============================================================
// OPTIONAL DROPDOWN LOADERS
// ============================================================

async function loadEditTicketLocations(
    orgCode
) {

    const locations =
        await $.get(
            "/support/employee-directory/getFilteredLocationList",
            {
                OrgCode: orgCode
            }
        );


    let html = "";


    locations.forEach(
        function (item) {

            html += `
                <option value="${item.VALUE}">
                    ${item.TEXT}
                </option>
            `;

        }
    );


    $("#EditSelectTicketLocation")
        .html(html);


    await loadEditTicketDepartments();

}


async function loadEditTicketDepartments() {

    const orgCode =
        $("#EditSelectTicketOrganization")
            .val();


    const locCode =
        $("#EditSelectTicketLocation")
            .val();


    const departments =
        await $.get(
            `${editTicketConfig.baseUrl}/get-ticket-department-options`,
            {
                OrgCode: orgCode,
                LocCode: locCode
            }
        );


    let html = "";


    departments.forEach(
        function (item) {

            html += `
                <option value="${item.VALUE}">
                    ${item.TEXT}
                </option>
            `;

        }
    );


    $("#EditTicketDepartmentOptions")
        .html(html);


    await loadEditTicketTypes();

}


async function loadEditTicketTypes() {

    const orgCode =
        $("#EditSelectTicketOrganization")
            .val();


    const locCode =
        $("#EditSelectTicketLocation")
            .val();


    const deptCode =
        $("#EditTicketDepartmentOptions")
            .val();


    const types =
        await $.get(
            `${editTicketConfig.baseUrl}/get-type-options`,
            {
                OrgCode: orgCode,
                LocCode: locCode,
                DeptCode: deptCode
            }
        );


    let html = "";


    types.forEach(
        function (item) {

            html += `
                <option value="${item.VALUE}">
                    ${item.TEXT}
                </option>
            `;

        }
    );


    $("#EditTaskTypeCode")
        .html(html);

}


// ============================================================
// ERROR MESSAGE
// ============================================================

function getAjaxErrorMessage(
    error
) {

    if (
        error.responseJSON &&
        error.responseJSON.message
    ) {

        return error.responseJSON.message;

    }


    if (
        error.responseText
    ) {

        try {

            const response =
                JSON.parse(
                    error.responseText
                );


            if (response.message) {

                return response.message;

            }

        }
        catch (e) {

            // Ignore parsing error.

        }

    }


    if (
        error.statusText
    ) {

        return error.statusText;

    }


    return "Unable to update ticket.";

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(
    value
) {

    return $("<div>")
        .text(value)
        .html();

}

