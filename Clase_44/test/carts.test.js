import chai from 'chai'
import supertest from 'supertest'


const expect= chai.expect
const requester= supertest('http://localhost:8080')


describe('Test de carritos', async function(){
    this.timeout(8000)
    it('Obtiene todos los carritos',async function(){
        const {_body}= await requester.get('/api/carts')
        expect(_body.payload).to.be.an('array')
    })

    it('Obtiene el carrito segun su cid',async function(){
        const cid= '64a8956a7aa388062cbb4868'
        const {_body}= await requester.get(`/api/carts/${cid}`)
        const result = _body.payload
        expect(result).to.have.property("_id");
    })

    it('Borra todos los productos del carrito segun su cid',async function(){
        const cid= '64deb10fc1d2c7fffceaae0a'
        const result= await requester.delete(`/api/carts/${cid}`)
        expect(result.status).to.be.equal(200)
    })

})