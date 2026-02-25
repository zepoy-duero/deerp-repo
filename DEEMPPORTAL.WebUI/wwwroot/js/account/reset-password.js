const gBaseUrl = "/account/reset-password"
const gFormId = $("#frmResetPassword")

$(function () {
  console.log("Welcome to reset password")
})

function showPassword(element) {
  const isChecked = $(element).is(":checked")
  if (isChecked) {
    $(gFormId).find("input[type='password']").attr("type", "text")
  } else {
    $(gFormId).find("input[type='text']").attr("type", "password")
  }
}

async function submitResetPassword(element) {
  const form = element.closest("form")
  const fd = new FormData(form)
  const isValid = validateForm(form)

  if (!isValid) {
    toastr.error("Please fill-in the required fields.", "Error")
    return
  }

  if (!isPasswordMatches()) {
    toastr.error("Password does not match.", "Error")
    return
  }

  disableForm("frmResetPassword", true)

  const response = await fetch(`${gBaseUrl}/resetPassword`, {
    method: "POST",
    body: fd
  })

  const result = await response.json()

  if (!response.ok) {
    disableForm("frmResetPassword", false)
    toastr.error(result.message, "Error")
    return
  }

  toastr.success(result.message, "Success")

  setTimeout(() => {
    window.location.href = `/auth/login/erp`
  }, 2000)
}

function isPasswordMatches() {
  const newPassword = $(gFormId).find("#inpNewPassword").val()
  const confirmPassword = $(gFormId).find("#inpConfirmPassword").val()
  return newPassword === confirmPassword
}