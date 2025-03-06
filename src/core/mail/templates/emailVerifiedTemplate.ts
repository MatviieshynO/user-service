export const emailVerifiedTemplate = (): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Email Verified Successfully</title>
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
    .success {
      font-size: 24px;
      font-weight: bold;
      color: #28a745;
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
    <h2>Email Verified Successfully</h2>
    <p>Congratulations! Your email address has been successfully verified.</p>
    <div class="success">✔ Email Verified</div>
    <p>You can now access all features of our service.</p>
    <p>If you didn't perform this action, please contact our support team.</p>
    <div class="footer">
      &copy; 2024 MyApp. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
