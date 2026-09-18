"use strict";

let currentOperatorId = null;

$(document).ready(function () {
    initializeEventHandlers();
    loadFilterOptions();
});

function initializeEventHandlers() {
    // Add button
    $("#btnAddOperator").on("click", openAddModal);

    // Form submit
    $("#operatorForm").on("submit", handleSaveOperator);

    // Filter changes
    $("#filterOrganization, #filterLocation, #filterDepartment, #filterStatus").on("change", function () {
        $("#equipmentOperatorTable").bootstrapTable("refresh");
    });

    // Cascading dropdowns
    $("#organizationId").on("change", loadLocationsByOrg);
    $("#locationId").on("change", loadDepartmentsByLoc);
}

function openAddModal() {
    currentOperatorId = null;
    $("#operatorModalTitle").text("Add Operator");
    $("#operatorForm")[0].reset();
    new bootstrap.Modal(document.getElementById("operatorModal")).show();
}

async function handleSaveOperator(e) {
    e.preventDefault();

    const operatorData = {
        operatorId: $("#operatorId").val() || 0,
        employeeId: parseInt($("#employeeId").val()),
        organizationId: parseInt($("#organizationId").val()),
        locationId: parseInt($("#locationId").val()),
        departmentId: parseInt($("#departmentId").val()),
        equipmentType: $("#equipmentType").val(),
        certificationNumber: $("#certificationNumber").val(),
        certificationDate: $("#certificationDate").val(),
        expiryDate: $("#expiryDate").val(),
        remarks: $("#remarks").val(),
        isActive: $("#isActive").is(":checked")
    };

    try {
        const response = await $.ajax({
            url: "/CertifiedEquipmentOperator/save-operator",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(operatorData)
        });

        if (response.success) {
            toastr.success("Operator saved successfully.", "Success");
            bootstrap.Modal.getInstance(document.getElementById("operatorModal")).hide();
            $("#equipmentOperatorTable").bootstrapTable("refresh");
        } else {
            toastr.error(response.message || "Failed to save operator.", "Error");
        }
    } catch (error) {
        console.error("Save error:", error);
        toastr.error("An error occurred while saving.", "Error");
    }
}

async function loadFilterOptions() {
    try {
        const orgs = await $.get("/CertifiedEquipmentOperator/get-organizations");
        orgs.forEach(org => {
            $("#filterOrganization, #organizationId").append(`<option value="${org.VALUE}">${org.TEXT}</option>`);
        });
    } catch (error) {
        console.error("Load organizations error:", error);
    }
}

async function loadLocationsByOrg() {
    const orgId = $("#organizationId").val();
    if (!orgId) return;

    try {
        const locations = await $.get("/CertifiedEquipmentOperator/get-locations", { orgId });
        $("#locationId").html('<option value="">Select Location</option>');
        locations.forEach(loc => {
            $("#locationId").append(`<option value="${loc.VALUE}">${loc.TEXT}</option>`);
        });
    } catch (error) {
        console.error("Load locations error:", error);
    }
}

async function loadDepartmentsByLoc() {
    const locId = $("#locationId").val();
    if (!locId) return;

    try {
        const depts = await $.get("/CertifiedEquipmentOperator/get-departments", { locId });
        $("#departmentId").html('<option value="">Select Department</option>');
        depts.forEach(dept => {
            $("#departmentId").append(`<option value="${dept.VALUE}">${dept.TEXT}</option>`);
        });
    } catch (error) {
        console.error("Load departments error:", error);
    }
}

// Trigger edit from table action button
function editOperator(operatorId) {
    // Load operator data and open modal
    $.get(`/CertifiedEquipmentOperator/get-operator/${operatorId}`, function (data) {
        $("#operatorId").val(data.OperatorId);
        $("#employeeId").val(data.EmployeeId);
        $("#organizationId").val(data.OrganizationId);
        $("#locationId").val(data.LocationId);
        $("#departmentId").val(data.DepartmentId);
        $("#equipmentType").val(data.EquipmentType);
        $("#certificationNumber").val(data.CertificationNumber);
        $("#certificationDate").val(data.CertificationDate);
        $("#expiryDate").val(data.ExpiryDate);
        $("#remarks").val(data.Remarks);
        $("#isActive").prop("checked", data.IsActive);

        $("#operatorModalTitle").text("Edit Operator");
        new bootstrap.Modal(document.getElementById("operatorModal")).show();
    });
}

// Trigger delete from table action button
function deleteOperator(operatorId) {
    currentOperatorId = operatorId;
    new bootstrap.Modal(document.getElementById("deleteModal")).show();
}

$("#btnConfirmDelete").on("click", async function () {
    if (!currentOperatorId) return;

    try {
        const response = await $.ajax({
            url: `/CertifiedEquipmentOperator/delete-operator/${currentOperatorId}`,
            type: "DELETE"
        });

        if (response.success) {
            toastr.success("Operator deleted successfully.", "Success");
            bootstrap.Modal.getInstance(document.getElementById("deleteModal")).hide();
            $("#equipmentOperatorTable").bootstrapTable("refresh");
        } else {
            toastr.error(response.message || "Failed to delete operator.", "Error");
        }
    } catch (error) {
        console.error("Delete error:", error);
        toastr.error("An error occurred while deleting.", "Error");
    }
});