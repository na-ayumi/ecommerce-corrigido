import nodemailer from 'nodemailer';
import { IMailProvider } from './IMailProvider';

export class EtherealMailProvider implements IMailProvider{
    constructor(private customer: any){
        this.customer = customer;
    }
    

    public sendMail(from: string, to: string, subject: string, text: string, html: string): Promise<any> {
        return this.customer.sendMail({
            from,
            to,
            subject,
            text,
            html
        });
    }
}