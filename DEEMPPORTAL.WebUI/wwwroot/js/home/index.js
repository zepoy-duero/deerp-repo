const gBaseUrl = '/home';

$(function() {
	displayUserDetails();
})

async function displayUserDetails() {
	const response = await fetch(`${gBaseUrl}/getUserDetails`);
	if (!response.ok) {
		console.error('Failed to fetch user details');
		return;
	}

	const data = await response.json();

	$("#imgContainer").empty().append(displayImage(data.EMP_PHOTO));
	$("#empName").html(`${data.EMP_NAME}`)
	$("#empPosition").html(`${data.EMP_POSITION}`)
	$("#deptName").html(`${data.DEPT_NAME}`)
	$("#empStatus").html(`${data.EMP_STATUS}`)
	$("#emailAddress").html(`${data.EMAIL_ADDRESS}`)
	$("#vatNo").html(`${data.VAT_NO}`)
}

function displayImage(byteImg) {
	if (byteImg == null)
		return `<img class="avatar-img rounded-circle shadow-lg" src="https://placehold.co/100" alt="default profile" width="200">`;
	return `<img class="avatar-img rounded-circle shadow-lg" src="data:image/jpg;base64,${byteImg}" alt="" loading="lazy" width="200">`;
} 