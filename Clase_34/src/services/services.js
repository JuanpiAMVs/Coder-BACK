//Importar el DAO a usar
import CartsManager from "../dao/mongo/Managers/cartsManager.js";
//Importar el servicio para colocar dentro el DAO
import CartsService from "./cart.Services.js";

export const cartsService = new CartsService(new CartsManager)

import ProductsManager from "../dao/mongo/Managers/productsManager.js";
import ProductsServices from "./products.Service.js";

export const productsService = new ProductsServices(new ProductsManager)

import UsersManager from "../dao/mongo/Managers/usersManager.js";
import UserServices from "./user.Service.js";


export const userServices = new UserServices(new UsersManager)

import TicketManager from "../dao/mongo/Managers/ticketsManager.js";
import TicketService from "./ticket.Service.js";

export const ticketServices = new TicketService(new TicketManager)