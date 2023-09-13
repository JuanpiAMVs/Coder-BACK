import chai from 'chai'
import supertest from 'supertest'


const expect= chai.expect
const requester= supertest('http://localhost:8080')

describe('Test de productos', async function(){
        it('Obtiene todos los productos',async function(){
            const {_body}= await requester.get('/api/products')
            expect(_body.message.payload).to.be.an('array')
        })
        it('Obtiene el producto segun su pid',async function(){
            const pid= '6469279128322a3c8479153f'
            const {_body}= await requester.get(`/api/products/${pid}`)
            const result = _body.message.payload
            expect(result).to.have.property("_id");
        })
        it('Subir nuevo producto (el usuario debe ser premium o admin)',async function(){
            const user={
                email: "adminCoder@coder.com",
                password:"adminCod3r123",                                        
                }
            const login= await requester.post('/api/sessions/login').send(user)
            const cookieresult= login.headers['set-cookie'][0]
            const cookie={
                name: cookieresult.split("=")[0],
                value:cookieresult.split("=")[1],
                }                    
            const product= {
                title:"Banpresto Demon Slayer: Kimetsu no Yaiba Figure-Demon Series- vol.7(B:Daki)",
                description:"aksjdsakjh",
                price:1500,
                category:"Female",
                stock:10,
                code:"66666",
                thumbnails:'https://m.media-amazon.com/images/I/61lFLwdDFkL._AC_SL1500_.jpg'            
            }      
            const response= await requester.post('/api/products/addProduct').set('Cookie',[`${cookie.name}=${cookie.value}`]).send(product)     
            expect(response._body.message.data).to.have.property("_id");
        })
})