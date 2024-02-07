const nodemailer = require('nodemailer');

const transportador = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const sendMail = async (to, nomeCliente) => {
    const transportador = nodemailer.createTransport({
        host: 'sandbox.smtp.mailtrap.io',
        port: 2525,
        auth: {
            user: '232ceae27a1979',
            pass: 'eeb0161cd1f858'
        }
    });

    const Email = {
        from: 'seu-email@exemplo.com', 
        to: to, 
        subject: 'Pedido Realizado', 
        text: `Olá ${nomeCliente},seu pedido foi realizado com sucesso!` 
    };

    transportador.sendMail(Email, (erro, info) => {
        if (erro) {
            console.error('Erro ao enviar e-mail:', erro);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
};

module.exports = sendMail;