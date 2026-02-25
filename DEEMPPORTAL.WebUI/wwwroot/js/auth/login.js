let gOtpModal = $("#modalOTPVerification")
const gFormLogin = $("#frmLogin")

$(function() {

})

$(document).on("submit", function(e) {
	e.preventDefault();
	return;
})

$(gOtpModal).on("keyup", "input.form-control", function(e) {
	if (e.key === "Enter") {
		console.log("enter enter")
	}
})

$(gFormLogin).on("keyup", "input.form-control", function(e) {
	if (e.key === "Enter") {
		submitLogin(gFormLogin[0])
	}
})

async function submitLogin(element) {
	const form = element.closest("form");
	const isValid = validateForm(form)
	const fd = new FormData(form)

	if (!isValid) {
		toastr["warning"]("Please fill-in the required fields..", "Required")
		return false;
	}

	try {
		disableForm("frmLogin", true)
		const response = await fetch("/auth/login/authenticate", {
			method: "POST",
			body: fd
		})

		const data = await response.json()
		if (!data.isSuccess) {
			toastr["error"](`${data.message}`, "Invalid Credentials")
			return
		}

		if (!data.is2FAEnabled) {
			window.location.href = `${data.url}`
			return
		}

		// show the otp verification modal
		const splitEmail = data.emailAddress.split(',')
		const splitLength = splitEmail.length
		const labelEmail = splitLength > 1 ? `${splitEmail[0]} and ${splitEmail[1]}` : splitEmail[0]

		$("#modalOtpVerification").on("shown.bs.modal", function() {
			$(this).find("input[name='OtpCode']").trigger("focus").select();
		});

		$("#modalOtpVerification").find("#lblEmailAddress").text(labelEmail)
		$("#modalOtpVerification").find("#inpUserCode").val(data.userCode)

		gOtpModal = new bootstrap.Modal("#modalOtpVerification", {
			backdrop: "static",
			keyboard: false,
		})

		gOtpModal.show();
	} catch (error) {
		console.log(error)
		disableForm("frmLogin", false)
		toastr["error"]("Please contact your administrator.", "Something went wrong")
	} finally {
		disableForm("frmLogin", false)
	}
} 

async function verifyOtp(element) {
	const form = element.closest("form");
	const isValid = validateForm(form)
	if (!isValid) {
		toastr["warning"]("Please enter the required fields.", "Required")
		return false;
	}

	const fd = new FormData(form);
	
	fd.append("Username", $(gFormLogin).find("#inpUsername").val())
	fd.append("Password", $(gFormLogin).find("#inpPassword").val())

	try {
		disableForm("frmOtpVerification", true)
		const response = await fetch("/auth/login/verifyOTP", {
			method: "POST",
			body: fd
		})

		const data = await response.json()
		if (!data.isSuccess) {
			toastr["error"](`${data.message}`, "Invalid Credentials")
			return
		}
		// redirect to another page
		window.location.href = `${data.url}`;
	} catch (error) {
		disableForm("frmOtpVerification", false)
		toastr["error"]("Please contact your administrator.", "Something went wrong.")
	} finally {
		disableForm("frmOtpVerification", false)
	}
}

function cancelModal() {
	gOtpModal.hide()
	gOtpModal.dispose()
} 