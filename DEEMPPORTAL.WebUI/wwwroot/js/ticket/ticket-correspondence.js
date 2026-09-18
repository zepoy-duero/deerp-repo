var correspondence = null
var correspondenceAction = 'create';
async function bindCorrespondenceHandlers() {
    
    $("#postCorrespondenceBtn").on("click", async function (e) {
        e.preventDefault();




        if (correspondenceAction == 'create') {
            let createParam = getCreateCorrespondenceParams();
            console.log(createParam)
            console.log(!$("#txtCorrespondence").val())
            if (!$("#txtCorrespondence").val()) {

                alert("Please enter a message.");

                $("#txtCorrespondence").focus();

                return;
            } else {
                await createCorrespondence(createParam);
            }

        } else {
            let updateParam = getUpdateCorrespondenceParams();
            console.log(updateParam)
            if (!updateParam.Message) {

                alert("Please enter a message.");

                $("#txtCorrespondence").focus();

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
    $("#addCorrespondenceAttachmentBtn").on('click', function () {
        $("#file-chooser").trigger('click');
    });
    
    $("#file-chooser").on("change", async function (e) {
        let isDuplicated = false;
        if (e.target.files.length > 10) {
            alert(`Please select not more than 10 files`);
            return;
        }
        const filesArray = Array.from(e.target.files);
        console.log(filesArray)
        const validated = validateAttachmentFiles(filesArray)
        if (!validated.valid) {
            toastr.error(`Invalid files selected`, "Error: Not allowed");
            return;
        }
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
        }
        console.log(isDuplicated)
        if (!isDuplicated) {
            let isUploaded = await uploadCorrespondenceAttachments(selectedTicket.TicketId);
            console.log(isUploaded);
            if (isUploaded) {
                await showCorrespondenceAttachmentList();
                return;
            }
        } else return;
    })

   
  
} 
function getCreateCorrespondenceParams() {
    let param = {
        TicketId: selectedTicket.TicketId,
        Message: $("#txtCorrespondence").val(),
        CreatedByCode: CurrentUser.USER_CODE
    }
    return param;
}
function getUpdateCorrespondenceParams() {
    let param = {
        CorrespondenceId: correspondence.CorrespondenceId,
        Message: $("#txtCorrespondence").val() ?? correspondence.Message,
        UpdatedBy: CurrentUser.USER_CODE
    };
    return param;
}
// FUNCTIONS
async function getTicketCorrespondence(ticketId) {
    try {
        const correspondenceResponse = await $.get(`/MyTickets/ticket-correspondence/ticketId/${ticketId}`);
        console.log(correspondenceResponse.data);

        let data = correspondenceResponse.data;
        const $correspondenceList = $("#correspondenceList").empty();

        // Ensure data exists and is an array before looping
        if (Array.isArray(data)) {
            data.forEach(function (item, index) {
                // 1. Build the HTML list item safely WITHOUT the messy inline onclick
                const listItemHtml = `
                    <li data-id="${item.CorrespondenceId}" 
                        class="list-group-item correspondence-item list-group-item-action flex-column align-items-start px-2 mb-2">
                        <div class="d-flex w-100 justify-content-between">
                             <textarea class="form-control-plaintext mb-1 fs-6" style="field-sizing: content; cursor: pointer;" readonly></textarea>
                    
                            <small class="text-nowrap">${moment(item.CreatedDate).fromNow()}</small>
                        </div>
                      
                    </li>`;

                // 2. Convert to a jQuery object
                const $item = $(listItemHtml);

                // 3. Safely inject the raw message text (prevents HTML/XSS injection bugs)
                $item.find('textarea').text(item.Message);
            

                // 4. Attach the raw object securely using jQuery's data store
                $item.data('correspondenceData', item);

                // 5. Append to the main list container
                $correspondenceList.append($item);
            });

            // 6. Handle clicks cleanly using a single delegated event listener
            $correspondenceList.off('click', '.correspondence-item').on('click', '.correspondence-item', function () {
                const itemData = $(this).data('correspondenceData');
                console.log(itemData)
                correspondenceSelected(itemData);
            });
        }
    } catch (error) {
        console.error("Error fetching ticket correspondence:", error);
    }
}

async function createCorrespondence(param) {
    try {
        let response = await $.ajax({
            url: "/MyTickets/ticket-correspondence",
            type: "POST",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify(param),
            dataType: "json"
        });
        if (!response.success) {
            $("#correspondenceAlert")
                .removeClass('d-none')
                .empty()
                .append(`
                 <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Error! - ${response.Message}</strong> Failed to add the correspondence...
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
               </div>`);
           
        } else {
            $("#correspondenceAlert")
                .removeClass('d-none')
                .empty()
                .append(`
                 <div class="alert alert-success alert-dismissible fade show" role="alert">
                <strong>Successful!</strong> Correspondence posted successfully..
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
               </div> `);
            
            // Clear textarea and refresh list
            $("#txtCorrespondence").val("");
   
            await getTicketCorrespondence(selectedTicket.TicketId);
        }
       
    } catch (error) {
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
    $("#postCorrespondenceBtn").empty().append('Update');
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
                await getTicketCorrespondence(selectedTicket.TicketId);
            
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
async function uploadCorrespondenceAttachments(TicketId) {
    if (selectedFiles.length >= 1) {
        //loadingUploadAttachmentButton();
        const data = new FormData();
        Array.from(selectedFiles).forEach((file) => {
            // Use the exact same key name to append multiple files as an array
            data.append('TicketAttachments', file);
        });
        data.append("TicketId", TicketId);
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
async function showCorrespondenceAttachmentList() {

    let attachments = await $.get(`/MyTickets/ticket-correspondence/get-attachments`, { TicketId: selectedTicket.TicketId });
  
    let attachmentList = '';
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
            attachmentList += `<div class="file-preview-item" data-attachment-id="${i.AttachmentId}">
            <div class="file-info">
        
                 <img class="file-icon"
                   src="${imgThumbnail}">
       
                 <div>
                     <div>
                         <span style="cursor: pointer;
}" class="text-decoration-underline text-primary" onclick="viewCorrespondenceAttachment(${i.AttachmentId})">
                           <strong>${i.FileName}</strong>
                         </span>                      
                     </div>
                        <small class="text-muted">${i.FileSize} KB</small>
                    </div>
                </div>
                <div>
                  <div class="btn-toolbar d-none" role="toolbar" aria-label="Toolbar with button groups">
                      <div class="btn-group me-2" role="group" aria-label="Second group" title="download attachment">
                         <button 
                           type="button" 
                           id="downloadCorrespondenceAttachmentBtn"
                           class="btn btn-primary "
                           onclick="downloadCorrespondenceAttachment(${i.AttachmentId})"
                            >
                             <i class="bi bi-download"></i>
                        </button>
                       </div>
                      <div class="btn-group me-2" role="group" aria-label="Third group" title="remove attachment">
                           <button onclick="deleteCorrespondenceAttachment(${i.AttachmentId})"  type="button" class="btn btn-danger">
                              <i class="bi bi-trash"></i>
                            </button>
                      </div>
                   
                  
                   </div>

                </div>
            </div>`
        })
        $("#correspondenceAttachmentContainer").empty().removeClass('d-none').append(attachmentList);
        $("#emptyState").addClass('d-none')
    } else {
        $("#correspondenceAttachmentContainer").empty().removeClass('d-none').append(`
        <div id="emptyState" class="alert alert-light text-center border-dashed m-0">
                        <i class="bi bi-paperclip text-muted fs-4"></i>
                        <p class="text-muted small mb-0">No files attached yet.</p>
                    </div>`);
    }
    
  
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


    // Memory Cleanup Event Hook
    $('#filePreviewModal').off('hidden.bs.modal').on('hidden.bs.modal', function () {
        // ONLY revoke if it's a locally generated Blob URL to prevent breaking DB download links
        if (isLocalFile && fileUrl.startsWith('blob:')) {
            URL.revokeObjectURL(fileUrl);
        }
        $('#file-preview-zone').empty();
    });

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
            url: `MyTickets/ticket-correspondence/delete-attachment?attachmentId=${attachmentId}`,
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