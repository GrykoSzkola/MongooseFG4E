require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const connectDB = require('./config/db');

const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');

const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));



app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = '';
  res.locals.error_msg = '';
  res.locals.error = '';
  next();
});

app.use('/', authRoutes);
app.use('/pet', petRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect('/pet/dashboard');
  }
  res.redirect('/login');
});

app.use((req, res) => {
  res.status(404).render('login', { error_msg: 'str nie istnieje' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});