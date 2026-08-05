"use strict";

/*
 * ============================================================
 * CREATE TICKET
 * ============================================================
 *
 * Required HTML:
 *
 * #createTicketModal
 * #createTicketForm
 * #SelectTicketOrganization
 * #SelectTicketLocation
 * #TicketDepartmentOptions
 * #TaskTypeCode
 * #TicketSubject
 * #TicketDescription
 * #TicketAttachments
 * #dropZone
 * #previewContainer
 * #submitTicket
 *
 * Existing dependency:
 * CurrentUser
 *
 * Expected CurrentUser properties:
 * USER_CODE
 * EMP_NAME
 * EMAIL_ADDRESS
 * DATE_TODAY
 * ============================================================
 */


const createTicketConfig = {
    baseUrl: "/MyTickets",

    createTicketUrl: "/MyTickets/create-ticket",

    uploadAttachmentsUrl:
        "/MyTickets/upload-ticket-attachments",

    getOrganizationUrl:
        "/support/employee-directory/getAllOrganizationList",

    getLocationUrl:
        "/support/employee-directory/getFilteredLocationList",

    getDepartmentUrl:
        "/MyTickets/get-ticket-department-options",

    getTypeUrl:
        "/MyTickets/get-type-options"
};


// ============================================================
// STATE
// ============================================================

let selectedFiles = [];


// ============================================================
// INITIALIZATION
// ============================================================

$(document).ready(function () {

    initializeCreateTicket();

});


function initializeCreateTicket() {

    initializeCreateTicketForm();

    initializeAttachmentEvents();

    initializeCreateTicketEvents();

}


// ============================================================
// FORM INITIALIZATION
// ============================================================

function initializeCreateTicketForm() {

    const $description =
        $("#TicketDescription");

    if ($description.length) {

        $description.summernote({

            height: 100,

            lang: "en-US",

            toolbar: [
                ["font", ["bold", "underline", "clear"]],
                ["fontname", ["fontname"]],
                ["fontsize", ["fontsize"]],
                ["color", ["color"]],
                ["para", ["ul", "ol", "paragraph"]]
            ]

        });

    }

}


// ============================================================
// CREATE TICKET MODAL
// ============================================================

function initializeCreateTicketEvents() {

    $("#openCreateTicketModal").on(
        "click",
        async function (event) {

            event.preventDefault();

            await openCreateTicketModal();

        }
    );


    $("#submitTicket").on(
        "click",
        async function (event) {

            event.preventDefault();

            await submitNewTicket();

        }
    );


    $("#SelectTicketOrganization").on(
        "change",
        async function () {

            const orgCode = $(this).val();

            await loadTicketLocations(orgCode);

            await loadTicketDepartments(
                orgCode,
                $("#SelectTicketLocation").val()
            );

        }
    );


    $("#SelectTicketLocation").on(
        "change",
        async function () {

            await loadTicketDepartments(
                $("#SelectTicketOrganization").val(),
                $(this).val()
            );

        }
    );


    $("#createTicketModal").on(
        "hidden.bs.modal",
        function () {

            resetCreateTicketForm();

        }
    );

}


// ============================================================
// OPEN CREATE TICKET MODAL
// ============================================================

async function openCreateTicketModal() {

    resetCreateTicketForm();

    await loadTicketOrganizations();

    const orgCode =
        $("#SelectTicketOrganization").val();

    await loadTicketLocations(orgCode);

    const locCode =
        $("#SelectTicketLocation").val();

    await loadTicketDepartments(
        orgCode,
        locCode
    );

    await loadTicketTypes(
        orgCode,
        locCode,
        $("#TicketDepartmentOptions").val()
    );

    setCurrentUserInformation();

}


// ============================================================
// CURRENT USER
// ============================================================

function setCurrentUserInformation() {

    if (!window.CurrentUser) {

        console.warn(
            "CurrentUser is not available."
        );

        return;

    }


    $("#displayRequestedBy")
        .text(CurrentUser.EMP_NAME);


    $("#RequestedByCode")
        .val(CurrentUser.USER_CODE);


    $("#RequestedByName")
        .val(CurrentUser.EMP_NAME);


    $("#requestedByCode")
        .val(CurrentUser.USER_CODE);


    $("#requestedBy")
        .val(CurrentUser.EMP_NAME);


    $("#RequestedDate")
        .val(CurrentUser.DATE_TODAY);


    let requestedDate =
        CurrentUser.DATE_TODAY;


    if (
        typeof moment !== "undefined"
    ) {

        requestedDate =
            moment(
                CurrentUser.DATE_TODAY
            ).format("MM-DD-YYYY");

    }


    $("#dateRequestedField")
        .text(requestedDate);

}


// ============================================================
// LOAD ORGANIZATIONS
// ============================================================

async function loadTicketOrganizations() {

    try {

        const organizations =
            await $.get(
                createTicketConfig.getOrganizationUrl
            );


        renderOrganizationOptions(
            organizations
        );

    }
    catch (error) {

        console.error(
            "Unable to load organizations:",
            error
        );

        showCreateTicketError(
            "Unable to load organizations."
        );

    }

}


function renderOrganizationOptions(
    organizations
) {

    let html = "";

    organizations.forEach(function (item) {

        html += `
    < option value = "${item.VALUE}" >
        ${ item.TEXT }
            </option >
    `;

    });


    $("#SelectTicketOrganization")
        .html(html);

}


// ============================================================
// LOAD LOCATIONS
// ============================================================

async function loadTicketLocations(
    orgCode
) {

    if (!orgCode) {

        $("#SelectTicketLocation")
            .empty();

        return;

    }


    try {

        const locations =
            await $.get(
                createTicketConfig.getLocationUrl,
                {
                    OrgCode: orgCode
                }
            );


        renderLocationOptions(
            locations
        );

    }
    catch (error) {

        console.error(
            "Unable to load locations:",
            error
        );

        showCreateTicketError(
            "Unable to load locations."
        );

    }

}


function renderLocationOptions(
    locations
) {

    let html = "";

    locations.forEach(function (item) {

        html += `
    < option value = "${item.VALUE}" >
        ${ item.TEXT }
            </option >
    `;

    });


    $("#SelectTicketLocation")
        .html(html);

}


// ============================================================
// LOAD DEPARTMENTS
// ============================================================

async function loadTicketDepartments(
    orgCode,
    locCode
) {

    if (!orgCode || !locCode) {

        $("#TicketDepartmentOptions")
            .empty();

        return;

    }


    try {

        const departments =
            await $.get(
                createTicketConfig.getDepartmentUrl,
                {
                    OrgCode: orgCode,
                    LocCode: locCode
                }
            );


        renderDepartmentOptions(
            departments
        );


        await loadTicketTypes(
            orgCode,
            locCode,
            $("#TicketDepartmentOptions").val()
        );

    }
    catch (error) {

        console.error(
            "Unable to load departments:",
            error
        );

        showCreateTicketError(
            "Unable to load departments."
        );

    }

}


function renderDepartmentOptions(
    departments
) {

    let html = "";

    departments.forEach(function (item) {

        html += `
    < option value = "${item.VALUE}" >
        ${ item.TEXT }
            </option >
    `;

    });


    $("#TicketDepartmentOptions")
        .html(html);

}


// ============================================================
// LOAD REQUEST TYPES
// ============================================================

async function loadTicketTypes(
    orgCode,
    locCode,
    deptCode
) {

    if (
        !orgCode ||
        !locCode ||
        !deptCode
    ) {

        $("#TaskTypeCode")
            .empty();

        return;

    }


    try {

        const types =
            await $.get(
                createTicketConfig.getTypeUrl,
                {
                    OrgCode: orgCode,
                    LocCode: locCode,
                    DeptCode: deptCode
                }
            );


        renderTicketTypeOptions(
            types
        );

    }
    catch (error) {

        console.error(
            "Unable to load request types:",
            error
        );

        showCreateTicketError(
            "Unable to load request types."
        );

    }

}


function renderTicketTypeOptions(
    types
) {

    let html = "";

    types.forEach(function (item) {

        html += `
    < option value = "${item.VALUE}" >
        ${ item.TEXT }
            </option >
    `;

    });


    $("#TaskTypeCode")
        .html(html);

}


// ============================================================
// RESET FORM
// ============================================================

function resetCreateTicketForm() {

    const form =
        $("#createTicketForm")[0];


    if (form) {

        form.reset();

    }


    $("#createTicketForm")
        .removeClass("was-validated");


    $("#TicketSubject")
        .removeClass(
            "is-valid is-invalid"
        );


    $("#SelectTicketOrganization")
        .removeClass(
            "is-valid is-invalid"
        );


    $("#SelectTicketLocation")
        .removeClass(
            "is-valid is-invalid"
        );


    $("#TicketDepartmentOptions")
        .removeClass(
            "is-valid is-invalid"
        );


    $("#TaskTypeCode")
        .removeClass(
            "is-valid is-invalid"
        );


    $("#summernoteInvalidFeedback")
        .addClass("d-none");


    if (
        $("#TicketDescription").length &&
        $("#TicketDescription").next(
            ".note-editor"
        ).length
    ) {

        $("#TicketDescription")
            .summernote("reset");

    }


    selectedFiles = [];

    $("#previewContainer")
        .empty();


    $("#TicketAttachments")
        .val("");


    $("#submitTicket")
        .prop("disabled", false)
        .html("Submit Ticket");


    $("#successAlert")
        .addClass("d-none");

}


// ============================================================
// VALIDATION
// ============================================================

function validateCreateTicketForm() {

    const form =
        $("#createTicketForm")[0];


    if (!form) {

        return false;

    }


    let isValid = true;


    // Native HTML validation

    if (!form.checkValidity()) {

        isValid = false;

    }


    // Summernote validation

    if (!validateTicketDescription()) {

        isValid = false;

    }


    $("#createTicketForm")
        .addClass("was-validated");


    return isValid;

}


// ============================================================
// DESCRIPTION VALIDATION
// ============================================================

function validateTicketDescription() {

    const $description =
        $("#TicketDescription");


    if (!$description.length) {

        return true;

    }


    let html =
        $description.summernote("code");


    const text =
        $("<div>")
            .html(html)
            .text()
            .trim();


    if (!text) {

        $("#summernoteInvalidFeedback")
            .removeClass("d-none");

        return false;

    }


    $("#summernoteInvalidFeedback")
        .addClass("d-none");


    return true;

}


// ============================================================
// GET CREATE TICKET DATA
// ============================================================

function getCreateTicketData() {

    const description =
        $("#TicketDescription")
            .summernote("code");


    return {

        OrgCode:
            $("#SelectTicketOrganization").val(),

        LocCode:
            $("#SelectTicketLocation").val(),

        DeptCode:
            $("#TicketDepartmentOptions").val(),

        TaskTypeCode:
            $("#TaskTypeCode").val(),

        TicketSubject:
            $("#TicketSubject").val(),

        TicketDescription:
            description,

        RequestedByCode:
            CurrentUser.USER_CODE,

        RequestedByName:
            CurrentUser.EMP_NAME,

        RequestedByEmail:
            CurrentUser.EMAIL_ADDRESS,

        RequestedDate:
            CurrentUser.DATE_TODAY

    };

}


// ============================================================
// ATTACHMENT EVENTS
// ============================================================

function initializeAttachmentEvents() {


    // File picker

    $("#TicketAttachments").on(
        "change",
        function (event) {

            handleTicketFiles(
                event.target.files
            );

        }
    );


    // Click drop zone

    $("#dropZone").on(
        "click",
        function () {

            const input =
                document.getElementById(
                    "TicketAttachments"
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


    // Drag over

    $("#dropZone").on(
        "dragover",
        function (event) {

            event.preventDefault();

            $(this).addClass(
                "dragover"
            );

        }
    );


    // Drag leave

    $("#dropZone").on(
        "dragleave",
        function () {

            $(this).removeClass(
                "dragover"
            );

        }
    );


    // Drop

    $("#dropZone").on(
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


            handleTicketFiles(files);

        }
    );


    // Paste screenshots

    $(window).on(
        "paste.createTicket",
        function (event) {

            const clipboard =
                event.originalEvent
                    .clipboardData;


            if (!clipboard) {
                return;
            }


            const pastedFiles = [];


            for (
                const item of clipboard.items
            ) {

                if (
                    item.type.indexOf(
                        "image"
                    ) === -1
                ) {

                    continue;

                }


                const blob =
                    item.getAsFile();


                if (!blob) {
                    continue;
                }


                const file =
                    new File(
                        [blob],
                        `screenshot_${ Date.now() }.png`,
                        {
                            type: blob.type
                        }
                    );


                pastedFiles.push(file);

            }


            if (
                pastedFiles.length > 0
            ) {

                handleTicketFiles(
                    pastedFiles
                );

            }

        }
    );

}


// ============================================================
// HANDLE ATTACHMENTS
// ============================================================

function handleTicketFiles(files) {

    if (!files) {
        return;
    }


    for (
        const file of files
    ) {

        if (
            !isValidTicketFileType(file)
        ) {

            toastr.warning(
                `Invalid file type: ${ file.name } `,
                "Attachment"
            );

            continue;

        }


        if (
            isDuplicateTicketFile(file)
        ) {

            toastr.warning(
                `${ file.name } is already selected.`,
                "Attachment"
            );

            continue;

        }


        selectedFiles.push(file);

        renderTicketFilePreview(file);

    }


    // Clear input so the same file
    // can be selected again later.

    $("#TicketAttachments")
        .val("");

}


// ============================================================
// FILE VALIDATION
// ============================================================

function isValidTicketFileType(file) {

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
// DUPLICATE FILE CHECK
// ============================================================

function isDuplicateTicketFile(file) {

    return selectedFiles.some(
        function (existingFile) {

            return (
                existingFile.name ===
                    file.name &&
                existingFile.size ===
                    file.size
            );

        }
    );

}


// ============================================================
// FILE PREVIEW
// ============================================================

function renderTicketFilePreview(file) {

    const fileItem =
        document.createElement("div");


    fileItem.className =
        "file-preview-item";


    const fileInfo =
        document.createElement("div");


    fileInfo.className =
        "file-info";


    // Icon / thumbnail

    const iconElement =
        document.createElement("img");


    iconElement.className =
        "file-icon";


    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        iconElement.src =
            URL.createObjectURL(file);

    }
    else if (
        file.type ===
        "application/pdf"
    ) {

        iconElement.src =
            "https://cdn-icons-png.flaticon.com/512/337/337946.png";

    }
    else {

        iconElement.src =
            "https://cdn-icons-png.flaticon.com/512/732/732220.png";

    }


    iconElement.alt =
        file.name;


    // File information

    const fileName =
        document.createElement("div");


    fileName.innerHTML = `
    < div >
    <strong>
        ${escapeHtml(file.name)}
    </strong>
        </div >

    <small class="text-muted">
        ${formatFileSize(file.size)}
    </small>
`;


    fileInfo.appendChild(
        iconElement
    );

    fileInfo.appendChild(
        fileName
    );


    // Remove button

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
        function (event) {

            event.preventDefault();

            event.stopPropagation();


            selectedFiles =
                selectedFiles.filter(
                    function (item) {
                        return item !== file;
                    }
                );


            fileItem.remove();

        }
    );


    // Preview image

    if (
        file.type &&
        file.type.startsWith("image/")
    ) {

        iconElement.style.cursor =
            "pointer";


        iconElement.addEventListener(
            "click",
            function (event) {

                event.stopPropagation();

                window.open(
                    iconElement.src,
                    "_blank"
                );

            }
        );

    }


    fileItem.appendChild(
        fileInfo
    );

    fileItem.appendChild(
        removeButton
    );


    $("#previewContainer")
        .append(fileItem);

}


// ============================================================
// FILE SIZE
// ============================================================

function formatFileSize(bytes) {

    if (!bytes) {
        return "0 KB";
    }


    const kb =
        bytes / 1024;


    if (kb < 1024) {

        return `${ kb.toFixed(2) } KB`;

    }


    return `${
    (
        kb / 1024
    ).toFixed(2)
} MB`;

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHtml(value) {

    return $("<div>")
        .text(value)
        .html();

}


// ============================================================
// SUBMIT NEW TICKET
// ============================================================

async function submitNewTicket() {

    // Validate

    if (
        !validateCreateTicketForm()
    ) {

        return;

    }


    const $button =
        $("#submitTicket");


    try {

        setSubmitButtonLoading();


        /*
         * ----------------------------------------------------
         * STEP 1
         * Create the ticket.
         *
         * The original create-ticket endpoint was called
         * using the ticket object. We keep that behavior here.
         * ----------------------------------------------------
         */

        const ticketData =
            getCreateTicketData();


        const response =
            await $.ajax({

                url:
                    createTicketConfig.createTicketUrl,

                type: "POST",

                contentType:
                    "application/json; charset=utf-8",

                data:
                    JSON.stringify(ticketData)

            });


        /*
         * ----------------------------------------------------
         * STEP 2
         * Upload attachments after the ticket has been created.
         * ----------------------------------------------------
         */

        if (
            selectedFiles.length > 0 &&
            response.TicketId
        ) {

            await uploadTicketAttachments(
                response.TicketId
            );

        }


        /*
         * ----------------------------------------------------
         * STEP 3
         * Success
         * ----------------------------------------------------
         */

        showCreateTicketSuccess(
            response
        );


        /*
         * If the ticket table exists on the page,
         * insert the new ticket without making this file
         * dependent on the table.
         */

        if (
            typeof insertNewRow ===
            "function"
        ) {

            insertNewRow(response);

        }


        if (
            typeof clearTicketFilterControl ===
            "function"
        ) {

            clearTicketFilterControl();

        }


        toastr.success(
            "You have successfully submitted a New Ticket - " +
            (
                response.StringTicketId ||
                response.TicketId
            ),
            "Success",
            {
                timeOut: 3000
            }
        );


        // Close modal

        $("#createTicketModal")
            .modal("hide");


    }
    catch (error) {

        console.error(
            "Create ticket failed:",
            error
        );


        let message =
            "Something went wrong while creating the ticket.";


        if (
            error.responseJSON &&
            error.responseJSON.message
        ) {

            message =
                error.responseJSON.message;

        }
        else if (
            error.responseText
        ) {

            try {

                const response =
                    JSON.parse(
                        error.responseText
                    );


                if (response.message) {

                    message =
                        response.message;

                }

            }
            catch (e) {

                // Keep default message.

            }

        }


        toastr.error(
            message,
            "Error"
        );

    }
    finally {

        resetSubmitButton();

    }

}


// ============================================================
// UPLOAD ATTACHMENTS
// ============================================================

async function uploadTicketAttachments(
    ticketId
) {

    if (
        selectedFiles.length === 0
    ) {

        return;

    }


    const formData =
        new FormData();


    selectedFiles.forEach(
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
                createTicketConfig.uploadAttachmentsUrl,

            type: "POST",

            data:
                formData,

            contentType: false,

            processData: false

        });


        toastr.success(
            "Ticket attachments uploaded successfully.",
            "Attachments"
        );

    }
    catch (error) {

        console.error(
            "Attachment upload failed:",
            error
        );


        /*
         * The ticket itself has already been created.
         * Report attachment failure separately.
         */

        toastr.warning(
            "The ticket was created, but some attachments could not be uploaded.",
            "Attachment Upload"
        );


        throw error;

    }

}


// ============================================================
// BUTTON STATE
// ============================================================

function setSubmitButtonLoading() {

    $("#submitTicket")
        .prop("disabled", true)
        .html(`
    < span
class="spinner-border spinner-border-sm"
role = "status"
aria - hidden="true" >
            </span >
    Submitting...
`);

}


function resetSubmitButton() {

    $("#submitTicket")
        .prop("disabled", false)
        .html(
            "Submit Ticket"
        );

}


// ============================================================
// SUCCESS
// ============================================================

function showCreateTicketSuccess(
    response
) {

    const ticketNumber =
        response.StringTicketId ||
        response.TicketId ||
        "";


    $("#newTicketId")
        .text(ticketNumber);


    $("#successAlert")
        .removeClass("d-none");

}


// ============================================================
// ERROR
// ============================================================

function showCreateTicketError(
    message
) {

    if (
        typeof toastr !== "undefined"
    ) {

        toastr.error(
            message,
            "Error"
        );

    }
    else {

        console.error(message);

    }

}

