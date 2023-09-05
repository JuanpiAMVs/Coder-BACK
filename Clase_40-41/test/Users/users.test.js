
import chai from 'chai'
import { response } from "express";
import supertest from 'supertest'


/* mongoose.connect(config.MONGO_URL); */

const expect= chai.expect
const requester = supertest("http://localhost:8080");



describe('Testing de usuarios', function () {
    this.timeout(18000);
    it('Registro de usuario',async function(){
        const user = {
            first_name: "JP",
            last_name: "GN",
            email: "asdkjsahk@gmail",       //cambiar por un correo existente para la restuaracion de contraseña
            password: "123"
        }
        const response= await requester.post('/api/sessions/register').send(user) 
        expect(response.status).to.be.equal(200)
        })

    it('Login de usuario, se espera que retorne el token', async function(){
        const user={
            email: "juenpablogodoyn@gmail.com",
            password:"1234",                                        
            }
        const response= await requester.post('/api/sessions/login').send(user)
        const cookieresult= response.headers['set-cookie'][0]
        const cookie={
                name: cookieresult.split("=")[0],
                value:cookieresult.split("=")[1],
            } 
        expect(cookie.name).to.be.ok.and.eql('authToken')
        expect(cookie.value).to.be.ok   
            })
    it('Restaurar contraseña', async function(){
        const email= 'asdkjsahk@gmail'
        const response= await requester.post('/api/sessions/restoreRequest').send({email}).timeout(3500)
        console.log(response)
        expect(response.status).to.be.equal(200)
        })
    })
