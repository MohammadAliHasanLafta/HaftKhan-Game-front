<template>
  <div class="story-screen">
    <video 
      ref="storyVideo"
      class="story-video"
      :src="videoSrc"
      @ended="handleVideoEnd"
      @loadeddata="handleVideoLoaded"
    >
      مرورگر شما از پخش ویدیو پشتیبانی نمی‌کند.
    </video>
    
    <!-- Skip Button -->
    <button 
      v-if="showSkipButton"
      class="skip-button"
      @click="skipStory"
    >
      رد کردن
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['skip', 'complete'])

const storyVideo = ref(null)
const videoSrc = ref(null)
const showSkipButton = ref(false)
let skipTimer = null

const loadVideo = async () => {
  try {
    const videoModule = await import('../assets/videos/story-intro.mp4')
    videoSrc.value = videoModule.default
  } catch (e) {
    console.error('Failed to load story video:', e)
    // If video doesn't exist, skip to game after delay
    setTimeout(() => {
      emit('complete')
    }, 2000)
  }
}

const handleVideoLoaded = () => {
  if (storyVideo.value) {
    storyVideo.value.play().catch(e => {
      console.error('Could not play video:', e)
    })
  }
  
  // Show skip button after 20 seconds
  skipTimer = setTimeout(() => {
    showSkipButton.value = true
  }, 20000)
}

const handleVideoEnd = () => {
  emit('complete')
}

const skipStory = () => {
  if (storyVideo.value) {
    storyVideo.value.pause()
  }
  if (skipTimer) {
    clearTimeout(skipTimer)
  }
  emit('skip')
}

onMounted(() => {
  loadVideo()
})

onUnmounted(() => {
  if (skipTimer) {
    clearTimeout(skipTimer)
  }
  if (storyVideo.value) {
    storyVideo.value.pause()
  }
})
</script>

<style scoped>
.story-screen {
  width: 100%;
  min-height: 100vh;
  position: relative;
  background: var(--color-bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.story-video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
}

.skip-button {
  position: fixed;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  color: var(--color-white);
  font-family: var(--font-primary, 'GameFont', sans-serif);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease;
}

.skip-button:hover {
  background: rgba(0, 0, 0, 0.9);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateX(-50%) scale(1.05);
}

.skip-button:active {
  transform: translateX(-50%) scale(0.98);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}
</style>

