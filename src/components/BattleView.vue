<template>
  <div class="battle-view" :class="{ 'shake': isCombatAnimating }">
    <div class="battle-background" :class="`khan-${enemy.image}`">
      <!-- Desert landscape for Khan 1 -->
      <div v-if="enemy.image === 'lion'" class="desert-scene">
        <div class="desert-sky"></div>
        <div class="desert-dunes">
          <div class="dune"></div>
          <div class="dune"></div>
          <div class="dune"></div>
        </div>
      </div>
      
      <!-- Enemy representation -->
      <div class="enemy-container">
        <div class="enemy-sprite" :class="`enemy-${enemy.image}`">
          <div v-if="enemy.image === 'lion'" class="lion">
            <div class="lion-body"></div>
            <div class="lion-head">
              <div class="lion-mane"></div>
              <div class="lion-eye"></div>
            </div>
            <div class="lion-tail"></div>
          </div>
        </div>
      </div>
      
      <!-- Combat log messages -->
      <div v-if="combatLog.length > 0" class="combat-log">
        <div 
          v-for="(log, index) in recentLogs" 
          :key="index"
          class="log-message"
          :class="log.type"
        >
          {{ log.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, watch, ref } from 'vue'

const props = defineProps({
  enemy: {
    type: Object,
    required: true
  },
  isPlayerTurn: {
    type: Boolean,
    default: true
  },
  combatLog: {
    type: Array,
    default: () => []
  }
})

const isCombatAnimating = ref(false)

const recentLogs = computed(() => {
  return props.combatLog.slice(-3).reverse()
})

watch(() => props.combatLog.length, () => {
  isCombatAnimating.value = true
  setTimeout(() => {
    isCombatAnimating.value = false
  }, 500)
})
</script>

<style scoped>
.battle-view {
  flex: 1;
  position: relative;
  min-height: 300px;
  overflow: hidden;
}

.battle-view.shake {
  animation: shake 0.5s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.battle-background {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Desert Scene for Khan 1 */
.desert-scene {
  width: 100%;
  height: 100%;
  position: relative;
}

.desert-sky {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 50%;
  background: linear-gradient(to bottom, var(--color-sky-light), #4a9ba8);
}

.desert-dunes {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50%;
}

.desert-dunes .dune {
  position: absolute;
  bottom: 0;
  width: 120%;
  height: 40%;
  background: var(--color-desert-orange);
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
}

.desert-dunes .dune:nth-child(1) {
  left: -10%;
  height: 45%;
  background: #f97316;
}

.desert-dunes .dune:nth-child(2) {
  left: 0;
  height: 40%;
  background: var(--color-desert-orange);
  z-index: 2;
}

.desert-dunes .dune:nth-child(3) {
  left: 10%;
  height: 35%;
  background: var(--color-desert-yellow);
  z-index: 1;
}

/* Enemy Container */
.enemy-container {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
}

.enemy-sprite {
  position: relative;
  width: 200px;
  height: 200px;
}

/* Lion Enemy */
.lion {
  position: relative;
  width: 100%;
  height: 100%;
  animation: idle 2s ease-in-out infinite;
}

@keyframes idle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.lion-body {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 80px;
  background: var(--color-desert-orange);
  border-radius: 50% 50% 40% 40%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

.lion-head {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: 100px;
  height: 90px;
  background: var(--color-desert-orange);
  border-radius: 50% 50% 40% 40%;
  z-index: 2;
}

.lion-mane {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 80px;
  background: #b45309;
  border-radius: 50%;
  box-shadow: 
    -10px 0 0 #92400e,
    10px 0 0 #92400e,
    0 -10px 0 #92400e;
}

.lion-eye {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  width: 12px;
  height: 12px;
  background: var(--color-black);
  border-radius: 50%;
  box-shadow: -25px 0 0 var(--color-black), 25px 0 0 var(--color-black);
}

.lion-tail {
  position: absolute;
  bottom: 40px;
  right: -30px;
  width: 8px;
  height: 60px;
  background: var(--color-desert-orange);
  border-radius: 4px;
  transform: rotate(-20deg);
}

.lion-tail::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 20px;
  background: var(--color-desert-orange);
  border-radius: 50%;
}

/* Combat Log */
.combat-log {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.log-message {
  background: rgba(0, 0, 0, 0.7);
  color: var(--color-white);
  padding: 0.8rem 1.2rem;
  border-radius: 12px;
  font-size: 0.9rem;
  text-align: center;
  backdrop-filter: blur(10px);
  animation: fadeInUp 0.3s ease;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.log-message.damage {
  border-color: #ef4444;
  color: #fca5a5;
}

.log-message.defense {
  border-color: #3b82f6;
  color: #93c5fd;
}

.log-message.victory {
  border-color: #10b981;
  color: #6ee7b7;
}

.log-message.heal {
  border-color: #10b981;
  color: #6ee7b7;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 480px) {
  .enemy-sprite {
    width: 150px;
    height: 150px;
  }
  
  .lion-body {
    width: 90px;
    height: 60px;
  }
  
  .lion-head {
    width: 75px;
    height: 70px;
    bottom: 45px;
  }
}
</style>

