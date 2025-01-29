import { transporter } from "../config/nodemailer"

interface IEmail {
    email: string,
    name: string,
    token: string
}

export class AuthEmail {
    
    static sendConfirmationEmail = async (user: IEmail) => {
        await transporter.sendMail({
            from: 'handleTask <admin@handleTask.com>',
            to: user.email,
            subject: 'handleTask - Confirm your account',
            text: `Hello ${user.name}, confirm your account using the following link: https://example.com/confirm?token=${user.token}. This link will expire in 10 minutes.`,
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f9f9f9;
                            margin: 0;
                            padding: 0;
                        }
                        .email-container {
                            max-width: 600px;
                            margin: 20px auto;
                            background: #ffffff;
                            border: 1px solid #dddddd;
                            border-radius: 8px;
                            padding: 20px;
                            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            background-color: #007bff;
                            color: #ffffff;
                            padding: 10px;
                            border-radius: 8px 8px 0 0;
                        }
                        .header h1 {
                            margin: 0;
                            font-size: 24px;
                        }
                        .content {
                            padding: 20px;
                            text-align: left;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #333333;
                        }
                        .button-container {
                            text-align: center;
                            margin: 40px 0;
                        }
                        .button {
                            background-color: #007bff;
                            color: #ffffff;
                            text-decoration: none;
                            padding: 10px 20px;
                            border-radius: 4px;
                            font-size: 16px;
                        }
                        .footer {
                            text-align: center;
                            font-size: 12px;
                            color: #888888;
                            margin-top: 20px;
                        }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        <div class="header">
                            <h1>Welcome to handleTask!</h1>
                        </div>
                        <div class="content">
                            <p>Hello ${user.name}</p>
                            <p>Thank you for creating an account with <strong>handleTask</strong>. Please confirm your email address to get started</p>
                            <div class="button-container">
                                <a href="${process.env.FRONTEND_URL}/auth/confirm-account" class="button">Confirm My Account</a>
                            </div>
                            <p>Token: <code>${user.token}</code></p>
                            <p><strong>Important</strong> this link will expire in <strong>10 minutes</strong>.</p>
                        </div>
                        <div class="footer">
                            <p>&copy; ${new Date().getFullYear()} handleTask. All rights reserved.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        });
    }
}
