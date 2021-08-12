const User = require('../models/User'),
  crypto = require('crypto');

// Register a User
exports.register = async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({
    name,
    email,
    password,
  });

  // const resetUrl = `http://localhost:3000/verifyemail/${user.email}`;

  // const message = `Click the following link to verify your email: \n${resetUrl}`;

  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: 'Email Verification',
    //   message,
    // });

    res.json({
      success: true,
      message: 'Registered!',
    });
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: `Registered!`,
    });
  }
};

// Login a User
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.json({ success: false, message: 'Invalid Credentials!' });
  }

  const isSame = await user.matchPassword(password);

  if (!isSame) {
    return res.json({ success: false, message: 'Invalid Credentials!' });
  }

  sendTokenResponse(user, 200, res, 'User Logged In!');
};

// Logout a user
exports.logout = async (req, res, next) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true,
    })
    .json({ success: true, message: 'Logged Off' });
};

// Get Current Logged In User
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Generating token and sending it in response
const sendTokenResponse = (user, status, res, message) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  return res
    .cookie('token', token, options)
    .json({ success: true, token, message, user });
};
