import mongoose from "mongoose";
import chai from 'chai'
import {response} from 'express'
import supertest from 'supertest'
import config from '../../src/config/config.js'
import Assert from 'assert'

import { userServices } from "../../src/services/services.js";

/* mongoose.connect(config.MONGO_URL); */

const assert = Assert.strict;

describe('Testing de usuarios', () => {

    before( function(){ // SE EJECUTA ANTES DE TODAS LAS PRUEBAS
        this.userDAO = userServices
    })
    it('Registro de usuario',async function(){
        const user = {
            first_name: "JP",
            last_name: "GN",
            email: "asdkjsahk@gmail",
            password: "123"
        }
        const {status}= await requester.post('/api/session/register').send(user) 
        expect(status).to.be.equal(200)
        })

    it('Login de usuario, se espera que retorne el token', async function(){
            const user={
                email: "asdkjsahk@gmail",
                password:"123",                                        
                }
            const response= await requester.post('/api/session/login').send(user)
            const cookieresult= response.headers['set-cookie'][0]
            const cookie={
                    name: cookieresult.split("=")[0],
                    value:cookieresult.split("=")[1],
                } 
            expect(cookie.name).to.be.ok.and.eql('authToken')
            expect(cookie.value).to.be.ok   
            })
    })