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

let gFilterType = ""
let gFilterValue = "for hr approval"
let gSearchParam = ""

let gTotalPageNo = 1
let gTotalCount = 1
let gPageNo = 1

let gLeaveTotalCountData = null
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
  await Promise.all([
    displayLastResumptionDetails(),
    displayLeaveCount(),
  ])

  displayDepartmentAnalytics()

  await displayLeaveApplications(function () {
    displayPagination()
  })

  await displayLeaveApplicationsForManagerApproval()
})

async function submitSearch() {
  gSearchParam = $("#inpSearchParam").val()
  await displayLeaveApplications(function () {
    displayPagination()
  })
}

async function displayLastResumptionDetails() {
  const response = await fetch(`${gBaseUrl}/getLastResumptionDetails`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const {
    LOCAL
    , ANNUAL
    , MEDICAL
    , EMERGENCY
    , ACCUMULATED_DAYS
  } = await response.json()

  gAccumulatedDays = ACCUMULATED_DAYS
  gTempAccumulatedDays = ACCUMULATED_DAYS // store the initial accumulated days
  gListLastResumptionDate.ANNUAL = convertToLocaleDateString(ANNUAL.split(" ")[0])

  $("#totalAccumulatedDays").text(ACCUMULATED_DAYS)

  $("#localLastResumptionDate").html(LOCAL !== `` ? convertToLocaleDateString(LOCAL.split(" ")[0]) : `&nbsp`)
  $("#annualLastResumptionDate").html(ANNUAL !== `` ? convertToLocaleDateString(ANNUAL.split(" ")[0]) : `&nbsp`)
  $("#medicalLastResumptionDate").html(MEDICAL !== `` ? convertToLocaleDateString(MEDICAL.split(" ")[0]) : `&nbsp`)
  $("#emergencyLastResumptionDate").html(EMERGENCY !== `` ? convertToLocaleDateString(EMERGENCY.split(" ")[0]) : `&nbsp`)
}

async function displayLeaveCount() {
  const response = await fetch(`${gBaseUrl}/getTotalLeaveCountByEmployee`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json()
  const totalLeave = Number(data.TOTAL_ANNUAL) + Number(data.TOTAL_LOCAL) + Number(data.TOTAL_MEDICAL) + Number(data.TOTAL_EMERGENCY)

  gLeaveTotalCountData = data

  // leave type
  $("#totalLocalLeave").text(data.TOTAL_LOCAL)
  $("#totalAnnualLeave").text(data.TOTAL_ANNUAL)
  $("#totalMedicalLeave").text(data.TOTAL_MEDICAL)
  $("#totalEmergencyLeave").text(data.TOTAL_EMERGENCY)
  $("#totalLeaveApplication").text(totalLeave)

  // application status
  $("#totalPending").text(data.TOTAL_FOR_HR_APPROVAL)
  $("#totalApproved").text(data.TOTAL_APPROVED)
  $("#totalDisapproved").text(data.TOTAL_DISAPPROVED)
  $("#totalTrashed").text(data.TOTAL_TRASHED)
  $("#totalResumed").text(data.TOTAL_RESUMED)
}

async function filterRecords(element) {
  gFilterType = $(element).attr("filter-type")
  gFilterValue = $(element).attr("filter-value")
  gSearchParam = ''
  gPageNo = 1

  await displayLeaveApplications(function () {
    displayPagination()
  })
}

async function submitSearch() {
  gSearchParam = $("#inpSearchParam").val()
  gPageNo = 1
  await displayLeaveApplications(function () {
    displayPagination()
  })
}

async function displayLeaveApplications() {
  setLoadingGrid(gTable)
  try {
    const response = await fetch(`${gBaseUrl}/getAllLeaveApplicationsByEmployee?` + new URLSearchParams({
      searchParam: gSearchParam,
      filterType: gFilterType,
      filterValue: gFilterValue,
      pageNo: gPageNo
    }).toString())

    const data = await response.json()
    const totalCount = data.length
    let tdDetails = ""

    if (totalCount > 0) {
      gTotalPageNo = data[0].PAGE_COUNT
      gTotalCount = data[0].TOTAL_COUNT
      console.log(data)
      for (let i = 0; i < totalCount; i++) {
        const {
          LEAVE_APPLICATION_CODE,
          USER_CODE,
          EMPLOYEE_NAME,
          DEPARTMENT_NAME,
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
          HAS_ATTACHMENT,
          IS_FOR_RESUMPTION,
          STATUS
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

        let btnActions = ""
        if (APPLICATION_STATUS === "Pending" || APPLICATION_STATUS === "Disapproved") {
          btnActions = `
            <button class="btn btn-link btn-sm btn-danger" onclick="confirmTrash(${LEAVE_APPLICATION_CODE}, '${EMPLOYEE_NAME}')" title="Trash Application">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
            </button>`
        }

        if (APPLICATION_STATUS === "Approved") {
          btnActions = `
            <div class="d-flex">
              <button class="btn btn-link btn-sm btn-danger" onclick="confirmTrash(${LEAVE_APPLICATION_CODE}, '${EMPLOYEE_NAME}')" title="Trash Application">
                <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
              </button>
              ${IS_FOR_RESUMPTION === `Y` ? `
                <button class="btn btn-link btn-sm btn-primary" onclick="confirmResume(${LEAVE_APPLICATION_CODE}, '${EMPLOYEE_NAME}')" title="For Resumption">
                  <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-user-share"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" /><path d="M6 21v-2a4 4 0 0 1 4 -4h3" /><path d="M16 22l5 -5" /><path d="M21 21.5v-4.5h-4.5" /></svg>
                </button>
              ` : ``}
            </div>
           `
        }

        if (STATUS === "TRASHED") {
          btnActions = `
            <button class="btn btn-link btn-sm btn-danger" onclick="confirmTempDelete(${LEAVE_APPLICATION_CODE})" title="Delete Application">
              <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
            </button>`
        }

        tdDetails +=
          `<tr>
										<td>${btnActions}</td>
										<td>
												<a class="text-main text-uppercase text-nowrap" href="javascript:void(0)" onclick="showModalEditLeaveApplication(${LEAVE_APPLICATION_CODE}, ${USER_CODE}, '${LEAVE_TYPE}')">
														<span class="fw-bold">
                                ${LEAVE_TYPE}
														</span>
												</a>
												<div class="text-normal"><small class="text-muted extra-small">Date filed:</small></div>
                        <div class="text-normal"><small class="text-nowrap">${convertToLocaleDateString(DATE_FILED)}</small></div>
										</td>
										<td class="">
												<span class="mb-0">${EMPLOYEE_NAME}</span>
												<div class="text-normal"><small class="text-muted text-nowrap">${DEPARTMENT_NAME}</small></div>
										</td>
										<td><span class="fw-bold" >${APPLICATION_STATUS}</span> ${REASON_FOR_DISAPPROVAL !== `` ? `<div><span class="text-danger">Reason(s): ${REASON_FOR_DISAPPROVAL}</span></div>` : ``}</td>
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
      gTotalPageNo = 1
      gTotalCount = 1
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
  }
}

async function displayLeaveApplicationsForManagerApproval(callback) {
  try {
    const response = await fetch(`${gBaseUrl}/getLeaveApplicationForManagerApproval?`)

    const data = await response.json()
    const totalCount = data.length
    let tdDetails = ""

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {
        const {
          LEAVE_APPLICATION_CODE,
          USER_CODE,
          EMPLOYEE_NAME,
          DEPARTMENT_NAME,
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
          HAS_ATTACHMENT,
          NO_OF_DAYS_PENDING
        } = data[i]

        tdDetails +=
          `<tr>
							<td>${i + 1}</td>
							<td>
									<a class="text-main text-uppercase text-nowrap" href="javascript:void(0)" onclick="showModalEditLeaveApplication(${LEAVE_APPLICATION_CODE}, ${USER_CODE}, '${LEAVE_TYPE}')">
											<span class="fw-bold">
													${LEAVE_TYPE}
											</span>
									</a>
									<div class="text-normal"><small class="text-muted">Date filed: ${convertToLocaleDateString(DATE_FILED)}</small></div>
							</td>
							<td class="">
									<span class="mb-0">${EMPLOYEE_NAME}</span>
									<div class="text-normal"><small class="text-muted">${DEPARTMENT_NAME}</small></div>
							</td>
              <td>
                ${NO_OF_DAYS_PENDING}
              </td>
					</tr>`
      }
    } else {
      tdDetails += `<tr>
						<td colspan="4" class="text-center"><i class="far fa-folder-open"></i> No records found.</td>
				</tr>`
    }

    $("#tblLeaveApplicationForManagerApproval tbody").empty().append(tdDetails)

  } catch (error) {
    throw new Error("Something went wrong!" + error)
  }
  finally {
    if (callback) callback()
  }
}

async function displayPDF(leaveApplicationCode) {
  const url = `${gBaseUrl}/getLeaveApplicationAttachment?leaveApplicationCode=${leaveApplicationCode}`
  window.open(url, '_blank');
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

async function showModalCreateNewLeave() {
  //const userEmailId = await getUserEmailAddress()
  //const managerEmailId = await getManagerEmailAddress()
  //if (validateEmailAddress(userEmailId) || validateEmailAddress(managerEmailId)) {
  //  alert("Your email id is not updated in HR module. Kindly contact Mr. Manu / Mr. Brian")
  //  return
  //}

  $(gModal).find(".modal-title").text("Create New Leave Entry")
  $(gModal).find(".modal-footer button#btnSaveChanges").removeClass("d-none")
  $(gModal).find("#appStatus").html(`<span class="btn btn-secondary btn-sm btn-round py-1">Pending</span>`)
  $(gModal).find(".modal-footer").empty().append(`
				<button type="button" class="btn btn-secondary rounded-1" onclick="cancelModal(this)">Close</button>
				<button id="btnSaveChanges" type="button" class="btn btn-danger bg-accent rounded-1" onclick="submitSaveLeave(this)">Submit Application</button>
		`)

  $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${gAccumulatedDays}`)
  $(gModal).modal("show")

  gIsUpdate = false

  await getAnnualLastResumptionDate()

  setInputEvents()
}

//async function getUserEmailAddress() {
//  return await $.get(`${gBaseUrl}/getUserEmailId`)
//}

//async function getManagerEmailAddress() {
//  return await $.get(`${gBaseUrl}/getManagerEmailId`)
//}

async function showModalEditLeaveApplication(leaveApplicationCode, userCode, leaveType) {
  await getAnnualLastResumptionDate(userCode)
  $(gModal).find(".modal-title").text("Review Leave Application")
  $(gModal).find(".modal-footer button#btnSaveChanges").addClass("d-none")
  $(gModal).modal("show")

  gIsUpdate = true
  setInputEvents()

  $(gModal).find("#selLeaveType")
    .addClass("readonly-event")
    .val(leaveType.toLowerCase())
    .trigger("change")

  disableForm("frmLeaveApplication", true)

  const response = await fetch(`${gBaseUrl}/getLeaveApplicationDetails?leaveApplicationCode=${leaveApplicationCode}`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json()

  disableForm("frmLeaveApplication", false)

  const employeeName = data.EMPLOYEE_NAME
  const startDateOfLeave = new Date(data.START_DATE_OF_LEAVE)
  const endDateOfLeave = new Date(data.END_DATE_OF_LEAVE)
  const numOfDays = data.NO_OF_DAYS
  const leaveReasons = data.REASONS
  const leaveStatus = data.APPLICATION_STATUS
  const accumulatedDays = data.ACCUMULATED_DAYS
  const isApprovedByManager = data.IS_APPROVED_BY_MANAGER
  const isApprovedByHr = data.IS_APPROVED_BY_HR
  const disapprovedReason = data.REASON_FOR_DISAPPROVAL

  // set the action title based on the approval status
  if (isApprovedByManager !== '' && isApprovedByHr !== '') {
    $(gModal).find(".modal-title").text("View Leave Application")
  }

  // let the manager edit the leave application only if the leave type is LOCAL or ANNUAL
  if (leaveType.toLowerCase() === 'LOCAL' || leaveType.toLowerCase() == 'ANNUAL') {
    $(gModal).find("input, textarea, select").prop("readonly", false) // enable the inputs
  } else {
    $(gModal).find("input, textarea, select").prop("readonly", true) // disable the inputs
    $(gModal).find("#txtRemarks").prop("readonly", false)
  }

  $(gModal).find("#inpLeaveApplicationCode").val(leaveApplicationCode)
  $(gModal).find("#appStatus").html(displayCustomStatus(leaveStatus))

  $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${accumulatedDays}`)
  $(gModalLeaveEntry).find("#inpStartDateOfLeave").val(formatDateForInput(startDateOfLeave))
  $(gModalLeaveEntry).find("#inpEndDateOfLeave").val(convertToLocaleDateString(endDateOfLeave))
  $(gModalLeaveEntry).find("#inpNumOfDays").val(numOfDays)
  $(gModalLeaveEntry).find("#txtReasons").val(leaveReasons)

  // display the button when the application is approved by the department manager.
  if (isApprovedByManager === 'Y' && isApprovedByHr === '' && leaveStatus !== "Trashed") {
    $(gModal).find(".modal-footer").empty().append(`
						<div class="w-100 text-center gap-2">
								<button type="button" class="btn btn-primary px-5" title="Approved" onclick="confirmApproval(${leaveApplicationCode}, '${employeeName}')"><i class="fas fa-thumbs-up"></i> Approve</button>
								<button type="button" class="btn btn-danger px-5" title="Disapproved or Reject" onclick="confirmDisApproval(${leaveApplicationCode}, '${employeeName}')"><i class="fas fa-thumbs-down"></i> Reject</button>
						</div>
				`)
  } else {
    $(gModal).find(".modal-footer").empty().append(`
						<button type="button" class="btn btn-secondary" onclick="cancelModal(this)">Close</button>
				`)
  }

  // display the reason for disapproval
  if (isApprovedByManager === 'N' || isApprovedByHr === 'N') {
    $(gModal).find("#reasonForDisapprovalField").removeClass("d-none")
    $(gModal).find("#lblReasonForDisapproval").text(disapprovedReason)
  } else {
    $(gModal).find("#reasonForDisapprovalField").addClass("d-none")
    $(gModal).find("#lblReasonForDisapproval").text('')
  }
}

function displayDepartmentAnalytics() {
  const pieChart = document.getElementById("pieChart").getContext("2d")
  const doughnutChart = document.getElementById("doughnutChart").getContext("2d")

  $.get(`${gBaseUrl}/getTotalUserPerDepartment`, function (response) {

    let dataArray = []
    let labelArray = []

    response.map(function (key, value) {
      dataArray.push(key.TOTAL_LEAVE_COUNT);
      labelArray.push(`${key.DEPARTMENT_NAME}`)
    })

    const getRandomColors = (dataArray) => {
      const colors = [];
      const length = dataArray.length
      for (let i = 0; i < length; i++) {
        const color = `hsl(${Math.floor(Math.random() * 360)}, 50%, 50%)`;
        colors.push(color);
      }
      return colors;
    }

    const colorArray = getRandomColors(dataArray)

    new Chart(pieChart, {
      type: "doughnut",
      data: {
        datasets: [
          {
            data: dataArray,
            backgroundColor: colorArray,
            borderWidth: 0,
          },
        ],
        labels: labelArray,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          position: "bottom",
          labels: {
            fontColor: "rgb(154, 154, 154)",
            fontSize: 11,
            usePointStyle: true,
            padding: 20,
          },
        },
        pieceLabel: {
          //render: "percentage",
          fontColor: "white",
          fontSize: 14,
        },
        tooltips: false,
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20,
          },
        },
      },
    });
  })

  const {
    TOTAL_LOCAL,
    TOTAL_ANNUAL,
    TOTAL_MEDICAL,
    TOTAL_EMERGENCY } = gLeaveTotalCountData

  new Chart(doughnutChart, {
    type: "doughnut",
    data: {
      datasets: [
        {
          data: [TOTAL_LOCAL, TOTAL_ANNUAL, TOTAL_MEDICAL, TOTAL_EMERGENCY],
          backgroundColor: ["#f3545d", "#fdaf4b", "#1d7af3", "#097969"],
        },
      ],
      labels: ["Local", "Annual", "Medical", "Emergency"],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        position: "bottom",
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20,
        },
      },
    },
  });
}


function displayCustomStatus(applicationStatus) {
  if (applicationStatus === '' || applicationStatus === null)
    return ``

  const splitStatus = applicationStatus.split(",") // split the status
  const splitLength = splitStatus.length
  let li = ""

  // convert the splited status to list items
  for (let i = 0; i < splitLength; i++) {
    li += `<li class="small list-inline-item"><span class="btn btn-secondary btn-sm btn-round py-1">${splitStatus[i]}</span></li>`
  }

  return `<ul class="mb-0 list-inline">${li}</ul>`
}

function setInputEvents() {
  $(gModal).on("change", "#selLeaveType", function () {
    gLeaveType = $(this).val().toUpperCase()
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

  fd.append("ATTACHMENT", attachment && attachment.files ? attachment.files[0] : null)
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
      .done(async function (rowsAffected) {
        if (rowsAffected > 0) {
          if (!gIsUpdate) {
            toastr["success"]("A new record has been created.", "Created Successfully")
          } else {
            toastr["success"]("The record has been updated.", "Updated Successfully")
          }
          await displayLeaveCount()
          await displayLeaveApplications(function () {
            displayPagination()
          })
        }
      })
      .fail(function (error) {
        console.log(error)
        toastr["error"]("Something went wrong. Please contact your administrator.", "System Error")
      })
      .always(function () {
        disableForm("frmLeaveApplication", false)
        cancelModal(gModal)
      })
  }
}

function deleteLeaveApplication(leaveApplicationCode) {
  const isConfirm = confirm("Are you sure you want to delete this leave application?")
  if (!isConfirm) return

  $.post(`${gBaseUrl}/deleteLeaveApplication?leaveApplicationCode=` + leaveApplicationCode
    , function (rowsAffected) {
      if (rowsAffected > 0) {
        toastr["success"]("The leave application has been deleted.", "Deleted Successfully")
        displayLeaveCount()
        displayLeaveApplications(function () {
          displayPagination()
        })
      } else {
        toastr["danger"]("There was a problem deleting the leave application.", "Failed to Delete")
      }
    })
}

async function showModalRemarks(leaveApplicationCode, employeeName) {
  const remarksModal = $("#modalAddRemarks")
  $(remarksModal).find(".modal-title").html(`<i class="far fa-comments"></i> Remarks for ${employeeName}`)
  $(remarksModal).find("#inpLeaveApplicationCode").val(leaveApplicationCode)
  $(remarksModal).modal("show")

  disableForm("frmRemarks", true)

  // display the existing remarks if there is.
  const response = await fetch(`${gBaseUrl}/getManagerRemarks?leaveApplicationCode=${leaveApplicationCode}`)

  if (!response.ok)
    throw new Error("Something went wrong while fetching the remarks.")

  disableForm("frmRemarks", true)

  const data = await response.text()

  $(remarksModal).find("#txtRemarks").val(data)
}

function submitRemarks(element) {
  const form = element.closest('form');
  const token = $(form).find("input[name='__RequestVerificationToken']").val()
  const data = $(form).serializeArray();
  const isValid = validateForm(form)

  const leaveApplicationCode = $(form).find("#inpLeaveApplicationCode").val()
  const remarks = $(form).find("#txtRemarks").val()

  if (!isValid) {
    toastr["error"]("Please enter all the required fields.", "Required")
    return
  }

  const isConfirm = confirm("Are you sure you want to post a remarks?")

  if (isConfirm) {
    disableForm("frmRemarks", true)

    $.ajax({
      type: "POST",
      headers: { "RequestVerificationToken": token },
      url: `${gBaseUrl}/updateManagerRemarks`,
      data: {
        leaveApplicationCode,
        remarks
      }
    })
      .done(function (rowsAffected) {
        if (rowsAffected > 0) {
          toastr["success"]("A remarks has been posted successfully.", "Posted Successfully")
        }
      })
      .fail(function (error) {
        console.log(error)
        toastr["error"]("Something went wrong. Please contact your administrator.", "System Error")
      })
      .always(function () {
        disableForm("frmRemarks", false)
      })
  }
}

function confirmApproval(leaveApplicationCode, employeeName) {
  const confirmStatusModal = $("#modalStatusUpdateConfirmation")
  const modalBody = $(confirmStatusModal).find(".modal-body")

  $(confirmStatusModal).find(".modal-title").text("Approve Leave?")

  $(modalBody).empty().append(`
				<div class="row px-3">
						<input type="hidden" name="LEAVE_APPLICATION_CODE" value="${leaveApplicationCode}" />
						<input type="hidden" name="APPLICATION_STATUS" value="APPROVED" />
						<input type="hidden" name="REASONS" />
						<p class="fs-6">Are you sure you want to approve the leave of <span class="fw-bold text-danger">${employeeName}</span>?</p>
				</div>
		`)

  $(confirmStatusModal).modal("show")
}

function confirmDisApproval(leaveApplicationCode, employeeName) {
  const confirmStatusModal = $("#modalStatusUpdateConfirmation")
  const modalBody = $(confirmStatusModal).find(".modal-body")

  $(confirmStatusModal).find(".modal-title").text("Disapprove Leave?")

  $(modalBody).empty().append(`
				<div class="row px-3">
						<div class="col">
								<input type="hidden" name="LEAVE_APPLICATION_CODE" value="${leaveApplicationCode}" />
								<input type="hidden" name="APPLICATION_STATUS" value="DISAPPROVED" />
								<p class="fs-6">Are you sure you want to disapprove the leave of <span class="fw-bold text-danger">${employeeName}</span>?</p>
						</div>
				</div>
				<div class="row mb-2 px-3">
						<div class="col">
								<label>Please provide the reason(s)? <span class="text-danger">*</span></label>
								<textarea class="form-control rounded-1 required" rows="5" name="REASONS"></textarea>
						</div>
				</div>
		`)

  $(confirmStatusModal).modal("show")
}

function confirmResume(leaveApplicationCode, employeeName) {
  const confirmStatusModal = $("#modalStatusUpdateConfirmation")
  const modalBody = $(confirmStatusModal).find(".modal-body")

  $(confirmStatusModal).find(".modal-title").text("Resume Leave?")

  $(modalBody).empty().append(`
				<div class="row px-3">
						<input type="hidden" name="LEAVE_APPLICATION_CODE" value="${leaveApplicationCode}" />
						<input type="hidden" name="APPLICATION_STATUS" value="RESUMED" />
						<input type="hidden" name="REASONS" />
						<p class="fs-6">Are you sure you want to update the status of <span class="fw-bold text-danger">${employeeName}</span>’s leave to <em>Resumed</em>?</p>
				</div>
		`)

  $(confirmStatusModal).modal("show")
}

function confirmTrash(leaveApplicationCode, employeeName) {
  const confirmStatusModal = $("#modalStatusUpdateConfirmation")
  const modalBody = $(confirmStatusModal).find(".modal-body")

  $(confirmStatusModal).find(".modal-title").text("Trash Leave Application?")

  $(modalBody).empty().append(`
				<div class="row px-3">
						<input type="hidden" name="LEAVE_APPLICATION_CODE" value="${leaveApplicationCode}" />
						<input type="hidden" name="APPLICATION_STATUS" value="TRASHED" />
						<input type="hidden" name="REASONS" />
						<p class="fs-6">Are you sure you want to trash the leave application of <span class="fw-bold text-danger">${employeeName}</span>?</p>
				</div>
		`)

  $(confirmStatusModal).modal("show")
}

function confirmTempDelete(leaveApplicationCode) {
  const confirmStatusModal = $("#modalStatusUpdateConfirmation")
  const modalBody = $(confirmStatusModal).find(".modal-body")

  $(confirmStatusModal).find(".modal-title").text("Permanently Delete?")

  $(modalBody).empty().append(`
				<div class="row px-3">
						<input type="hidden" name="LEAVE_APPLICATION_CODE" value="${leaveApplicationCode}" />
						<input type="hidden" name="APPLICATION_STATUS" value="DELETED" />
						<input type="hidden" name="REASONS" />
						<p class="fs-6">Are you sure you want to permanently delete the leave application?</p>
				</div>
		`)

  $(confirmStatusModal).modal("show")
}

async function submitApplicationStatus(element) {
  const form = element.closest('form');
  const isValid = validateForm(form)
  const fd = new FormData(form)

  if (!isValid) {
    toastr["error"]("Please enter all the required fields.", "Required")
    return
  }

  try {
    const response = await fetch(`${gBaseUrl}/updateLeaveApplicationStatus`, {
      method: 'POST',
      body: fd
    })

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const rowsAffected = await response.text()

    if (parseInt(rowsAffected) > 0) {
      toastr["success"]("The leave status has been updated successfully.", "Status Updated")
      await displayLeaveCount()
      await displayLeaveApplications(function () {
        displayPagination()
      })
    }
  } catch (error) {
    toastr["error"]("Something went wrong. Please contact your administrator.", "System Error")
    console.log(error)
  }
  finally {
    cancelModal(element) // clear and close the leave application form
  }
}

function validateEndDate() {
  $(gModalLeaveEntry).on("change", "#inpStartDateOfLeave", function () {
    const numOfDays = parseInt($(gModalLeaveEntry).find("#inpNumOfDays").val())
    const startDate = $(this).val()
    if (parseInt(numOfDays) > 0 && parseInt(numOfDays) <= 30) {
      if (startDate !== null) {
        setEndDate(startDate, numOfDays)
      }
    }
  })
}

function setAccumulatedDays() {
  $(gModalLeaveEntry).on("change", "#inpStartDateOfLeave", async function () {
    const startDate = $(this).val()
    const computedAccumulatedDays = await getAccumulatedDays(startDate)

    // TODOS: if the computed accumulated days is greater than the current accumulated days
    if (gTempAccumulatedDays != 30 && computedAccumulatedDays > gTempAccumulatedDays) {
      gAccumulatedDays = computedAccumulatedDays // max 30 days only
      $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${computedAccumulatedDays}`)
    } else {
      gAccumulatedDays = gTempAccumulatedDays
      $(gModalLeaveEntry).find("#lblAccumulatedDays").text(`Accumulated Days: ${gTempAccumulatedDays}`)
    }
  })
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

async function getAnnualLastResumptionDate(userCode) {
  const response = await fetch(`${gBaseUrl}/getLastResumptionDetails?userCode=${userCode}`)

  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const { ANNUAL } = await response.json()

  gListLastResumptionDate.ANNUAL = convertToLocaleDateString(ANNUAL.split(" ")[0])

}

function validateLeaveEntry() {
  const { ANNUAL, LOCAL, EMERGENCY, MEDICAL } = gListOfLeaveType
  let leaveContent = null

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
  const { ANNUAL, LOCAL, EMERGENCY, MEDICAL } = gListOfLeaveType
  const numOfAccumulatedDays = $(gModalLeaveEntry).find("#inpAccumulatedDays").val()
  gNumOfLeaveNoticeMessage = ""

  $(gModal).off("input", "#inpNumOfDays").on("input", "#inpNumOfDays", function () {
    const numOfDays = parseInt($(this).val())
    let message = ""
    let excessDays = 0

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
        if (numOfDays > numOfAccumulatedDays) {
          message += `You are allowed to take only ${numOfAccumulatedDays} days paid annual leave. `
          excessDays = numOfDays - numOfAccumulatedDays
          if (excessDays > 0) {
            message += `Addition ${excessDays} will be unpaid and is subject to management approval. `
          }
          toastr["warning"](message, "Warning")
          gNumOfLeaveNoticeMessage = message
        }
        break;
      }
      default:

        break
    }

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

function setEndDate(startDate, numOfDays) {
  if (!startDate) return;
  // Safely parse the date string in local time
  const [year, month, day] = startDate.split('-').map(Number);
  const endDate = new Date(year, month - 1, day); // Correct local date
  endDate.setDate(endDate.getDate() + (numOfDays - 1));

  $(gModalLeaveEntry).find("#inpEndDateOfLeave").val(endDate.toDateString());
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

  gAccumulatedDays = gTempAccumulatedDays

  $(gModal).find("#reasonForDisapprovalField").addClass("d-none")
  $(gModal).find("#lblReasonForDisapproval").text('')

  $(gModalLeaveEntry).empty()
  $(gModalUserNotice).html('')
}

function validateEmailAddress(email) {
  return email.toLowerCase().includes("test") ||
    email === '' ||
    email === null ||
    email === undefined ? true : false;
}

