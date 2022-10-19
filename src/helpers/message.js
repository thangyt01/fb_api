/**
 *
 * @param {*} type
 * @param {*} OTP
 * @param {*} lastName
 * @param {*} email
 * @returns
 */
export function contentMail(type, OTP, lastName, email) {
    switch (+type) {
        case 0:
            return {
                subject: '[BKs] Confirm your account on Bks',
                content: `
                    <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                        <hr>
                        <h2 style="font-size: 50px">Hi, ${lastName}!</h2>
                        <h4 style="font-size: 40px">Kích hoạt tài khoản ✔</h4>
                        <p style="margin-bottom: 30px; font-size: 30px">Cảm ơn bạn đã đăng ký sử dụng app của chúng tôi!</p>
                        <p style="margin-bottom: 30px; font-size: 30px">Đây là mã xác nhận của bạn</p>
                        <p style="font-size: 40px; letter-spacing: 2px; text-align:center">
                            <span>${OTP}</span>
                        </p>
                        <p
                            style="margin-bottom: 30px; font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:12px;color:#aaaaaa;line-height:16px">
                            Tin nhắn này được gửi tới
                            <a href="mailto:${email}" style="color:#3b5998;text-decoration:none">${email}</a>.
                            <br>
                            Bks, Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội.
                        </p>
                        <hr>
                    </div>
                `
            }
        case 1:
            return {
                subject: '[BKs] Reset your Bks password',
                content: `
                    <div class="container" style="max-width: 90%; margin: auto; padding-top: 20px">
                        <hr>
                        <h2 style="font-size: 50px">Hi, ${lastName}!</h2>
                        <h4 style="font-size: 40px">Yêu cầu lấy lại mật khẩu của bạn ✔</h4>
                        <p style="margin-bottom: 30px; font-size: 30px">Đây là mã xác nhận của bạn</p>
                        <p style="font-size: 40px; letter-spacing: 2px; text-align:center">
                            <span>${OTP}</span>
                        </p>
                        <p
                            style="margin-bottom: 30px; font-family:Helvetica Neue,Helvetica,Lucida Grande,tahoma,verdana,arial,sans-serif;font-size:12px;color:#aaaaaa;line-height:16px">
                            Tin nhắn này được gửi tới
                            <a href="mailto:${email}" style="color:#3b5998;text-decoration:none">${email}</a>.
                            <br>
                            Bks, Địa chỉ: Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội.
                        </p>
                        <hr>
                    </div>
                `
            }
    }
}