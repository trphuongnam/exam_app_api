import { createHmac } from "crypto";

const generateToken = (userId: number, userEmail: String) => {
  const headerToken = btoa(JSON.stringify({"alg": "HS256", "typ": "JWT"}));

  const exp = Date.now() + 86400000;
  const payloadToken = btoa(JSON.stringify({"sub": userId, "name": userEmail, "exp": exp}));

  const signature = generateSignature(headerToken, payloadToken);

  const token = `${headerToken}.${payloadToken}.${signature}`;
  return token;
}

const generateSignature = (headerToken: String, payloadToken: String) => {
  const secretKey = 'd5e74080b825575d9b5cb45709e142b0bfaf47e1d706da7d3b2083a8d1934232';
  let signatureData = createHmac('SHA256', `${headerToken}.${payloadToken}.${secretKey}`);

  signatureData = signatureData.update('nodejsera');
  const signature = signatureData.digest('hex');
  return signature;
}

export default generateToken;
