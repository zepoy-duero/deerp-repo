$(function () {
	$(document).on("click", ".star-rating:not(.readonly) label", function () {
		const inputId = $(this).attr("for")
		const specificRadio = $(this).closest("div").find("input[id='" + inputId + "']")
		const ratingValue = $(specificRadio).val()

		$(this).closest("div.card-body").find("#inpRating").val(ratingValue)
	})
})

async function submitUserSatisfaction(element) {
	const form = element.closest("form")
	const fd = new FormData(form)
	let isValid = false

	if ($(form).find("#inpRating").val() === "") {
		toastr["error"]("Please rate your current working experience.", "Validation Error")
		return
	}

	$(form).find("textarea").each(function () {
		if (String($(this).val()).trim() !== "")
			isValid = true
	})

	if (!isValid) {
		toastr["error"]("Please fill-in at least one field to complete.", "Validation Error")
		return
	}

	$(form).find(":input").prop("disabled", true)

	const response = await fetch(`/erp/support/user-satisfaction/sendUserSatisfaction`, {
		method: "POST",
		body: fd
	})

	const result = await response.json()

	if (result.success) {
		toastr["success"](result.message, "Success")
	} else {
		toastr["error"](result.message, "Error")
	}

	$(form).find(":input").prop("disabled", false)
	$(form)[0].reset()
}