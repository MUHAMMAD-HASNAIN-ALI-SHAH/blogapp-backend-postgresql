const sendVerificationLink = (link) => `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title>Verification Code</title>
  </head>
  <body style="font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 0;">
    <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 30px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <tr>
        <td style="background-color: #e3342f; padding: 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">shortly</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 30px; text-align: center;">
          <h2 style="color: #333333; margin-bottom: 20px;">Verify Your Email Address</h2>
          <p style="color: #555555; margin-bottom: 30px;">Click the button below to verify your email address and complete your registration.</p>
          <a href="${link}" style="display: inline-block; padding: 12px 24px; background-color: #e3342f; color: #ffffff; text-decoration: none; border-radius: 4px; font-size: 16px;">Verify Email</a>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
module.exports = {
  sendVerificationLink,
};
