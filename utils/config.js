const SECRET_KEY = '@&Me^*@Real!~'

const USER_EMAIL = 'thagnguyen111@gmail.com'
const PASS_EMAIL = 'ducthang97'
const BASE_URL = 'http://localhost:3000'
const NO_IMAGE = 'http://localhost:3000/uploads/noimg.png'
const form_email = (title_email, body_email, title_button, button, title_link, active_code, link_active) => {
    str = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
        <head>
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
            <title>XeMinh.com</title>
            <meta name="viewport" content="width=device-width, initial-scale=1.0"/>

            <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,600,700" rel="stylesheet">
        </head>

        <body style="background-color: #323232; padding: 0; margin: 0; font-family: 'Open Sans', sans-serif; font-size: 14px; color: #333333">
            <table style="width: 597px; margin: 20px auto 20px auto; border-collapse: collapse;">
                <tbody>
                    <!-- Empty block -->
                    <tr>
                        <td style="height: 100px;"></td>
                    </tr>
                    <!-- Empty block -->

                    <!-- Body -->
                    <tr>
                        <td style="background-color: #fff; padding: 0 30px;">
                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                <tbody>
                                    <tr>
                                        <td style="padding: 22px 0; border-bottom: 1px solid rgba(22, 28, 48, 0.2)">
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td width="60%">
                                                        <h1 style="font-size: 18px; font-weight: 600; margin: 0; color: #161c30">${title_email}</h1>
                                                    </td>
                                                </tr>
                                            </table>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td style="padding: 25px 0 30px;">
                                            ${body_email}
                                            <br>
                                            <br>
                                            
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="border: 1px solid rgba(213, 211, 211, 0.5); background-color: #fbfbfb; padding: 35px; text-align: center">
                                                <tbody>
                                                    <tr>
                                                        <td width="100%">
                                                            <h2 style="font-size: 18px; font-weight: 700;  margin-bottom: 8px; margin-top: 0;">${title_button}</h2>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td style="font-weight: 600; font-size: 25px; letter-spacing: 5px">
                                                            ${active_code}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <a href="${link_active}" style="display: inline-block;
                                                            height: 50px;
                                                            line-height: 50px;
                                                            font-size: 16px;
                                                            font-weight: 600;
                                                            background-color: #009ef8;
                                                            color: #fff;
                                                            -webkit-border-radius: 25px;
                                                            border-radius: 25px;
                                                            padding: 0 27px;
                                                            white-space: nowrap; text-decoration: none; margin-top: 18px">${button}</a>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <h3 style="font-size: 18px; font-weight: 700; margin-top: 30px; margin-bottom: 15px;">${title_link}</h3>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <span style="display: inline-block; padding: 7px 25px; background-color: #f4f3f3; border-radius: 17.5px; cursor: pointer; min-width: 310px">
                                                                <span style="text-align: left;word-break: break-all; display: inline-block; max-width: 90%" id="link-ref">${link_active}</span>
                                                            </span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>

                                            <br>
                                            <br>
                                            XeMinh Team
                                            <br>
                                            Automated message. Please do not reply
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <!-- End Body -->

                    <!-- Empty block -->
                    <tr>
                        <td style="height: 100px;"></td>
                    </tr>
                    <!-- Empty block -->
                </tbody>

            </table>
        </body>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"></script>
        <script>
            new ClipboardJS('#img-copy-btn');
        </script>
        <script>
        </script>
    </html>
    `

    return str
}

module.exports = {
    SECRET_KEY,
    form_email,
    USER_EMAIL,
    PASS_EMAIL,
    BASE_URL,
    NO_IMAGE
}