$(document).ready(function () {
    // DataTransfer object allows us to modify the read-only FileList of the input
    const dt = new DataTransfer();

    // Helper function to format bytes into readable sizes
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }

    // Listen for file selection
    $('#fileInput').on('change', function () {
        // Add newly selected files to our DataTransfer object
        for (let i = 0; i < this.files.length; i++) {
            dt.items.add(this.files[i]);
        }
        // Sync the updated FileList back to the input element
        this.files = dt.files;
        renderPreviewList();
    });

    // Render the preview list below the input
    function renderPreviewList() {
        const $list = $('#testfilePreviewList');
        $list.empty();

        Array.from(dt.files).forEach((file, index) => {
            const isImage = file.type.startsWith('image/');
            const fileUrl = isImage ? URL.createObjectURL(file) : '';

            // Show image thumbnail if it's an image, otherwise show a generic file icon
            const iconHtml = isImage
                ? `<img src="${fileUrl}" class="preview-thumb me-3" alt="Preview">`
                : `<i class="bi bi-file-earmark-text fs-3 text-secondary me-3"></i>`;

            const listItem = `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <div class="d-flex align-items-center text-truncate pe-2">
                                ${iconHtml}
                                <div class="text-truncate">
                                    <div class="fw-bold text-truncate">${file.name}</div>
                                    <small class="text-muted">${formatBytes(file.size)}</small>
                                </div>
                            </div>
                            <button type="button" class="btn btn-sm btn-outline-danger remove-file" data-index="${index}" title="Remove file">
                                <i class="bi bi-x-lg"></i>
                            </button>
                        </li>
                    `;
            $list.append(listItem);
        });
    }

    // Handle removing a single file from the list
    $('#filePreviewList').on('click', '.remove-file', function () {
        const indexToRemove = $(this).data('index');

        // Remove the file from DataTransfer
        dt.items.remove(indexToRemove);

        // Update the actual <input type="file"> element
        $('#fileInput')[0].files = dt.files;

        // Re-render the list
        renderPreviewList();
    });

    // Example form submission check
    $('#uploadForm').on('submit', function (e) {
        e.preventDefault();
        alert(`Ready to upload ${$('#fileInput')[0].files.length} file(s)!`);
    });
});