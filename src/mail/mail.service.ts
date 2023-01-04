import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {

    constructor(
        private readonly _mailerService: MailerService
    ) { }

    passwordRecover(email: string, token: string): Promise<any> {
        return new Promise(async (resolve, reject) => {
            try {
                await this._mailerService.sendMail({
                    to: email,
                    from: process.env.MAIL_USER,
                    subject: `Password Recover`,
                    html: `<strong>Recover your password</strong>
                            <a>${process.env.API_URL}/restorePassword/${token}</a>`
                });
                resolve(true);
            } catch (err) {
                console.log(err);
                resolve(false);
            }
        });
    }
}