const gBaseUrl = "/account/change-password"
const gFormId = $("#frmChangePassword")

$(function () {

})

async function submitSaveChanges(element) {
  const form = element.closest("form")
  const fd = new FormData(form)
  const isValid = validateForm(form)

  if (!isValid) {
    toastr.error("Please fill-in all the required fields.", "Invalid")
    return
  }

  if (!isPasswordMatches()) {
    toastr.error("Your password does not match. Please try again.", "Invalid")
    return
  }

  setFormDisabled(true)
  const response = await fetch(`${gBaseUrl}/updatePassword`, {
    method: "POST",
    body: fd
  })

  const result = await response.json()

  if (!response.ok) {
    toastr.error(result.message, "Error")
    setFormDisabled(false)
    return
  }

  toastr.success(result.message, "Success")
  setFormDisabled(false)
}

function setFormDisabled(bool = true) {
  $(gFormId).find(":input").prop("disabled", bool)
}

function isPasswordMatches() {
  const newPassword = $(gFormId).find("#inpNewPassword").val()
  const confirmPassword = $(gFormId).find("#inpConfirmPassword").val()
  return newPassword === confirmPassword
}

function showPassword(element) {
  const isChecked = $(element).is(":checked")
  if (isChecked) {
    $(gFormId).find("input[type='password']").attr("type", "text")
  } else {
    $(gFormId).find("input[type='text']").attr("type", "password")
  }
}
