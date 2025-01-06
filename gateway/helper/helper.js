const jwt = require('jsonwebtoken');

const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
const createAccessToken = (user_id) => {
  return jwt.sign({
    user_id: user_id
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m'
  });
};

const createRefreshToken = (user_id) => {
  return jwt.sign({
    user_id: user_id
  }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: '7d',
    notBefore: '10s' // Prevents token use immediately to avoid replay attacks
  });
};
const checkEmail = (email) => {
  const regex = /@/;
  return regex.test(email); // Returns true if @ is found, false if not
};

function isValidISODate(dateString) {
  // Regular expression to match the ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)
  const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/;

  // Test the input string against the regex
  return isoRegex.test(dateString);
}
module.exports = {
  isValidUUID,
  createAccessToken,
  createRefreshToken,
  checkEmail,
  isValidISODate
}