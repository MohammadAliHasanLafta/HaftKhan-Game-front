<template>
  <div class="game-header">
    <div class="header-top">
      <div class="khan-badge">
        <span class="khan-label">خان</span>
        <span class="khan-number">{{ currentKhan }}</span>
      </div>
      
      <div class="coins-display">
        <span class="coin-icon">🪙</span>
        <span class="coin-amount">{{ playerCoins }}</span>
      </div>
    </div>
    
    <div class="enemy-info">
      <h2 class="enemy-name">{{ enemy.name }}</h2>
      <div class="health-bar-container">
        <div class="health-bar-label">سلامت دشمن</div>
        <div class="health-bar">
          <div 
            class="health-bar-fill" 
            :style="{ width: `${(enemy.health / enemy.maxHealth) * 100}%` }"
          ></div>
          <span class="health-text">{{ enemy.health }} / {{ enemy.maxHealth }}</span>
        </div>
      </div>
    </div>
    
    <div class="player-health">
      <div class="health-bar-label">سلامت شما</div>
      <div class="health-bar">
        <div 
          class="health-bar-fill player-health-fill" 
          :style="{ width: `${(playerHealth / playerMaxHealth) * 100}%` }"
        ></div>
        <span class="health-text">{{ playerHealth }} / {{ playerMaxHealth }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  currentKhan: {
    type: Number,
    required: true
  },
  enemy: {
    type: Object,
    required: true
  },
  playerCoins: {
    type: Number,
    required: true
  },
  playerHealth: {
    type: Number,
    required: true
  },
  playerMaxHealth: {
    type: Number,
    required: true
  }
})
</script>

<style scoped>
.game-header {
  background: linear-gradient(to bottom, var(--color-sky-dark), var(--color-sky-light));
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  z-index: 10;
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.khan-badge {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.khan-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.khan-number {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-gold);
}

.coins-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  backdrop-filter: blur(10px);
}

.coin-icon {
  font-size: 1.2rem;
}

.coin-amount {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-gold);
}

.enemy-info {
  margin-bottom: 1rem;
}

.enemy-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-white);
  text-align: center;
  margin-bottom: 0.5rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.health-bar-container {
  margin-bottom: 0.5rem;
}

.health-bar-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.3rem;
  text-align: center;
}

.health-bar {
  position: relative;
  width: 100%;
  height: 28px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 14px;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.health-bar-fill {
  height: 100%;
  background: linear-gradient(to right, #ef4444, #f87171);
  transition: width 0.5s ease;
  border-radius: 12px;
}

.player-health-fill {
  background: linear-gradient(to right, #10b981, #34d399);
}

.health-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-white);
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.8);
  z-index: 1;
}
</style>

