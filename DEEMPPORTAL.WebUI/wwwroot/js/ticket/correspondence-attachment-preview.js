$(async function () {
    $('#file-chooser').on('change', function (e) {
        
        const file = e.target.files[0];
        if (!file) return;

        const fileName = file.name;
        const fileExtension = fileName.split('.').pop().toLowerCase();
        const fileUrl = URL.createObjectURL(file); // Generates a safe local preview blob URL

        // Update modal title with current file name
        $('#preview-filename').text('Preview: ' + fileName);

        let previewHtml = '';

        // Route based on File Type
        if (fileExtension === 'pdf') {
            // 1. PDF Handling (Native browser rendering)
            previewHtml = `<iframe src="${fileUrl}" class="w-100 h-100" style="border:none;"></iframe>`;

        } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(fileExtension)) {
            // 2. Image Handling
            previewHtml = `<img src="${fileUrl}" class="img-fluid style="max-height: 100%; object-fit: contain;" alt="Preview">`;

        } else if (['xlsx', 'xls', 'docx', 'doc'].includes(fileExtension)) {
            // 3. Office Documents Handling
            // Local web browsers cannot natively render binary Office formats (.docx / .xlsx).
            // If the file is already uploaded to a public server, use Microsoft Office Online Viewer:
            // previewHtml = `<iframe src="https://live.com{encodeURIComponent(PUBLIC_FILE_URL)}" class="w-100 h-100" style="border:none;"></iframe>`;

            // For LOCAL browser-only previewing before uploading, offer a direct download link:
            previewHtml = `
                <div class="text-center p-5">
                  <i class="bi bi-file-earmark-excel fs-1 text-success d-block mb-3"></i>
                  <h4>Office Files cannot be previewed directly offline</h4>
                  <p class="text-muted">You can open it locally by clicking below:</p>
                  <a href="${fileUrl}" download="${fileName}" class="btn btn-outline-primary">Open / Download File</a>
                </div>`;

        } else {
            // 4. Fallback for unhandled files
            previewHtml = `
                <div class="text-center p-5">
                  <h5>Preview unavailable for this file format (.${fileExtension})</h5>
                  <a href="${fileUrl}" download="${fileName}" class="btn btn-secondary mt-2">Download File Instead</a>
                </div>`;
        }

        // Inject into DOM and present the modal
        $('#file-preview-zone').html(previewHtml);
        //$('#filePreviewModal').modal('show');

        // Revoke the object URL when modal closes to free system RAM
        $('#filePreviewModal').on('hidden.bs.modal', function () {
            URL.revokeObjectURL(fileUrl);
            $('#file-preview-zone').empty();
        });
    });
});
