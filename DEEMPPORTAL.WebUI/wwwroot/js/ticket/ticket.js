const gBaseUrl = '/ticket';
const homeUrl = '/home';



$(async function () {
   
   
    renderAttachments()
    var employees = [
        {
            id: 1,
            name: 'Jeffvil'
        },
        {
            id: 2,
            name: 'Landrex'
        },
        {
            id: 3,
            name: 'Avito'
        },
        {
            id: 4,
            name: 'Avito'
        },
        {
            id: 5,
            name: 'Avito'
        },
        {
            id: 6,
            name: 'Avito'
        },
        {
            id: 7,
            name: 'Avito'
        },
    ]
    $('#table').on('click-row.bs.table', function (e, row, $element, field) {
        $("#editTicketModal").modal("toggle");
    });
    $('#isMajorChange').on('change', function () {
        $('#managementApproval').toggleClass('d-none', !this.checked);
    });

    // Search as user types
    $("#employeeSearch").on("keyup", function () {
        console.log("enter")
        let keyword = $(this).val().toLowerCase();

        if (keyword.length === 0) {
            $("#employeedropdown").hide();
            return;
        }

        let filtered = employees.filter(emp =>
            emp.name.toLowerCase().includes(keyword)
        );

        renderDropdown(filtered);
        $("#employeedropdown").show();
    });

    // Click selection
    $("#employeedropdown").on("click", ".list-group-item-action", function (e) {
        e.preventDefault();

        let id = $(this).data("id");
        let name = $(this).data("name");

        $("#hiddenInput").val(id);        // store EmployeeId
        $("#searchInput").val(name);      // show Employee Name
        $("#employeedropdown").hide();
    });

    // Hide dropdown if clicking outside
    $(document).on("click", function (e) {
        if (!$(e.target).closest("#employeeSearch, #employeedropdown").length) {
            $("#employeedropdown").hide();
        }
    });
    const response = await fetch(`${homeUrl}/getUserDetails`);

    if (!response.ok) {
        console.error('Failed to fetch user details');
        return;
    }

    const data = await response.json();
    console.log(data)
    let currentDate = new Date()
    $("#requestedBy").text(data.EMP_NAME)
    $("#requestDate").text(currentDate.toISOString().slice(0, 10))

    for (i = 1; i < 5; i++) {
        $("#tblTickets tbody").append(`<tr data-user-id="${i}">
                                           
                                           <td class="text-start">
                                           <span>
                                             <i class="fas fa-pen-to-square fs-5 text-primary btn"></i>
                                           </span>
                                             <span> MIS#${1}</span>
                                            </td>
                                            <td class="text-start">Landrex Rebruera</td>
                                            <td class="text-start">Add EMployee Directory</td>
                                            <td class="text-start">02-05-2026</td>
                                            <td class="text-start">
                                                <span class="badge badge-sm rounded-pill bg-success text-white">Completed</span>
                                            </td>
                                            
                                        </tr>`)
                    
    }
    
    $("#viewTicketDetailsBtn").on("click", () => {
        $("#editTicketModal").modal("toggle");
    })
    $("#submitTicket").on("click", function () {
        console.log('fired')
        $("#successAlert").removeClass('d-none');
     
        setTimeout(function () {
            $("#successAlert").addClass('d-none');
        }, 3000);
    })
    $("#tblBody").on("click", function (event) {
        const clickedRow = event.target.closest('tr');

        // Ensure a row was found and it's within the tbody
        if (clickedRow && this.contains(clickedRow)) {
            // Access data from the row, for example, using data attributes
            const userId = clickedRow.getAttribute('data-user-id');
            $("#editTicketModal").modal("toggle");
          
        }
    })
    // PREVIEW FILE
    $("#btnPreview").on("click", function () {

        let fileName = $(this).closest(".attachment-item").find(".file-name").text();
        let fileUrl = "/img/" + fileName;

        $("#previewImage, #previewPdf, #previewOther").addClass("d-none");

        if (fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
            $("#previewImage").attr("src", fileUrl).removeClass("d-none");
        }
        else if (fileName.match(/\.(pdf)$/i)) {
            $("#previewPdf").attr("src", fileUrl).removeClass("d-none");
        }
        else {
            $("#previewOther").removeClass("d-none");
        }

        $("#attachmentPreviewContainer").toggleClass("d-none");
    });


    // DELETE FILE
    $(".btnDelete").on("click", function () {

        if (!confirm("Delete this file?")) return;

        let item = $(this).closest(".attachment-item");
        let fileName = item.find(".file-name").text();

        $.post('/Attachment/Delete', { fileName: fileName }, function () {
            item.remove();
        });

    });


    // RENAME FILE
    $(".btnRename").on("click",  function () {

        let item = $(this).closest(".attachment-item");

        let newName = item.find(".file-input").val();

        $.post('/Attachment/Rename', {
            oldName: item.find(".file-name").text(),
            newName: newName
        }, function () {

            item.find(".file-name").text(newName);

            alert("Renamed successfully!");
        });

    });


    // UPLOAD FILES
   
})
function toggleSearchBar() {
    $("#inpSearchParam").toggleClass("d-none");
}
//    function showAttachments() {

//        const blob = new Blob(["Sample content"], { type: "text/plain" });
//        let files = blob;
//        let formData = new FormData();

//        for (let i = 0; i < files.length; i++) {
//            formData.append("files", files[i]);
//        }

//        $.ajax({
//            url: '/Attachment/Upload',
//            type: 'POST',
//            data: formData,
//            processData: false,
//            contentType: false,
//            success: function (res) {

//                // Append new files to UI
//                res.forEach(file => {
//                    $("#attachmentsPreviewContainer").append(`
//                    <div class="col-md-6 attachment-item">
//                        <div class="border rounded p-2 d-flex justify-content-between">
//                            <span class="file-name">${file}</span>
//                            <button class="btn btn-sm btn-outline-primary btnPreview">Preview</button>
//                        </div>
//                    </div>
//                `);
//                });

//            }
//        });
//}
function renderDropdown(list) {
    $("#employeedropdown").empty();

    if (list.length === 0) {
        $("#employeedropdown").append(
            '<div class="list-group-item text-muted">No results found</div>'
        );
        return;
    }

    list.forEach(emp => {
        $("#employeedropdown").append(
            `<a href="#" class="list-group-item border-0 list-group-item-action"
                        data-id="${emp.id}"
                        data-name="${emp.name}">
                        ${emp.name}
                    </a>`
        );
    });
}
 function getStatus(i){
    if (i % 2 == 1) return '<span class="badge bg-success rounded-pill">Completed</span>'
    else return '<span class="badge bg-primary rounded-pill">In Progress</span>'
}

async function selectUsers() {
    let params = {
        org_code:1,
        gsearchParam: encodeURIComponent(""),
        gPagNo: 1
    }
    

    let data = await $.get(`/manage/users/getUsers`, params)
    console.log(data)
}
function mounted() {
    $('#table').bootstrapTable()
}  