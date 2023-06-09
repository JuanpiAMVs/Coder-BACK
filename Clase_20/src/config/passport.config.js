import passport from 'passport';
import local from 'passport-local'
import GithubStrategy from 'passport-github2'

import userModel from '../dao/mongo/models/user.model.js'
import { createHash, validatePassword } from '../utils.js'


const LocalStrategy = local.Strategy

const initializePassportStrategies = () => {
    //username lo va a tomar del valor email que le llegue
    passport.use('register', new LocalStrategy({passReqToCall:true, usernameField: 'email'}, async(req, email, password, done) => {
        try{
            const { first_name, last_name } = req.body
            // Corrobora si existe
            const exists = await userModel.findOne({email})
            //done lo que quiere hacer es DEVOLVERTE un usuario en req.user // false = porque ya existe el usuario entonces no le envia nada
            if(exists) return done(null, false, {message: 'El usuario ya existe'})
            // SI el usuario no existe, encriptamos su contraseña
            const hashedPassword = await createHash(password)
            // Construimos el usuario a registrar
            const user = {
                first_name, 
                last_name,
                email,
                password: hashedPassword
            }
            const result = await userModel.create(user)
            //Si todo salio bien hay que finalizar done.
            done(null, result)
        }catch(err){
            return done(err)
        }

    }) )

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (email,password, done) => {
        //PASSPORT SOLO DEBE DEVOLVER AL USUARIO FINAL,  EL NO ES RESPONSABLE DE LA SESION
        if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
            const user = {
                id: 0,
                name: `Admin`,
                email: "...",
                role: "admin"
            }
            return done(null, user )
        } 
     // buscar el usuario
    let user = await userModel.findOne({email});
    if(!user) return done(null, false, {message: "Usuario o contraseña incorrecta"})

    // si existe el usuario VERIFICA SU PASSWORD ENCRIPTADO
    const isValidPassword = await validatePassword(password, user.password)
    if(!isValidPassword) return done(null, false, {message: "Contraseña invalida"})

    //¿El usuario existe y SI PUSO SU CONTRASEÑA CORRECTA? Como estoy en passport, solo devuelvo al usuario

        user = {
            id: user._id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            role: user.role
        }
        return done(null, user)
 
    }))

    passport.use('github', new GithubStrategy({
        clientID: "Iv1.1e0bc2bcc881cb87",
        clientSecret: "a2c05d12c396fb2b87a05a5c711dcc1eaae1b316",
        callbackURL:"http://localhost:8080/api/sessions/githubcallback"
    }, async(accessToken, refreshToken, profile, done) => {
        try{
            console.log(profile)
            //Tomo los datos que me sirvan.
            const {name, email } = profile._json
            const user = await userModel.findOne({email})
            if(!user){
                //NO EXISTE? lo creo entonces.
                const newUser = {
                    first_name: name,
                    email,
                    password:""
                }
                const result = await userModel.create(newUser)
                done(null, result)
            }

            //Si el usuario ya existia.
            done(null, user)
        }catch(err){
            done(err)
        }
    }))

    passport.serializeUser(function(user,done){
        return done(null, user.id)
    })
    passport.deserializeUser(async function(id, done){
        if(id===0){
            return done(null,{
                role: "admin",
                name: "ADMIN"
            } )
        }
        const user = await userModel.findOne({_id: id})
        return done(null, user)
    })
}

export default initializePassportStrategies