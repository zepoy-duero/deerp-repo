function renderTicketCorrespondence(correspondences, ticketId) {

    const $userCorrespondence = $('#userCorrespondenceContainer');

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

            // Check if this is an MIS/Support agent message
            if (item.CreatedByCode === CurrentUser.USER_CODE || item.CreatedByRole === 'MIS') {

                // -------------------------------------------------------
                // AGENT / SUPPORT MESSAGE
                // -------------------------------------------------------
                $userCorrespondence.append(`
                    <div class="d-flex msg-agent mb-4 
                                align-items-start flex-row-reverse">

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

                        </div>

                    </div>
                `);

            } else {

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
                        </div>
                    </div>
                `);

            }

        });
    }


    // ---------------------------------------------------------------
    // REPLY / CORRESPONDENCE INPUT
    // ---------------------------------------------------------------

    $userCorrespondence.append(`

        <div class="border-top pt-4 mt-4">

            <div class="mb-2">

                <label class="form-label fw-bold small">
                    Add Correspondence
                </label>

            </div>

            <textarea
                id="TicketCorrespondence"
                class="form-control"
                rows="4"
                placeholder="Type your message here..."
                maxlength="5000"></textarea>

            <div class="d-flex justify-content-between 
                        align-items-center mt-2">

                <small class="text-muted">
                    <i class="bi bi-info-circle me-1"></i>
                    Your message will be added to the ticket history.
                </small>

                <button
                    type="button"
                    class="btn btn-main px-4"
                    id="btnSendCorrespondence"
                    data-ticket-id="${ticketId}">

                    <i class="bi bi-send me-1"></i>
                    Send

                </button>

            </div>

        </div>

    `);

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
function loadTicketCorrespondence(ticketId) {

    const $container = $('#ticketCorrespondenceContainer');

    $container.html(`
        <div class="text-center py-5 text-muted">
            <div class="spinner-border spinner-border-sm me-2"></div>
            Loading correspondence...
        </div>
    `);

    $.ajax({
        url: `${gBaseUrl}/get-ticket-correspondence`,
        type: 'GET',
        data: {
            TicketId: ticketId
        },

        success: function (response) {

            if (response.success) {

                renderTicketCorrespondence(
                    response.data,
                    ticketId
                );

            } else {

                $container.html(`
                    <div class="alert alert-danger">
                        ${escapeHtml(
                    response.message ||
                    'Unable to load correspondence.'
                )}
                    </div>
                `);

            }
        },

        error: function (xhr) {

            console.error(
                'Load correspondence error:',
                xhr.responseText
            );

            $container.html(`
                <div class="alert alert-danger">
                    Unable to load ticket correspondence.
                </div>
            `);
        }
    });
}