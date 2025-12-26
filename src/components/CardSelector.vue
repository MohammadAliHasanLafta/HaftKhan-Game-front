<template>
  <div class="card-selector">
    <div class="selector-header">
      <h3>انتخاب کارت</h3>
      <div class="selection-count">
        انتخاب شده: {{ selectedCards.length }}
      </div>
    </div>
    
    <div class="cards-container">
      <div 
        v-for="card in availableCards" 
        :key="card.id"
        class="card"
        :class="{ 
          'selected': isCardSelected(card.id),
          'disabled': !canAffordCard(card),
          'out-of-stock': selectedCards.length >= 3
        }"
        @click="handleCardClick(card)"
      >
        <div class="card-header">
          <span class="card-name">{{ card.name }}</span>
          <span class="card-cost">
            <span class="coin-icon">🪙</span>
            {{ card.cost }}
          </span>
        </div>
        
        <div class="card-body">
          <div class="card-icon">{{ card.icon }}</div>
          <div class="card-description">{{ card.description }}</div>
        </div>
        
        <div class="card-stats">
          <span v-if="card.attack" class="stat attack">
            ⚔️ {{ card.attack }}
          </span>
          <span v-if="card.defense" class="stat defense">
            🛡️ {{ card.defense }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { getAvailableCards } from '../data/cards'

const props = defineProps({
  selectedCards: {
    type: Array,
    default: () => []
  },
  playerCoins: {
    type: Number,
    required: true
  },
  currentKhan: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['select-card', 'deselect-card'])

const availableCards = computed(() => {
  return getAvailableCards(props.currentKhan)
})

const isCardSelected = (cardId) => {
  return props.selectedCards.some(card => card.id === cardId)
}

const canAffordCard = (card) => {
  const totalCost = props.selectedCards.reduce((sum, c) => sum + c.cost, 0)
  return (totalCost + card.cost) <= props.playerCoins
}

const handleCardClick = (card) => {
  if (props.selectedCards.length >= 3 && !isCardSelected(card.id)) {
    return // Max 3 cards
  }
  
  if (isCardSelected(card.id)) {
    emit('deselect-card', card.id)
  } else {
    if (canAffordCard(card)) {
      emit('select-card', card)
    }
  }
}
</script>

<style scoped>
.card-selector {
  background: var(--color-sky-dark);
  padding: 1rem;
  max-height: 40vh;
  overflow-y: auto;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.3);
}

.selector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.selector-header h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-white);
}

.selection-count {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.card {
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
}

.card:hover:not(.disabled):not(.out-of-stock) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border-color: rgba(255, 255, 255, 0.4);
}

.card.selected {
  background: rgba(20, 184, 166, 0.3);
  border-color: var(--color-teal);
  box-shadow: 0 0 20px rgba(20, 184, 166, 0.5);
}

.card.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.card.out-of-stock:not(.selected) {
  opacity: 0.5;
  cursor: not-allowed;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
}

.card-name {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-white);
}

.card-cost {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text-gold);
  background: rgba(245, 158, 11, 0.2);
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
}

.coin-icon {
  font-size: 1rem;
}

.card-body {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.card-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.card-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.5;
  flex: 1;
}

.card-stats {
  display: flex;
  gap: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.stat {
  font-size: 0.9rem;
  font-weight: 600;
  padding: 0.3rem 0.8rem;
  border-radius: 8px;
}

.stat.attack {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.stat.defense {
  background: rgba(59, 130, 246, 0.2);
  color: #93c5fd;
}

/* Scrollbar styling */
.card-selector::-webkit-scrollbar {
  width: 8px;
}

.card-selector::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.card-selector::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.card-selector::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}
</style>

