import BaseRouter from "./router.js";
import { getUsers, updateUser, deleteUser, getUserBy, createUser } from "../controllers/users.controllers.js";
export default class UserRouter extends BaseRouter{
    init(){
        this.get("/", ["USER"], getUsers);
        this.post("/",["USER"], createUser);
        this.get("/:uId", ["USER"], getUserBy);
        this.put("/:uId", ["USER"], updateUser);
        this.delete("/:uId", ["USER"], deleteUser);
    }
}