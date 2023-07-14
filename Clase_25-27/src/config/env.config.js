import dotenv from 'dotenv'
import { Command } from 'commander'

const program = new Command()
program.option('--mode <mode>', 'Modo de ejecucion','production')
program.parse()
//"dotenv.config()" solo lee .env
dotenv.config({
    path: program.opts().mode==="dev"?'./.env.dev':'./.env.prod'
});

export default {
    app:{
        PORT: process.env.PORT||8080
    },
    mongo:{
        URL: process.env.MONGO_URL||'localhost:27017'
    }
}