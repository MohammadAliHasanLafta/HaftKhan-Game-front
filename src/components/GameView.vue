<template>
  <div class="game-view">
    <GameHeader 
      :current-khan="gameState.currentKhan"
      :enemy="gameState.enemy"
      :player-coins="gameState.player.coins"
      :player-health="gameState.player.health"
      :player-max-health="gameState.player.maxHealth"
    />
    
    <BattleView 
      :enemy="gameState.enemy"
      :is-player-turn="gameState.isPlayerTurn"
      :combat-log="gameState.combatLog"
    />
    
    <CardSelector 
      :selected-cards="gameState.selectedCards"
      :player-coins="gameState.player.coins"
      :current-khan="gameState.currentKhan"
      @select-card="handleCardSelect"
      @deselect-card="handleCardDeselect"
    />
    
    <ActionOverlay 
      v-if="gameState.selectedCards.length > 0"
      :selected-cards="gameState.selectedCards"
      :total-cost="totalCardCost"
      :player-coins="gameState.player.coins"
      @confirm="handleCombatTurn"
      @cancel="clearSelection"
    />
    
    <!-- Music Toggle Button -->
    <button 
      class="music-toggle"
      @click="toggleMusic"
      :title="isPlaying ? 'قطع صدا' : 'روشن کردن صدا'"
    >
      <span v-if="isPlaying">🔊</span>
      <span v-else>🔇</span>
    </button>
    
    <!-- Background Music -->
    <audio 
      :ref="(el) => audioRef = el"
      loop
      preload="auto"
      class="bg-music"
    >
      <source :src="musicSrc" type="audio/mpeg" v-if="musicSrc" />
      <source :src="musicSrcOgg" type="audio/ogg" v-if="musicSrcOgg" />
    </audio>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import GameHeader from './GameHeader.vue'
import BattleView from './BattleView.vue'
import CardSelector from './CardSelector.vue'
import ActionOverlay from './ActionOverlay.vue'
import { useGameLogic } from '../composables/useGameLogic'
import { useBackgroundMusic } from '../composables/useBackgroundMusic'

// Background music for game
const { 
  audioRef, 
  musicSrc, 
  musicSrcOgg,
  isPlaying,
  play,
  pause
} = useBackgroundMusic('game-bg-music', { 
  autoplay: false, 
  volume: 0.4 
})

const hasPlayedOnce = ref(false)

const startMusicOnFirstClick = async () => {
  if (!hasPlayedOnce.value && !isPlaying.value) {
    hasPlayedOnce.value = true
    await play()
  }
}

const toggleMusic = async () => {
  if (isPlaying.value) {
    pause()
  } else {
    await play()
  }
}

const props = defineProps({
  gameState: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['update-game-state'])

const { 
  handleCardSelect: selectCard,
  handleCardDeselect: deselectCard,
  calculateTotalCost,
  executeCombatTurn
} = useGameLogic(props.gameState)

const totalCardCost = computed(() => {
  return calculateTotalCost(props.gameState.selectedCards)
})

const handleCardSelect = async (card) => {
  await startMusicOnFirstClick()
  selectCard(card)
  emit('update-game-state', props.gameState)
}

const handleCardDeselect = (cardId) => {
  deselectCard(cardId)
  emit('update-game-state', props.gameState)
}

const clearSelection = () => {
  props.gameState.selectedCards = []
  emit('update-game-state', props.gameState)
}

const handleCombatTurn = () => {
  const result = executeCombatTurn()
  emit('update-game-state', props.gameState)
  
  // Check for game over or Khan completion
  if (result.enemyDefeated) {
    setTimeout(() => {
      if (props.gameState.currentKhan < 7) {
        props.gameState.currentKhan++
        // Set next Khan enemy
        if (props.gameState.currentKhan === 2) {
          props.gameState.enemy = {
            name: 'بیابان بی‌آب',
            health: 100,
            maxHealth: 100,
            image: 'desert'
          }
        }
        props.gameState.selectedCards = []
        props.gameState.combatLog = []
        props.gameState.player.health = props.gameState.player.maxHealth // Restore health for next Khan
        emit('update-game-state', props.gameState)
      } else {
        // Game completed
        setTimeout(() => {
          alert('تبریک! شما همه خان‌ها را پشت سر گذاشتید!')
          props.gameState.currentScreen = 'splash'
        }, 2000)
      }
    }, 2000)
  }
  
  // Check for player defeat after enemy turn
  setTimeout(() => {
    if (props.gameState.player.health <= 0) {
      setTimeout(() => {
        alert('شما شکست خوردید!')
        props.gameState.currentScreen = 'splash'
      }, 1500)
    }
  }, 2000)
}
</script>

<style scoped>
.game-view {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-dark);
  position: relative;
}

.bg-music {
  display: none;
}

.music-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  z-index: 1000;
  transition: all 0.3s ease;
}

.music-toggle:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.music-toggle:active {
  transform: scale(0.95);
}
</style>

