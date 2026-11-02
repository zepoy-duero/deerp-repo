var correspondence = null
var correspondenceAction = 'create';
var correspondenceIdSelected = null;
var isFileDuplicated = false;
function bindCorrespondenceHandlers() {
    $("#clearUserCorrespondenceBtn").on('click', function () {
        $("#userCorrespondenceField").val("");
    })
    $("#clearDevCorrespondenceBtn").on('click', function () {
        $("#devCorrespondenceField").val("");
    })
    $("#clearInternalCorrespondenceBtn").on('click', function () {
        $("#internalCorrespondenceField").val("");
    })

    $("#ticketCorrespondenceOffcanvas").on('show.bs.offcanvas', async function () {
        let ticketCorrespondences = await getTicketCorrespondence(selectedTicket.TicketId, 'User');
        renderDevCorrespondence(ticketCorrespondences);
       
    });

    $("#postInternalCorrespondenceBtn").on("click", async function (e) {
        e.preventDefault();
        if (correspondenceAction == 'create') {
            let param = {
                TicketId: selectedTicket.TicketId,
                Message: $("#internalCorrespondenceField").val(),
                CreatedByCode: CurrentUser.USER_CODE,
                CorrespondenceType: 'Internal'
            }
   
            if (!$("#internalCorrespondenceField").val()) {

                alert("Please enter a message.");

                $("#internalCorrespondenceField").focus();

                return;
            } else {
                let response = await createCorrespondence(param);
                if (!response.success) {

                    failedCorrespondenceAlert(response.message)

                } else {
                    let successMsg = 'You have successfully posted a ticket correspondence'
                    successCorrespondenceAlert(successMsg);

                    // Clear textarea and refresh list
              
                    $("#internalCorrespondenceField").val("");

                    let internalCorrespondences = await getTicketCorrespondence(selectedTicket.TicketId, 'Internal');
                    renderInterCorrespondences(internalCorrespondences);
                }
            }

        } else {
           
            let updateParam = {
                CorrespondenceId: correspondence.CorrespondenceId,
                Message: $("#userCorrespondenceField").val(),
                UpdatedBy: CurrentUser.USER_CODE
            };
            if (!updateParam.Message) {
                alert("Please enter a message.");
                $("#userCorrespondenceField").focus();
                return;
            } else {
                await updateCorrespondence(updateParam);
            }
        }
    });
    $("#postDevCorrespondenceBtn").on("click", async function (e) {
        e.preventDefault();
        if (correspondenceAction == 'create') {
            let param = {
                TicketId: selectedTicket.TicketId,
                Message: $("#devCorrespondenceField").val(),
                CreatedByCode: CurrentUser.USER_CODE,
                CorrespondenceType: 'User'
            }
   
            if (!$("#devCorrespondenceField").val()) {

                alert("Please enter a message.");

                $("#devCorrespondenceField").focus();

                return;
            } else {
                let response = await createCorrespondence(param);
                if (!response.success) {

                    failedCorrespondenceAlert(response.message)

                } else {
                    let successMsg = 'You have successfully posted a ticket correspondence'
                    successCorrespondenceAlert(successMsg);

                    // Clear textarea and refresh list
              
                    $("#devCorrespondenceField").val("");

                    await getTicketCorrespondence(selectedTicket.TicketId, 'User');
                }
            }

        } else {
           
            let updateParam = {
                CorrespondenceId: correspondence.CorrespondenceId,
                Message: $("#devCorrespondenceField").val(),
                UpdatedBy: CurrentUser.USER_CODE
            };
            if (!updateParam.Message) {

                alert("Please enter a message.");

                $("#devCorrespondenceField").focus();

                return;
            } else {
                await updateCorrespondence(updateParam);
            }

        }
    });
    $("#postUserCorrespondenceBtn").on("click", async function (e) {
        e.preventDefault();
        if (correspondenceAction == 'create') {
            let param = {
                TicketId: selectedTicket.TicketId,
                Message: $("#userCorrespondenceField").val(),
                CreatedByCode: CurrentUser.USER_CODE,
                CorrespondenceType: 'User'
            }
   
            if (!$("#userCorrespondenceField").val()) {

                alert("Please enter a message.");

                $("#userCorrespondenceField").focus();

                return;
            } else {
                let response = await createCorrespondence(param);
                if (!response) {

                    failedCorrespondenceAlert(response.message)

                } else {
                 
                    let successMsg = 'You have successfully posted a ticket correspondence'
                    successCorrespondenceAlert(successMsg);

                    // Clear textarea and refresh list
              
                    $("#userCorrespondenceField").val("");

                    let ticketCorrespondences = await getTicketCorrespondence(selectedTicket.TicketId, 'User');
                    renderUserCorrespondence(ticketCorrespondences);
                }
            }

        } else {
           
            let updateParam = {
                CorrespondenceId: correspondence.CorrespondenceId,
                Message: $("#userCorrespondenceField").val(),
                UpdatedBy: CurrentUser.USER_CODE
            };
            if (!updateParam.Message) {

                alert("Please enter a message.");

                $("#userCorrespondenceField").focus();

                return;
            } else {
                await updateCorrespondence(updateParam);
            }

        }
    });
    //when a user clicked the New Correspondence btn
    $("#addCorrespondenceBtn").on('click', function (e) {
        e.preventDefault()
        correspondenceAction = 'create';
        $("#txtCorrespondence").val('').focus();
        $("#correspondenceInputArea").removeClass('d-none')
        $("#postCorrespondenceBtn").empty().append('Post');
    });
    //CLEAR TEXTAREA
    $("#clearCorrespondenceBtn").on('click', function () {
        $("#txtCorrespondence").val('');
    });
    $("#addUserCorrespondenceAttachmentBtn").on('click', function (event) {
        event.preventDefault()
        selectedFiles = [];
        $("#correspondenceAttachmentInput").trigger('click');
       
       
    }); 
    //event listener that triggers when user selected file attachments
    $("#correspondenceAttachmentInput").on("change", function (e) {
        let isDuplicated = false;
        if (e.target.files.length > 10) {
            alert(`Please select not more than 10 files`);
            return;
        }
        const filesArray = Array.from(e.target.files);
        console.log(filesArray);
        
        const validated = validateAttachmentFiles(filesArray)
        if (!validated.valid) {
            toastr.error(`Invalid files selected`, "Error: Not allowed");
            return;
        }
       
        //return;
        if (filesArray.length >= 1) {
            for (let file of filesArray) {
                if (!isValidFileSize(file)) {
                    toastr.error(`Please select a file under 2MB`, "Error");
                    continue;
                }
                else if (checkIfDuplicateFile(file)) {
                    toastr.error(`The file named ${file.name} already selected`, "Error");
                    isDuplicated = true
                    continue;
                } else {
                    selectedFiles.push(file)
                   
                }
            }
            handleCorrAttachmentFiles(filesArray)
        }
        console.log(selectedFiles)
       
        //$("#correspondenceAttachmentSelectedFileContainer")
        //    .empty()
        //    .append(getCorrespodenceAttachmentHtml());
    })
    //$("#addCorrespondenceAttachmentBtn").on('click', function () {
   
    //    $("#userCorrespondenceField").click();
      
    //});
    //$('#userCorrespondenceContainer,#devCorrespondenceContainer, #internalCorrespondenceContainer').on('click', 'textarea', async function () {
    //    let $msg = $(this);
    //    console.log($msg.val())
    //    $("#userCorrespondenceField").val($msg.text());
    //    $("#postUserCorrespondenceBtn").empty().append('<i class="bi bi-send me-2"></i>Update')
    //    $("#devCorrespondenceField").val($msg.text());
    //    $("#internalCorrespondenceField").val($msg.text());
    //});
}
//function getCorrespodenceAttachmentHtml() {
//    console.log(selectedFiles);
//    let attachmentList = ''
//    if (selectedFiles.length >= 1) {
//        selectedFiles.forEach(function (i) {
//            let imgThumbnail = '';
//            console.log(i)
//            if (i.FileExtension.trim() === 'pdf') imgThumbnail = `img/pdf-icon.png`;
//            else if (i.FileExtension.trim() === 'xlsx' || i.FileExtension === 'xls') imgThumbnail = `img/excel-icon.png`;
//            else if (i.FileExtension.trim() === 'docs') imgThumbnail = `img/docs-icon.png`;
//            else if (i.FileExtension.trim() === 'txt') imgThumbnail = `img/textfile-icon.png`;
//            else {
//                imgThumbnail = `img/image-icon.png`;
//            }
//            attachmentList += `<div class="mt-2 me-2 d-flex align-items-center bg-white border rounded p-1 shadow-sm" style="width: 25% !important;">
//                                        <div class="bg-light text-secondary rounded d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
//                                            <img class="file-icon" style="width: 25px;height:25px;"
//                                                 src="${imgThumbnail}">
//                                        </div>
//                                        <div class="flex-grow-1 w-75">
//                                            <div style="cursor: pointer;"
//                                                 class="text-decoration-underline d-block text-truncate text-small fw-bold text-main"
//                                                 onclick="viewCorrespondenceAttachment(${i.AttachmentId})">
//                                                ${i.name}
//                                            </div>
//                                            <div class="text-muted" style="font-size: 8px !important;">
//                                                ${i.size} KB
//                                            </div>
//                                        </div>                                
//                                </div>`;
//        });

//    }
//    return attachmentList;
//}
async function loadUserCorrespondence() {
    let ticketCorrespondences = await getTicketCorrespondence(selectedTicket.TicketId, 'User');
    renderUserCorrespondence(ticketCorrespondences);
}
function failedCorrespondenceAlert(errorMsg) {
    toastr.error("Message: " + errorMsg, "Error");
}
function successCorrespondenceAlert(successMsg) {
    toastr.success(successMsg, 'Success')
}
// FUNCTIONS
async function createCorrespondence(param) {
    try {
        let response = await $.ajax({
            url: "/MyTickets/ticket-correspondence",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(param),
            dataType: "json"
        });
        console.log(response.data)
        if (!response.success) {
            failedCorrespondenceAlert(response.message);
            return;
        } 
        else {
            try {
                await uploadCorrespondenceAttachments(response.data.CorrespondenceId)
            } catch (error) {
                toastr.error("Message:"+ error,'Error uploading correspondence attachments')
            }
          
        }
        
        await getTicketCorrespondence(selectedTicket.TicketId, param.CorrespondenceType);
        $('#userCorrespondenceContainer').scrollTop(0);
        return response;
       
    } catch (error) {
        return error;
        console.error("Error posting correspondence:", error);
        $("#correspondenceAlert")
            .removeClass("d-none alert-success")
            .addClass("alert-danger")
            .text("Failed to post correspondence.");
    }
}
function correspondenceSelected(item) {
    //console.log(event)
    console.log(item);
    console.log(document.getElementById("toggleEditReview").checked)
    //console.log(event.target.innerHTML);
    correspondence = item;
    correspondenceAction = 'edit'
    $("#txtCorrespondence").val(item.Message)
    $("#txtCorrespondence").focus({ focusVisible: true });
    $("#correspondenceInputArea").removeClass('d-none')
    $("#postUserCorrespondenceBtn").empty().append('Update');
}
async function updateCorrespondence(param) {

    $.ajax({
        url:
            `/MyTickets/ticket-correspondence/${param.CorrespondenceId}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({
            correspondenceId: param.CorrespondenceId,
            message: param.Message,
            updatedBy:CurrentUser.USER_CODE
        }),

        success: async function (response) {

            if (!response.success) {
                
                $("#correspondenceAlert")
                    .removeClass('d-none')
                    .empty()
                    .append(`
                 <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error! - ${response.Message}</strong> Failed to updated the correspondence...
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
               </div>`);
                return;
            } else {
        
                $("#correspondenceAlert")
                    .removeClass('d-none')
                    .empty()
                    .append(`
                 <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Successful!</strong> Correspondence updated successfully..
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
               </div> `);
              
                // Clear textarea and refresh list
                $("#txtCorrespondence").val("");
                console.log(selectedTicket)
                let correspondenceType = selectedTicket.RequestedByCode == CurrentUser.USER_CODE ? 'User' : 'Internal'
                await getTicketCorrespondence(selectedTicket.TicketId, correspondenceType);
            
            }

            console.log(
                "Updated:",
                response.data
            );

        },

        error: function (xhr) {

            console.error(
                xhr.responseText
            );

        }
    });
}
function renderUserCorrespondence(correspondences) {
    const $userCorrespondence = $('#userCorrespondenceContainer');
    $userCorrespondence.empty();
    if (!correspondences || correspondences.length === 0) {

        $userCorrespondence.append(`
            <div class="text-center text-muted py-5">
                <i class="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                <div>No correspondence yet.</div>
            </div>
        `);

    } else {
        $.each(correspondences, async function (index, item) {
        
            //GET CORRESPONDENCE 
            if (item.CreatedByCode === CurrentUser.USER_CODE) {
                $userCorrespondence.append(`
                 <!-- Normal User Message -->
                <div class="d-flex msg-customer mb-4 align-items-start">
                    <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold small text-dark">${item.CreatedByName}<span class="text-muted font-monospace fw-normal">(Me)</span></span>
                            <span class="text-muted small">${formatCorrespondenceDate(item.CreatedDate)}</span>
                        </div>
                      
                        <textarea class="form-control-plaintext mb-1 p-3 shadow-1 rounded-1" 
                                         style="field-sizing: content; cursor: pointer;" readonly>${item.Message}</textarea>
                     
                         ${await getCorrespondenceAttachmentList(item.CorrespondenceId)}
                    
                    </div>
                </div>`);
            
            } else {
                $userCorrespondence.append(`
                <!-- Dept Message -->
                <div class="d-flex msg-agent mb-4 align-items-start">
                   
                    <div class="avatar bg-main text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                         <i class="bi bi-headset"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold small text-dark">${item.CreatedByName} <span class="text-primary font-monospace fw-normal">(${item.CreatedByRole})</span></span>
                            <span class="text-muted small">${formatCorrespondenceDate(item.CreatedDate)}</span>
                        </div>
                        <div class="p-3 rounded-2 bg-main text-white text-wrap shadow-sm msg-bubble text-start ms-auto" style="white-space: pre-wrap;">
                         ${item.Message}
                        </div>
                       
                        ${ await getCorrespondenceAttachmentList(item.CorrespondenceId) }
                       
                    </div>
                </div>`);
                
            }
        });
    }
}
function renderDevCorrespondence(correspondences) {
    const $devCorrespondence = $('#devCorrespondenceContainer');
    $devCorrespondence.empty();
    if (!correspondences || correspondences.length === 0) {
        $devCorrespondence.append(`
            <div class="text-center text-muted py-5">
                <i class="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                <div>No correspondence yet.</div>
            </div>`);
    } else {
        $.each(correspondences, async function (index, item) {

            //GET CORRESPONDENCE 
            if (item.CreatedByCode === CurrentUser.USER_CODE) {
                $devCorrespondence.append(`
                 <!-- Normal User Message -->
                <div class="d-flex msg-customer mb-4 align-items-start">
                    <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold small text-dark">${item.CreatedByName}<span class="text-muted font-monospace fw-normal">(Me)</span></span>
                            <span class="text-muted small">${formatCorrespondenceDate(item.CreatedDate)}</span>
                        </div>
                      
                        <textarea class="form-control-plaintext mb-1 p-3 shadow-1 rounded-1" 
                                         style="field-sizing: content; cursor: pointer;" readonly>${item.Message}</textarea>
                    <div class="d-flex flex-row">
                            ${await getCorrespondenceAttachmentList(item.CorrespondenceId)}
                      </div>
                    </div>
                </div>`);

            } else {
                $devCorrespondence.append(`
                <!-- Dept Message -->
                <div class="d-flex msg-agent mb-4 align-items-start">
                   
                    <div class="avatar bg-main text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                         <i class="bi bi-headset"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold small text-dark">${item.CreatedByName} <span class="text-primary font-monospace fw-normal">(${item.CreatedByRole})</span></span>
                            <span class="text-muted small">${formatCorrespondenceDate(item.CreatedDate)}</span>
                        </div>
                        <div class="p-3 rounded-2 bg-main text-white text-wrap shadow-sm msg-bubble text-start ms-auto" style="white-space: pre-wrap;">
                         ${item.Message}
                        </div>
                        <div class="d-flex flex-row">
                        ${await getCorrespondenceAttachmentList(item.CorrespondenceId)}
                        </div>
                    </div>
                </div>`);

            }
        });
    }
}
function renderInternalCorrespondence(correspondences) {
    const $correspondenceContainer =  $('#internalCorrespondenceContainer');

    $correspondenceContainer.empty();

    if (!correspondences || correspondences.length === 0) {

        $correspondenceContainer.append(`
            <div class="text-center text-muted py-5">
                <i class="bi bi-chat-square-text fs-1 d-block mb-2"></i>
                <div>No correspondence yet.</div>
            </div>
        `);

    }
    else {
        $.each(correspondences, function (index, item) {


            if (item.CreatedByCode === CurrentUser.USER_CODE) {
                // -------------------------------------------------------
                // EMPLOYEE / CUSTOMER MESSAGE
                // -------------------------------------------------------
                $correspondenceContainer.append(`
                 <div class="d-flex msg-customer mb-4 align-items-start">
                    <div class="avatar bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style="width: 40px; height: 40px; min-width: 40px;">
                        <i class="bi bi-person-fill"></i>
                    </div>
                    <div class="flex-grow-1">
                        <div class="d-flex justify-content-between align-items-center mb-1">
                            <span class="fw-bold small text-dark">${escapeHtml(item.CreatedByName)}<span class="text-muted font-monospace fw-normal">(Employee)</span></span>
                            <span class="text-muted small">${formatCorrespondenceDate(item.CreatedDate)}</span>
                        </div>
                        <div data-id="${item.CorrespondenceId}" class="corr-msg p-3 bg-white border shadow-sm small fw-normal">
                            ${formatMessage(item.Message)}
                        </div>
                    </div>
                </div>
                    `);

            } else {

                // -------------------------------------------------------
                // AGENT / SUPPORT MESSAGE
                // -------------------------------------------------------
                $correspondenceContainer.append(`
                    <div class="d-flex msg-agent mb-4 
                                align-items-start flex-row">

                        <div class="avatar bg-main text-white 
                                    rounded-circle d-flex 
                                    align-items-center justify-content-center 
                                    ms-3"
                             style="width:40px;height:40px;min-width:40px;">

                            <i class="bi bi-headset"></i>

                        </div>

                        <div class="flex-grow-1">

                            <div class="d-flex justify-content-between 
                                        align-items-center mb-1">

                                <span class="text-muted small">
                                    ${formatCorrespondenceDate(item.CreatedDate)}
                                </span>

                                <span class="fw-bold small text-dark">

                                    ${escapeHtml(item.CreatedByName)}

                                    <span class="text-muted 
                                                 font-monospace fw-normal">

                                        (${escapeHtml(item.CreatedByRole || 'MIS')})

                                    </span>

                                </span>

                            </div>

                            <div data-id="${item.CorrespondenceId}" class="corr-msg p-3 bg-main text-white 
                                        shadow-sm small fw-normal">

                                ${formatMessage(item.Message)}

                            </div>
                                <div class="container" id="userCorrespondenceAttachmentContainer">
                   
                                </div>
                        </div>

                    </div>
                `);


            }
            //await getCorrespondenceAttachments(item.CorrespondenceId);

        });
    }


    // ---------------------------------------------------------------
    // REPLY / CORRESPONDENCE INPUT
    // ---------------------------------------------------------------

    //$userCorrespondence.append(`

    //    <div class="border-top pt-4 mt-4 position-sticky">

    //        <div class="mb-2">

    //            <label class="form-label fw-bold small">
    //                Add Correspondence
    //            </label>

    //        </div>

    //        <textarea
    //            id="TicketCorrespondence"
    //            class="form-control"
    //            rows="4"
    //            placeholder="Type your message here..."
    //            maxlength="5000"></textarea>

    //        <div class="d-flex justify-content-between 
    //                    align-items-center mt-2">

    //            <small class="text-muted">
    //                <i class="bi bi-info-circle me-1"></i>
    //                Your message will be added to the ticket correspondence.
    //            </small>

    //            <button
    //                type="button"
    //                class="btn btn-danger px-4"
    //                id="btnSendCorrespondence"
    //                data-ticket-id="${ticketId}">

    //                <i class="bi bi-send me-1"></i>
    //                Send

    //            </button>

    //        </div>

    //    </div>

    //`);

}
async function getTicketCorrespondence(ticketId, correspondenceType) {
    console.log(ticketId, correspondenceType)
    try {
        const correspondenceResponse = await $.get(`/MyTickets/ticket-correspondence/ticketId/${ticketId}`, {
            ticketId: ticketId,
            correspondenceType: correspondenceType
        });

        let data = correspondenceResponse.data;
        return data;
        //renderTicketCorrespondence(data, correspondenceType);
    } catch (error) {
        console.error("Error fetching ticket correspondence:", error);
    }
}
async function uploadCorrespondenceAttachments(CorrespondenceId) {
    if (selectedFiles.length >= 1) {
        //loadingUploadAttachmentButton();
        const data = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            // Use the exact same key name to append multiple files as an array
            data.append('CorrespondenceAttachments', file);
        });
        data.append("CorrespondenceId", CorrespondenceId);
        data.append("TicketId", selectedTicket.TicketId);
        try {
            //let response = await $.post(`${gBaseUrl}/upload-ticket-attachments?TicketId=${TicketId}`,data)
            let response = await $.ajax({
                url: 'MyTickets/ticket-correspondence/upload-attachment',
                type: 'POST',
                data: data,
                contentType: false,
                processData: false
            });

            if (response.isSuccess) {
                console.log(response.isSuccess);
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
async function getCorrespondenceAttachmentList(CorrespondenceId) {
    correspondenceIdSelected = CorrespondenceId;
    let corrAttachments = await $.get('/MyTickets/ticket-correspondence/get-attachments', { CorrespondenceId: CorrespondenceId })
    let attachmentList = '';

    if (corrAttachments.length >= 1) {
        corrAttachments.forEach(function (i) {
            let imgThumbnail = '';
            console.log(i)
            if (i.FileExtension.trim() === 'pdf') imgThumbnail = `img/pdf-icon.png`;
            else if (i.FileExtension.trim() === 'xlsx' || i.FileExtension === 'xls') imgThumbnail = `img/excel-icon.png`;
            else if (i.FileExtension.trim() === 'docs') imgThumbnail = `img/docs-icon.png`;
            else if (i.FileExtension.trim() === 'txt') imgThumbnail = `img/textfile-icon.png`;
            else {
                imgThumbnail = `img/image-icon.png`;
            }
            attachmentList += `<div class="mt-2 me-2 d-flex align-items-center bg-white border rounded p-1 shadow-sm" style="width: 25% !important;">
                                        <div class="bg-light text-secondary rounded d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                                            <img class="file-icon" style="width: 25px;height:25px;"
                                             src="${imgThumbnail}">
                                        </div>
                                        <div class="flex-grow-1 w-75">
                                            <div style="cursor: pointer;"
                                                 class="text-decoration-underline d-block text-truncate text-small fw-bold text-main"
                                                 onclick="viewCorrespondenceAttachment(${i.AttachmentId})">
                                                ${i.FileName}
                                            </div>
                                            <div class="text-muted" style="font-size: 8px !important;">
                                                ${i.FileSize} KB
                                            </div>
                                        </div>                                
                                </div>`;
        });

    }
    //else {
    //    attachmentList += `<div class="caption text-muted">No attachment</div>`
    //}
    
    return attachmentList;
}
function renderDatabaseFilePreview(base64Data, fileName, mimeType, isLocalFile=false) {
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
    //$("#editTicketModal").modal('hide');
    $('#filePreviewModal').modal('show');
    $("#filePreviewModal").on('hidden.bs.modal', function () {
        $("#editTicketModal").modal('show');
    });

    // Memory Cleanup Event Hook
    //$('#filePreviewModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
    //    // ONLY revoke if it's a locally generated Blob URL to prevent breaking DB download links
    //    if (isLocalFile && fileUrl.startsWith('blob:')) {
    //        URL.revokeObjectURL(fileUrl);
    //    }
    //    $('#file-preview-zone').empty();
    //});

}
async function deleteCorrespondenceAttachment(attachmentId) {
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
            url: `/MyTickets/ticket-correspondence/delete-attachment?attachmentId=${attachmentId}`,
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
async function viewCorrespondenceAttachment(attachmentId) {
   
    console.log(attachmentId)
    try {
        // 1. Fetch the absolute latest list of attachments to find our specific file metadata
        // (This saves an extra API call since we can grab it from your existing endpoint structure)
        let fileData = await $.get(`/MyTickets/ticket-correspondence/get-attachment`, {
            AttachmentId: attachmentId
        });
        let mimeType = getMimeTypeByExtension(fileData.FileName)
        renderDatabaseFilePreview(fileData.FileAttachment, fileData.FileName, mimeType);
        

    } catch (error) {
        console.error("Error loading file preview:", error);
        alert("An error occurred while attempting to preview the file.");
    }
}
async function downloadCorrespondenceAttachment(attachmentId) {

    const file = await $.get(`/MyTickets/ticket-correspondence/get-attachment`, { AttachmentId: attachmentId });

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
function formatMessage(message) {

    if (!message) {
        return '';
    }

    return escapeHtml(message)
        .replace(/\r\n/g, '<br>')
        .replace(/\n/g, '<br>');
}
function formatCorrespondenceDate(dateValue) {

    if (!dateValue) {
        return '';
    }

    const date = new Date(dateValue);

    if (isNaN(date.getTime())) {
        return dateValue;
    }

    return date.toLocaleString([], {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function renderCorrAttachmentFile(i) {
   
    return `<div class="mt-2 me-2 d-flex align-items-center bg-white border rounded p-1 shadow-sm" style="width: 25% !important;">
                        <div class="bg-light text-secondary rounded d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
                            <img class="file-icon" style="width: 25px;height:25px;" src="img/excel-icon.png">
                        </div>
                        <div class="flex-grow-1 w-75">
                            <div style="cursor: pointer;" class="text-decoration-underline d-block text-truncate text-small fw-bold text-main" onclick="viewCorrespondenceAttachment(17)">
                                ${i.name}
                            </div>
                            <div class="text-muted" style="font-size: 8px !important;">
                            ${(i.size / 1024).toFixed(2) } KB
                            </div>
                        </div>
                    </div > `;
              //return `<div class="mt-2 me-2 d-flex align-items-center bg-white border rounded p-1 shadow-sm" style="width: 25% !important;">
              //                          <div class="bg-light text-secondary rounded d-flex align-items-center justify-content-center" style="width: 40px; height: 40px;">
              //                              <img class="file-icon" style="width: 25px;height:25px;" src="img/image-icon.png">
              //                          </div>
              //                          <div class="flex-grow-1 w-75">
              //                              <div style="cursor: pointer;" class="text-decoration-underline d-block text-truncate text-small fw-bold text-main" onclick="viewCorrespondenceAttachment(20)">
              //                                 ${i.name}
              //                              </div>
              //                              <div class="text-muted" style="font-size: 8px !important;">
              //                                 ${(i.size / 1024).toFixed(2) } KB
              //                              </div>
              //                           </div>
              //      </div>`

}
function handleCorrAttachmentFiles(files) {
    let attachmentList = '';
    for (let file of files) {
        if (!isValidFileType(file)) {
            alert(`Invalid file type: ${file.name}`);
            continue;
        }

        selectedFiles.push(file);
       
        $("#correspondenceAttachmentSelectedFileContainer").append(renderCorrAttachmentFile(file));

    }
 

    // Clear the native file input safely — avoid referencing an undefined variable.
    // Try by id first, then by common selector as fallback.
    const fileInput = document.getElementById("correspondenceAttachmentInput") || document.querySelector('input[type="file"][name="files"]');
    if (fileInput) {
        try {
            fileInput.value = "";
        } catch (e) {
            // Some older browsers or custom inputs might throw; ignore silently.
            console.warn("Could not clear file input value", e);
        }
    }
}