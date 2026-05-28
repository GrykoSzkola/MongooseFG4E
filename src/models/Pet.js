const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 30
  },
  hunger: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  },
  happiness: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  },
  energy: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 50
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastTick: {
    type: Date,
    default: Date.now
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

petSchema.methods.applyTimeEffects = async function() {
  const TICK_INTERVAL_MS = (parseInt(process.env.TICK_INTERVAL_MINUTES) || 5) * 1000;
  const now = new Date();
  const timeSinceLastTick = now - this.lastTick;
  
  if (timeSinceLastTick < TICK_INTERVAL_MS) {
    return false;
  }
  
  const ticks = Math.min(Math.floor(timeSinceLastTick / TICK_INTERVAL_MS), 100);
  
  let changed = false;
  for (let i = 0; i < ticks; i++) {
    if (this.hunger < 100) {
      this.hunger = Math.min(100, this.hunger + 1);
      changed = true;
    }
    if (this.energy > 0) {
      this.energy = Math.max(0, this.energy - 1);
      changed = true;
    }
    if (this.happiness > 0) {
      this.happiness = Math.max(0, this.happiness - 1);
      changed = true;
    }
  }
  
  if (changed) {
    this.lastTick = new Date(this.lastTick.getTime() + ticks * TICK_INTERVAL_MS);
    await this.save();
  }
  
  return ticks > 0;
};

petSchema.methods.getStatusMessages = function() {
  const messages = [];
  if (this.hunger >= 100) messages.push('Zwierzak jest bardzo glodny! ');
  else if (this.hunger >= 80) messages.push('Zwierzak jest głodny');
  
  if (this.energy <= 0) messages.push('Zwierzak jest wyczerpany!');
  else if (this.energy <= 20) messages.push('Zwierzak jest zmeczony');
  
  if (this.happiness <= 0) messages.push('Zwierzak jest bardzo smutny!');
  else if (this.happiness <= 20) messages.push('Zwierzak jest smutny');
  
  return messages;
};

module.exports = mongoose.model('Pet', petSchema);