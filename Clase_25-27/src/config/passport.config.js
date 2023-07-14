import { Strategy, ExtractJwt } from 'passport-jwt';
import local from 'passport-local'
import passport from 'passport';
import GithubStrategy from 'passport-github2'


import { cartsService, usersService } from '../dao/mongo/Managers/index.js';
import { cookieExtractor } from '../utils.js'
import { createHash, validatePassword } from '../services/auth.js';



const LocalStrategy = local.Strategy
const JWTStrategy = Strategy

const initializePassportStrategies = () => {
    //username lo va a tomar del valor email que le llegue
    passport.use('register', new LocalStrategy({passReqToCallback:true, usernameField: 'email'}, async(req, email, password, done) => {
        try{
            const { first_name, last_name, role, age } = req.body
            // Corrobora si existe
            const exists = await usersService.getUserBy({email})
            //done lo que quiere hacer es DEVOLVERTE un usuario en req.user // false = porque ya existe el usuario entonces no le envia nada
            if(exists) return done(null, false, {message: 'User already exists'})
            // SI el usuario no existe, encriptamos su contraseña
            const hashedPassword = await createHash(password)
            // Construimos el usuario a registrar
            const cart = await cartsService.createCart()
            const newUser = {
                first_name, 
                last_name,
                email,
                role,
                age,
                cart: cart._id,
                password: hashedPassword
            }

            const result = await usersService.createUser(newUser)
            console.log(newUser)
            //Si todo salio bien hay que finalizar done.
            done(null, result)
        }catch(err){
            return done(err)
        }

    }) )

    passport.use('login', new LocalStrategy({usernameField: 'email'}, async (email,password,done) => {
        //PASSPORT SOLO DEBE DEVOLVER AL USUARIO FINAL,  EL NO ES RESPONSABLE DE LA SESION
        let resultUser;
        try{
            if(email === "adminCoder@coder.com" && password === "adminCod3r123"){
                resultUser = {
                    id: 0,
                    name: `Admin`,
                    email: "...",
                    role: "admin"
                }
                return done(null, resultUser )
            } 
            if(email === "admin@admin.com" && password === "123"){
                resultUser = {
                    id: 1,
                    name: `Admin`,
                    email: "...",
                    role: "superAdmin"
                }
                return done(null, resultUser )
            } 

                        // buscar el usuario
            const user = await usersService.getUserBy({email})
            if(!user) return done(null, false, {message: "Usuario o contraseña incorrecta"})

            // si existe el usuario VERIFICA SU PASSWORD ENCRIPTADO
            const isValidPassword = await validatePassword(password, user.password)
            if(!isValidPassword) return done(null, false, {message: "Incorrect credentials"})

            //¿El usuario existe y SI PUSO SU CONTRASEÑA CORRECTA? Como estoy en passport, solo devuelvo al usuario 
            resultUser = {
                id: user._id,
                name: `${user.first_name} ${user.last_name}`,
                email: user.email,
                age: user.age,
                role: user.role
            }
            return done(null, resultUser)
            
        }catch(error){
            return done(error)
        }
 
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

    passport.use('jwt' , new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:"jwtSecret"
    }, async(payload,done) => {
        try{
            return done(null, payload)
        }catch(error){
            return done(error)
        }
       
    }))
    
    //Passport se encargará de la verificación del token
    passport.use('current' , new Strategy({
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:"jwtSecret"
    }, async(payload,done) => {
        try{
            return done(null, payload)
        }catch(error){
            return done(error)
        }
       
    }))
}

export default initializePassportStrategies