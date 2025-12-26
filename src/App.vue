<template>
  <div class="app-container">
    <SplashScreen 
      v-if="gameState.currentScreen === 'splash'"
      @start="showStory"
      @continue="continueGame"
    />
    <StoryScreen
      v-else-if="gameState.currentScreen === 'story'"
      @skip="startNewGame"
      @complete="startNewGame"
    />
    <GameView 
      v-else-if="gameState.currentScreen === 'game'"
      :game-state="gameState"
      @update-game-state="updateGameState"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import SplashScreen from './components/SplashScreen.vue'
import StoryScreen from './components/StoryScreen.vue'
import GameView from './components/GameView.vue'

const gameState = reactive({
  currentScreen: 'splash', // 'splash' | 'story' | 'game'
  currentKhan: 1,
  player: {
    health: 100,
    maxHealth: 100,
    coins: 50,
    hand: []
  },
  enemy: {
    name: 'شیر',
    health: 80,
    maxHealth: 80,
    image: 'lion'
  },
  selectedCards: [],
  isPlayerTurn: true,
  combatLog: []
})

const showStory = () => {
  gameState.currentScreen = 'story'
}

const startNewGame = () => {
  // Reset game state
  gameState.currentKhan = 1
  gameState.player.health = 100
  gameState.player.maxHealth = 100
  gameState.player.coins = 50
  gameState.player.hand = []
  gameState.selectedCards = []
  gameState.isPlayerTurn = true
  gameState.combatLog = []
  
  // Set Khan 1 enemy
  gameState.enemy = {
    name: 'شیر',
    health: 80,
    maxHealth: 80,
    image: 'lion'
  }
  
  gameState.currentScreen = 'game'
}

const continueGame = () => {
  // Load saved game state (for future implementation)
  gameState.currentScreen = 'game'
}

const updateGameState = (updates) => {
  Object.assign(gameState, updates)
}
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  position: relative;
}
</style>

