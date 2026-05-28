const Pet = require('../models/Pet');
const User = require('../models/User');

const getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('pet');
    
    if (!user || !user.pet) {

      return res.redirect('/logout');
    }
    
    const pet = user.pet;
    
    await pet.applyTimeEffects();
    await pet.populate('owner');
    
    const statusMessages = pet.getStatusMessages();
    const isStarving = pet.hunger >= 100;
    const isExhausted = pet.energy <= 0;
    
  res.render('dashboard', {
    pet,
    statusMessages,
    isStarving,
    isExhausted,
    autoRefresh: true   
  });
    
  } catch (error) {
    console.error(error);

    res.redirect('/logout');
  }
};

const feedPet = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('pet');
    
    if (!user || !user.pet) {
      return res.redirect('/logout');
    }
    
    const pet = user.pet;
    
    await pet.applyTimeEffects();
    
    let message = '';
    
    if (pet.hunger <= 0) {
      message = 'Zwierzak nie jest głodny!';
    } else {
      pet.hunger = Math.max(0, pet.hunger - 20);
      pet.happiness = Math.min(100, pet.happiness + 5);
      pet.energy = Math.min(100, pet.energy + 3);
      message = 'Nakarmiono zwierzaka!';
      
      pet.lastTick = new Date();
      await pet.save();
    }
    

    res.redirect('/pet/dashboard');
    
  } catch (error) {
    console.error(error);

    res.redirect('/pet/dashboard');
  }
};

const playPet = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('pet');
    
    if (!user || !user.pet) {

      return res.redirect('/logout');
    }
    
    const pet = user.pet;
    
    await pet.applyTimeEffects();
    
    if (pet.energy <= 0) {

      return res.redirect('/pet/dashboard');
    }
    
    pet.happiness = Math.min(100, pet.happiness + 20);
    pet.energy = Math.max(0, pet.energy - 15);
    pet.hunger = Math.min(100, pet.hunger + 5);
    
    pet.lastTick = new Date();
    await pet.save();
    

    res.redirect('/pet/dashboard');
    
  } catch (error) {
    console.error(error);

    res.redirect('/pet/dashboard');
  }
};

const sleepPet = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).populate('pet');
    
    if (!user || !user.pet) {
      return res.redirect('/logout');
    }
    
    const pet = user.pet;
    
    await pet.applyTimeEffects();
    
    pet.energy = Math.min(100, pet.energy + 30);
    pet.hunger = Math.min(100, pet.hunger + 5);
    pet.happiness = Math.max(0, pet.happiness - 3);
    
    pet.lastTick = new Date();
    await pet.save();
    

    res.redirect('/pet/dashboard');
    
  } catch (error) {
    console.error(error);

    res.redirect('/pet/dashboard');
  }
};

module.exports = {
  getDashboard,
  feedPet,
  playPet,
  sleepPet
};