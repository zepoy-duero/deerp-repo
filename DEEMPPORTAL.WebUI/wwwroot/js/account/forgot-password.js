const gBaseUrl = "/account/forgot-password"
const gFormId = $("#frmForgotPassword")

$(function () {
  
})

async function sendOtpCode(element) {
  const emailAddress = $(gFormId).find("#inpEmailAddress").val()
  if (emailAddress === "") {
    $(gFormId).find("#inpEmailAddress").addClass("is-invalid")
    toastr.error("Please fill-in the required field.", "Invalid Entry")
    return
  }
  else if (!isValidEmail(emailAddress)) {
    $(gFormId).find("#inpEmailAddress").addClass("is-invalid")
    toastr.error("You have entered an invalid email address. Please try again.", "Invalid Entry")
    return
  }
  else {
    $(element).prop("disabled", true)
    $(gFormId).find("#inpEmailAddress").removeClass("is-invalid").addClass("readonly-event").prop("readonly", true)

    // fire the request
    const form = element.closest("form")
    const fd = new FormData(form)
    const response = await fetch(`${gBaseUrl}/sendOtpCode`, {
      method: "POST",
      body: fd
    })

    const result = await response.json()

    if (!response.ok) {
      toastr.error(result.message, "Error")
      $(element).prop("disabled", false)
      $(gFormId).find("#inpEmailAddress").removeClass("readonly-event").prop("readonly", false)
      return
    }

    toastr.success(result.message, "Success")
    $(gFormId).find("#otpVerification").removeClass("d-none")
  }
}

async function verifyOtpCode(element) {
  const otpCode = $(gFormId).find("#inpOtpCode").val()
  if (otpCode === "") {
    $(gFormId).find("#inpOtpCode").addClass("is-invalid")
    toastr.error("Please fill-in the required field.", "Invalid Entry")
    return
  }
  else {
    $(element).prop("disabled", true)
    $(gFormId).find("#inpOtpCode").removeClass("is-invalid").addClass("readonly-event").prop("readonly", true)

    // fire the request
    const form = element.closest("form")
    const fd = new FormData(form)
    const response = await fetch(`${gBaseUrl}/verifyOtpCode`, {
      method: "POST",
      body: fd
    })

    const result = await response.json()

    if (!response.ok) {
      toastr.error(result.message, "Error")
      $(element).prop("disabled", false)
      $(gFormId).find("#inpOtpCode").removeClass("readonly-event").prop("readonly", false)
      return
    }

    toastr.success(result.message, "Success")

    $(gFormId).find(":input").removeClass("readonly-event").prop("readonly", false).prop("disabled", false)
    $(gFormId).find("#otpVerification").addClass("d-none")
    $(gFormId)[0].reset()
  }
}

function startOtpCountDown() {
}


function isValidEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
