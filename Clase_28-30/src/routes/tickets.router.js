import BaseRouter from "./router.js";
import {getTickets, getTicketsById, createTickets, deleteTicket} from '../controllers/ticket.controllers.js'

export default class TicketRouter extends BaseRouter{
    init(){
        this.get("/", ["PUBLIC"], getTickets)
        this.get("/:tid", ["PUBLIC"], getTicketsById);
        this.delete("/:tid", ["PUBLIC"], deleteTicket);
        this.post("/", ["PUBLIC"], createTickets);
    }
}

