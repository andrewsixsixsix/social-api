import { MailOptions } from 'nodemailer/lib/smtp-pool/index.js';

import { transport } from '../../config/nodemailer.config.js';

// TODO: add table verification emails and store results there
export const sendEmail = async (options: MailOptions) => {
  try {
    await transport.sendMail(options);
  } catch (err: unknown) {
    console.log(err);
  }
};
