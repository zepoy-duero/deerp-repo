const gBaseUrl = '/er/ticket';
const homeUrl = '/erp/home';

$(async function () {
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

  

    for (i = 0; i < 4; i++) {
        $("#tblTickets tbody").append(`<tr class="align-items-start">
                                            <td>MIS#${1 + i}</td>
                                            <td>Landrex Rebruera</td>
                                            <td>Add EMployee Directory</td>
                                            <td>02-05-2026</td>
                                            <td>
                                                <div class="badge bg-success ">Completed</div>
                                            </td>
                                            <td class ="text-start">
                                        
                                                <button type="button" class="btn btn-sm btn-danger rounded-2" data-bs-toggle="modal" data-bs-target="#editTicketModal">
                                                    <i class="fas fa-pencil-alt"></i> Edit</button>
                                                <button type="button" class="btn btn-sm btn-success btn-sm rounded-2">
                                                    <span class="fas fa-eye"></span> View
                                                </button>
                                              
                                            </td>
                                        </tr>`)
                    
    }
    showTicketList();
    $("#submitTicket").on("click", function () {
        $("#successAlert").removeClass('d-none')
    })
})
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
function showTicketList() {
    $("#ticketList").empty();
    for (i = 0; i <= 5; i++) {
        var item = `
        <li class="list-tem">
            <figure>
              <blockquote class="blockquote">
              <div class="col"><p>MIS#${i + 1}</p></div>
              <div class="col">
                <p>Speed Dial Directory - Table Column Alignment</p>
              </div>
              <div class="col text-end">
                <i  data-bs-toggle="modal" data-bs-target="#editTicketModal" class="fa fa-edit"></i>
              </div>  
              <blockquote>
              <figcaption class="blockquote-footer">
                <cite title="Source Title">
                 <div class="col">
                    ${getStatus(i)}
                 </div>
                <div class="col"><p>
                    <cite title="Source Title">Created at Jan. 6, 2026</cite></p>
                </div>
                <div class="col"></div>
                </cite>
              </figcaption>
            </figure>
        </li>
        `
        var listItem = `<li class="list-group-item d-flex justify-content-start align-items-start h-25">
                                        <div class="row no-box-shadow">
                                               <div class="col-auto>
                                                   <div class="card">
                                                       <div class="card-subtitle">
                                                            <div class="fw-bold">MIS#${i + 1}</div> 
                                                       </div>
                                                       <div class="card-text">
                                                            <span class="badge ${i % 2 == 1 ?  `bg-primary` : `bg-success` } rounded-pill">In Progress</span>
                                                       </div>
                                                   </div>                                                
                                                </div>
                                                <div class="vr mx-2"></div>
                                                <div class="col-auto">
                                                    <div class="fw-bold text-start">Speed Dial Directory - Table Column Alignment</div>              
                                                    <span class="mark" text-muted">Created at Jan. 6,Created at Jan. 6, 2026 2026</span>       
                                                 </div>
                                                 <div class="col-1 text-end">
                                                   <i  data-bs-toggle="modal" data-bs-target="#editTicketModal" class="fa fa-edit"></i>
                                                 </div>
                                         
                        </li>
                                        <div class="hr"></div>`
        $("#ticketList").append(listItem);
    }
}   
async function selectUsers() {
    let params = {
        org_code:1,
        gsearchParam: encodeURIComponent(""),
        gPagNo: 1
    }
    

    let data = await $.get(`/erp/manage/users/getUsers`, params)
    console.log(data)
}
