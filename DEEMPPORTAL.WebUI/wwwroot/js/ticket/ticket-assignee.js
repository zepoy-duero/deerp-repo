$(async function () {

});
//-----FUNCTIONS------------
function toggleEditRequestedBy() {

    isEditingRequestedBy = !isEditingRequestedBy;

    if (isEditingRequestedBy) {

        // Switch to Edit Mode
        $("#DisplayRequestedByName").addClass("d-none");
        $("#SelectRequestedByName").removeClass("d-none");
        $("#editBtn").addClass("d-none");
        $("#checkBtn").removeClass("d-none");



    } else {

        $("#DisplayRequestedByName").removeClass("d-none")
            .empty()
            .append($("#SelectRequestedByName").val());
        $("#SelectRequestedByName").addClass("d-none");
        $("#editBtn").removeClass("d-none");
        $("#checkBtn").addClass("d-none");

    }
}