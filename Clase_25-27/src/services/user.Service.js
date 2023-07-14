export default class UserServices{

    constructor(dao){
        this.dao = dao
    }
    getUsers(){
        return this.dao.getUsers()
    }

    getUserBy(params){
        return this.dao.getUser(params)
    }

    createUser(user){
        return this.dao.createUser(user)
    }

    updateUser(uid,user){
        return this.dao.updateUser(uid,user)
    }

    deleteUser(uid){
        return this.dao.deleteUser(uid)
    }
}