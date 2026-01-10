import dayjs from "dayjs";

export const getVerifyTemplateMail = ({ email, link }) => {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <title>Xác thực tài khoản — MPV ticket</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f8f9fa;
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: #222;
      }

      .wrapper {
        width: 100%;
        padding: 40px 0;
      }

      .container {
        max-width: 580px;
        background: #fff;
        margin: 0 auto;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
      }

      .header {
        text-align: center;
        padding: 36px 24px 16px;
        border-bottom: 1px solid #eee;
      }

      .logo {
        display: inline-block;
        background: blue;
        color: #fff;
        font-weight: 700;
        font-size: 22px;
        border-radius: 10px;
        padding: 12px 18px;
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
      }

      .brand {
        color: blue;
        font-size: 18px;
        margin-top: 10px;
        color: #111;
        font-weight: 700;
      }

      .subtitle {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }

      .content {
        padding: 32px 36px;
        line-height: 1.6;
      }

      .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #111;
      }

      .text {
        font-size: 15px;
        color: #333;
        margin-bottom: 24px;
      }

      .highlight {
        color: blue;
        font-weight: 500;
      }

      .btn {
        display: inline-block;
        background: blue;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        text-decoration: none;
      }

      .note {
        font-size: 13px;
        color: #555;
        margin-top: 24px;
      }

      .note a {
        color: blue;
        word-break: break-all;
      }

      .footer {
        text-align: center;
        padding: 20px 32px;
        background: #fafafa;
        border-top: 1px solid #eee;
        color: #555;
        font-size: 13px;
      }

      .footer a {
        color: blue;
        text-decoration: none;
      }

      @media (max-width: 480px) {
        .content {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="brand">MPV ticket</div>
          <div class="subtitle">Nền tảng đặt vé xem phim nổi tiếng</div>
        </div>

        <div class="content">
          <p class="title">Xác thực địa chỉ email của bạn</p>
          <p class="text">
            Xin chào <strong>${email}</strong>, cảm ơn bạn đã đăng ký tài khoản tại
            <span class="highlight">MPV ticket</span>. Nhấn nút bên dưới để xác thực email
            và hoàn tất quá trình đăng ký.
          </p>

          <a href="${link}" class="btn" target="_blank" rel="noopener noreferrer">
            Xác thực tài khoản
          </a>

          <p class="note">
            Liên kết xác thực có hiệu lực trong <span class="highlight">24 giờ</span>.
            Nếu bạn không đăng ký MPV ticket, vui lòng bỏ qua email này.
          </p>
        </div>

        <div class="footer">
          MPV ticket — Kết nối nhanh, tiện ích hơn
        </div>
      </div>
    </div>
  </body>
</html>`;
};

export const getResetPasswordTemplateMail = ({ email, password }) => {
  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <title>Mật khẩu mới của bạn — MPV</title>
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <style>
      body {
        margin: 0;
        padding: 0;
        background: #f8f9fa;
        font-family: "Helvetica Neue", Arial, sans-serif;
        color: #222;
      }

      .wrapper {
        width: 100%;
        padding: 40px 0;
      }

      .container {
        max-width: 580px;
        background: #fff;
        margin: 0 auto;
        border-radius: 16px;
        overflow: hidden;
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.05);
      }

      .header {
        text-align: center;
        padding: 36px 24px 16px;
        border-bottom: 1px solid #eee;
      }

      .logo {
        display: inline-block;
        background: blue;
        color: #fff;
        font-weight: 700;
        font-size: 22px;
        border-radius: 10px;
        padding: 12px 18px;
        box-shadow: 0 4px 10px rgba(239, 68, 68, 0.2);
      }

      .brand {
        color: blue;
        font-size: 18px;
        margin-top: 10px;
        color: #111;
        font-weight: 700;
      }

      .subtitle {
        font-size: 14px;
        color: #666;
        margin-top: 4px;
      }

      .content {
        padding: 32px 36px;
        line-height: 1.6;
      }

      .title {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #111;
      }

      .text {
        font-size: 15px;
        color: #333;
        margin-bottom: 24px;
      }

      .highlight {
        color: blue;
        font-weight: 500;
      }

      .btn {
        display: inline-block;
        background: blue;
        color: #fff;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
        text-decoration: none;
      }

      .note {
        font-size: 13px;
        color: #555;
        margin-top: 24px;
      }

      .note a {
        color: blue;
        word-break: break-all;
      }

      .footer {
        text-align: center;
        padding: 20px 32px;
        background: #fafafa;
        border-top: 1px solid #eee;
        color: #555;
        font-size: 13px;
      }

      .footer a {
        color: blue;
        text-decoration: none;
      }

      @media (max-width: 480px) {
        .content {
          padding: 24px;
        }
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="container">
        <div class="header">
          <div class="brand">MPV</div>
          <div class="subtitle">Nền tảng đặt vé xem phim nổi tiếng</div>
        </div>

        <div class="content">
          <p class="title">Yêu cầu đặt lại mật khẩu</p>
          <p class="text">
            Xin chào <strong>${email}</strong>, chúng tôi đã đặt lại mật khẩu mới của bạn
          </p>

          <button class="btn">
            ${password}
          </button>

          <p class="note">
           Không chia sẻ mật khẩu cho bất kỳ ai để tránh rò rỉ thông tin. Chúng tôi sẽ không chịu trách nghiệm
          </p>
        </div>

        <div class="footer">
          MPV — Kết nối nhanh, tiện ích hơn
        </div>
      </div>
    </div>
  </body>
</html>`;
};

export const getSendTicketTemplateMail = ({ ticket }) => {
  const {
    ticketId,
    movieName,
    roomName,
    startTime,
    items,
    seats: seatsFromOrder,
    totalAmount,
    customerInfo,
  } = ticket;
  const normalizedItems = items ?? seatsFromOrder ?? [];
  const seats = normalizedItems
    .map((item) => item?.seatLabel ?? item?.label ?? "")
    .filter(Boolean)
    .join(", ");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5; padding:30px 0; font-family:Arial, sans-serif;">
    <tr>
      <td align="center">
        <table width="550" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:10px; overflow:hidden;">

          <!-- Header -->
          <tr>
            <td align="center" bgcolor="blue" style="padding:20px; color:white;">
              <h2 style="margin:0; font-size:24px; font-weight:bold;">Vé xem phim điện tử 🎟</h2>
              <p style="margin:5px 0 0; font-size:14px; opacity:.9;">Cảm ơn bạn đã đặt vé tại MPVCinema</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px;">

              <!-- Ticket Info -->
              <h3 style="margin:0 0 10px 0; font-size:18px; color:#333;">Thông tin vé</h3>

              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td width="150" style="font-weight:bold;">Mã vé:</td>
                  <td>${ticketId}</td>
                </tr>
                <tr>
                  <td width="150" style="font-weight:bold;">Tên khách:</td>
                  <td>${customerInfo?.userName}</td>
                </tr>
                <tr>
                  <td width="150" style="font-weight:bold;">Số điện thoại:</td>
                  <td>${customerInfo?.phone}</td>
                </tr>
                 <tr>
                  <td width="150" style="font-weight:bold;">Email:</td>
                  <td>${customerInfo?.email}</td>
                </tr>
              </table>

              <!-- Showtime Info -->
              <h3 style="margin:25px 0 10px; font-size:18px; color:#333;">Thông tin suất chiếu</h3>

              <table width="100%" cellpadding="6" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td width="150" style="font-weight:bold;">Phim:</td>
                  <td>${movieName}</td>
                </tr>
                <tr>
                  <td width="150" style="font-weight:bold;">Phòng chiếu:</td>
                  <td>${roomName}</td>
                </tr>
                <tr>
                  <td width="150" style="font-weight:bold;">Thời gian:</td>
                  <td>${dayjs(startTime).format("HH:mm [, Ngày] DD [Tháng] MM [Năm] YYYY")}</td>
                </tr>
                <tr>
                  <td width="150" style="font-weight:bold;">Ghế:</td>
                  <td>${seats}</td>
                </tr>
              </table>

              <!-- Payment Info -->
              <h3 style="margin:25px 0 10px; font-size:18px; color:#333;">Thanh toán</h3>

              <table width="100%" cellpadding="6" cellspacing="0">
                <tr>
                  <td width="150" style="font-weight:bold;">Tổng tiền:</td>
                  <td style="font-size:18px; font-weight:bold; color:blue;">
                    ${totalAmount.toLocaleString()}đ
                  </td>
                </tr>
              </table>

              <!-- QR Code -->
          <!-- QR Code -->
            <div style="text-align:center; margin:30px 0 10px;">
              <p style="margin-bottom:12px; font-weight:bold; font-size:14px;">
                Vui lòng đưa mã QR để check-in tại rạp
              </p>
              <img src="cid:qr_ticket" width="200" height="200" style="border-radius:6px;" alt="QR Code"/>
            </div>


            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#fafafa" style="padding:16px; font-size:13px; color:#777; border-top:1px solid #eee;">
              © ${new Date().getFullYear()} MPVCinema — Chúc bạn xem phim vui vẻ 🎬
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>`;
};
