import nodemailer from "nodemailer";
import {
  EMAIL_PASSWORD,
  EMAIL_USER,
} from "../../common/configs/environment.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: false,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASSWORD,
  },
});

export const sendMail = async (
  toEmail,
  subject,
  template,
  attachments = [],
) => {
  const info = await transporter.sendMail({
    from: "MPV ticket <no-reply@goticket.com>",
    to: toEmail,
    subject,
    html: template,
    attachments,
    replyTo: undefined,
  });

  console.log("Email sent: ", info.messageId);
};
