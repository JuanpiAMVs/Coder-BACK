import ticketModel from "../models/ticket.model.js";
import { v4 as uuidv4 } from "uuid";

export default class TicketManager {
  getTickets = async () => {
    return ticketModel.find().lean();
  };
  getTicketsById = async (tid) => {
    return ticketModel.findById(tid);
  };
  createTickets = async (ticket) => {
    ticket.code = uuidv4();
    return ticketModel.create(ticket);
  };
  deleteTickets = async (tid) => {
    try {
      const deletedTicket = await ticketModel.findByIdAndDelete(tid);
      return deletedTicket;
    } catch (error) {
      throw new Error("Error al borrar ticket");
    }
  };
}