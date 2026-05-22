let defaultOrg = $("#ddlOrg").val();
let processedRows = []; // IMPORTANT

$(async function () {
    setTableNoData();
    $("#loadingSpinner").hide();
    //$("#btnProcess").prop("disabled", true);

 
        // ==============================
        // CLEAR BUTTON
        // ==============================
        $("#btnClear").on("click", function () {
                $("#tblBody").html(`
                @{
                   await Html.RenderPartialAsync("~/Views/Ticket/_TicketDashBoard.cshtml");
                 }
            `);
                $("#lblTotal").text("0");
        });
        $("#fileUpload").on("change", function () {
            $("#btnProcess").prop("disabled", false);

        });
        // ==============================
        // TABLE COLUMN SORTING
        // ==============================
        $(".sortable").on("click", function () {

            let table = $(this).closest("table");
            let rows = table.find("tbody tr").toArray();
            let index = $(this).index();
            let ascending = $(this).hasClass("asc");

            $(".sortable").removeClass("asc desc");

            rows.sort(function (a, b) {

                let A = $(a).children("td").eq(index).text().toUpperCase();
                let B = $(b).children("td").eq(index).text().toUpperCase();

                if ($.isNumeric(A) && $.isNumeric(B)) {
                    return ascending ? B - A : A - B;
                }

                return ascending
                    ? B.localeCompare(A)
                    : A.localeCompare(B);
            });

            if (!ascending) {
                $(this).addClass("asc");
            } else {
                $(this).addClass("desc");
            }

            $.each(rows, function (i, row) {
                table.children("tbody").append(row);
            });
        });

        // On org change -> load suppliers + clear file + clear grid
        $("#ddlOrg").on("change", function () {
            clearGrid();
            $("#msgError").addClass("d-none").text("");
            $("#msgSuccess").addClass("d-none").text("");
            clearFile();

            const orgCode = $(this).val();

            // if (!orgCode) {
            //     $("#ddlSupplier").prop("disabled", true).html('<option value="">-- Select --</option>');
            //     return;
            // }

            $.get("/parts-origin/get-supplier-by-org", { orgCode: orgCode })
                .done(function (data) {
                    let html = "";
                    data.forEach(function (x) {
                        html += `<option value="${x.value}">${x.text}</option>`;
                    });

                    $("#ddlSupplier").html(html).prop("disabled", false);

                    if (data.length > 0) {
                        $("#ddlSupplier").val(data[0].value);
                    }

                    clearFile();
                })
                .fail(function () {
                    showError("Failed to load suppliers.");
                });
        });

        // Supplier change -> clear file + grid
        $("#ddlSupplier").on("change", function () {
            clearGrid();
            $("#msgError").addClass("d-none").text("");
            $("#msgSuccess").addClass("d-none").text("");
            clearFile();
        });

        $("#btnUpdate").on("click", function () {

            $("#msgError").addClass("d-none").text("");
            $("#msgSuccess").addClass("d-none").text("");

            const orgCode = parseInt($("#ddlOrg").val() || "0");
            const supCode = $("#ddlSupplier").val();

            if (!orgCode) return showError("Please select Organization.");
            if (!supCode) return showError("Please select Supplier.");
            if (!processedRows || processedRows.length === 0) return showError("No records to insert. Please click Process first.");

            //block insert if ANY row has empty required fields
            const hasInvalid = processedRows.some(r =>
                !r.PartNo || r.PartNo.toString().trim() === "" ||
                !r.Origin || r.Origin.toString().trim() === "" ||
                !r.HSCode || r.HSCode.toString().trim() === ""
            );

            if (hasInvalid) {
                return showError("No data to be inserted because Part No / Origin / HS Code has empty value.");
            }

            $("#btnUpdate").prop("disabled", true).text("Updating...");

            $.ajax({
                url: "/parts-origin/update-origin-hscode",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({ OrgCode: orgCode, SupCode: supCode, Rows: processedRows }) //send all rows
            })
                .done(function (res) {
                    showSuccess(`Successfully inserted ${res.inserted} records.`);
                })
                .fail(function (xhr) {
                    showError(xhr.responseText || "Insert failed.");
                })
                .always(function () {
                    $("#btnUpdate").prop("disabled", false).text("Update Origin / HS Code");
                });
        });

    $("#btnClear").on("click", function () {
        // hide messages
        $("#msgError").addClass("d-none").text("");
        $("#msgSuccess").addClass("d-none").text("");

        // clear file + grid + stored rows
        $("#fileUpload").val("");
        $("#lblTotal").text("0");
        $("#tblBody").html('<tr><td colspan="12" class="text-center text-muted">No data</td></tr>');
        processedRows = [];

        // set org back to default and reload suppliers
        $("#ddlOrg").val(defaultOrg).trigger("change");
    });

    //event listener
    $("#btnProcess").on("click", function (e) {
        e.preventDefault();

        $("#loadingSpinner").show();
        $("#btnProcess").prop("disabled", true);

        $("#msgError").addClass("d-none").text("");
        $("#msgSuccess").addClass("d-none").text("");

        const orgCode = $("#ddlOrg").val();
        const supCode = $("#ddlSupplier").val();
        const supName = $("#ddlSupplier option:selected").text();
        const file = $("#fileUpload")[0].files[0];

        if (!orgCode) return showError("Please select Organization.");
        if (!supCode) return showError("Please select Supplier.");
        if (!file) return showError("Please choose a file.");

        const fd = new FormData();
        fd.append("orgCode", orgCode);
        fd.append("supCode", supCode);
        fd.append("supName", supName);
        fd.append("uploadFile", file);

        $("#uploadProgressWrapper").show();
        $.ajax({
            url: "/parts-origin/process-file",
            type: 'POST',
            data: fd,
            processData: false,
            contentType: false,
            xhr: function () {
                let xhr = new window.XMLHttpRequest();
                xhr.upload.addEventListener("progress", function (evt) {
                    if (evt.lengthComputable) {
                        let percent = Math.round((evt.loaded / evt.total) * 100);
                        $("#uploadProgressBar")
                            .css("width", percent + "%")
                            .text(percent + "%");
                    }
                }, false);
                return xhr;
            },
            success: function (res) {
                console.log(res);
            },
            complete: function () {
                $("#loadingSpinner").hide();
                $("#btnProcess").prop("disabled", false);
                setTimeout(() => {
                    $("#uploadProgressWrapper").hide();
                    $("#uploadProgressBar").css("width", "0%").text("0%");
                }, 1000);
            }
        });

    });
        // trigger after handlers are attached

        $("#ddlOrg").trigger("change");
 });
    function clearGrid() {
        $("#lblTotal").text("0");
         processedRows = []; //  clear stored rows too
    }

    function showError(text) {
        $("#msgError").removeClass("d-none").text(text || "");
        $("#msgSuccess").addClass("d-none").text("");
    }

    function showSuccess(text) {
        $("#msgSuccess").removeClass("d-none").text(text || "");
        $("#msgError").addClass("d-none").text("");
    }

    function clearFile() {
        $("#fileUpload").val("");
    }

function setTableNoData() {
    //$("#tblBody").(`
    //        @{
    //           await Html.RenderPartialAsync("~/Views/Ticket/_TicketDashBoard.cshtml");
    //         }
    //    `);
    $("#lblTotal").text("0");
}