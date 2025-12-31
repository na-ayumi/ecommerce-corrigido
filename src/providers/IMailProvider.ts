export interface IMailProvider {
    sendMail(from: string,
    to: string,
    subject: string,
    text: string,
    html: string): Promise<any>
}