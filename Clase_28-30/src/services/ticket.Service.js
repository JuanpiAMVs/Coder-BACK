export default class TicketService {
    constructor(dao) {
      this.dao = dao;
    }
    getTickets = () => {
      return this.dao.getTickets();
    };
    getTicketsById = (tid) => {
      return this.dao.getTicketsById();
    };
    createTickets = (ticket) => {
      return this.dao.createTickets(ticket);
    };
    deleteTickets = () => {
      return this.dao.deleteTickets();
    };
  }