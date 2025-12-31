import nodemailer from 'nodemailer';
import logger from '../lib/logger';
import { IMailProvider } from '../providers/IMailProvider';

export class NotificationService {
    constructor(
        private mailProvider: IMailProvider
    ){}

    async messageEmail(customerEmail: string,
    orderId: number,
    totalAmount: number,
    productsDetails: any []): Promise <any | false>{
        const from = '"DevStore" <noreply@devstore.com>';
        const subject = `Confirmação do Pedido #${orderId}`;
        const text = `Olá, seu pedido #${orderId} no valor de R$ ${totalAmount} foi confirmado.`;
        const html= `
          <h1>Pedido Confirmado!</h1>
          <p>Olá, seu pedido <b>#${orderId}</b> foi processado com sucesso.</p>
          <p>Total: <strong>R$ ${totalAmount}</strong></p>
          <ul>
            ${productsDetails.map(p => `<li>${p.name}</li>`).join('')}
          </ul>
        `;

        const info = await this.mailProvider.sendMail(
            from,
            customerEmail,
            subject,
            text,
            html
        )

        const emailPreview = nodemailer.getTestMessageUrl(info)
        logger.info(`Email enviado: ${emailPreview}`); 

        return emailPreview;
    }
}