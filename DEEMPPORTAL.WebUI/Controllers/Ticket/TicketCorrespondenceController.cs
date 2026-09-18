using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Domain.Ticket;
using DEEMPPORTAL.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace DEEMPPORTAL.WebUI.Controllers.Ticket
{
    [Authorize]
    [Route("MyTickets/ticket-correspondence")]
    public class TicketCorrespondenceController(
        ITicketRepository correspondenceRepository,
         ITicketService ticketService,
        ILogger<TicketCorrespondenceController> logger) : Controller
    {
        private readonly ITicketService _ticketService = ticketService;
        private readonly ITicketRepository
            _correspondenceRepository =
                correspondenceRepository;
        private readonly ILogger<TicketCorrespondenceController> _logger = logger;



        /* =========================================================
           GET
           /api/ticket-correspondence/1
        ========================================================= */

        [HttpGet("{correspondenceId:int}")]
        public async Task<IActionResult> GetById(
            int correspondenceId)
        {
            try
            {
                var correspondence =
                    await _correspondenceRepository
                        .GetByIdAsync(correspondenceId);


                if (correspondence == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message =
                            "Correspondence not found."
                    });
                }


                return Ok(new
                {
                    success = true,
                    data = correspondence
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "An error occurred while retrieving the correspondence.",
                        error = ex.Message
                    }
                );
            }
        }


        /* =========================================================
           GET BY TICKET
           /api/ticket-correspondence/ticket/1001
        ========================================================= */

        [HttpGet("ticketId/{ticketId:int}")]
        public async Task<IActionResult> GetByTicketId(
            int ticketId)
        {
            try
            {
                var correspondences =
                    await _correspondenceRepository
                        .GetByTicketIdAsync(ticketId);


                return Ok(new
                {
                    success = true,
                    data = correspondences
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "An error occurred while retrieving ticket correspondence.",
                        error = ex.Message
                    }
                );
            }
        }


        /* =========================================================
           INSERT
           POST /api/ticket-correspondence
        ========================================================= */

        [HttpPost]
        public async Task<IActionResult> Insert([FromBody] TicketCorrespondenceRequest model)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid request.",
                        errors = ModelState
                    });
                }


                if (model.TicketId <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message =
                            "TicketId is required."
                    });
                }


                if (string.IsNullOrWhiteSpace(
                    model.Message))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message =
                            "Message is required."
                    });
                }


                var result =
                    await _correspondenceRepository
                        .InsertAsync(model);


                if (result == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message =
                            "Unable to create correspondence."
                    });
                }


                return CreatedAtAction(
                    nameof(GetById),
                    new
                    {
                        correspondenceId =
                            result.CorrespondenceId
                    },
                    new
                    {
                        success = true,
                        message =
                            "Correspondence created successfully.",
                        data = result
                    }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "An error occurred while creating the correspondence.",
                        error = ex.Message
                    }
                );
            }
        }


        /* =========================================================
           UPDATE
           PUT /api/ticket-correspondence/1
        ========================================================= */

        [HttpPut("{correspondenceId:int}")]
        public async Task<IActionResult> Update(
            int correspondenceId,
            [FromBody]
            UpdateTicketCorrespondenceRequest model)
        {
            try
            {
                if (correspondenceId !=
                    model.CorrespondenceId)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message =
                            "CorrespondenceId mismatch."
                    });
                }


                if (!ModelState.IsValid)
                {
                    return BadRequest(new
                    {
                        success = false,
                        message = "Invalid request.",
                        errors = ModelState
                    });
                }


                if (string.IsNullOrWhiteSpace(
                    model.Message))
                {
                    return BadRequest(new
                    {
                        success = false,
                        message =
                            "Message is required."
                    });
                }


                var result =
                    await _correspondenceRepository
                        .UpdateAsync(model);


                if (result == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        message =
                            "Correspondence not found."
                    });
                }


                return Ok(new
                {
                    success = true,
                    message =
                        "Correspondence updated successfully.",
                    data = result
                });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    StatusCodes.Status500InternalServerError,
                    new
                    {
                        success = false,
                        message =
                            "An error occurred while updating the correspondence.",
                        error = ex.Message
                    }
                );
            }
        }


        /* =========================================================
           DELETE
           DELETE /api/ticket-correspondence/1
        ========================================================= */

        [HttpPost("delete-attachment")]
        public async Task<IActionResult> DeleteAttachment(int attachmentId)
        {
            if (attachmentId <= 0)
            {
                return BadRequest(new { success = false, message = "Invalid attachment or ticket ID." });
            }

            try
            {
                var result = await _ticketService.DeleteCorrespondenceAttachmentAsync(attachmentId);

                if (result)
                {
                    return Ok(new { success = true, message = "Attachment deleted successfully." });
                }

                return BadRequest(new { success = false, message = "Failed to delete attachment." });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting attachment {AttachmentId}", attachmentId);
                return StatusCode(500, new { success = false, message = "An error occurred while deleting the attachment." });
            }
        }

        [HttpPost("upload-attachment")]
        public async Task<IActionResult> UploadCorrespondenceAttachments([FromForm] int TicketId, [FromForm] List<IFormFile>? TicketAttachments)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            if (!await _ticketService.UploadCorrespondenceAttachmentsAsync(TicketId, TicketAttachments))
                return BadRequest(new
                {
                    isSuccess = false,
                    message = "Failed to upload correspondence attachment. Please try again."
                });

            return Ok(new
            {
                isSuccess = true,
                message = "Successfully created a new attachment."
            });
        }
        [HttpGet("get-attachments")]
        public async Task<IActionResult> GetCorrespondenceAttachments(int TicketId)
        {
            var ticketAttachments = await _ticketService.GetCorrespondenceAttachmentsAsync(TicketId);
            return Ok(ticketAttachments);
        }
        [HttpGet("get-attachment")]
        public async Task<IActionResult> GetCorrespondenceAttachment(int AttachmentId)
        {
            var ticketAttachment = await _ticketService.GetCorrespondenceAttachmentAsync(AttachmentId);
            return Ok(ticketAttachment);
        }
    }
}