import { Router } from 'express';

const router = Router()

router.get('/', (req, res)=> {
    const comidas = [
        {name:"Hamburguesa"},
        {name:"Pancho"}]
    const user = {
        name: "Lucas"
    }
    res.render('home', {           // se envia el html y los valores a renderizar
        name: user.name,
        comidas: comidas,           // se le asgina el valor de user.name a la variable "name" dentro del home.handlebars
        css:'comidas'               
    })
})

export default router