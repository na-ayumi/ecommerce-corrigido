export interface IMailProvider {
    from: string,
    to: string,
    subject: string,
    text: string,
    html: string
}