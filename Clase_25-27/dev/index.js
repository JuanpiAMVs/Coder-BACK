import {Command} from 'commander'

const program = new Command()
program
.option('-d', 'Variable para debuggear', false) // argumento, descripcion, lo que hace si no viene el argumento
.option('-p <port>', 'Puerto del servidor', 8080)
.option('--mode <mode>', 'Modo de trabajo', 'production')
.requiredOption('-u <user>','Usuario que llamo al script')
.option('-l, --letters [letters...]','letras')

program.parse()

console.log('Options:', program.opts())