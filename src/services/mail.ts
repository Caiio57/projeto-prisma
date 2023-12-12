import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'caioriquelme47@gmail.com',
    pass: 'fnjn rtnb jfgh qqrg'
  },
  tls: {
    rejectUnauthorized: false
  }
});

export async function enviarEmailConfirmacao(destinatario: string): Promise<void> {
  const mailOptions = {
    from: 'caioriquelme47@gmail.com',
    to: destinatario,
    subject: 'Confirmação de Conta',
    text: `massa`, // Substitua pela URL de confirmação real
  };

  await transporter.sendMail(mailOptions);
}
