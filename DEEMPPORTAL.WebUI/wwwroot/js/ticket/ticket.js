const gBaseUrl = '/ticket';
const homeUrl = '/home';

$(async function () {
    //$("#switchTbl").on("click",function () {
    //    $("#ticketHeader1").toggleClass("d-none")
    //    $("#ticketHeader2").toggleClass("d-none")
    //});
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
    //const response = await fetch(`${homeUrl}/getUserDetails`);

    //if (!response.ok) {
    //    console.error('Failed to fetch user details');
    //    return;
    //}

    //const data = await response.json();
    //console.log(data)
    //let currentDate = new Date()
    //$("#requestedBy").text(data.EMP_NAME)
    //$("#requestDate").text(currentDate.toISOString().slice(0, 10))

    for (i = 0; i < 4; i++) {
        $("#tblTickets tbody").append(`<tr class="">
                                            <td class="text-center">
                                        
                                              
                                                    <i class="fas fa-pencil-alt btn btn-sm" data-bs-toggle="modal" data-bs-target="#editTicketModal"></i>
                                              
                                            </td>
                                            <td class="text-center">MIS#${1 + i}</td>
                                            <td class="text-center">Landrex Rebruera</td>
                                            <td class="text-center">Add EMployee Directory</td>
                                            <td class="text-center">02-05-2026</td>
                                            <td class="text-center">
                                                <div class="badge bg-success ">Completed</div>
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
        `;
        var listItem = `<li class="list-group-item d-flex align-items-center">
                                               <div class="p-2 flex-fill text-start">                                     
                                                       <div class="card-subtitle">
                                                            <div class="fw-bold">MIS#${i + 1}
                                                       </div> 
                                                       <span class="small text-muted">
                                                                Riyaz Ahmed
                                                       </span>
                                                   </div>                                                
                                                </div>
                                                <div class="vr mx-4"></div>
                                                <div class="p-2 flex-fill">
                                                    <div class="fw-bold text-start">Speed Dial Directory - Table Column Alignment</div>              
                                                    <span class="small text-muted">Created at Jan. 6, 2026 
                                                    <div class="progress" role="progressbar" aria-label="Default striped example" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100">
                                                          <div class="progress-bar progress-bar-striped" style="width: 60%">progress</div>
                                                        </div>
                                                      <span class="d-none badge ${i % 2 == 1 ? `bg-primary` : `bg-success`} rounded-pill">In Progress</span>
                                                   </span>       
                                                 </div>
                                                 <div class="p-2 flex-fill text-end">
                                                    <i class="fas fa-pencil-alt text-primary"></i>
                                                 </div>            
                          
                         </li>
                         <div class="hr"></div>`;
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
