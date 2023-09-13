import {fileURLToPath} from 'url';
import { dirname } from 'path';


export const cookieExtractor = (req) => {
    let token = null; // Aqui va a venir el token.. Si lo encuentra
    if(req && req.cookies){
        token = req.cookies['authToken']
    }
    return token
}


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

import fs from 'fs'
import Handlebars from 'handlebars'

export const generateMailTemplate= async (template, payload)=>{
    //lee el archivo y lo devuelve como string
    const content= await fs.promises.readFile(`${__dirname}/templates/${template}.handlebars`, 'utf-8')
    const preCompiled= Handlebars.compile(content)
    const compiledContent= preCompiled({...payload})
    return compiledContent
}