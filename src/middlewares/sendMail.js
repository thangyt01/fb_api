const nodemailer = require('nodemailer')
const { google } = require('googleapis')
const _ = require('lodash')
const Logger = require('../libs/logger')
const logger = new Logger(__dirname)

const config = require('config')
const sender = _.get(config, 'mail', null)

const CLIENT_ID = _.get(sender, 'client_id', '')
const CLIENT_SECRET = _.get(sender, 'client_secret', '')
const REDIRECT_URI = _.get(sender, 'redirect_uri', '')
const REFRESH_TOKEN = _.get(sender, 'refresh_token', '')

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN })

export async function sendMail(to, subject, html, from = sender.user) {
    try {
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: html
        }

        const accessToken = await oAuth2Client.getAccessToken()

        let transporter = nodemailer.createTransport({
            service: _.get(sender, 'service', ''),
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: _.get(sender, 'user', ''),
                pass: _.get(sender, 'password', ''),
                type: 'OAuth2',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                logger.error("[sendMail] error", error)
            } else {
                logger.info('Email sent: ' + info.response)
            }
        })
        return true
    } catch (error) {
        logger.error("[sendMail] error", error)
        return false
    }

}
