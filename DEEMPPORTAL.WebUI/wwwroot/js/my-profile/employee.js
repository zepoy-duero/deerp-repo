const gBaseUrl = "/my-profile"
const gFormEntry = "#frmEmployeeProfile"
const gNavId = "#v-pills-tab"

let gActivePanel = $(gNavId).find(".nav-link.active").attr("data-bs-target")

$(async function () {
  loadRelationship()
  loadBloodGroup()
  await displayEmployeeProfileDetails()
})

$(gNavId).on("click", ".nav-link", function () {
  gActivePanel = $(this).attr("data-bs-target")
})

function refreshData() {
  displayEmployeeProfileDetails()
}

async function displayEmployeeProfileDetails() {
  disableForm("frmEmployeeProfile", true)
  const response = await fetch(`${gBaseUrl}/getMyProfileDetails`)
  if (!response.ok) {
    console.error("Error fetching data:", response.statusText);
    return;
  }

  const data = await response.json()
  const totalCount = data.length

  disableForm("frmEmployeeProfile", false)

  if (totalCount === 0) return false;
  console.log(data[0])
  const employeeProfileId = data[0].EMPLOYEE_PROFILE_ID
  const bloodGroup = data[0].BLOOD_GROUP
  const foodPreference = data[0].FOOD_PREFERENCE
  const dietaryRestrictions = data[0].DIETARY_RESTRICTION
  const medicalALlergies = data[0].MEDICAL_ALLERGIES
  const emergencyContact = data[0].EMERGENCY_CONTACT.split("|")
  const localResidentialAddress = data[0].RESIDENTIAL_ADDRESS
  const mobileNo = data[0].MOBILE_NO
  const telephoneNo = data[0].TELEPHONE_NO
  const extensionNo = data[0].EXTENSION_NO
  const lastUpdatedDate = data[0].UPDATED_BY === 0 ? data[0].CREATED_DATE : data[0].UPDATED_DATE

  $(gFormEntry).find("#inpEmployeeProfileId").val(employeeProfileId)
  $(gFormEntry).find("#selBloodGroup").val(bloodGroup)
  $(gFormEntry).find("input[type='radio'][value='" + foodPreference + "']").prop("checked", true)
  $(gFormEntry).find("#txtDietaryRestriction").val(dietaryRestrictions)
  $(gFormEntry).find("#txtMedicalAllergies").val(medicalALlergies)
  $(gFormEntry).find("#inpEmergencyContactName").val(emergencyContact[0].trim())
  $(gFormEntry).find("#selEmergencyContactRelationship").val(emergencyContact[1].trim())
  $(gFormEntry).find("#inpEmergencyContactNumber").val(emergencyContact[2].trim())
  $(gFormEntry).find("#txtResidentialAddress").val(localResidentialAddress)
  $(gFormEntry).find("#inpMobileNo").val(mobileNo)
  $(gFormEntry).find("#inpTelephoneNo").val(telephoneNo)
  $(gFormEntry).find("#inpExtensionNo").val(extensionNo)
  $(gFormEntry).find("#lblLastUpdate").text(convertToLocaleDateString(lastUpdatedDate))
}

async function submitSaveChanges(element) {
  const form = element.closest("form");
  const token = $(form).find("input[name='__RequestVerificationToken']").val()
  const isValid = validateForm(gActivePanel)
  const fd = new FormData(form)

  if (!isValid) {
    toastr.error("Please enter all the required fields.", "Required")
    return
  }

  disableForm("frmEmployeeProfile", true)

  try {
    const response = await fetch(`${gBaseUrl}/updSertMyProfile`, {
      method: "POST",
      headers: {
        "RequestVerificationToken": token
      },
      body: fd
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    toastr.success("You have successfully updated your profile.", "Employee Profile");
    displayEmployeeProfileDetails();

  } catch (error) {
    console.error("Update failed:", error);
    toastr.error("Something went wrong. Please contact your administrator.", "System Error");
  } finally {
    disableForm("frmResidentialAddress", false);
  }
}

function submitClearEntries() {
  clearEntries(gActivePanel)
}

function loadBloodGroup(callback) {
  const options = `
    <option value=""></option>
    <option value="A+">A+</option>
    <option value="A-">A-</option>
    <option value="B+">B+</option>
    <option value="B-">B-</option>
    <option value="AB+">AB+</option>
    <option value="AB-">AB-</option>
    <option value="O+">O+</option>
    <option value="O-">O-</option>
  `

  $(gFormEntry).find("#selBloodGroup").empty().append(options)

  if (callback) callback()
}

function loadRelationship(callback) {
  const options = `
    <option value=""></option>
		<option value="Father">Father</option>
		<option value="Mother">Mother</option>
		<option value="Grand Father">Grand Father</option>
		<option value="Grand Mother">Grand Mother</option>
    <option value="Wife">Wife</option>
		<option value="Husband">Husband</option>
		<option value="Son">Son</option>
		<option value="Daughter">Daughter</option>
    <option value="Brother">Brother</option>
		<option value="Sister">Sister</option>
		<option value="Cousin">Cousin</option>
		<option value="Friend">Friend</option>
  `

  $(gFormEntry).find("#selEmergencyContactRelationship").empty().append(options)

  if (callback) callback()
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