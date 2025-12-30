import nodemailer from 'nodemailer';
import { IMailProvider } from './IMailProvider';

export class EtherealMailProvider implements IMailProvider{
    constructor (
        from: string,
        to: string,
        subject: string,
        text: string,
        html: string
    ) {}
        

    async sendMail(from: string, to: string, subject: string, text: string, html: string): Promise<any> {
        this.customer.sendMail({
            from: '"DevStore" <noreply@devstore.com>',
            to,
            subject,
            text,
            html
        })
    }
}