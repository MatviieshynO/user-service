export const confirmationEmailTemplate = (confirmationCode: string): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Confirmation</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      text-align: center;
      padding: 20px;
    }
    .container {
      max-width: 500px;
      margin: auto;
      background: #fff;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }
    .code {
      font-size: 24px;
      font-weight: bold;
      color: #333;
      background: #f8f8f8;
      padding: 10px;
      border-radius: 5px;
      display: inline-block;
      margin: 20px 0;
    }
    .footer {
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h2>Email Confirmation</h2>
    <p>Use the code below to verify your email address:</p>
    <div class="code">${confirmationCode}</div>
    <p>This code is valid for 10 minutes.</p>
    <p>If you didn't request this, please ignore this email.</p>
    <div class="footer">
      &copy; 2024 MyApp. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
