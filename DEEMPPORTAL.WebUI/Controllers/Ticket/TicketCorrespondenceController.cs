using DEEMPPORTAL.Application.Ticket;
using DEEMPPORTAL.Domain.Ticket;
using DEEMPPORTAL.Infrastructure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DEEMPPORTAL.WebUI.Controllers.Ticket
{
    [Authorize]
    [Route("MyTickets/ticket-correspondence")]
    public class TicketCorrespondenceController(
        ITicketRepository correspondenceRepository) : Controller
    {
        private readonly ITicketRepository
            _correspondenceRepository =
                correspondenceRepository;


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
        public async Task<IActionResult> Insert(
            [FromBody] TicketCorrespondenceRequest model)
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

        [HttpDelete("{correspondenceId:int}")]
        public async Task<IActionResult> Delete(
            int correspondenceId,
            [FromBody]
            DeleteTicketCorrespondenceRequest model)
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


                var deleted =
                    await _correspondenceRepository
                        .DeleteAsync(model);


                if (!deleted)
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
                        "Correspondence deleted successfully."
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
                            "An error occurred while deleting the correspondence.",
                        error = ex.Message
                    }
                );
            }
        }
    }
}