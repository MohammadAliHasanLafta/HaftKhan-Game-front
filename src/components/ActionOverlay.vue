<template>
  <div class="action-overlay">
    <div class="overlay-content">
      <div class="selected-cards-summary">
        <h3>کارت‌های انتخاب شده</h3>
        <div class="cards-list">
          <div 
            v-for="card in selectedCards" 
            :key="card.id"
            class="summary-card"
          >
            <span class="summary-card-name">{{ card.name }}</span>
            <span class="summary-card-cost">🪙 {{ card.cost }}</span>
          </div>
        </div>
        
        <div class="total-cost">
          <span>هزینه کل:</span>
          <span class="cost-amount" :class="{ 'insufficient': totalCost > playerCoins }">
            🪙 {{ totalCost }} / {{ playerCoins }}
          </span>
        </div>
      </div>
      
      <div class="action-buttons">
        <button 
          class="btn btn-confirm"
          :disabled="totalCost > playerCoins"
          @click="$emit('confirm')"
        >
          تأیید و مبارزه
        </button>
        <button 
          class="btn btn-cancel"
          @click="$emit('cancel')"
        >
          لغو
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  selectedCards: {
    type: Array,
    required: true
  },
  totalCost: {
    type: Number,
    required: true
  },
  playerCoins: {
    type: Number,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.action-overlay {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  padding: 1.5rem;
  z-index: 100;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}

.overlay-content {
  max-width: 100%;
}

.selected-cards-summary {
  margin-bottom: 1.5rem;
}

.selected-cards-summary h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--color-white);
  margin-bottom: 1rem;
  text-align: center;
}

.cards-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  max-height: 150px;
  overflow-y: auto;
}

.summary-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.8rem 1rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.summary-card-name {
  font-size: 0.95rem;
  color: var(--color-white);
  font-weight: 600;
}

.summary-card-cost {
  font-size: 0.9rem;
  color: var(--color-text-gold);
  font-weight: 700;
}

.total-cost {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(20, 184, 166, 0.2);
  border-radius: 12px;
  border: 2px solid var(--color-teal);
  font-size: 1.1rem;
  font-weight: 700;
}

.total-cost .cost-amount {
  color: var(--color-text-gold);
}

.total-cost .cost-amount.insufficient {
  color: #ef4444;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.btn {
  width: 100%;
  padding: 1.2rem;
  border: none;
  border-radius: 12px;
  font-family: var(--font-primary, 'GameFont', sans-serif);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn:active:not(:disabled) {
  transform: scale(0.98);
}

.btn-confirm {
  background: var(--color-teal);
  color: var(--color-white);
}

.btn-confirm:hover:not(:disabled) {
  background: var(--color-teal-dark);
  box-shadow: 0 6px 16px rgba(20, 184, 166, 0.4);
}

.btn-confirm:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #6b7280;
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.1);
  color: var(--color-white);
  border: 2px solid rgba(255, 255, 255, 0.3);
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
}
</style>

