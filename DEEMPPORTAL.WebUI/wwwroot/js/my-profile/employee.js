const gBaseUrl = "/my-profile"
const gFormEntry = "#frmEmployeeProfile"
const gNavId = "#v-pills-tab"

let gActivePanel = $(gNavId).find(".nav-link.active").attr("data-bs-target")
const validationConfig = {
    "#selBloodGroup": "Please select a valid blood group.",
    "#txtDietaryRestriction": "Specify any dietary restrictions.",
    "#txtMedicalAllergies": "Allergies are required.",
    "#inpEmergencyContactName": "Enter emergency contact name.",
    "#selEmergencyContactRelationship": "Select contact relationship.",
    "#inpEmergencyContactNumber": "Enter emergency contact number.",
    "#txtResidentialAddress": "Residential address is required.",
    "#inpMobileNo": "Mobile number is required.",
    //"#inpTelephoneNo": "Telephone number is required.",
    //"#inpExtensionNo": "Extension is required."
};
const selectors = [
    "#selBloodGroup",
    "#txtDietaryRestriction",
    "#txtMedicalAllergies",
    "#inpEmergencyContactName",
    "#selEmergencyContactRelationship",
    "#inpEmergencyContactNumber",
    "#txtResidentialAddress",
    "#inpMobileNo",
    //"#inpTelephoneNo",
    //"#inpExtensionNo"
];
$(async function () {
    console.log(gActivePanel);
    loadRelationship()
    loadBloodGroup()
    await displayEmployeeProfileDetails()
    //$("#frmEmployeeProfile").on("change", function () {
    //    console.log(gActivePanel);
    //});
})

$(gNavId).on("click", ".nav-link", function () {
  gActivePanel = $(this).attr("data-bs-target")
})

function refreshData() {
    selectors.forEach(selector => {
        $(selector).removeClass("is-invalid is-valid");
        const tooltipInstance = bootstrap.Tooltip.getInstance(selector);
        if (tooltipInstance) {
            tooltipInstance.dispose();
        }
    })
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


function validateTab(activeTab) {
    let validated = true;
    let fieldsToValidate = [];

    // 1. Determine which fields to check based on the active tab
    if (activeTab === "#v-pills-home") {
        fieldsToValidate = ["#selBloodGroup",
            "#txtDietaryRestriction",
            "#txtMedicalAllergies",
            "#inpEmergencyContactName",
            "#selEmergencyContactRelationship",
            "#inpEmergencyContactNumber"];
    } else if (activeTab === "#v-pills-profile") {
        fieldsToValidate = ["#txtResidentialAddress"];
    } else if (activeTab === "#v-pills-messages") {
        //fieldsToValidate = ["#inpMobileNo", "#inpTelephoneNo", "#inpExtensionNo"];
        fieldsToValidate = ["#inpMobileNo"];
    }

    // 2. Loop through the specific fields for this tab
    fieldsToValidate.forEach(selector => {
        const $el = $(selector);

        // Remove old validation state/tooltips
        $el.removeClass("is-invalid");
        const oldTooltip = bootstrap.Tooltip.getInstance($el[0]);
        if (oldTooltip) oldTooltip.dispose();

        if ($el.val().trim() === "") {
            validated = false;
            $el.addClass("is-invalid");

            // 3. Create the white tooltip with custom message
            new bootstrap.Tooltip($el[0], {
                title: validationConfig[selector],
                placement: "right",
                trigger: "manual",
                customClass: "white-tooltip"
            }).show();
        } else {
            $el.addClass("is-valid");
        }
    });

    return validated;
}
async function submitSaveChanges(element) {
  //element.preventDefault();  
  const form = element.closest("form");
  const token = $(form).find("input[name='__RequestVerificationToken']").val()
  //const isValid = validateForm(gActivePanel)
  const isValid = validateTab(gActivePanel)
  const fd = new FormData(form)
  console.log(gActivePanel)
  //if (!isValid) {
  //  toastr.error("Please enter all the required fields.", "Required")
  //  return
  //}

    if (isValid) {
        disableForm("frmEmployeeProfile", true)
        try {
            const response = await fetch(`${gBaseUrl}/updSertMyProfile`, {
                method: "POST",
                headers: {
                    "RequestVerificationToken": token
                },
                body: fd
            });
            console.log(response)
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
    } else {
        toastr.error("Please enter all the required fields.", "Required");
        return;
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