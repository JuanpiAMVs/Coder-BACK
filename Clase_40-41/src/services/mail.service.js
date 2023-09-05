import nodemailer from 'nodemailer'
import config from "../config/config.js";
import DMailInfo from '../constants/DMailInfo.js'
import {generateMailTemplate} from '../utils.js'


export default class MailingService{
    constructor(){
        this.mailer = nodemailer.createTransport({
            service:'gmail',
            port:587,
            auth:{
                user: config.MAILER_EMAIL,
                pass: config.MAILER_PASSWORD
            }
        })
    }

    sendMail = async(emails,template,payload) => {
        const mailInfo = DMailInfo[template];
        const html = await generateMailTemplate(template,payload);
        const result = await this.mailer.sendMail({
            from: 'Juanpi <juenpablogodoyn@gmail.com>',
            to: emails,
            html,
            ...mailInfo
        })
        return result;
    }
}