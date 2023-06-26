import UsersManager from "./usersManager.js";
import CartsManager from "./cartsManager.js";
import MessagesManager from "./messagesManager.js";
import ProductsManager from "./productsManager.js";

export const usersService = new UsersManager()
export const cartsService = new CartsManager()
export const messagesService = new MessagesManager()
export const productService = new ProductsManager()