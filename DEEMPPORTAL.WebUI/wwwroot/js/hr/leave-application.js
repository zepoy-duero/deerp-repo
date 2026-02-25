const gBaseUrl = "/hr/leave-application"
const gModal = $("#modalSaveLeaveEntry")
const gTable = $("#tblLeaveApplications")
const gModalLeaveEntry = $(gModal).find("#leaveEntry")
const gModalUserNotice = $(gModal).find("#txtNotice")

const gListOfLeaveType = {
  ANNUAL: "ANNUAL",
  LOCAL: "LOCAL",
  EMERGENCY: "EMERGENCY",
  MEDICAL: "MEDICAL"
}

let gIsUpdate = false
let gIsValidNumOfDays = false
let gLeaveType = null
let gNoticeMessage = ""
let gNumOfLeaveNoticeMessage = ""
let gAccumulatedDays = 0
let gTempAccumulatedDays = 0 // in case the gAccumulatedDays is modified we can still retain the old accumulated days

let gSearchParam = ""
let gTotalPageNo = 1
let gTotalCount = 1
let gPageNo = 1

const gListLastResumptionDate = {
  ANNUAL: "",
  LOCAL: "",
  EMERGENCY: "",
  MEDICAL: ""
}

const gAnnualLeaveContent = `
    <div class="form-group row align-items-center py-1">
        <label for="inpStartDateOfLeave" class="col-sm-3 text-end">Start Date of Leave: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpStartDateOfLeave" type="date" class="form-control rounded-1 required" name="START_DATE_OF_LEAVE" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1 justify-content-center">
        <div class="col-sm-9">
            <hr style="border: 0; border-bottom: 1px dashed #000" >
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="" class="col-sm-3 text-end">&nbsp;</label>
        <div class="col-sm-5">
            <span id="lblAccumulatedDays" class="bg-accent d-flex text-white fs-5 text-center px-3 fw-bold">Accumulated Days: 12</span>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpNumOfDays" class="col-sm-3 text-end">No. of Day(s): <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpNumOfDays" type="number" class="form-control rounded-1 required" name="NO_OF_DAYS" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpStatus" class="col-sm-3 text-end">End Date of Leave: </label>
        <div class="col-sm-5">
            <input id="inpEndDateOfLeave" readonly type="text" class="form-control rounded-1 small" value="" name="END_DATE_OF_LEAVE" />
            <small class="text-muted">This field is auto calculated based on Start Date and Days.</small>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpUploadFile" class="col-sm-3 text-end">Upload File:</label>
        <div class="col-sm-5">
            <input id="inpFileAttachment" type="file" class="form-control rounded-1" name="FILE_ATTACHMENT" onchange="validateFile(this)" />
            <small class="text-muted">Note: Accepts only PDF file.</small>
        </div>
    </div>
`

const gLocalLeaveContent = `
    <div class="form-group row align-items-center py-1">
        <label for="inpStartDateOfLeave" class="col-sm-3 text-end">Start Date of Leave: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpStartDateOfLeave" type="date" class="form-control rounded-1 required" name="START_DATE_OF_LEAVE" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1 justify-content-center">
        <div class="col-sm-9">
            <hr style="border: 0; border-bottom: 1px dashed #000" >
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpNumOfDays" class="col-sm-3 text-end">No. of Day(s): <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpNumOfDays" type="number" class="form-control rounded-1 required" name="NO_OF_DAYS" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpStatus" class="col-sm-3 text-end">End Date of Leave: </label>
        <div class="col-sm-5">
            <input id="inpEndDateOfLeave" readonly type="text" class="form-control rounded-1 small" value="" name="END_DATE_OF_LEAVE" />
            <small class="text-muted">This field is auto calculated based on Start Date and Days.</small>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="txtReasons" class="col-sm-3 text-end">Reason: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <textarea id="txtReasons" class="form-control rounded-1 required" rows="5" name="REASONS"></textarea>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpUploadFile" class="col-sm-3 text-end">Upload File:</label>
        <div class="col-sm-5">
            <input id="inpFileAttachment" type="file" class="form-control rounded-1" name="FILE_ATTACHMENT" onchange="validateFile(this)" />
            <small class="text-muted">Note: Accepts only PDF file.</small>
        </div>
    </div>
`

const gEmergencyLeaveContent = `
    <div class="form-group row align-items-center py-1">
        <label for="inpStartDateOfLeave" class="col-sm-3 text-end">Start Date of Leave: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpStartDateOfLeave" type="date" class="form-control rounded-1 required" name="START_DATE_OF_LEAVE" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpNumOfDays" class="col-sm-3 text-end">No. of Day(s): <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpNumOfDays" type="number" class="form-control rounded-1 required" name="NO_OF_DAYS" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpStatus" class="col-sm-3 text-end">End Date of Leave: </label>
        <div class="col-sm-5">
            <input id="inpEndDateOfLeave" readonly type="text" class="form-control rounded-1 small" value="" name="END_DATE_OF_LEAVE" />
            <small class="text-muted">This field is auto calculated based on Start Date and Days.</small>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="txtReasons" class="col-sm-3 text-end">Reason: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <textarea id="txtReasons" class="form-control rounded-1 required" rows="5" name="REASONS"></textarea>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpUploadFile" class="col-sm-3 text-end">Upload File:</label>
        <div class="col-sm-5">
            <input id="inpFileAttachment" type="file" class="form-control rounded-1" name="FILE_ATTACHMENT" onchange="validateFile(this)" />
            <small class="text-muted">Note: Accepts only PDF file.</small>
        </div>
    </div>
`

const gMedicalLeaveContent = `
    <div class="form-group row align-items-center py-1">
        <label for="inpStartDateOfLeave" class="col-sm-3 text-end">Start Date of Leave: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpStartDateOfLeave" type="date" class="form-control rounded-1 required" name="START_DATE_OF_LEAVE" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpNumOfDays" class="col-sm-3 text-end">No. of Day(s): <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <input id="inpNumOfDays" type="number" class="form-control rounded-1 required" name="NO_OF_DAYS" />
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpStatus" class="col-sm-3 text-end">End Date of Leave: </label>
        <div class="col-sm-5">
            <input id="inpEndDateOfLeave" readonly type="text" class="form-control rounded-1 small" value="" name="END_DATE_OF_LEAVE" />
            <small class="text-muted">This field is auto calculated based on Start Date and Days.</small>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="txtReasons" class="col-sm-3 text-end">Reason: <span class="text-danger">*</span></label>
        <div class="col-sm-5">
            <textarea id="txtReasons" class="form-control rounded-1 required" rows="5" name="REASONS"></textarea>
        </div>
    </div>
    <div class="form-group row align-items-center py-1">
        <label for="inpUploadFile" class="col-sm-3 text-end">Upload File:</label>
        <div class="col-sm-5">
            <input id="inpFileAttachment" type="file" class="form-control rounded-1" name="FILE_ATTACHMENT" onchange="validateFile(this)" />
            <small class="text-muted">Note: Accepts only PDF file.</small>
        </div>
    </div>
`

$(async function () {
  initDOMEvents()
  await displayLastResumptionDetails()
  await displayLeaveApplications(function () {
    displayPagination()
  })
})

async function displayLastResumptionDetails() {
  const response = await fetch(`${gBaseUrl}/getLastResumptionDetails`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const { LOCAL, ANNUAL, MEDICAL, EMERGENCY, ACCUMULATED_DAYS } = await response.json()

  gAccumulatedDays = ACCUMULATED_DAYS
  gTempAccumulatedDays = ACCUMULATED_DAYS // if the gAccumulated days is modified the current accumulated is still retained
  gListLastResumptionDate.ANNUAL = convertToLocaleDateString(ANNUAL.split(" ")[0])

  $("#totalAccumulatedDays").text(ACCUMULATED_DAYS)

  $("#localLastResumptionDate").html(LOCAL !== `` ? convertToLocaleDateString(LOCAL.split(" ")[0]) : `&nbsp`)
  $("#annualLastResumptionDate").html(ANNUAL !== `` ? convertToLocaleDateString(ANNUAL.split(" ")[0]) : `&nbsp`)
  $("#medicalLastResumptionDate").html(MEDICAL !== `` ? convertToLocaleDateString(MEDICAL.split(" ")[0]) : `&nbsp`)
  $("#emergencyLastResumptionDate").html(EMERGENCY !== `` ? convertToLocaleDateString(EMERGENCY.split(" ")[0]) : `&nbsp`)
}

async function displayLeaveApplications(callback) {
  setLoadingGrid(gTable)
  try {
    const response = await fetch(`${gBaseUrl}/getAllLeaveApplications`)

    const data = await response.json()
    const totalCount = data.length

    let tdDetails = ""

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {

        gTotalPageNo = data[0].PAGE_COUNT
        gTotalCount = data[0].TOTAL_COUNT

        const {
          LEAVE_APPLICATION_CODE,
          LEAVE_TYPE,
          START_DATE_OF_LEAVE,
          END_DATE_OF_LEAVE,
          NO_OF_DAYS,
          ACCUMULATED_DAYS,
          IS_PAID_LEAVE_YN,
          REASONS,
          APPLICATION_STATUS,
          DATE_FILED,
          IS_APPROVED_BY_MANAGER,
          IS_APPROVED_BY_HR,
          REASON_FOR_DISAPPROVAL,
          HAS_ATTACHMENT
        } = data[i]

        const setManagerStatus = (statusFlag) => {
          if (statusFlag === 'Y') {
            return `<span class="btn btn-sm btn-icon btn-round bg-primary-gradient text-white" style="font-size:1rem !important"><i class="fas fa-thumbs-up"></i></span>`
          } else if (statusFlag === 'N') {
            return `<span class="btn btn-sm btn-icon btn-round bg-danger-gradient text-white" style="font-size:1rem !important"><i class="fas fa-thumbs-down"></i></span>`
          } else {
            return ""
          }
        }

        tdDetails += `<tr>
                    <td>
                        ${IS_APPROVED_BY_MANAGER === `` && IS_APPROVED_BY_HR === `` ?
          `<button class="btn rounded-1 btn-link bg-grey text-nowrap text-decoration-none text-primary" onclick="showModalEditLeaveApplication(${LEAVE_APPLICATION_CODE}, '${LEAVE_TYPE}')">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
              Edit</button>`
            : `
                        <button class="btn rounded-1 btn-link text-main" onclick="showModalEditLeaveApplication(${LEAVE_APPLICATION_CODE}, '${LEAVE_TYPE}')">
                          <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-eye-search"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" /><path d="M12 18c-.328 0 -.652 -.017 -.97 -.05c-3.172 -.332 -5.85 -2.315 -8.03 -5.95c2.4 -4 5.4 -6 9 -6c3.465 0 6.374 1.853 8.727 5.558" /><path d="M18 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M20.2 20.2l1.8 1.8" /></svg>
                          <span class="">View</span></button>`
          }
                    </td>
                    <td>
                        <span class="fw-bolder text-nowrap text-uppercase">
                            ${LEAVE_TYPE}
                        </span>
                    </td>
                    <td class="text-nowrap">${convertToLocaleDateString(DATE_FILED)}</td>
                    <td>
                      <span class="fw-bold">${APPLICATION_STATUS}</span> 
                      ${REASON_FOR_DISAPPROVAL !== `` ?
                          `<div><span class="text-danger">Reason(s): ${REASON_FOR_DISAPPROVAL}</span></div>` : ``}</td>
                    <td>
                        <div class="px-4">
                          <p class="text-nowrap mb-0">
                            <small class="extra-small d-block text-muted">Start date</small>
                            <span class="small d-block">
                            <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-cancel"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12.5 21h-6.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v5" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M19 19m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M17 21l4 -4" /></svg>
                              ${convertToLocaleDateString(START_DATE_OF_LEAVE)}
                            </span>
                          </p>
                          <p class="text-nowrap mb-0">
                            <small class="extra-small d-block text-muted">End date</small>
                            <span class="small d-block-inline">
                              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-calendar-check"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11.5 21h-5.5a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v6" /><path d="M16 3v4" /><path d="M8 3v4" /><path d="M4 11h16" /><path d="M15 19l2 2l4 -4" /></svg>
                              ${convertToLocaleDateString(END_DATE_OF_LEAVE)}
                            </span>
                          </p>
                          <div class="py-1">
                            <p class="text-primary small mb-0">No. of days: <span class="fw-bolder">${NO_OF_DAYS}</span></p>
                          </div>
                        </div>
                    </td>
                    <td class="text-nowrap">${setManagerStatus(IS_APPROVED_BY_MANAGER)}</td>
                    <td class="text-nowrap">${setManagerStatus(IS_APPROVED_BY_HR)}</td>
                    <td>${HAS_ATTACHMENT === `Y` ? `<button class="btn btn-icon btn-round btn-sm btn-primary" onclick="displayPDF(${LEAVE_APPLICATION_CODE})"><i class="fas fa-paperclip"></i></button>` : ``}</td>
                </tr>`
      }
    } else {
      tdDetails += `<tr>
                <td colspan="8" class="text-center">
                  <div class="d-grid">
                    <span class="text-muted fw-bold">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-archive"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 4m0 2a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v0a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2z" /><path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" /><path d="M10 12l4 0" /></svg>
                      No records found
                    </span>
                  </div>
                </td>
            </tr>`
    }

    $(gTable).find("tbody").empty().append(tdDetails)

  } catch (error) {
    throw new Error("Something went wrong!" + error)
  } finally {
    if (callback) callback()
  }
}

async function getAccumulatedDays(startDate) {
  const response = await fetch(`${gBaseUrl}/getTotalAccumulatedDays?startDate=${startDate}`)
  const days = await response.text()

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  return parseInt(days)
}

function displayPagination() {
  let options = '';
  for (let i = 1; i <= gTotalPageNo; i++) {
    options += `<option>${i}</option>`
  }

  $(".card").find(".card-footer #pagination #pageNo").empty().append(options);
  $(".card").find(".card-footer #pagination #pageTotal").text(gTotalPageNo);
}

function changePageNo(pageNo) {
  gPageNo = pageNo
  displayLeaveApplications()
}

async function displayPDF(leaveApplicationCode) {
  const url = `${gBaseUrl}/getLeaveApplicationAttachment?leaveApplicationCode=${leaveApplicationCode}`
  window.open(url, '_blank');
}

async function showModalCreateNewLeave() {
  $(gModal).find(".modal-title").text("Create New Leave Entry")
  $(gModal).find("#btnSaveChanges").text("Submit Application")
  $(gModal).find("#appStatus").html(`<span class="btn btn-secondary btn-sm btn-round py-1">Pending</span>`)
  $(gModal).modal("show")

  gIsUpdate = false
  setInputEvents()

  // don't let the user submit if there are no accumulated days available
  if (gAccumulatedDays === 0)
    $(gModal).find("#btnSaveChanges").attr("disabled", true).addClass("d-none")
}

async function showModalEditLeaveApplication(leaveApplicationCode, leaveType) {
  $(gModal).find(".modal-title").text("Update Leave Application")
  $(gModal).find("#btnSaveChanges").text("Update Application")
  $(gModal).modal("show")

  gIsUpdate = true
  setInputEvents()

  $(gModal).find("#selLeaveType").val(leaveType.toLowerCase()).trigger("change")
  disableForm("frmLeaveApplication", true)

  const response = await fetch(`${gBaseUrl}/getLeaveApplicationDetails?leaveApplicationCode=${leaveApplicationCode}`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json()

  disableForm("frmLeaveApplication", false)

  const startDateOfLeave = new Date(data.START_DATE_OF_LEAVE)
  const endDateOfLeave = new Date(data.END_DATE_OF_LEAVE)
  const numOfDays = data.NO_OF_DAYS
  const leaveReasons = data.REASONS
  const leaveStatus = data.APPLICATION_STATUS
  const isApprovedByManager = data.IS_APPROVED_BY_MANAGER
  const isApprovedByHr = data.IS_APPROVED_BY_HR
  const disapprovedReason = data.REASON_FOR_DISAPPROVAL

  if (isApprovedByManager !== '' || isApprovedByHr !== '') {
    $(gModal).find(".modal-title").text("View Leave Application")
    $(gModal).find("input, textarea, select").prop("readonly", true) // disable the inputs
  }

  $(gModal).find("#inpLeaveApplicationCode").val(leaveApplicationCode)
  $(gModal).find("#appStatus").html(displayCustomStatus(leaveStatus))

  $(gModalLeaveEntry).find("#inpStartDateOfLeave").val(formatDateForInput(startDateOfLeave))
  $(gModalLeaveEntry).find("#inpEndDateOfLeave").val(convertToLocaleDateString(endDateOfLeave))
  $(gModalLeaveEntry).find("#inpNumOfDays").val(numOfDays)
  $(gModalLeaveEntry).find("#txtReasons").val(leaveReasons)

  // remove the submit button for the following conditions
  if (isApprovedByManager === '' && isApprovedByHr === '') {
    $(gModal).find("#selLeaveType").removeClass("readonly-event")
    $(gModal).find("#btnSaveChanges").removeClass("d-none")
  } else {
    $(gModal).find("#btnSaveChanges").addClass("d-none")
    $(gModal).find("#selLeaveType").addClass("readonly-event")
  }

  // display the reason for disapproval if the status is disapproved.
  if (isApprovedByManager === 'N' || isApprovedByHr === 'N') {
    $(gModal).find("#reasonForDisapprovalField").removeClass("d-none")
    $(gModal).find("#lblReasonForDisapproval").text(disapprovedReason)
  } else {
    $(gModal).find("#reasonForDisapprovalField").addClass("d-none")
    $(gModal).find("#lblReasonForDisapproval").text('')
  }
}

function setInputEvents() {
  $(gModal).on("change", "#selLeaveType", function () {
    gLeaveType = $(this).val().toUpperCase()
    validateUserCanSubmit()
    validateLeaveEntry()
    validateNumberofDays()
    validateEndDate()
    setAccumulatedDays()
  })
}


function submitSaveLeave(element) {
  const form = element.closest('form');
  const token = $(form).find("input[name='__RequestVerificationToken']").val()
  const data = $(form).serializeArray();
  const isValid = validateForm(form)
  const fd = new FormData()
  let confirmMessage = "";

  const attachment = $(form).find("#inpFileAttachment")[0]

  fd.append("ATTACHMENT", attachment && attachment?.files ? attachment?.files[0] : null)
  fd.append("ACCUMULATED_DAYS", gAccumulatedDays)

  $.each(data, function (_, field) {
    fd.append(field.name, field.value)
  })

  if (!isValid) {
    toastr["error"]("Please enter all the required fields.", "Required")
    return
  }

  if (!gIsValidNumOfDays) {
    toastr["error"]("You have entered an invalid number of days. Please try again.", "Invalid Entry")
    $(element).find("#inpNumOfDays").addClass("is-invalid")
    return
  }

  confirmMessage = gNumOfLeaveNoticeMessage + " Are you sure you want to continue?"
  const isConfirm = confirm(confirmMessage)

  if (isConfirm) {
    disableForm("frmLeaveApplication", true)

    $.ajax({
      type: "POST",
      headers: { "RequestVerificationToken": token },
      url: `${gBaseUrl}/updSertLeaveApplication`,
      data: fd,
      processData: false,
      contentType: false
    })
      .done(function (rowsAffected) {
        if (rowsAffected > 0) {
          if (!gIsUpdate) {
            toastr["success"]("A new record has been created.", "Created Successfully")
          } else {
            toastr["success"]("The record has been updated.", "Updated Successfully")
          }
        }
      })
      .fail(function (error) {
        console.log(error)
        toastr["error"]("Something went wrong. Please contact your administrator.", "System Error")
      })
      .always(function () {
        disableForm("frmLeaveApplication", false)
        cancelModal(element)
        displayLeaveApplications(function () {
          displayPagination()
        })
      })
  }
}

function validateUserCanSubmit() {
  if ((gAccumulatedDays === 0 && gLeaveType.toUpperCase() === "ANNUAL") || gLeaveType === "") {
    $(gModal).find(".modal-footer #btnSaveChanges").attr("disabled", true).addClass("d-none")
  } else {
    $(gModal).find(".modal-footer #btnSaveChanges").attr("disabled", false).removeClass("d-none")
  }
}

function validateEndDate() {
  $(gModalLeaveEntry).on("change", "#inpStartDateOfLeave", async function () {
    const numOfDays = parseInt($(gModalLeaveEntry).find("#inpNumOfDays").val())
    const startDate = $(this).val()
    if (parseInt(numOfDays) > 0 && parseInt(numOfDays) <= 30) {
      if (startDate !== null) {
        setEndDate(startDate, numOfDays)
      }
    }
  })
}

// gets the computation of the accumulated days based on the starting date
function setAccumulatedDays() {
  $(gModalLeaveEntry).on("change", "#inpStartDateOfLeave", async function () {
    const startDate = $(this).val()
    const computedAccumulatedDays = await getAccumulatedDays(startDate)

    // TODOS: if the computed accumulated days is greater than the current accumulated days
    if (gTempAccumulatedDays != 30 && computedAccumulatedDays > gTempAccumulatedDays) {
      gAccumulatedDays = computedAccumulatedDays
      $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${computedAccumulatedDays}`)
    } else {
      gAccumulatedDays = gTempAccumulatedDays
      $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${gTempAccumulatedDays}`)
    }
  })
}

function validateLeaveEntry() {
  const { ANNUAL, LOCAL, EMERGENCY, MEDICAL } = gListOfLeaveType
  let leaveContent = null

  gNumOfLeaveNoticeMessage = ""
  gIsValidNumOfDays = false

  switch (gLeaveType) {
    case ANNUAL:
      leaveContent = gAnnualLeaveContent
      gNoticeMessage = `<ul>
                <li>30 days paid leave after 1 year of continuous service.</li>
                <li>Last Resumption Date: ${gListLastResumptionDate.ANNUAL}</li>
            </ul>`
      break;
    case EMERGENCY:
      leaveContent = gEmergencyLeaveContent
      gNoticeMessage = `<ul>
                <li>Emergency leave (Paid/Unpaid) is subject to management approval.</li>
                <li>The Emergency leave days will not be deducted from Accumulated days.</li>
            </ul>`
      break;
    case MEDICAL:
      leaveContent = gMedicalLeaveContent
      gNoticeMessage = `<ul>
                <li>Medical leave (Paid/Unpaid) is subject to management approval.</li>
                <li>Submission of Government authorized medical certificate is mandatory for paid leave.</li>
                <li>The Medical leave days will not be deducted from Accumulated days.</li>
            </ul>`
      break;
    case LOCAL:
      leaveContent = gLocalLeaveContent
      gNoticeMessage = `<ul>
                <li>Paid local leave will be as per management's discretion.</li>
            </ul>`
      break;
    default:
      leaveContent = null
      gNoticeMessage = ""
      break
  }

  $(gModalLeaveEntry).empty().html(leaveContent)
  $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${gAccumulatedDays}`)
  $(gModalUserNotice).html(gNoticeMessage)
}

function validateNumberofDays() {
  let timeOutId = null
  const { ANNUAL, LOCAL } = gListOfLeaveType
  //const isPaidLeave = $(gModalLeaveEntry).find("input[name='IS_PAID_LEAVE_YN']:checked").val()

  $(gModal).off("input", "#inpNumOfDays").on("input", "#inpNumOfDays", function () {
    const numOfDays = parseInt($(this).val())
    let message = ""
    let excessDays = 0
    const minimumNoOfDays = 6

    // display only the message when user end typing
    clearInterval(timeOutId)
    timeOutId = setTimeout(function () {
      if (numOfDays < 0 || numOfDays > 30) {
        toastr["error"]("You have entered an invalid number of days. Please try again.", "Invalid Entry")
        $(this).addClass("is-invalid")
        gIsValidNumOfDays = false
        return
      }

      $(this).removeClass("is-invalid")

      gIsValidNumOfDays = true

      switch (gLeaveType) {
        case ANNUAL: {
          if (numOfDays > gAccumulatedDays) {
            message = `You are allowed to take only ${gAccumulatedDays} days paid annual leave. `
            excessDays = numOfDays - gAccumulatedDays
            if (excessDays > 0) {
              message += `Addition ${excessDays} will be unpaid and is subject to management approval. `
            }

            toastr["warning"](message, "Warning")
          }

          if (numOfDays < minimumNoOfDays) {
            message = `You are only allowed to apply a minimum of ${minimumNoOfDays} days.`

            toastr["warning"](message, "Warning")
          }

          break;
        }
        case LOCAL: {
          break
          //let $radio = $(".inpIsPaidLeave")

          //if (numOfDays > 3) {
          //  $radio.prop("disabled", true)
          //} else {
          //  $radio.prop("disabled", false)
          //}

          //$radio[0].checked = true

          //$radio = $(".inpIsDeductedFromAnnualLeave")

          //$radio[0].checked = true // resets the radio button to default

          // display the deduct leave from annual
          //if (numOfDays <= 3 && isPaidLeave === 'Y') {
          //    $(gModalLeaveEntry).find("#deductFromAnnualLeaveContainer").removeClass("d-none")
          //} else {
          //    $(gModalLeaveEntry).find("#deductFromAnnualLeaveContainer").addClass("d-none")
          //}
        }
        default:
          break
      }

      gNumOfLeaveNoticeMessage = message

    }, 1000)

    // add number days to the end date
    const startDate = $(gModalLeaveEntry).find("#inpStartDateOfLeave").val()
    if (startDate !== null) {
      setEndDate(startDate, numOfDays)
    }
  })
}

function validateFile(element) {
  if (!element.files || element.files.length === 0) {
    return;
  }
  const file = element.files[0]
  const fileName = file.name
  const fileExt = fileName.split('.').pop().toLowerCase()
  const fileType = file.type

  if (fileExt !== 'pdf' || fileType !== '' && fileType !== 'application/pdf') {
    $(element).val('')
    toastr["warning"]("File must have .pdf extension.", "Invalid File")
    return
  }
}

function validateEmailAddress(email) {
  return email.toLowerCase().includes("test") ||
    email === '' ||
    email === null ||
    email === undefined ? true : false;
}

function displayCustomStatus(applicationStatus) {
  if (applicationStatus === '' || applicationStatus === null)
    return ``

  const splitStatus = applicationStatus.split(",") // split the status
  const splitLength = splitStatus.length
  let li = ""

  // convert the splited status to list items
  for (let i = 0; i < splitLength; i++) {
    li += `<li class="small list-inline-item">
                    <span class="btn btn-secondary btn-sm btn-round py-1">${splitStatus[i]}</span>
                </li>`
  }

  return `<ul class="mb-0 list-inline">${li}</ul>`
}

function initDOMEvents() {
  $(".card-footer").on("click", "#btnPrev", async function () {
    if (gPageNo > 1) {
      --gPageNo
      $("#pagination").find("#pageNo").val(gPageNo)
      disableForm("pagination", true)
      await displayLeaveApplications().then(function () {
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
      await displayLeaveApplications().then(function () {
        disableForm("pagination", false)
      })
    }
  })
}

function setEndDate(startDate, numOfDays) {
  if (!startDate) return;
  const [year, month, day] = startDate.split('-').map(Number);
  const endDate = new Date(year, month - 1, day); // Correct local date
  endDate.setDate(endDate.getDate() + (numOfDays - 1));

  $(gModalLeaveEntry).find("#inpEndDateOfLeave").val(endDate.toDateString());
}

function capitalizeFirstLetter(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
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

function clearEntries(modal) {
  // clears & resets all the inputs
  $(modal).find('input, textarea, select').not(`input[name='__RequestVerificationToken']`).each(function () {
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

  $(gModal).find("#reasonForDisapprovalField").addClass("d-none")
  $(gModal).find("#lblReasonForDisapproval").text('')

  $(gModalLeaveEntry).empty()
  $(gModalUserNotice).html('')

  gAccumulatedDays = gTempAccumulatedDays
}