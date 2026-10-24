/**
 * Ticket Model - Represents the Ticket data structure
 * Single Responsibility: Only holds ticket data
 */
class TicketModel {
    constructor(data = {}) {
        this.OrgCode = data.OrgCode || 1;
        this.LocCode = data.LocCode || 1;
        this.DeptCode = data.DeptCode || 9;
        this.RequestedDate = data.RequestedDate || null;
        this.TicketDescription = data.TicketDescription || null;
        this.TicketSubject = data.TicketSubject || null;
        this.TaskTypeCode = data.TaskTypeCode || null;
        this.TicketAttachments = data.TicketAttachments || [];
        this.TicketId = data.TicketId || null;
        this.StringTicketId = data.StringTicketId || null;
        this.RequestedByCode = data.RequestedByCode || null;
        this.RequestedByName = data.RequestedByName || null;
        this.RequestedByEmail = data.RequestedByEmail || null;
        this.StatusName = data.StatusName || null;
        this.TicketPriority = data.TicketPriority || null;
        this.TaskTypeName = data.TaskTypeName || null;
        this.DeptName = data.DeptName || null;
        this.AssignedToName = data.AssignedToName || null;
    }

    isValid() {
        return this.OrgCode && this.LocCode && this.DeptCode && 
               this.TaskTypeCode && this.TicketSubject && this.TicketDescription;
    }

    toFormData() {
        const fd = new FormData();
        Object.keys(this).forEach(key => {
            const value = this[key];
            fd.append(key, value !== null && value !== undefined ? value : '');
        });
        return fd;
    }
}