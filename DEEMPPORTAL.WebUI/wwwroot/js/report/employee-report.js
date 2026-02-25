const gBaseUrl = "/report/employee-report"
const gModal = "#modalEmployeeProfileDetails"
const gTable = "#tblEmployeeProfile"

let gData = null
let gFilterStatus = ""
let gFilterValue = "Y"
let gSearchParam = ""

let gTotalPageNo = 1
let gTotalCount = 1
let gPageNo = 1

$(async function () {
  initDOMEvents();
  await displayRecords()
  await displayTotalCount()
  displayPagination()
})

$(".card").on("keyup", "#inpSearchParam", function (e) {
  if (e.key === "Enter") {
    submitSearch()
  }
})

async function filterStatus(status) {
  gFilterStatus = status
  gPageNo = 1

  // highlight clicked dropdown item
  $(".dropdown-menu .dropdown-item").removeClass("active");   // remove from all
  $(".dropdown-menu .dropdown-item").filter(function () {
    return $(this).text().trim() === (status === "" ? "All" : status);
  }).addClass("active");

  await displayRecords().then(function () {
    displayPagination()
  })
}

async function filterRecords(element) {
  gFilterValue = $(element).attr("filter-value")
  gSearchParam = $("#inpSearchParam").val()
  gPageNo = 1

  await displayRecords().then(function () {
    displayPagination()
  })
}

async function submitSearch() {
  gSearchParam = $("#inpSearchParam").val()
  gPageNo = 1

  await displayRecords().then(function () {
    displayPagination()
  })
}

async function displayTotalCount() {
  const response = await fetch(`${gBaseUrl}/getTotalEmployeeProfileCount?`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json()

  $("#totalUpdated").text(data.TOTAL_UPDATED)
  $("#totalNotUpdated").text(data.TOTAL_NOT_UPDATED)
}

async function displayRecords() {
  setLoadingGrid(gTable)
  const response = await fetch(`${gBaseUrl}/getAllEmployeeProfiles?` + new URLSearchParams({
    searchParam: gSearchParam,
    filterValue: gFilterValue,
    filterStatus: gFilterStatus,
    pageNo: gPageNo
  }).toString())

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const result = await response.json()
  const data = result.Rows
  const totalCount = data.length

  let tbody = ""
  let isUpdatedIcon = `<svg  xmlns="http://www.w3.org/2000/svg"  width="20"  height="20"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-check text-green"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-1.293 5.953a1 1 0 0 0 -1.32 -.083l-.094 .083l-3.293 3.292l-1.293 -1.292l-.094 -.083a1 1 0 0 0 -1.403 1.403l.083 .094l2 2l.094 .083a1 1 0 0 0 1.226 0l.094 -.083l4 -4l.083 -.094a1 1 0 0 0 -.083 -1.32z" /></svg>`

  gData = data
  gTotalPageNo = result.PageCount

  if (gFilterValue === 'N') {
    isUpdatedIcon = `<svg xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="currentColor"  class="icon icon-tabler icons-tabler-filled icon-tabler-circle-x text-accent"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 3.34a10 10 0 1 1 -14.995 8.984l-.005 -.324l.005 -.324a10 10 0 0 1 14.995 -8.336zm-6.489 5.8a1 1 0 0 0 -1.218 1.567l1.292 1.293l-1.292 1.293l-.083 .094a1 1 0 0 0 1.497 1.32l1.293 -1.292l1.293 1.292l.094 .083a1 1 0 0 0 1.32 -1.497l-1.292 -1.293l1.292 -1.293l.083 -.094a1 1 0 0 0 -1.497 -1.32l-1.293 1.292l-1.293 -1.292l-.094 -.083z" /></svg>`
  }

  if (totalCount > 0) {
    for (let i = 0; i < totalCount; i++) {
      tbody += `
              <tr>
                  <td>${data[i].ROW_NO}</td>
                  <td class="">
                    <div class="d-flex align-items-center">
                      <div class="me-4">
                        <div id="" class="avatar avatar-sm">
                          ${displayImage(data[i].EMP_PHOTO)}
                        </div>
                      </div>
                      <div>
                        <a href="javascript:void(0)" onclick="showModalEmployeeProfileDetails(${i})" class="nav-link fw-bolder text-main d-flex gap-1">
                          <p class="mb-0 small">
                            ${data[i].EMPLOYEE_NAME}
                            <span class="">
                              ${isUpdatedIcon}
                            </span>
                          </p>
                         </a>
                        <div class="d-flex align-items-center">
                          <small class="mb-0 text-muted">${data[i].EMPLOYEE_POSITION}</small>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>${data[i].EMAIL_ADDRESS}</td>
                  <td>${data[i].MOBILE_NO}</td>
                  <td>${data[i].DEPARTMENT_NAME}</td>
              </tr>`
    }
  } else {
    tbody = `<tr>
      <td colspan="5" class="text-center">No records found.</td>
      </tr>`
  }

  $(gTable).find("tbody").empty().append(tbody)
}

function showModalEmployeeProfileDetails(index) {
  $(gModal).find("#imgContainer").empty().append(`${displayImage(gData[index].EMP_PHOTO)}`)
  $(gModal).find("#employeeProfileName").text(gData[index].EMPLOYEE_NAME)
  $(gModal).find("#employeeProfilePosition").text(gData[index].EMPLOYEE_POSITION)
  $(gModal).find("#employeeProfileDepartment").text(gData[index].DEPARTMENT_NAME)
  $(gModal).find("#fieldBloodGroup").text(gData[index].BLOOD_GROUP)
  $(gModal).find("#fieldFoodPreference").text(gData[index].FOOD_PREFERENCE === "Veg" && gData[index].FOOD_PREFERENCE !== "" ? "Vegetarian" : "Non-Vegetarian")
  $(gModal).find("#fieldDietaryRestriction").text(gData[index].DIETARY_RESTRICTION)
  $(gModal).find("#fieldMedicalAllergies").text(gData[index].MEDICAL_ALLERGIES)
  $(gModal).find("#fieldEmergencyContact").text(gData[index].EMERGENCY_CONTACT)
  $(gModal).find("#fieldResidentialAddress").text(gData[index].RESIDENTIAL_ADDRESS)
  $(gModal).find("#fieldMobileNumber").text(gData[index].MOBILE_NO)

  $(gModal).modal("show")
}

function displayPagination() {
  let options = '';
  for (let i = 1; i <= gTotalPageNo; i++) {
    options += `<option value="${i}">${i}</option>`
  }

  $(".card").find(".card-footer #pagination #pageNo").empty().append(options);
  $(".card").find(".card-footer #pagination #pageTotal").text(gTotalPageNo);
}

async function changePageNo(pageNo) {
  gPageNo = pageNo
  disableForm("pagination", true)
  await displayRecords().then(function () {
    disableForm("pagination", false)
  })
}

function initDOMEvents() {
  $(".card-footer").on("click", "#btnPrev", async function () {
    if (gPageNo > 1) {
      --gPageNo
      $("#pagination").find("#pageNo").val(gPageNo)
      disableForm("pagination", true)
      await displayRecords().then(function () {
        disableForm("pagination", false)
      })
    }
  })

  $(".card-footer").off("click", "#btnNext").on("click", "#btnNext", async function (e) {
    e.preventDefault()
    if (gPageNo < gTotalPageNo) {
      ++gPageNo
      console.log(gPageNo)
      $("#pagination").find("#pageNo").val(gPageNo)
      disableForm("pagination", true)
      await displayRecords().then(function () {
        disableForm("pagination", false)
      })
    }
  })
}

function exportAsExcel(element) {
  $(element).prop("disabled", true)
  const request = new Request(`${gBaseUrl}/exportAsExcel?` + new URLSearchParams({
    filterValue: gFilterValue,
    filterStatus: gFilterStatus
  }).toString(), {
    method: "POST",
  })

  fetch(request)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      $(element).prop("disabled", false)
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `Employee-Profile-Report.xlsx`;  // Set the file name
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);  // Clean up after the download
    })
}

function displayImage(byteImg) {
  if (byteImg == null)
    return `<img class="avatar-img rounded-circle shadow-lg" src="https://placehold.co/100" alt="default profile" width="200">`;

  return `<img class="avatar-img rounded-circle shadow-lg" src="data:image/jpg;base64,${byteImg}" alt="" loading="lazy" width="200">`;
}

function clearEntries(form) {
  // clears & resets all the inputs
  $(form).find('input, textarea, select').not(`input[type='hidden']`).each(function () {
    if ($(this).is(':checkbox') || $(this).is(':radio')) {
      $(this).prop('checked', false);
    } else if ($(this).is('select')) {
      $(this).prop('selectIndex', 0).removeClass("is-invalid readonly-event");
      $(this).val('').removeClass("is-invalid readonly-event");
    } else {
      $(this).val('').removeClass("is-invalid readonly-event");
    }

    $(this).prop("readonly", false)
  });
}