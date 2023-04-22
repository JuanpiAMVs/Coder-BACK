import multer from 'multer'
import __dirname from '../utils.js'

//Donde voy a almacenar TODO

const storage = multer.diskStorage({
    //carpeta
    destination: function(req, file, cb){
        cb(null, `${__dirname}/public/img`)
    },
    filename: function(req, file, cb){
        //para evitar que se repitan los nombres de las imagenes cargadas
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})

const uploader = multer({storage})

export default uploader;