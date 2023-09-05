import BaseRouter from "./router.js";
import { getUsers, updateUser, deleteUser, getUserBy, createUser, changeRole } from "../controllers/users.controllers.js";
export default class UserRouter extends BaseRouter{
    init(){
        this.get("/", ["PUBLIC"], getUsers);
        this.post("/",["USER"], createUser);
        this.get("/:uId", ["USER"], getUserBy);
        this.put("/:uId", ["USER"], updateUser);
        this.delete("/:uId", ["USER"], deleteUser);
        this.put('/premium/:uId', ["ADMIN"], changeRole)
    }
}