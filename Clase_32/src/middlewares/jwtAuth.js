import jwt from 'jsonwebtoken'

export const authToken = (req, res,next) => {
    // Se toma de los headers por ahora.

    const authHeader = req.header.authorization
    if(!authHeader) res.status(401).send({status: "error", error: "Not authenticated"})
    const token = authHeader.split(" ")[1];
    // Si existe el token, es valido?
    jwt.verify(token, "jwtSecret", (error, credentials) => {
        if(error) return res.status(401).send({error: "Token inválido"})
        req.user = credentials.user;
        next()
    })
    
}