import "dotenv/config";
import nodemailer from "nodemailer";

const {UKR_NET_KEY, UKR_NET_FROM} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465,
    secure: true,
    auth: {
        user: UKR_NET_FROM,
        pass: UKR_NET_KEY,
    }
};

const tranport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: UKR_NET_FROM};
    return tranport.sendMail(email);
}

export default sendEmail;