const gbaseUrl = `/manage/roles`

const gModalRole = $("#modalSaveRoles")
const gModalPermission = $("#modalPermissions")
const gModalRoleUser = ("#modalRoleUsers")
const gMenuItemTable = $("#tblMenuItems")
const gRoleTable = $("#tblRoles")

let gRoleCode = null
let gMenuItemCodes = []

let gSearchParam = null
let gIsUpdate = false

// Initialize the page by displaying the records
$(async function () {
  displayRecords()
})

// Show the modal for creating a new role
function showModalCreateRole() {
  $(gModalRole).find(".modal-title").text("Create New Role")
  $(gModalRole).find("select").prop("selectedIndex", 0)
  $(gModalRole).modal("show")

  gIsUpdate = false
}

// Display the list of roles
async function displayRecords() {
  const data = await $.get(`${gbaseUrl}/getAllRoles`, { searchParam: gSearchParam })
  const totalCount = data.length
  let tdDetails = "";

  if (totalCount > 0) {
    for (let i = 0; i < totalCount; i++) {
      tdDetails += `
                <tr>
                    <td>${i + 1}</td>
                    <td>
                        <input type="checkbox" class="form-check-input p-2 border-2" style="" value="${data[i].ROLE_CODE}" />
                    </td>
                    <td>
                        <a href="javascript:void(0)" class="btn btn-secondary rounded-1 border text-primary" onclick="showModalPermission(${data[i].ROLE_CODE}, '${data[i].ROLE_NAME}')">
                            <i class="fas fa-eye"></i> View
                        </a>
                    </td>
                    <td>${data[i].ROLE_NAME}</td>
                    <td><a href="javascript:void(0)" class="btn btn-link fw-bolder" onclick="showModalRoleUsers(${data[i].ROLE_CODE}, '${data[i].ROLE_NAME}')">${data[i].TOTAL_USERS}</a></td>
                    <td>
                        ${data[i].IS_ACTIVE === 'Y' ? `<span class="badge bg-success">Active</span>` : `<span class="badge bg-danger">Inactive</span>`}
                    </td>
                    <td>
                        ${data[i].TOTAL_USERS > 0 ? `` : `
                            <button type="button" class="btn btn-secondary rounded-1" onclick="showModalEditRole(${data[i].ROLE_CODE})">
                                <i class="fas fa-pencil-alt"></i> Edit
                            </button>
                            <button class="btn btn-secondary text-danger rounded-1" onclick="deleteRole(${data[i].ROLE_CODE})">
                                <i class="fas fa-trash"></i> Trash
                            </button>
                        `}
                    </td>
                </tr>
            `
    }
  } else {
    tdDetails += `
            <tr>
                <td colspan="5" class="text-center">No records found...</td>
            </tr>
        `
  }

  $("#tblRoles tbody").empty().append(tdDetails)
}

// Show the modal to edit an existing role
async function showModalEditRole(roleCode) {
  $(gModalRole).find(".modal-title").text("Update Role")
  $(gModalRole).find("select").prop("selectedIndex", 0)
  $(gModalRole).modal("show")

  gIsUpdate = true
  disableForm("frmRoles", true)

  try {
    const data = await $.get(`${gbaseUrl}/getRoleDetails`, { roleCode })

    $(gModalRole).find("#inpRoleCode").val(data.ROLE_CODE)
    $(gModalRole).find("#inpRoleName").val(data.ROLE_NAME)
    $(gModalRole).find("#selIsActive").val(data.IS_ACTIVE)
  } catch (error) {
    alert("Failed to fetch the details.")
    console.log(error)
  } finally {
    disableForm("frmRoles", true)
  }
}

// Submit the form to save a new or updated role
async function submitSaveRole(element) {
  const form = $(element).closest("form");
  const token = $(form).find("input[name=__RequestVerificationToken]").val();
  const data = $(form).serializeArray()
  const isValid = validateForm(form)

  if (!isValid) return false;

  const fd = new FormData()
  $.each(data, function (_, field) {
    fd.append(field.name, field.value)
  })

  disableForm("frmRole", true)

  $.ajax({
    type: "POST",
    headers: { "RequestVerificationToken": token },
    url: `${gbaseUrl}/updSertRole`,
    data: fd,
    processData: false,
    contentType: false
  })
    .done(async function (rowsAffected) {
      if (rowsAffected > 0) {
        if (gIsUpdate) {
          toastr["success"]("Successfully Updated a Role", "Update Successful")
        } else {
          toastr["success"]("Successfully Created a New Role", "Create Successful")
        }
      } else {
        toastr["danger"]("Unable to save the record", "Save Failed")
      }

      displayRecords()
    })
    .fail(function (err) {
      console.log(err)
      toastr["danger"]("Something went wrong. Please contact your administrator", "System Error")
    })
    .always(function () {
      disableForm("frmRole", false)
      cancelModal(element)
    })
}

// Delete a role
async function deleteRole(roleCode) {
  const isDelete = confirm("Are you sure you want to delete this role?")

  if (!isDelete) return false;

  const rowsAffected = await $.post(`${gbaseUrl}/deleteRole`, {
    roleCode
  })

  if (rowsAffected > 0) {
    toastr["success"]("Successfully Delete the Record", "Delete Successful")
    displayRecords()
  } else {
    toastr["danger"]("Failed to Delete the Record", "Delete Failed")
  }
}

// Show the modal to manage the role permissions
async function showModalPermission(roleCode, roleName) {
  $(gModalPermission).modal("show")
  $(gModalPermission).find(".modal-title").text("Manage Role Permission for " + roleName)
  gRoleCode = roleCode

  await displayMainMenuItems()
}

// Display the main menu items for role permissions
async function displayMainMenuItems() {
  disableForm("frmPermissions", true)
  try {
    const response = await fetch(`/manage/menus/getAllMainMenu`)
    const data = await response.json()
    const totalCount = data.length
    let tbody = ""

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {
        tbody += `
        			<tr>
        				<td>
                  <div class="form-check">
                      <input type="checkbox" style="width:1rem !important;height:1rem !important" class="form-check-input border-2 border-muted" data-mm-code="${data[i].MAIN_MENU_CODE}" data-sm-code="" data-slm-code="" / >
                  </div>
        				</td>
        				<td>
        					${data[i].HAS_SUB_MENU === 'Y' ? `
        						<a href="javascript:void(0)" class="btn btn-xs btn-secondary border" data-main-menu-id="${data[i].MAIN_MENU_CODE}" onclick="toggleSubMenuItems(${data[i].MAIN_MENU_CODE})">
        							<i class="fas fa-angle-down"></i>
        						</a>
        					` : ``}
        				</td>
        				<td>${data[i].ICON_NAME !== '' ? `<span class="${data[i].ICON_NAME}"></span>` : ``}
        				</td>
        				<td>${data[i].MENU_NAME}</td>
        				<td></td>
        			</tr>

              ${await displaySubMenuItems(data[i].MAIN_MENU_CODE)}  
            `
      }
    } else {
      tbody = `
        		<tr>
        			<td colspan="7" class="text-center">No records found...</td>
        		</tr>
        	`;
    }

    $(gMenuItemTable).find("tbody").empty().append(tbody);

  } catch (error) {
    console.log(error)
    alert("Failed to load the menu items.")
  } finally {
    disableForm("frmPermissions", false)
    setSelectedMenuItems()
  }
}

async function displaySubMenuItems(mainMenuCode) {
  try {
    const data = await getSubMenuItems(mainMenuCode)
    const totalCount = data.length;
    let tbody = ""

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {
        tbody += `
    			<tr class="sub-menu main-menu-${mainMenuCode} table-light d-none">
    				<td>
                <div class="form-check">
    					    <input type="checkbox" style="width:1rem !important;height:1rem !important" class="form-check-input border-2 border-muted" data-mm-code="${data[i].MAIN_MENU_CODE}" data-sm-code="${data[i].MENU_SUB_CODE}" data-slm-code="" / >
    				    </div>
            </td>
    				<td>
    					${data[i].HAS_SUB_MENU === 'Y' ? `
    						<a href="javascript:void(0)" class="btn btn-xs btn-secondary" data-main-menu-id="${mainMenuCode}" data-sub-menu-id="${data[i].MENU_SUB_CODE}" onclick="toggleSubLevelMenuItems(${data[i].MAIN_MENU_CODE},${data[i].MENU_SUB_CODE})">
    							<i class="fas fa-angle-down"></i>
    						</a>
    					` : ``}
    				</td>
    				<td></td>
    				<td>${data[i].MENU_NAME}</td>
    				<td>${data[i].PARENT_MENU}</td>
    			</tr>

         ${await displaySubLevelMenuItems(data[i].MAIN_MENU_CODE, data[i].MENU_SUB_CODE)} 
    		`
      }
    }

    return tbody

  } catch (error) {
    console.log(error)
    alert("Failed to load the menu items.")
  }
}

async function displaySubLevelMenuItems(mainMenuCode, subMenuCode) {
  try {
    const data = await getSubLevelMenuItems(mainMenuCode, subMenuCode)
    const totalCount = data.length;
    let tbody = ""

    if (totalCount > 0) {
      for (let i = 0; i < totalCount; i++) {
        tbody += `
    	    <tr class="sub-level-menu main-menu-${mainMenuCode} sub-menu-${subMenuCode} table-light d-none">
    		    <td>
                <div class="form-check">
    					    <input type="checkbox" style="width:1rem !important;height:1rem !important" class="form-check-input border-2 border-muted" data-mm-code="${data[i].MAIN_MENU_CODE}" data-sm-code="${data[i].MENU_SUB_CODE}" data-slm-code="${data[i].MENU_SUB_LEVEL_CODE}" / >
    				    </div>
            </td>
    		    <td></td>
    		    <td></td>
    		    <td>${data[i].MENU_NAME}</td>
    		    <td>${data[i].PARENT_MENU}</td>
    	    </tr>
        `
      }
    }

    return tbody

  } catch (error) {
    console.log(error)
  }
}

async function getSubMenuItems(mainMenuCode) {
  return await $.get(`/manage/menus/getAllSubMenu`, {
    mainMenuCode
  });
}

function toggleSubMenuItems(mainMenuCode) {
  let tr = $(`tr.sub-menu.main-menu-${mainMenuCode}`)
  if ($(tr).hasClass("d-none")) {
    $(tr).removeClass("d-none")
  } else {
    // include also the sub level menus in case the toggle menu function is not called
    tr = $(`tr.main-menu-${mainMenuCode}, tr.sub-menu.main-menu-${mainMenuCode}`)
    $(tr).addClass("d-none")
  }
}

async function getSubLevelMenuItems(mainMenuCode, subMenuCode) {
  return await $.get("/manage/menus/getAllSubLevelMenu", {
    mainMenuCode,
    subMenuCode
  });
}

function toggleSubLevelMenuItems(mainMenuCode, subMenuCode) {
  const tr = $(`tr.sub-level-menu.main-menu-${mainMenuCode}.sub-menu-${subMenuCode}`)

  console.log(mainMenuCode)
  console.log(subMenuCode)
  if ($(tr).hasClass("d-none")) {
    $(tr).removeClass("d-none")
  } else {
    $(tr).addClass("d-none")
  }
}

async function getMenuItemDetails(mainMenuCode, subMenuCode, subLevelMenuCode) {
  return await $.get("/menus/getMenuDetails", {
    mainMenuCode,
    subMenuCode,
    subLevelMenuCode
  })
}

async function submitRoleMenuItems(element) {
  const form = $(element).closest("form")
  const token = $(form).find("input[name='__RequestVerificationToken']").val()
  const isValid = validateSelectedItems()

  if (!isValid) {
    toastr["info"]("Please select at least one item.", "Validation")
    return
  }

  const response = await fetch(`${gbaseUrl}/updSertRoleMenu`, {
    method: "POST",
    headers: {
      "RequestVerificationToken": token,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(gMenuItemCodes)
  })

  if (!response.ok)
    throw new Error(`Http error! Status: ${response.status}`)

  const retval = await response.text()
  const rowsAffected = parseInt(retval) // convert the text to 
  const action = gIsUpdate ? "updated" : "created"

  if (rowsAffected > 0) {
    toastr["success"](`Succesfully ${action} a role menu item.`, "Success")
  } else {
    toastr["danger"]("Failed to save the record.", "Save Failed")
  }
}

async function setSelectedMenuItems() {
  const data = await getRoleMainMenuItems()
  const totalCount = data.length

  if (totalCount > 0) {
    data.map(item => {
      const menuMainCode = item.MAIN_MENU_CODE === 0 ? '' : item.MAIN_MENU_CODE
      const subMenuCode = item.MENU_SUB_CODE === 0 ? '' : item.MENU_SUB_CODE
      const subLevelMenuCode = item.MENU_SUB_LEVEL_CODE === 0 ? '' : item.MENU_SUB_LEVEL_CODE
      const selector = `tbody input[type='checkbox'][data-mm-code='${menuMainCode}'][data-sm-code='${subMenuCode}'][data-slm-code='${subLevelMenuCode}']`;
      const checkbox = $(gMenuItemTable).find(selector);

      if (checkbox.length > 0) {
        checkbox.prop("checked", true);
      }
    })
  }
}

async function getRoleMainMenuItems() {
  const response = await fetch(`${gbaseUrl}/getRoleMenus?roleCode=${gRoleCode}`)
  if (!response.ok)
    throw new Error(`Http error! Status: ${response.status}`)

  return await response.json()
}

function showModalRoleUsers(roleCode, roleName) {
  $(gModalRoleUser).modal("show")
  $(gModalRoleUser).find(".modal-title").text(roleName + " Users")
  gRoleCode = roleCode
  setTriggerEvents()
  displayRoleUsers('')
}

async function displayRoleUsers(searchParam) {
  let tdDetails = ""
  try {
    const data = await getRoleUsers(searchParam)
    const totalCount = data.length;

    for (let i = 0; i < totalCount; i++) {
      tdDetails += `
			    <tr>
				    <td>${i + 1}</td>
				    <td>${data[i].EMP_NAME}</td>
                    <td>${data[i].IS_ACTIVE === `Y` ? `<span class="badge bg-success">Active</span>` : `<span class="badge bg-danger">Inactive</span>`}</td>
			    </tr>
		    `
    }
  } catch (e) {
    console.log(e)
  }

  $("#tblRoleUsers").find("tbody").empty().append(tdDetails)
}

async function getRoleUsers(searchParam) {
  const response = await fetch(`${gbaseUrl}/getRoleUsers?roleCode=${gRoleCode}&searchParam=${encodeURIComponent(searchParam)}`)
  if (!response.ok)
    throw new Error(`Http error! Status: ${response.status}`)

  return await response.json()
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
  $(modal).find('input, textarea, select').not(`input[name='__RequestVerificationToken']`).each(function () {
    if ($(this).is(':checkbox') || $(this).is(':radio')) {
      $(this).prop('checked', false);
    } else if ($(this).is('select')) {
      $(this).prop('selectIndex', 0).removeClass("is-invalid, readonly-event");
    } else {
      $(this).val('').removeClass("is-invalid, readonly-event");
    }
  });

  $(modal).find(".invalid-feedback").text("")
}

// Checks and unchecks all the checkboxes
$(gMenuItemTable).on("change", "#cbSelectAllRecords", function () {
  const isChecked = $(this).is(":checked")

  if (isChecked) {
    $(gMenuItemTable).find("input[type='checkbox']:not(:checked)").prop("checked", true)
    $("#btnDeleteMultiple").removeClass("d-none")
  } else {
    $(gMenuItemTable).find("input[type='checkbox']:checked").prop("checked", false)
    $("#btnDeleteMultiple").addClass("d-none")
  }
})

function setTriggerEvents() {
  $(gModalRoleUser).on("change", "#inpSearchRoleUser", function (e) {
    e.preventDefault()
    const searchParam = $(this).val()
    displayRoleUsers(searchParam)
  })
}

function validateSelectedItems() {
  // Reset the array
  gMenuItemCodes = []

  $(gMenuItemTable).find("tbody input[type='checkbox']:checked").map(function () {
    const mainMenuCode = Number($(this).data("mm-code"))
    const subMenuCode = Number($(this).data("sm-code"))
    const subLevelMenuCode = Number($(this).data("slm-code"))

    gMenuItemCodes.push({
      ROLE_CODE: gRoleCode,
      MAIN_MENU_CODE: mainMenuCode,
      SUB_MENU_CODE: subMenuCode,
      SUB_LEVEL_MENU_CODE: subLevelMenuCode
    })
  })

  return gMenuItemCodes.length !== 0
}

// Checks and unchecks all the checkboxes
$(gRoleTable).on("change", "#cbSelectAllRecords", function () {
  const isChecked = $(this).is(":checked")

  if (isChecked) {
    $(gRoleTable).find("input[type='checkbox']:not(:checked)").prop("checked", true)
    $("#btnDeleteMultiple").removeClass("d-none")
  } else {
    $(gRoleTable).find("input[type='checkbox']:checked").prop("checked", false)
    $("#btnDeleteMultiple").addClass("d-none")
  }
})