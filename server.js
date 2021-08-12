const express = require('express'),
  app = express(),
  dotenv = require('dotenv'),
  cors = require('cors'),
  methodOverride = require('method-override'),
  userRoutes = require('./routes/user'),
  connectDB = require('./config/db'),
  colors = require('colors'),
  morgan = require('morgan'),
  xss = require('xss-clean'),
  cookieParser = require('cookie-parser'),
  helmet = require('helmet'),
  hpp = require('hpp'),
  mongoSanitize = require('express-mongo-sanitize');

dotenv.config({ path: 'config/config.env' });

app.use(cors());

app.use(mongoSanitize());
app.use(cookieParser());
app.use(helmet());
app.use(hpp());
app.use(xss());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('dev'));

app.use('/api/v1/user', userRoutes);

const PORT = process.env.PORT || 4000;
const ENVIRONMENT = process.env.NODE_ENV;

app.listen(PORT, () =>
  console.log(
    `Server started running in ${ENVIRONMENT} mode on PORT ${PORT}`.blue.bold,
  ),
);

connectDB();
