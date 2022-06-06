import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private nodemailerTransport: Mail;
  constructor() {
    this.nodemailerTransport = createTransport({
      secure: false,
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendMail(options: Mail.Options) {
    return this.nodemailerTransport.sendMail(options);
  }

  emailTemplate(
    title: string,
    arrayData: {
      productName: string;
      productUsername: string;
      productPassword: string;
    }[],
  ) {
    let tbodyhtml = '';

    arrayData.forEach((item) => {
      tbodyhtml += `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px">
         ${item.productName}
        </td>
        <td style="border: 1px solid #ddd; padding: 8px">
          ${item.productUsername}
        </td>
        <td style="border: 1px solid #ddd; padding: 8px">
        ${item.productPassword}
        </td>
      </tr>
      `;
    });
    return `
      <div style="background-color: #f8f8f8; font-family: sans-serif; padding: 15px">
        <div style="max-width: 1000px; margin: auto">
          <div
            style="
              background-color: #fff;
              padding: 10px 30px;
              color: #fff;
              display: flex;
              border-bottom: 1px solid #d4d4d4;
            "
          >
            <div
              style="
                color: #000;
                font-weight: bold;
                display: inline-block;
                font-size: 18px;
                margin-left: 10px;
                margin-top: 25px;
              "
            >
              VuLeShopBee
            </div>
          </div>
      
          <div
            style="
              background-color: #fff;
              padding: 5px 20px;
              color: #000;
              border-radius: 0px 0px 2px 2px;
            "
          >
            <div style="padding: 35px 15px">
              <p style="margin: 0; font-size: 16px">
                <b>Xin chào ,</b>
              </p>
              <br />
              <p style="margin: 0; font-size: 16px">${title}</p>
      
              <div style="padding: 40px; margin: auto; text-align: center">
                <table style="border-collapse: collapse; width: 100%">
                  <thead>
                    <tr>
                      <th
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          padding-top: 12px;
                          padding-bottom: 12px;
                          text-align: left;
                          background-color: #04aa6d;
                          color: white;
                        "
                      >
                        Product name
                      </th>
                      <th
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          padding-top: 12px;
                          padding-bottom: 12px;
                          text-align: left;
                          background-color: #04aa6d;
                          color: white;
                        "
                      >
                        Product username
                      </th>
                      <th
                        style="
                          border: 1px solid #ddd;
                          padding: 8px;
                          padding-top: 12px;
                          padding-bottom: 12px;
                          text-align: left;
                          background-color: #04aa6d;
                          color: white;
                        "
                      >
                        Product password
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    ${tbodyhtml}
                  </tbody>
                  <tfoot></tfoot>
                </table>
              </div>
      
              <div style="border-top: 1px solid #dcdbdb"></div>
              <br />
              <p style="margin: 0; font-size: 16px">
                Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua nó hoặc nếu
                cần hỗ trợ, liên hệ với chúng tôi.
              </p>
              <br />
              <p style="margin: 0; font-size: 16px">Trân trọng,</p>
              <p style="margin: 0; font-size: 16px">VuLeShopBee Corp</p>
            </div>
          </div>
      
          <div
            style="
              clear: both;
              overflow: hidden;
              margin-top: 15px;
              padding: 40px 30px;
              background-color: #eee;
              border-radius: 2px;
            "
          >
            <div style="float: left; width: 50%">
              <ul style="list-style: none; margin: 0; padding: 0">
                <li>Hotline: 1900 000 000</li>
              </ul>
            </div>
            <div style="float: left; width: 50%; text-align: right">
              <ul style="list-style: none; margin: 0; padding: 0">
                <li style="font-size: 15px">
                  <a href="#m_-5018931478296668331_" style="text-decoration: none">
                    Cần được hỗ trợ ngay?
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
  
    `;
  }
}
