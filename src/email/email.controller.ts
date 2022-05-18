import { Controller, Post, Query } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('v1/email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('send-mail')
  sendMail(@Query('mail') mail) {
    const message = {
      from: process.env.EMAIL_USER,
      to: mail,
      subject: 'AMP4EMAIL message',
      text: 'For clients with plaintext support only',
      html: this.emailService.emailTemplate(
        'bạn vừa nhận được dữ liệu từ tôi',
        [],
      ),
      amp: `<!doctype html>
      <html ⚡4email>
        <head>
          <meta charset="utf-8">
          <style amp4email-boilerplate>body{visibility:hidden}</style>
          <script async src="https://cdn.ampproject.org/v0.js"></script>
          <script async custom-element="amp-anim" src="https://cdn.ampproject.org/v0/amp-anim-0.1.js"></script>
        </head>
        <body>
          <p>Image: <amp-img src="https://cldup.com/P0b1bUmEet.png" width="16" height="16"/></p>
          <p>GIF (requires "amp-anim" script in header):<br/>
            <amp-anim src="https://cldup.com/D72zpdwI-i.gif" width="500" height="350"/></p>
        </body>
      </html>`,
    };
    return this.emailService.sendMail(message);
  }
}
