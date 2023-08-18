import LoggerServices from '../services/logger.services.js'
import config from '../config/config.js'

const logger=new LoggerServices(config.MODE)

const attachLogger=(req,res,next)=>{
 req.logger=logger.logger
 
    //para ver las peticiones ▼
    req.logger.http(`Peticion http: ${req.method} , ${req.url} , ${new Date().toLocaleTimeString()}`)
    next()
}
export default attachLogger