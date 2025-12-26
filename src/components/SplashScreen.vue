<template>
  <div class="splash-screen">
    <div class="splash-background">
      <img 
        v-if="splashImage"
        :src="splashImage" 
        alt="هفت خان رستم" 
        class="splash-image"
        @error="handleImageError"
      />
      <div v-else class="splash-fallback"></div>
      
      <!-- Title Text -->
      <div class="title-container">
        <h1 class="title-main">هفت خان</h1>
        <h2 class="title-sub">رستم</h2>
      </div>
      
      <!-- Lottie Animation - Top (Lightning) -->
      <div v-if="lottieAnimationData" class="lottie-wrapper lottie-top">
        <LottieAnimation 
          :animation-data="lottieAnimationData"
          :loop="true"
          :autoplay="true"
        />
      </div>
    </div>
    
    <!-- Buttons -->
    <div class="button-container">
      <img 
        v-if="btnStartImage"
        :src="btnStartImage" 
        alt="شروع" 
        class="btn btn-start"
        @click="handleStart"
      />
      <button 
        v-else
        class="btn btn-start btn-fallback"
        @click="handleStart"
      >
        شروع
      </button>
      <img 
        v-if="btnContinueImage"
        :src="btnContinueImage" 
        alt="ادامه" 
        class="btn btn-continue"
        @click="handleContinue"
      />
      <button 
        v-else
        class="btn btn-continue btn-fallback"
        @click="handleContinue"
      >
        ادامه
      </button>
    </div>
    
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
      :ref="(el) => { if (el) audioRef = el }"
      loop
      preload="auto"
      class="bg-music"
      @loadeddata="handleAudioLoaded"
    >
      <source :src="musicSrc" type="audio/mpeg" v-if="musicSrc" />
      <source :src="musicSrcOgg" type="audio/ogg" v-if="musicSrcOgg" />
    </audio>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useBackgroundMusic } from '../composables/useBackgroundMusic'
import LottieAnimation from './LottieAnimation.vue'

const emit = defineEmits(['start', 'continue'])

// Import images - if they don't exist, will use fallback
let splashImage = ref(null)
let btnStartImage = ref(null)
let btnContinueImage = ref(null)

// Try to dynamically import images
const loadImages = async () => {
  try {
    const splashModule = await import('../assets/images/splash-bg.jpg')
    splashImage.value = splashModule.default
  } catch (e) {
    splashImage.value = null
  }
  
  // Button images - commented out until files are added
  // Uncomment these when you add btn-start.png and btn-continue.png to src/assets/images/
  /*
  try {
    const startModule = await import('../assets/images/btn-start.png')
    btnStartImage.value = startModule.default
  } catch (e) {
    btnStartImage.value = null
  }
  
  try {
    const continueModule = await import('../assets/images/btn-continue.png')
    btnContinueImage.value = continueModule.default
  } catch (e) {
    btnContinueImage.value = null
  }
  */
  
  // For now, use fallback buttons (text buttons)
  btnStartImage.value = null
  btnContinueImage.value = null
}

loadImages()

const handleImageError = () => {
  splashImage.value = null
}

// Lottie Animation - Top (Lightning)
let lottieAnimationData = ref(null)

const loadLottieAnimation = async () => {
  try {
    const animationModule = await import('../assets/animations/lightning.json')
    lottieAnimationData.value = animationModule.default
  } catch (e) {
    console.error('Failed to load Lottie animation:', e)
    lottieAnimationData.value = null
  }
}

loadLottieAnimation()

// Background Music
const { 
  audioRef,
  musicSrc, 
  musicSrcOgg,
  isPlaying,
  play,
  pause
} = useBackgroundMusic('splash-bg-music', { 
  autoplay: true, 
  volume: 0.5 
})

const toggleMusic = async () => {
  if (isPlaying.value) {
    pause()
  } else {
    await play()
  }
}

const handleStart = () => {
  emit('start')
}

const handleContinue = () => {
  emit('continue')
}

const handleAudioLoaded = async () => {
  // Try to play music when audio is loaded
  if (!isPlaying.value && (musicSrc.value || musicSrcOgg.value)) {
    await play()
  }
}
</script>

<style scoped>
.splash-screen {
  width: 100%;
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.splash-background {
  flex: 1;
  position: relative;
  width: 100%;
  min-height: calc(100vh - 200px);
  overflow: hidden;
}

.splash-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.splash-fallback {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  background: linear-gradient(to bottom, #1A4D5E 0%, #2D7A8F 50%, #D97706 100%);
}

/* Title */
.title-container {
  position: absolute;
  top: 15%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
}

.title-main {
  font-size: 3.975rem;
  font-weight: 600;
  color: var(--color-text-gold);
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
  margin-bottom: -0.5rem;
  letter-spacing: 0px;
  line-height: 1;
}

.title-sub {
  font-size: 3.975rem;
  font-weight: 700;
  color: var(--color-text-gold);
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  letter-spacing: 1px;
  line-height: 1;
  margin-top: 0;
}

/* Buttons */
.button-container {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 30;
  width: 90%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  background: transparent;
  padding: 0;
}

.btn {
  width: 140px;
  height: 45px;
  cursor: pointer;
  transition: all 0.3s ease;
  user-select: none;
  -webkit-user-select: none;
  display: block;
}

.btn:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

.btn:active {
  transform: scale(0.98);
}

.btn-start,
.btn-continue {
  object-fit: cover;
  width: 140px;
  height: 45px;
}

.btn-fallback {
  width: 140px;
  height: 45px;
  padding: 0;
  border: none;
  border-radius: 12px;
  font-family: var(--font-primary, 'GameFont', sans-serif);
  font-size: 32px;
  font-weight: 700;
  color: var(--color-white);
  background: var(--color-teal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-continue.btn-fallback {
  background: var(--color-desert-orange);
}

.bg-music {
  display: none;
}

.music-toggle {
  position: absolute;
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
  z-index: 100;
  transition: all 0.3s ease;
  padding: 0;
  margin: 0;
  line-height: 0;
}

.music-toggle span {
  display: block;
  line-height: 1;
  margin: 0;
  padding: 0;
}

.music-toggle:hover {
  background: rgba(0, 0, 0, 0.7);
  border-color: rgba(255, 255, 255, 0.5);
  transform: scale(1.1);
}

.music-toggle:active {
  transform: scale(0.95);
}

.lottie-wrapper {
  position: absolute;
  left: 0;
  width: 100%;
  z-index: 5;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-top {
  top: 0;
  height: 40%;
  padding-top: 2rem;
  align-items: flex-start;
}

/* @media (max-width: 480px) {
  .title-main {
    font-size: 2.5rem;
  }
  
  .title-sub {
    font-size: 1.8rem;
  }
} */
</style>

