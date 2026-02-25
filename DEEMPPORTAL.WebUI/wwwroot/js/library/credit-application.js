
const gBaseUrl = `/library/credit-application`
const gModal = $("#modalLibraryInformation")
const gSubModal = $("#modalLibraryAttachment")
const gTable = $("#tblLibraryInformation")
const gSubTable = $("#tblAttachments")

const gFormLibraryInformation = $("#frmLibraryInformation")

let gIsUpdate = false
let gLibraryInformationCode = 0
let gOrgCode = 1

$(async function () {
  await loadOrganization()
  await displayLibraryInformation()
})

$(document).on("change", "#selOrgCode", async function () {
  gOrgCode = $(this).val()
  $("#sectionAttachment").addClass("d-none")
  await displayLibraryInformation()
})

function showModalCreateNewLogoInformation() {
  $(gModal).find(".modal-title").text("Create New Credit Aplication Entry")
  $(gModal).find("#inpLibraryTypeCode").val("CREDIT APPLICATION")
  $(gModal).modal("show")

  gIsUpdate = false
}

async function showModalEditLogoInformation(libraryInformationCode) {
  $(gModal).find(".modal-title").text("Edit Credit Application Information")
  $(gModal).modal("show")

  gIsUpdate = true
  
  const data = await displaLibraryInformationDetails(libraryInformationCode)

  $(gFormLibraryInformation).find("#inpLibraryInformationCode").val(data.LIBRARY_INFORMATION_CODE)
  $(gFormLibraryInformation).find("#selLibraryOrgCode").val(data.ORG_CODE)
  $(gFormLibraryInformation).find("#inpDescription").val(data.DESCRIPTION)
  $(gFormLibraryInformation).find("#inpLibraryTypeCode").val("CREDIT APPLICATION")
}

function showModalAddAttachment() {
  $(gSubModal).find(".modal-title").text("Add Attachment")
  $(gSubModal).find("#inpLibraryInformationCode").val(gLibraryInformationCode)
  $(gSubModal).modal("show")
  gIsUpdate = false
}

async function displayLibraryInformation() {
  const response = await fetch(`${gBaseUrl}/getAllLibraryInformation?orgCode=${gOrgCode}`)

  if (!response.ok) {
    toastr.error("Failed to fetch records.", "Error")
    return
  }

  const data = await response.json()
  const totalCount = data.length
  let tdDetails = ''
  let btnActions = ''

  if (totalCount > 0) {
    for (let i = 0; i < totalCount; i++) {
      if (userId === '1') {
        btnActions = `
          <a href="javascript:void(0)" class="text-muted mx-1" onclick="showModalEditLogoInformation(${data[i].LIBRARY_INFORMATION_CODE})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-edit"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" /><path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" /><path d="M16 5l3 3" /></svg>
          </a>
          <a href="javascript:void(0)" class="text-danger mx-1" onclick="deleteLogoInformation(${data[i].LIBRARY_INFORMATION_CODE})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-trash"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
          </a>
          <a href="javascript:void(0)" class="text-primary mx-1" onclick="displayAttachments(${data[i].LIBRARY_INFORMATION_CODE})">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" /></svg>
          </a>
        `
      } else {
        btnActions = `
          <a href="javascript:void(0)" class="text-primary mx-1" onclick="displayAttachments(${data[i].LIBRARY_INFORMATION_CODE})" title="Open folder">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-folder-open"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 19l2.757 -7.351a1 1 0 0 1 .936 -.649h12.307a1 1 0 0 1 .986 1.164l-.996 5.211a2 2 0 0 1 -1.964 1.625h-14.026a2 2 0 0 1 -2 -2v-11a2 2 0 0 1 2 -2h4l3 3h7a2 2 0 0 1 2 2v2" /></svg>
          </a>
        `
      }

      tdDetails += `
        <tr>
          <td>${i + 1}</td>
          <td>${data[i].DESCRIPTION}</td>
          <td>${btnActions}</td>
        </tr>
      `
    }
  } else {
    tdDetails = `
      <tr>
        <td colspan="3">
          <div class="text-center">No records found.</div>
        </td>
      </td>
    `
  }

  $(gTable).find("tbody").empty().append(tdDetails)
}

async function displaLibraryInformationDetails(libraryInformationCode) {
  setFormDisabled(true)
  const response = await fetch(`${gBaseUrl}/getLibraryInformation?libraryInformationCode=${libraryInformationCode}`)

  if (!response.ok) {
    toastr.error("Failed to fetch records.", "Error")
    return
  }

  setFormDisabled(false)

  return await response.json()
}

async function submitSaveLibraryInformation(element) {
  const form = element.closest("form")
  const isValid = validateForm(form)
  const fd = new FormData(form)

  if (!isValid) {
    toastr.error("Please enter the required fields.", "Required")
    return
  }

  setFormDisabled(true)

  try {
    const response = await fetch(`${gBaseUrl}/updSertLibraryInformation`, {
      method: "POST",
      body: fd
    })

    if (!response.ok) {
      toastr.error(result.message, "Error")
      setFormDisabled(false)
      return
    }

    setFormDisabled(false)

    const result = await response.json()

    if (gIsUpdate) {
      toastr.success("A new record has been created successfully.", "Success");
    } else {
      toastr.success("The record has been updated successfully.", "Success");
    }

    // display the records
    await displayLibraryInformation()

  } catch (error) {
    console.error("Update failed:", error);
    toastr.error("Something went wrong. Please contact your administrator.", "System Error");
  } finally {
    setFormDisabled(false)
  }
}

async function deleteLogoInformation(libraryInformationCode) {
  const isConfirm = confirm("Are you sure you want delete this record?")
  if (!isConfirm) return false

  const response = await fetch(`${gBaseUrl}/deleteLibraryInformation?libraryInformationCode=${libraryInformationCode}`, {
    method: "POST"
  })

  if (!response.ok) {
    toastr.error(result.message, "Error")
    setFormDisabled(false)
    return
  }

  const result = await response.json()

  toastr.success(result.message, "Success")
  await displayLibraryInformation()

  $("#sectionAttachment").addClass("d-none")
}

async function displayAttachments(libraryInformationCode) {
  setLoadingGrid(gSubTable)
  $("#sectionAttachment").removeClass("d-none")
  gLibraryInformationCode = libraryInformationCode

  const response = await fetch(`${gBaseUrl}/getAllLibraryAttachments?libraryInformationCode=${libraryInformationCode}`)
  if ( !response.ok ) {
    toastr.error("Failed to fetch records.", "Error")
    return
  }

  const data = await response.json()
  const totalCount = data.length
  let tdDetails = ''
  let btnActions = ''

  if (totalCount > 0) {
    for (let i = 0; i < totalCount; i++) {
      if (userId === '1') {
        btnActions = `
           <a href="${gBaseUrl}/downloadAttachment?libraryAttachmentCode=${data[i].LIBRARY_ATTACHMENT_CODE}" class="text-primary mx-1" onclick="dowloadAttachment(${data[i].LIBRARY_ATTACHMENT_CODEs})">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cloud-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 18.004h-5.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.38 0 2.573 .813 3.13 1.99" /><path d="M19 16v6" /><path d="M22 19l-3 3l-3 -3" /></svg>
            </a>
            <a href="javascript:void(0)" class="text-danger mx-1" onclick="deleteAttachment(${data[i].LIBRARY_ATTACHMENT_CODE})">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
            </a>
        `
      } else {
        btnActions = `
           <a href="${gBaseUrl}/downloadAttachment?libraryAttachmentCode=${data[i].LIBRARY_ATTACHMENT_CODE}" class="text-primary mx-1" onclick="dowloadAttachment(${data[i].LIBRARY_ATTACHMENT_CODEs})">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-cloud-down"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 18.004h-5.343c-2.572 -.004 -4.657 -2.011 -4.657 -4.487c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.38 0 2.573 .813 3.13 1.99" /><path d="M19 16v6" /><path d="M22 19l-3 3l-3 -3" /></svg>
            </a>
        `
      }

      tdDetails += `
        <tr>
          <td>
            <a href="javascript:void(0)" class="fw-normal">${data[i].FILE_NAME}${data[i].FILE_EXTENSION}</a>
          </td>
          <td>${btnActions}</td>
        </tr>
      `
    }
  } else {
    tdDetails += `
      <tr>
        <td colspan="2">
          <div class="text-center">No attachments found..</div>
        </td>
      </tr>
    `
  }

  $("#tblAttachments").find("tbody").empty().append(tdDetails)
}

async function submitSaveLibraryAttachment(element) {
  const form = element.closest("form")
  const isValid = validateForm(form)
  const fd = new FormData(form)

  if (!isValid) {
    toastr.error("Please enter the required fields.", "Required")
    return
  }

  try {
    setFormDisabled(true)
    const response = await fetch(`${gBaseUrl}/insertLibraryAttachments`, {
      method: "POST",
      body: fd
    })

    if (!response.ok) {
      toastr.error(result.message, "Error")
      setFormDisabled(false)
      return
    }

    setFormDisabled(false)
    const result = await response.json()

    toastr.success("Attachments has been created successfully.", "Success");
    await displayAttachments(gLibraryInformationCode)

  } catch (error) {
    console.error("Error:", error);
    toastr.error("Something went wrong. Please contact your administrator.", "System Error");
  } finally {
    setFormDisabled(false)
  }
}

async function deleteAttachment(libraryAttachmentCode) {
  const isConfirm = confirm("Are you sure you want delete this record?")
  if (!isConfirm) return false

  const response = await fetch(`${gBaseUrl}/deleteLibraryAttachment?libraryAttachmentCode=${libraryAttachmentCode}`, {
    method: "POST"
  })

  if (!response.ok) {
    toastr.error(result.message, "Error")
    return
  }

  const result = await response.json()

  if(result.isSuccess) 
    toastr.success(result.message, "Success")
  else
    toastr.error(result.message, "Failed")

  await displayAttachments(gLibraryInformationCode)
}

async function loadOrganization() {
  const data = await $.get(`${gBaseUrl}/getAllOrganizations`)
  const totalCount = data.length
  let options = "";

  if (totalCount > 0) {
    for (let i = 0; i < data.length; i++) {
      options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
    }
  }

  $("#selOrgCode, .selOrgCode").empty().append(options);
}

function setFormDisabled(bool = true) {
  $("form").find(":input").prop("disabled", bool)
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
      $(this).prop('selectedIndex', 0).removeClass("is-invalid readonly-event");
      console.log("select")
    } else {
      $(this).val('').removeClass("is-invalid readonly-event");
    }
    $(this).prop("readonly", false)
  });
}