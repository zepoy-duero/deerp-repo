const gUserAccountModal = $("#modalSaveUserAccount")
const gbaseUrl = `/manage/users`

let gUserSelectControl = null
let gEmpCode = null
let gEmpName = null
let gOrgCode = 1
let gLocCode = 1
let gIsUpdate = false
let gTotalPageNo = 1
let gPageNo = 1
let gSearchParam = ""
let orgCode = 1

//---jeffvil---


$(async function () {
  await Promise.all([
    loadOrganization(),
    loadLocation(),
    loadRoles(),
    loadDepartment(),
    loadEmployees(),
  ])




  displayRecords(function () {
    displayPagination()
  })
})
//---jeffvil----
$("#select-organization").on("change", function () {
  orgCode = $(this).val();
  displayRecords(function () {
    displayPagination()
  })
})
//---------
$(".card").on("keyup", "#inpSearch", function (e) {
  e.preventDefault()
  if (e.key === "Enter") {
    submitSearchUserAccount()
  }
})

function submitSearchUserAccount() {
  gSearchParam = $("#inpSearch").val()
  displayRecords(function () {
    displayPagination()
  })
}

async function displayRecords(callback) {
  try {
    const url = `${gbaseUrl}/getUsers?orgCode=${orgCode}&searchParam=${encodeURIComponent(gSearchParam)}&pageNo=${gPageNo}`
    const response = await fetch(url)

    const data = await response.json()
    const rowsCount = data.length
    let rows = ""

    let totalActiveUsers = 0
    let totalInactiveUsers = 0
    let totalConsultants = 0
    let totalOnPayroll = 0
    let totalEmployees = 0

    if (rowsCount > 0) {
      for (let i = 0; i < rowsCount; i++) {
        gTotalPageNo = data[0].PAGE_COUNT
        totalCount = data[0].TOTAL_COUNT
        totalActiveUsers = data[0].TOTAL_ACTIVE_USERS
        totalInactiveUsers = data[0].TOTAL_INACTIVE_USERS
        totalConsultants = data[0].TOTAL_CONSULTANTS
        totalOnPayroll = data[0].TOTAL_ON_PAYROLL
        totalEmployees = data[0].TOTAL_EMPLOYEES

        rows += `
                <tr>
                    <td id="org-code" style="display:none">${data[i].ORG_CODE}</td>
                    <td>${i + 1}</td>
                    <td>
                        <button type="button" class="btn btn-danger rounded-1" onclick="showModalUpdateUserAccount(${data[i].USER_CODE})"><span class="fas fa-pencil-alt"></span> Edit</button>
                    </td>
                    <td>
                        <div class="text-uppercase fw-bolder fs-6">
                            <span class="text-main">${data[i].EMP_NAME}</span>
                        </div>
                        <div class="small"><strong>Role:</strong> ${data[i].ROLE_NAME}</div>
                        <div class="small"><strong>Department:</strong> ${data[i].DEPT_NAME}</div>
                        <div class="text-muted small">${data[i].USERNAME} / ${data[i].EMAIL_ADDRESS}</div>
                        <div class="extra-small d-flex gap-1 py-1">
                            ${data[i].IS_ACTIVE === `Y` ? `<span class="badge bg-success">Active</span>` : `<span class="badge bg-danger">Inactive</span>`}
                        </div>
                    </td>
                    <td>
                        <div class="d-flex gap-2">
                            <div class="dropdown">
                              <button class="btn btn-sm btn-light rounded-1" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <i class="fas fa-ellipsis-v"></i>
                              </button>
                              <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="javascript:void(0)" onclick="resetPassword(${data[i].USER_CODE})">Reset Password</a></li>
                                <li><a class="dropdown-item" href="javascript:void(0)" onclick="showPassword(${data[i].USER_CODE})">Show Password</a></li>
                                <li><a class="dropdown-item text-danger" href="javascript:void(0)" onclick="deleteAccount(${data[i].USER_CODE})">Delete Account</a></li>
                              </ul>
                            </div>
                        </div>
                    </td>
                </tr>`
      }
    } else {
      rows = `<tr><td colspan="8" class="text-center">No records found.</td></tr>`
    }

    $("#totalCount").text(totalCount)
    $("#totalActive").text(totalActiveUsers)
    $("#totalInactive").text(totalInactiveUsers)

    $("#totalEmployees").text(totalEmployees)
    $("#totalConsultants").text(totalConsultants)
    $("#totalOnPayroll").text(totalOnPayroll)

    $("#tblUsers").find("tbody").empty().append(rows)

  } catch (error) {
    console.log("Error: " + error)
    console.log("Failed to load users data.")
  } finally {
    if (callback) callback()
  }
}

function showModalCreateUserAccount() {
  $(gUserAccountModal).modal("show")
  $(gUserAccountModal).find(".modal-title").text("New User Account Entry")
  $(gUserAccountModal).find("#empSearchInputContainer").removeClass("d-none")
  $(gUserAccountModal).find("#empLabelInputContainer").addClass("d-none")
  $(gUserAccountModal).find("#selIs2FAEnabled").val('N').trigger("change") // default disabled

  gIsUpdate = false

  setEventTrigger()
}

async function showModalUpdateUserAccount(userCode) {
  $(gUserAccountModal).find(".modal-title").text("Update User Account")
  $(gUserAccountModal).find("#empSearchInputContainer").addClass("d-none")
  $(gUserAccountModal).find("#empLabelInputContainer").removeClass("d-none")
  $(gUserAccountModal).modal("show")

  disableForm("frmUserAccountDetails", true)

  gIsUpdate = true

  const url = `${gbaseUrl}/getUser?userCode=${userCode}`
  const response = await fetch(url)

  if (!response.ok)
    throw new Error(`Http error! Status: ${response.status}`)

  const data = await response.json()

  $(gUserAccountModal).find("#inpUserCode").val(data.USER_CODE)
  $(gUserAccountModal).find("#selOrgCode").val(data.ORG_CODE).addClass("readonly-event")
  $(gUserAccountModal).find("#selLocCode").val(data.LOC_CODE).addClass("readonly-event")
  $(gUserAccountModal).find("#inpEmpCode").val(data.EMP_CODE)
  $(gUserAccountModal).find("#inpEmpId").val(data.EMP_ID)
  $(gUserAccountModal).find("#inpEmpStatus").val(data.EMP_STATUS)
  $(gUserAccountModal).find("#selRoleCode").val(data.ROLE_CODE)
  $(gUserAccountModal).find("#selIsActive").val(data.IS_ACTIVE)
  $(gUserAccountModal).find("#inpEmailAddress").val(data.EMAIL_ADDRESS)
  $(gUserAccountModal).find("#inpUserName").val(data.USERNAME).addClass("readonly-event")
  $(gUserAccountModal).find("#inpPassword").val(data.PASSWORD)
  $(gUserAccountModal).find("#inpEmpName").val(data.EMP_NAME).addClass("readonly-event")
  $(gUserAccountModal).find("#selIs2FAEnabled").val(data.IS_2FA_ENABLED)

  gOrgCode = data.ORG_CODE
  gLocCode = data.LOC_CODE

  loadDepartment().then(function () {
    $(gUserAccountModal).find("#selDeptCode").val(data.DEPT_CODE)
  })

  disableForm("frmUserAccountDetails", false)
}

async function submitSaveUser(element) {
  const form = element.closest("form")
  const token = $(form).find("input[name='__RequestVerificationToken']").val()
  const isValid = validateForm(form)
  const fd = new FormData(form)

  // This is the overall input validation of the form
  if (!isValid) {
    alert("Please enter the required fields.")
    return
  }

  // this checks if there is a selected employee using the Tomselect Library
  // this will only check if you are creating new user account.
  if (!gIsUpdate && gUserSelectControl.getValue() === '') {
    alert("Please enter the required fields.")
    return
  }

  try {
    const response = await fetch(`${gbaseUrl}/updSertUser`, {
      method: "POST",
      headers: { "RequestVerificationToken": token },
      body: fd
    })

    if (!response.ok) {
      if (response.status === 400) {
        const errorData = await response.json()
        for (const [field, messages] of Object.entries(errorData)) {
          toastr["error"](messages[0], field)
        }
        return
      }
      throw new Error(`Http error! Status: ${response.status}`)
    }

    const retval = await response.text()
    const rowsAffected = parseInt(retval) // convert the text to int
    const action = gIsUpdate ? "updated" : "created"

    if (rowsAffected > 0) {
      toastr["success"](`Succesfully ${action} a user account.`, "Success")
      displayRecords(function () {
        displayPagination()
      })
    } else {
      toastr["error"]("Failed to save a user account. Please try again.", "Error")
    }
  }
  catch (error) {
    console.log("Unexpected error: ", error)
  }
}

async function resetPassword(userCode) {
  const isConfirmed = confirm("Are you sure you want to reset the password?")
  if (isConfirmed) {
    const response = await fetch(`${gbaseUrl}/resetPassword?userCode=${userCode}`, {
      method: "POST"
    })

    if (!response.ok)
      throw new Error(`Http error! Status: ${response.status}`)

    toastr["success"]("Password has been reset. Your reset password is welcomeDEERP", "Success")
  }
}

async function showPassword(element) {
  const isChecked = $(element).is(":checked")
  if (isChecked)
    $(gUserAccountModal).find("#inpPassword").attr("type", "text")
  else
    $(gUserAccountModal).find("#inpPassword").attr("type", "password")
  //const response = await fetch(`${gbaseUrl}/showPassword?userCode=${userCode}`)

  //if (!response.ok)
  //    throw new Error(`Http error! Status: ${response.status}`)

  //const password = await response.text()

  //alert(`Your password is ${password}`)
}

async function deleteAccount(userCode) {
  const isConfirm = confirm("Are you sure you want to delete this user? You will NOT recover this account.")

  if (!isConfirm) return false

  const response = await fetch(`${gbaseUrl}/deleteUser?userCode=${userCode}`, {
    method: "POST"
  })

  if (!response.ok) {
    toastr["error"]("An error occured. Please contact your administrator.", "System Error")
    throw new Error(`Http error! Status: ${response.status}`)
  }

  const rowsAffected = await response.text()

  if (parseInt(rowsAffected) > 0)
    toastr["success"]("Successfully deleted a user account.", "Success")
  else
    toastr["error"]("Failed to delete a user account.", "Failed")

  displayRecords(function () {
    displayPagination()
  })
}

async function getEmployeeDetails() {
  disableForm("frmUserAccountDetails", true)

  const response = await fetch(`${gbaseUrl}/getEmployeeDetails?empCode=${gEmpCode}&empName=${encodeURIComponent(gEmpName)}&orgCode=${gOrgCode}&locCode=${gLocCode}`)

  if (!response.ok)
    throw new Error(`Http error! Status: ${response.status}`)

  const data = await response.json();

  $(gUserAccountModal).find("#inpEmpCode").val(data.EMP_CODE)
  $(gUserAccountModal).find("#inpEmpId").val(data.EMP_ID)
  $(gUserAccountModal).find("#selDeptCode").val(data.DEPT_CODE)
  $(gUserAccountModal).find("#inpEmailAddress").val(data.EMP_EMAIL)
  $(gUserAccountModal).find("#inpEmpStatus").val(data.EMP_STATUS)
  $(gUserAccountModal).find("#inpUserName").val(data.EMP_USERNAME)
  $(gUserAccountModal).find("#inpPassword").val(data.EMP_PASSWORD)
  $(gUserAccountModal).find("#selRoleCode").val(17) // NEW EMPLOYEE

  disableForm("frmUserAccountDetails", false)
}

async function loadEmployees() {
  gUserSelectControl = new TomSelect('#selEmpCode', {
    valueField: 'VALUE',
    labelField: 'TEXT',
    searchField: 'TEXT',
    load: async function (searchParam, callback) {
      const url = `${gbaseUrl}/getEmployee?searchParam=${encodeURIComponent(searchParam)}`
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Http error! Status:  ${response.status}`)
      }
      const json = await response.json()
      callback(json)
    },
    render: {
      option: function (item, escape) {
        return `<div>${escape(item.TEXT)}</div>`; // Display TEXT as the option
      },
      item: function (item, escape) {
        gEmpCode = item.VALUE
        gEmpName = item.TEXT
        getEmployeeDetails()
        return `<div>${escape(item.TEXT)}</div>`; // Display TEXT as the selected item
      }
    }
  })
}

async function loadOrganization() {
  //----modified----jeffvil-------
  const res = await $.get(`${gbaseUrl}/getAllOrganizations`)
  let data = $(res).sort((a, b) => a.VALUE - b.VALUE)
  //--------------------
  const totalCount = data.length
  let options = "";

  if (totalCount > 0) {
    for (let i = 0; i < data.length; i++) {
      options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
    }
  }
  console.log(options)

  $("#selOrgCode").empty().append(options);
  //------jeffvil----______________________-
  let orgSelectOptions = "<option value='0'>All Organizations</option>" + options
  $("#select-organization").empty().append(orgSelectOptions);
  //------*****------------------------------
}

async function loadLocation() {
  const data = await $.get(`${gbaseUrl}/getAllLocations`, { orgCode: gOrgCode })
  const totalCount = data.length
  let options = "";

  if (totalCount > 0) {
    for (let i = 0; i < data.length; i++) {
      options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
    }
  }

  $("#selLocCode").empty().append(options);
}

async function loadRoles() {
  const data = await $.get(`${gbaseUrl}/getAllRoles`)
  const totalCount = data.length
  let options = "";

  if (totalCount > 0) {
    for (let i = 0; i < data.length; i++) {
      options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
    }
  }

  $("#selRoleCode").empty().append(options);
}

async function loadDepartment() {
  const data = await $.get(`${gbaseUrl}/getAllDepartments`, {
    orgCode: gOrgCode,
    locCode: gLocCode
  })

  const totalCount = data.length
  let options = "";

  if (totalCount > 0) {
    for (let i = 0; i < data.length; i++) {
      options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
    }
  }

  $("#selDeptCode").empty().append(options);
}

function displayPagination() {
  let options = '';
  for (let i = 1; i <= gTotalPageNo; i++) {
    options += `<option>${i}</option>`
  }

  $(".card").find("#tblUsers tfoot #pagination #pageNo").empty().append(options);
  $(".card").find("#tblUsers tfoot #pagination #pageTotal").text(gTotalPageNo);
}

function setEventTrigger() {
  $(".modal").on("change", "#selOrgCode", async function () {
    gOrgCode = $(this).val()
    gLocCode = 1

    await Promise.all([
      loadLocation(),
      loadDepartment(),
      getEmployeeDetails()
    ])
  })

  $(".modal").on("change", "#selLocCode", async function () {
    gLocCode = $(this).val()
    await loadDepartment()
  })
}

function changePageNo(pageNo) {
  gPageNo = pageNo
  displayRecords()
}

function cancelModal(element) {
  const modal = $(element).closest(".modal")
  clearEntries(modal)
  closeModal(element)
}

function closeModal(element) {
  // reset the visited tab to false
  $(element).closest(".modal").modal("hide")
}

async function clearEntries(modal) {
  // clears & resets all the inputs
  //$(modal).find("input[type='checkbox']:checked, input[type='radio']:checked").prop("checked", false)
  //$(modal).find("input[type='text'], input[type='number'], input[type='password'], select, textarea").removeClass("readonly-event")
  //$(modal).find("input[type='hidden'], input[type='text'], input[type='number'], input[type='password'], textarea").val("")
  //$(modal).find("select").prop("selectedIndex", 0)
  $(modal).find("#inpPassword").attr("type", "password")

  $(modal).find('input, textarea, select').not(`input[name='__RequestVerificationToken']`).each(function () {
    if ($(this).is(':checkbox') || $(this).is(':radio')) {
      $(this).prop('checked', false);
    } else if ($(this).is('select')) {
      $(this).prop('selectIndex', 0).removeClass("is-invalid, readonly-event");
    } else {
      $(this).val('').removeClass("is-invalid, readonly-event");
    }
  });

  gUserSelectControl.clear()

  // load options
  gOrgCode = 1
  gLocCode = 1

  await Promise.all([loadLocation(), loadDepartment()])
}