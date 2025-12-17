"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWelcomeEmailHtml = void 0;
const getWelcomeEmailHtml = (password) => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Madrasa Management</title>
  <style>
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f3f4f6;
      margin: 0;
      padding: 0;
      line-height: 1.6;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .header {
      background-color: #10B981; /* Emerald 500 */
      color: white;
      text-align: center;
      padding: 30px 20px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
    }
    .content {
      padding: 40px 30px;
      color: #374151; /* Gray 700 */
    }
    .welcome-text {
      font-size: 16px;
      margin-bottom: 24px;
    }
    .password-box {
      background-color: #ecfdf5; /* Emerald 50 */
      border: 1px dashed #10B981;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      margin: 30px 0;
    }
    .password-label {
      display: block;
      color: #059669; /* Emerald 600 */
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .password-value {
      display: block;
      color: #111827; /* Gray 900 */
      font-size: 24px;
      font-weight: 700;
      font-family: monospace;
      letter-spacing: 2px;
    }
    .footer {
      background-color: #f9fafb; /* Gray 50 */
      padding: 20px;
      text-align: center;
      font-size: 13px;
      color: #6b7280; /* Gray 500 */
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to Madrasa Management</h1>
    </div>
    <div class="content">
      <div class="welcome-text">
        <p>Assalamu Alaikum,</p>
        <p>Your madrasa management account has been successfully created. We are delighted to have you on board.</p>
        <p>Please use the following password to log in to your account:</p>
      </div>
      
      <div class="password-box">
        <span class="password-label">Your Password</span>
        <span class="password-value">${password}</span>
      </div>
      
      <div class="welcome-text">
        <p>For security purposes, we recommend changing your password after your first login.</p>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Madrasa Management System. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `;
};
exports.getWelcomeEmailHtml = getWelcomeEmailHtml;
