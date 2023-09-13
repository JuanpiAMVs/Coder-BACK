import { Router } from "express";

const router= Router()

router.get('/loggerTest', (req,res)=>{
        req.logger.info('info')
        req.logger.error('error')
        req.logger.debug('debug')
        req.logger.warning('warning')
        req.logger.fatal('fatal')
        req.logger.http("http");

        
    res.send({message:'Loggers'})
})

export default router