$(async function () {
    //EVENT LISTENERS
    //$("#toggleEditUserRequest").on('change', function (event) {
    //    $("#ticketSubject").prop('readonly', function (i, value) {
    //        return !value;
    //    })
    //    $("#requestedByCode").prop('readonly', function (i, value) {
    //        return !value;
    //    })
    //    if ($("#ticketSubject").prop("disabled")) {
    //        $('#ticketDescription').summernote('disable');
    //    } else {
    //        $('#ticketDescription').summernote('enable');
    //    }
    //});
    $("#toggleEditUserRequest").on("change", function (event) {
        event.preventDefault()

        //make the field editable
        $("#editRequestedByName").toggleClass('form-control-plaintext form-select fw-bold')
        $("#editRequestedByName").prop("disabled", function (i, val) {
            return !val;
        });
        $("#requestedDate").toggleClass('form-control-plaintext form-control fw-bold')
        $("#requestedDate").prop("disabled", function (i, val) {
            return !val;
        });

        $("#editTicketSubject").toggleClass('form-control-plaintext form-control fw-bold')
        $("#editTicketSubject").prop("disabled", function (i, val) {
            return !val;
        });

        if ($("#editTicketSubject").prop("disabled")) {
            $('#ticketDescription').summernote('disable');
        } else {
            $('#ticketDescription').summernote('enable');
        }


    });
   

})
async function setUserRequestFields() {

}

function disableUserRequestForm() {

}
