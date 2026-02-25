const gBaseUrl = "/manage/menus"
const gModalMenuItems = $("#modalMainMenu")
const gMenuItemTable = $("#tblMenuItems")
let gSearchParam = null

const gMenuType = {
	MAIN_MENU: "MAIN-MENU",
	SUB_MENU: "SUB-MENU",
	SUB_LEVEL_MENU: "SUB-LEVEL-MENU"
}

let gIsUpdate = false
let gSelMenuTypeVal = gMenuType.MAIN_MENU
let gMainMenuCode = null
let gMenuItemCodes = []

const gModal = new bootstrap.Modal(".modal", {
	backdrop: "static",
	keyboard: false,
})

const gMainMenuEntries = `
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Menu Name: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<input id="inpMainMenuCode" type="hidden" class="form-control rounded-1" placeholder="" name="MAIN_MENU_CODE">
			<input id="inpMenuName" type="text" class="form-control rounded-1 required" placeholder="" name="MENU_NAME">
			<div class="invalid-feedback">
				Please enter a menu name.
			</div>
		</div>
	</div>
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Icon Name: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<input id="inpIconName" class="form-control rounded-1 required" placeholder="" name="ICON_NAME">
			<div class="invalid-feedback">
				Please enter an icon name.
			</div>
		</div>
	</div>
`

const gSubMenuEntries = `
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Main Menu Items: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<input id="inpSubMenuCode" type="hidden" class="form-control rounded-1" placeholder="" name="SUB_MENU_CODE">
			<select id="selMainMenuCode" class="form-control form-select rounded-1 required" name="MAIN_MENU_CODE" onchange="selOnChangeMainMenu(this)">
			</select>
		</div>
	</div>
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Menu Name: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<input id="inpMenuName" class="form-control rounded-1 required" placeholder="" name="MENU_NAME">
			<div class="invalid-feedback">
				Please enter a menu name.
			</div>
		</div>
	</div>
`

const gSubLevelMenuEntries = `
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Main Menu Items: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<input id="inpSubMenuCode" type="hidden" class="form-control rounded-1" placeholder="" name="SUB_LEVEL_MENU_CODE">
			<select id="selMainMenuCode" class="form-control form-select rounded-1 required" name="MAIN_MENU_CODE" onchange="selOnChangeMainMenu(this)">
			</select>
		</div>
	</div>
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Sub Menu Items: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<select id="selSubMenuCode" class="form-control form-select rounded-1 required" name="SUB_MENU_CODE"></select>
		</div>
	</div>
	<div class="form-group row align-items-center py-1">
		<label class="col-sm-3 text-end">Menu Name: <span class="text-danger">*</span></label>
		<div class="col-sm-8">
			<input id="inpMenuName" class="form-control rounded-1 required" placeholder="" name="MENU_NAME">
		</div>
	</div>
`

$(async function () {
	await displayMainMenuItems()
})

async function submitSearchMenu() {
	gSearchParam = $("#inpSearchParam").val()
	await displayMainMenuItems()
}

function showModalCreateMenuItems() {
	$(gModalMenuItems).modal("show")
	$(gModalMenuItems).find(".modal-title").text("New Main Menu Item")
	$(gModalMenuItems).find("select").prop("selectedIndex", 0)

	$(gModalMenuItems).find("#frmMenuItemEntries").empty().html(gMainMenuEntries)

	gIsUpdate = false

	// TODOS: load the main menu options
}

async function showModalEditMenuItems(mainMenuCode, subMenuCode, subLevelMenuCode) {
	$(gModalMenuItems).modal("show")
	$(gModalMenuItems).find("select").prop("selectedIndex", 0)
	
	gIsUpdate = true
	
	// display the main menu
	if(mainMenuCode !== null && subMenuCode === null && subLevelMenuCode === null) {
		$(gModalMenuItems).find(".modal-title").text("Update Main Menu Item")
		$(gModalMenuItems).find("#frmMenuItemEntries").empty().html(gMainMenuEntries)
		$(gModalMenuItems).find("#selMenuType").prop("selectedIndex", 0).addClass("readonly-event")
		$(gModalMenuItems).find("#inpMainMenuCode").val(mainMenuCode)
		gSelMenuTypeVal = gMenuType.MAIN_MENU
	}

	// display the sub menu
	if(mainMenuCode !== null && subMenuCode !== null && subLevelMenuCode === null) {
		$(gModalMenuItems).find(".modal-title").text("Update Sub Menu Item")
		$(gModalMenuItems).find("#frmMenuItemEntries").empty().html(gSubMenuEntries)
		$(gModalMenuItems).find("#selMenuType").prop("selectedIndex", 1)
		$(gModalMenuItems).find("#selMenuType, #selMainMenuCode").addClass("readonly-event")
		gSelMenuTypeVal = gMenuType.SUB_MENU
		
		await Promise.all([loadMainMenuItems()])
	}

	// display the sub level menu
	if(mainMenuCode !== null && subMenuCode !== null && subLevelMenuCode !== null) {
		$(gModalMenuItems).find(".modal-title").text("Update Sub Level Menu Item")
		$(gModalMenuItems).find("#frmMenuItemEntries").empty().html(gSubLevelMenuEntries)
		$(gModalMenuItems).find("#selMenuType").prop("selectedIndex", 2)
		gSelMenuTypeVal = gMenuType.SUB_LEVEL_MENU
		
		await Promise.all([loadMainMenuItems(), loadSubMenuItems(mainMenuCode)])
	}
	
	disableForm("frmMenuItems", true)
	
	try {
		const data = await getMenuItemDetails(mainMenuCode, subMenuCode, subLevelMenuCode)
		$(gModalMenuItems).find("#inpMainMenuCode, #selMainMenuCode").val(data.MAIN_MENU_CODE)
		$(gModalMenuItems).find("#inpSubMenuCode, #selSubMenuCode").val(data.SUB_MENU_CODE)
		$(gModalMenuItems).find("#inpSubLevelMenuCode").val(data.SUB_LEVEL_MENU_CODE)
		$(gModalMenuItems).find("#inpMenuName").val(data.MENU_NAME)
		$(gModalMenuItems).find("#inpIconName").val(data.ICON_NAME)
		$(gModalMenuItems).find("#inpSeqNo").val(data.SEQ_NO)
		$(gModalMenuItems).find("#selIsActive").val(data.IS_ACTIVE)
	} catch(error) {
		console.log(error)
		alert("Failed to fetch the details. Please try again.")
	} finally {
		disableForm("frmMenuItems", false)
	}
}

async function displayMainMenuItems() {
	const data = await $.get(`${gBaseUrl}/getAllMainMenu`, { searchParam: gSearchParam });
	const totalCount = data.length;
	console.log(data)
	let tdDetails = ""
	if (totalCount > 0) {
		for (let i = 0; i < totalCount; i++) {
			tdDetails += `
				<tr>
					<td>${ i + 1 }</td>
					<td>
						<input type="checkbox" class="form-check-input check-custom" data-mm-code="${data[i].MAIN_MENU_CODE}" data-sm-code="" data-slm-code="" / >
					</td>
					<td>
						${data[i].HAS_SUB_MENU === 'Y' ? `
							<a href="javascript:void(0)" class="btn btn-secondary" data-main-menu-id="${data[i].MAIN_MENU_CODE}" onclick="toggleSubMenuItems(this)">
								<i class="fas fa-chevron-down"></i>
							</a>
						` : ``}
					</td>
					<td>${data[i].ICON_NAME !== '' ? `<span class="${data[i].ICON_NAME}"></span>` : ``}
					</td>
					<td>${data[i].MENU_NAME}</td>
					<td>
						${data[i].IS_ACTIVE === 'Y' ? `<span class="badge rounded-pill text-bg-success">Active</span>` : `<span class="badge rounded-pill text-bg-danger">Inactive</span>`}
					</td>
					<td>
						<span class="badge rounded-pill text-bg-danger"></span>
					</td>
					<td>
						<button class="btn btn-secondary"
								onClick="showModalEditMenuItems(${data[i].MAIN_MENU_CODE}, null, null)">
							<i class="fas fa-pencil-alt"></i> Edit
						</button>
						<button class="btn btn-secondary text-danger" onclick="deleteMenuItem(${data[i].MAIN_MENU_CODE}, 0, 0)">
							<i class="fas fa-trash"></i> Trash
						</button>
					</td>
				</tr>`
		}
	} else {
		tdDetails = `
			<tr>
				<td colspan="7" class="text-center">No records found...</td>
			</tr>
		`;
	}

	$(gMenuItemTable).find("tbody").empty().append(tdDetails);
}

async function toggleSubMenuItems(element) {
	const currRow = $(element).closest("tr")
	const mainMenuId = $(element).data("main-menu-id")
	const isRowExists = $(currRow).next().hasClass(`main-menu-${mainMenuId}`)
	
	if (isRowExists) {
		$(`.main-menu-${mainMenuId}`).remove()
		return
	}
	
	loadingToggleButton(element, true)
	
	try {
		const data = await getSubMenuItems(mainMenuId)
		const totalCount = data.length;
		let tdDetails = ""

		for (let i = 0; i < totalCount; i++) {
			tdDetails += `
			<tr class="sub-menu main-menu-${mainMenuId} table-light">
				<td></td>
				<td>
					<input type="checkbox" class="form-check-input check-custom" data-mm-code="${data[i].MAIN_MENU_CODE}" data-sm-code="${data[i].MENU_SUB_CODE}" data-slm-code="" / >
				</td>
				<td>
					${data[i].HAS_SUB_MENU === 'Y' ? `
						<a href="javascript:void(0)" class="btn btn-secondary" data-main-menu-id="${mainMenuId}" data-sub-menu-id="${data[i].MENU_SUB_CODE}" onclick="toggleSubLevelMenuItems(this)">
							<i class="fas fa-chevron-down"></i>
						</a>
					` : ``}
				</td>
				<td></td>
				<td>${data[i].MENU_NAME}</td>
				<td>
					${data[i].IS_ACTIVE === 'Y' ? `<span class="badge rounded-pill text-bg-success">Active</span>` : `<span class="badge rounded-pill text-bg-danger">Inactive</span>`}
				</td>
				<td>
					<span class="badge rounded-pill text-bg-primary">${data[i].PARENT_MENU}</span>
				</td>
				<td>
					<button class="btn btn-secondary rounded-1"
								onClick="showModalEditMenuItems(${data[i].MAIN_MENU_CODE}, ${data[i].MENU_SUB_CODE}, null)">
							<i class="fas fa-pencil-alt"></i> Edit
						</button>
						<button class="btn btn-secondary text-danger rounded-1" onclick="deleteMenuItem(${data[i].MAIN_MENU_CODE}, ${data[i].MENU_SUB_CODE}, 0)">
							<i class="fas fa-trash"></i> Trash
						</button>
				</td>
			</tr>
		`
		}

		$(currRow).after(tdDetails)
		
	} catch(error) {
		console.log(error)
		alert("Failed to load the menu items.")
	} finally {
		loadingToggleButton(element, false)
	}
}

async function toggleSubLevelMenuItems(element) {
	const currRow = $(element).closest("tr")
	const mainMenuId = $(element).data("main-menu-id")
	const subMenuId = $(element).data("sub-menu-id")
	const isRowExists = $(currRow).next().hasClass(`sub-menu-${subMenuId}`)

	if (isRowExists) {
		$(`.main-menu-${mainMenuId}.sub-menu-${subMenuId}`).remove()
		return
	}
	
	loadingToggleButton(element, true)

	try {
		const data = await getSubLevelMenuItems(mainMenuId, subMenuId)
		const totalCount = data.length;
		let tdDetails = ""

		for (let i = 0; i < totalCount; i++) {
			tdDetails += `
			<tr class="sub-menu main-menu-${mainMenuId} sub-menu-${subMenuId} table-light">
				<td></td>
				<td>
					<input type="checkbox" class="form-check-input check-custom" data-mm-code="${data[i].MAIN_MENU_CODE}" data-sm-code="${data[i].MENU_SUB_CODE}" data-slm-code="${data[i].MENU_SUB_LEVEL_CODE}" / >
				</td>
				<td></td>
				<td></td>
				<td>${data[i].MENU_NAME}</td>
				<td>
					${data[i].IS_ACTIVE === 'Y' ? `<span class="badge rounded-pill text-bg-success">Active</span>` : `<span class="badge rounded-pill text-bg-danger">Inactive</span>`}
				</td>
				<td>
					<span class="badge rounded-pill text-bg-primary">${data[i].PARENT_MENU}</span>
				</td>
				<td>
					<button class="btn btn-secondary rounded-1"
								onClick="showModalEditMenuItems(${data[i].MAIN_MENU_CODE}, ${data[i].MENU_SUB_CODE}, ${data[i].MENU_SUB_LEVEL_CODE})">
							<i class="fas fa-pencil-alt"></i> Edit
					</button>
					<button class="btn btn-secondary rounded-1 text-danger" onclick="deleteMenuItem(${data[i].MAIN_MENU_CODE}, ${data[i].MENU_SUB_CODE}, ${data[i].MENU_SUB_LEVEL_CODE})">
						<i class="fas fa-trash"></i> Trash
					</button>
				</td>
			</tr>
		`
		}

		$(currRow).after(tdDetails)
		
	} catch(error) {
		console.log(error)
	} finally {
		loadingToggleButton(element, false)
	}
}

async function getMainMenuItems(searchParam) {
	return await $.get(`${gBaseUrl}/getAllSubMenu`, {
		mainMenuCode
	});
}

async function getSubMenuItems(mainMenuCode) {
	return await $.get(`${gBaseUrl}/getAllSubMenu`, { 
		mainMenuCode
	});
}

async function getSubLevelMenuItems(mainMenuCode, subMenuCode) {
	return await $.get(`${gBaseUrl}/getAllSubLevelMenu`, {
		mainMenuCode,
		subMenuCode
	});
}

async function getMenuItemDetails(mainMenuCode, subMenuCode, subLevelMenuCode) {
	return await $.get(`${gBaseUrl}/getMenuDetails`, {
		mainMenuCode,
		subMenuCode,
		subLevelMenuCode
	})
}

async function selOnChangeMenuType(element) {
	gSelMenuTypeVal = String($(element).val()).trim().toUpperCase()
	const container = $(gModalMenuItems).find("#frmMenuItemEntries").empty()
	const formAction = gIsUpdate ? "Update" : "New";

	switch (gSelMenuTypeVal) {
		case gMenuType.MAIN_MENU:
			$(gModalMenuItems).find(".modal-title").text(formAction + " Main Menu Item")
			$(container).html(gMainMenuEntries)
			break
		case gMenuType.SUB_MENU:
			$(gModalMenuItems).find(".modal-title").text(formAction + " Sub Menu Item")
			$(container).html(gSubMenuEntries)
			await loadMainMenuItems()
			break
		case gMenuType.SUB_LEVEL_MENU:
			$(gModalMenuItems).find(".modal-title").text(formAction + " Sub Level Menu Item")
			$(container).html(gSubLevelMenuEntries)
			await Promise.all([loadMainMenuItems(), loadSubMenuItems(gMainMenuCode)])
			break
		default:
			alert("Invalid Menu Type")
			break
	}
}

async function selOnChangeMainMenu(element) {
	const value = $(element).val()
	if(value !== null && value !== undefined) {
		await loadSubMenuItems(value)	
	}
}

function getUpdSertPostUrl() {
	let postUrl = null
	switch (gSelMenuTypeVal) {
		case gMenuType.MAIN_MENU:
			postUrl = `${gBaseUrl}/updSertMainMenu`
			break;
		case gMenuType.SUB_MENU:
			postUrl = `${gBaseUrl}/updSertSubMenu`
			break;
		case gMenuType.SUB_LEVEL_MENU:
			postUrl = `${gBaseUrl}/updSertSubLevelMenu`
			break
		default:
			break;
	}

	return postUrl
}

function submitMenuItems(element) {
	const form = element.closest("form")
	const token = $(form).find("input[name='__RequestVerificationToken']").val()
	const isValid = validateForm(form)
	const fd = new FormData(form)

	if (!isValid) return false

	let postUrl = getUpdSertPostUrl();

	disableForm("frmMenuItems", true)

	$.ajax({
		type: "POST",
		headers: { "RequestVerificationToken": token },
		url: postUrl,
		data: fd,
		processData: false,
		contentType: false
	})
		.done(async function (rowsAffected) {
			if (rowsAffected > 0) {
				if (!gIsUpdate) {
					toastr["success"]("A new menu item has been created.", "Created Successfully")
				} else {
					toastr["success"]("The menu item has been updated.", "Updated Successfully")
				}
				await displayMainMenuItems()
			}
		})
		.fail(function (error) {
			console.log(error)
			toastr["danger"]("Something went wrong. Please contact your administrator.", "System Error")
		})
		.always(function () {
			disableForm("frmMenuItems", false)
			$(gModalMenuItems).modal("hide")
			clearEntries(gModalMenuItems)
		})

}

async function deleteMenuItem(mainMenuCode, subMenuCode, subLevelMenuCode) {
	const isContinueAndDelete = confirm("Are you sure you want to delete?")
	if(!isContinueAndDelete) return;
	
	gMenuItemCodes = [] // empty the array first
	gMenuItemCodes.push({
		MAIN_MENU_CODE: mainMenuCode,
		SUB_MENU_CODE: subMenuCode,
		SUB_LEVEL_MENU_CODE: subLevelMenuCode
	})

	$.ajax({
		type: "POST",
		url: "/erp/manage/menus/deleteMenu",
		contentType: "application/json",
		data: JSON.stringify(gMenuItemCodes),
	})
		.done(async function (rowsAffected) {
			if(rowsAffected > 0) {
				toastr["success"]("The record has been successfully deleted.", "Delete Successful")
				await displayMainMenuItems()
			} else {
				toastr["danger"]("Failed to delete the record. Please try again.", "Delete Failed")
			}
		})
		.fail(function () {
			toastr["danger"]("An error occurred while deleting the record.", "Delete Failed");
		})
}

async function deleteMultipleMenuItems() {
	const isValid = validateSelectedItems()
	
	if (!isValid) {
		alert("Please select at least one (1) item.")
		return false;
	}

	const isContinueAndDelete = confirm("Are you sure you want to delete?")
	
	if(!isContinueAndDelete) return;
	
	$.ajax({
		type: "POST",
		url: "/erp/menus/deleteMenu",
		contentType: "application/json",
		data: JSON.stringify(gMenuItemCodes),
	})
		.done(async function (rowsAffected) {
			if(rowsAffected > 0) {
				toastr["success"]("The record has been successfully deleted.", "Delete Successful")
				await displayMainMenuItems()
			} else {
				toastr["danger"]("Failed to delete the record. Please try again.", "Delete Failed")
			}
		})
		.fail(function () {
			toastr["danger"]("An error occurred while deleting the record.", "Delete Failed");
		})
}

async function loadMainMenuItems() {
	let options = "";
	const data = await $.get("/erp/manage/menus/getAllMainMenuOptions")
	const totalCount = data.length

	if (totalCount > 0) {
		for (let i = 0; i < totalCount; i++) {
			options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
		}
	}

	$("#selMainMenuCode").empty().append(options)
}

async function loadSubMenuItems(mainMenuCode) {
	let options = "";
	const data = await $.get("/erp/manage/menus/getAllSubMenuOptions", { mainMenuCode })
	const totalCount = data.length
	if (totalCount > 0) {
		for (let i = 0; i < totalCount; i++) {
			options += `<option value="${data[i].VALUE}">${data[i].TEXT}</option>`
		}
	}

	$("#selSubMenuCode").empty().append(options)
}

function cancelModal(element) {
	const isConfirm = confirm(Message.ContinueClose);
	if (isConfirm) {
		const modal = $(element).closest(".modal")
		clearEntries(modal)
		closeModal(element)
	}
}

function closeModal(element) {
	// reset the visited tab to false
	$(element).closest(".modal").modal("hide")
}

function clearEntries(modal) {
	// clears & resets all the inputs 
	$(modal).find("input[type='checkbox']:checked, input[type='radio']:checked").prop("checked", false).removeClass("is-invalid")
	$(modal).find("input[type='text'], input[type='number']").val("").removeClass("is-invalid")
	$(modal).find("select").prop("selectedIndex", 0).removeClass("is-invalid")
	$(modal).find("textarea").val("").removeClass("is-invalid")
	$(modal).find("table tbody").empty()
	$(modal).find(".invalid-feedback").text("")
	$(modal).find("input, select").removeClass("readonly-event")
}

function validateSelectedItems() {
	$(gMenuItemTable).find("tbody input[type='checkbox']:checked").map(function() {
		const mainMenuCode = Number($(this).data("mm-code"))
		const subMenuCode = Number($(this).data("sm-code"))
		const subLevelMenuCode = Number($(this).data("slm-code"))
		
		gMenuItemCodes.push({
			MAIN_MENU_CODE: mainMenuCode,
			SUB_MENU_CODE: subMenuCode,
			SUB_LEVEL_MENU_CODE: subLevelMenuCode 
		})
	})
	
	return gMenuItemCodes.length !== 0
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

// Displays the delete button if there's a checked item
$(gMenuItemTable).on("change", "tbody input[type='checkbox']", function () {
	const cb = $(gMenuItemTable).find("tbody input[type='checkbox']:checked")
	const totalChecked = cb.length

	if (totalChecked > 0) {
		$("#btnDeleteMultiple").removeClass("d-none")
	} else {
		$("#btnDeleteMultiple").addClass("d-none")
	}
})