import bcrypt from 'bcrypt'
import passport from 'passport';
import jwt from 'jsonwebtoken';

export const createHash = async (password) =>{
    const salts = await bcrypt.genSalt(10);
    return bcrypt.hash(password,salts);
}

export const validatePassword = (password,hashedPassword) => bcrypt.compare(password,hashedPassword);

export const passportCall = (strategy,options={}) =>{
    return async(req,res,next) =>{
        passport.authenticate(strategy,(error,user,info)=>{
            if(error) return next(error);
             // Verificar si se ha definido options.strategyType
            if(!options.strategyType){
                console.log(`Route ${req.url} doesn't have defined a strategyType`);
                return res.sendServerError();
            }

            if(!user) {
                //¿Qué significa el que no haya encontrado user en cada caso?
                switch(options.strategyType) {
                    case 'jwt':
                        req.error = info.message?info.message:info.toString;
                        return next();
                    case 'locals':
                        return res.sendUnauthorized(info.message?info.message:info.toString())
                }
            }

            req.user = user;
            next();
        })(req,res,next);
    }
}

export const generateToken = (user, expiresIn = "1d")=>{
    const token= jwt.sign(user,'jwtSecret', {expiresIn})
    return token
}



export const authAddCart = (req, res, next) => {
    const token = req.cookies["authToken"];
    console.log(token);
    if (!token) {
      return res.status(401).send({ status: "Registrate para continuar" });
    }
    const user = jwt.verify(token,'jwtSecret');
    req.user = user;
    next();
  };