import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  const body = await request.json();

  const message = {
    from: `The Cake Co. <${process.env.EMAIL_FROM}>`,
    to: body.email, // usually your admin/manager email
    subject: `🎂 New Cake Order - ${body.orderId}`,
    html: `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
</head>
<body style="margin: 0; padding: 20px; font-family: Roboto, Arial, sans-serif; background-color: #f9fafb;">

  <div style="background-color: #ffffff; padding: 20px; border-radius: 20px; max-width: 540px; margin: 0 auto; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1);">
    
    <div style="text-align: center; margin-bottom: 20px;">
      <img src="https://thecakecopagadian.com/images/logo.png" alt="The Cake Co. logo" height="100" />
    </div>

    <p style="font-weight: bold; font-size: 24px; margin: 0 0 10px 0;">
      🎂 New Cake Order Received!
    </p>
    <p style="font-size: 16px; margin: 0 0 20px 0;">
      You have a new order waiting for confirmation.
    </p>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
      <tr style="border: 1px solid #d1d5db;">
        <td style="padding: 12px; font-weight: bold; width: 40%;">Customer:</td>
        <td style="padding: 12px;">${body.name}</td>
      </tr>
      <tr style="border: 1px solid #d1d5db;">
        <td style="padding: 12px; font-weight: bold;">Order ID:</td>
        <td style="padding: 12px;">${body.orderId}</td>
      </tr>
      <tr style="border: 1px solid #d1d5db;">
        <td style="padding: 12px; font-weight: bold;">Total Amount:</td>
        <td style="padding: 12px;">₱${body.totalAmount}</td>
      </tr>
      <tr style="border: 1px solid #d1d5db;">
        <td style="padding: 12px; font-weight: bold;">Payment Method:</td>
        <td style="padding: 12px;">${body.paymentProvider}</td>
      </tr>
    </table>

    <div style="text-align: right;">
      <a href="https://thecakecopagadian.com/admin" target="_blank" style="display: inline-block; background-color: #000000; color: #ffffff; text-decoration: none; padding: 10px 16px; border-radius: 10px; font-size: 14px; font-weight: 500;">
        View Orders
      </a>
    </div>

  </div>

</body>
</html>
`,
    headers: {
      "X-Entity-Ref-ID": "cake-order",
    },
  };

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.GOOGLE_APP_PASSWORD,
    },
    tls: {
      rejectUnauthorized: process.env.IS_REJECT_UNAUTHORIZED === "true",
    },
  });

  try {
    await transporter.sendMail(message);
    return NextResponse.json(
      { message: "Email Sent Successfully" },
      { status: 200 }
    );
  } catch (err: unknown) {
    let message = "Unknown error";
    if (err instanceof Error) {
      message = err.message;
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
