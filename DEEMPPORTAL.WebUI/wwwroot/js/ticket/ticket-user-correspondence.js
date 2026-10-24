
function bindUserCorrespondenceHandlers() {
    $("#postUserCorrespondenceBtn").on("click", async function (e) {

        e.preventDefault();
        if (correspondenceAction == 'create') {
            let createParam = getCreateCorrespondenceParams('User');
            console.log(createParam)
            console.log(!$("#userCorrespondenceField").val())
            if (!$("#userCorrespondenceField").val()) {

                alert("Please enter a message.");

                $("#userCorrespondenceField").focus();

                return;
            } else {
                await createCorrespondence(createParam);
            }

        } else {
            let updateParam = getUpdateCorrespondenceParams();
            console.log(updateParam)
            if (!updateParam.Message) {

                alert("Please enter a message.");

                $("#userCorrespondenceField").focus();

                return;
            } else {
                await updateCorrespondence(updateParam);
            }

        }
    });
   
    //CLEAR TEXTAREA
    $("#clearUserCorrespondenceBtn").on('click', function () {
        $("#userCorrespondenceField").val('');
    });
    $("#addUserCorrespondenceAttachmentBtn").on('click', function (event) {
        event.preventDefault()
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
                await  ();
                return;
            }
        } else return;
    })
}
function escapeHtml(value) {

    if (value === null || value === undefined) {
        return '';
    }

    return $('<div>')
        .text(value)
        .html();
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
function renderTicketCorrespondence(correspondences, correspondenceType) {

    const $userCorrespondence = (correspondenceType == 'User') ? $('#userCorrespondenceContainer') : $("#internalCorrespondenceContainer");

    $userCorrespondence.empty();

    if (!correspondences || correspondences.length === 0) {

        $userCorrespondence.append(`
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
                $userCorrespondence.append(`
                    <div class="d-flex msg-customer mb-4 align-items-start">
                        <div class="avatar bg-secondary text-white 
                                    rounded-circle d-flex 
                                    align-items-center justify-content-center 
                                    me-3"
                             style="width:40px;height:40px;min-width:40px;">
                            <i class="bi bi-person-fill"></i>
                        </div>
                        <div class="flex-grow-1">
                            <div class="d-flex justify-content-between 
                                        align-items-center mb-1">
                                <span class="fw-bold small text-dark">
                                    ${escapeHtml(item.CreatedByName)}
                                    <span class="text-muted 
                                                 font-monospace fw-normal">
                                        (${escapeHtml(item.CreatedByRole || 'Employee')})
                                    </span>
                                </span>
                                <span class="text-muted small">
                                    ${formatCorrespondenceDate(item.CreatedDate)}
                                </span>
                            </div>
                            <div class="corr-msg p-3 bg-white border shadow-sm small fw-normal">
                                ${formatMessage(item.Message)}
                            </div>
                           <div class="container" id="userCorrespondenceAttachmentContainer">
                       
                           </div>
                            
                        </div>
                    </div>
                `);

            } else {

                // -------------------------------------------------------
                // AGENT / SUPPORT MESSAGE
                // -------------------------------------------------------
                $userCorrespondence.append(`
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

                            <div class="corr-msg p-3 bg-main text-white 
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
function loadUserCorrespondence(ticketId) {
    try {
        const correspondenceResponse = await $.get(`/MyTickets/ticket-correspondence/ticketId/${ticketId}`, {
            ticketId: ticketId,
            correspondenceType: 'User'
        });
        console.log(correspondenceResponse.data);

        let data = correspondenceResponse.data;
        renderTicketCorrespondence(data, selectedTicket.TicketId,'User');
        return;
        const $correspondenceList = $("#userCorrespondenceContainer").empty();

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
                console.log($item)
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