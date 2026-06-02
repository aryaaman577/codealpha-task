exports.sendTokenResponse = (user, statusCode, res) => {
  const token = user.generateAuthToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  };

  res
    .status(statusCode)
    .cookie('token', token, options)
    .redirect('/feed');
};

exports.clearTokenResponse = (res) => {
  res
    .cookie('token', 'none', {
      expires: new Date(Date.now() + 1 * 1000),
      httpOnly: true
    })
    .redirect('/');
};
