const User = require('../models/User');
const Pet = require('../models/Pet');
const bcrypt = require('bcrypt');

const showLogin = (req, res) => {
  res.render('login');
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.render('login', { error_msg: 'Wprowadź nazwę użytkownika i hasło.' });
    }
    
    const user = await User.findOne({ username }).populate('pet');
    
    if (!user) {
      return res.render('login', { error_msg: 'Nieprawidłowy login lub hasło.' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.render('login', { error_msg: 'Nieprawidłowy login lub hasło.' });
    }
    
    req.session.user = {
      id: user._id,
      username: user.username,
      petId: user.pet ? user.pet._id : null
    };
    
    res.redirect('/pet/dashboard');
    
  } catch (error) {
    console.error(error);
    res.redirect('/login');
  }
};

const showRegister = (req, res) => {
  res.render('register');
};

const register = async (req, res) => {
  try {
    const { username, password, petName } = req.body;
    
    const errors = [];
    if (!username || !password) {
      errors.push('Wszystkie pola sa wymagane');
    }


    if (username && username.length < 3) {
      errors.push('Nazwa użytkownika musi miec co najmniej 3 znaki');
    }
    
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      errors.push('Nazwa użytkownika jest juz zajeta');
    }
    
    if (errors.length > 0) {
      return res.render('register', { errors, username, petName });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    const user = new User({
      username,
      password: hashedPassword
    });
    
    const pet = new Pet({
      name: petName || `Pet_${username}`,
      hunger: 50,
      happiness: 50,
      energy: 50,
      owner: user._id
    });
    
    await pet.save();
    user.pet = pet._id;
    await user.save();
    

    res.redirect('/login');
    
  } catch (error) {
    console.error(error);

    res.redirect('/register');
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/login');
  });
};

module.exports = {
  showLogin,
  login,
  showRegister,
  register,
  logout
};