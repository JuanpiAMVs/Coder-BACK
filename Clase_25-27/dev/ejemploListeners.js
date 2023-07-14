import {Command} from 'commander'
const program = new Command()
program.option('-n, --numbers [numbers...]', 'numeros')
program.parse();

const numbers = program.opts().numbers

process.on('uncaughtException', error =>   {
    console.log("Ha ocurrido un error")
    console.log(error.stack)
    process.exit(error.code)
})

process.on('exit', code => {
    console.log(code)
})
console.log('inicio del proceso')
console.log(numbers)

if(!numbers){
    /* throw new Error("Sin argumento") */
    const error = new Error('Sin argumentos')
    error.code = -4;
    error.stack = {
        argumentosEnviados: numbers||[]
    }
    throw error;
}

console.log("Parsea los numeros")

const parsedNumbers = numbers.map((candidate) => {
    const possibleNumber = parseInt(candidate);
    if(isNaN(possibleNumber)){
        const error = new Error('Invalid Types')
        error.code = -5;
        const types = numbers.map(candidate => {
            const possibleNumber = parseInt(candidate)
            if(!isNaN(possibleNumber)){
                return "number"
            }else{
                return "string"
            }
        })
        error.stack = {
            description: "Tipos de argumentos invalidos",
            args: numbers,
            tipos: types
        }
        throw error;
    }else{
        return possibleNumber
    }
});

console.log(parsedNumbers)