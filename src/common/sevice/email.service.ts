import { MailOptions } from 'nodemailer/lib/smtp-pool/index.js';

import { transport } from '../../config/nodemailer.config.js';

export const sendEmail = async (options: MailOptions) => await transport.sendMail(options);
