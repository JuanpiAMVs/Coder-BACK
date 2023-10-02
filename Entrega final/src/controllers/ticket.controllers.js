import { cartsService, ticketServices,  } from "../services/services.js";
import MailingService from "../services/mail.service.js";
import DTemplates from "../constants/DTemplates.js";

export const getTickets = async (req, res) => {
  const tickets = await ticketServices.getTickets();
  return res.sendSuccess(tickets);
};

export const getTicketsById = async (req, res) => {
  try {
    const tickets = await ticketServices.getTicketsById({ _id: cid });
    if (!tickets) return res.status(404).send({ status: "error", error: "ticket not found" });
    return res.sendSuccessWithPayload(tickets)
  } catch (err) {
    console.log(err);
  }
};

export const createTickets = async (req, res) => {
  try {
    const ticket = await ticketServices.createTickets(req.body);
    const updatedCart = await cartsService.updateProductStock(req.body.cart);
    const clear = await cartsService.deleteCartItems(req.body.cart);

    res.send({ status: "success", payload: ticket });
  } catch (error) {
    console.log(error)
    return res.status(404).send({ status: "error", error: "cart not created" });
  }
};

export const deleteTicket = async (req, res) => {
  try {
    const { tid } = req.params;
    const deletedTicket = await ticketServices.deleteTickets(tid);
    res.send({ status: "success", payload: deletedTicket });
  } catch (err) {
    return res.status(404).send({ status: "error", error: "ticket not deleted" })
  }
};
