const authService = require('../services/AuthService');
const userRepository = require('../repositories/UserRepository');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

// Config options for cookie
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
};

exports.signup = catchAsync(async (req, res, next) => {
  const result = await authService.signup(req.body);
  
  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', result.refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    data: {
      token: result.accessToken,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      }
    }
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }

  const result = await authService.login(email, password);

  res.cookie('refreshToken', result.refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    data: {
      token: result.accessToken,
      user: {
        id: result.user._id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role
      }
    }
  });
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (!token) return next(new AppError('No refresh token found', 401));

  const result = await authService.refreshToken(token);

  res.cookie('refreshToken', result.refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    data: {
      token: result.accessToken
    }
  });
});

exports.logout = catchAsync(async (req, res, next) => {
  const token = req.cookies.refreshToken;
  if (token && req.user) {
    await authService.logout(req.user.id, token);
  }
  res.clearCookie('refreshToken');
  res.status(200).json({ success: true, message: 'Logged out successfully' });
});

exports.googleCallback = catchAsync(async (req, res, next) => {
  const user = req.user;
  const tokens = authService.generateTokens(user);

  // Set refresh token in HTTP-only cookie
  res.cookie('refreshToken', tokens.refreshToken, cookieOptions);

  // Update user with new refresh token
  await userRepository.updateRefreshTokens(user._id, [...user.refreshTokens, tokens.refreshToken]);

  const frontendUrl = process.env.NODE_ENV === 'production' 
    ? '/' 
    : 'http://localhost:5173';

  // Redirect to frontend with token
  const userData = encodeURIComponent(JSON.stringify({
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role
  }));
  
  res.redirect(`${frontendUrl}/login?token=${tokens.accessToken}&user=${userData}`);
});
