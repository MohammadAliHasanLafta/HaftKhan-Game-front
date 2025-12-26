<template>
  <div ref="lottieContainer" class="lottie-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import lottie from 'lottie-web'

const props = defineProps({
  animationData: {
    type: Object,
    default: null
  },
  animationPath: {
    type: String,
    default: null
  },
  loop: {
    type: Boolean,
    default: true
  },
  autoplay: {
    type: Boolean,
    default: true
  },
  speed: {
    type: Number,
    default: 1
  }
})

const lottieContainer = ref(null)
let animationInstance = null

const loadAnimation = async () => {
  if (!lottieContainer.value) return

  // Clean up previous animation
  if (animationInstance) {
    animationInstance.destroy()
    animationInstance = null
  }

  let animationData = props.animationData

  // Load from path if provided
  if (!animationData && props.animationPath) {
    try {
      const response = await fetch(props.animationPath)
      animationData = await response.json()
    } catch (e) {
      console.error('Failed to load Lottie animation:', e)
      return
    }
  }

  if (!animationData) return

  animationInstance = lottie.loadAnimation({
    container: lottieContainer.value,
    renderer: 'svg',
    loop: props.loop,
    autoplay: props.autoplay,
    animationData: animationData
  })

  if (props.speed !== 1) {
    animationInstance.setSpeed(props.speed)
  }
}

onMounted(() => {
  loadAnimation()
})

onUnmounted(() => {
  if (animationInstance) {
    animationInstance.destroy()
  }
})

watch(() => props.animationData, () => {
  loadAnimation()
})

watch(() => props.animationPath, () => {
  loadAnimation()
})
</script>

<style scoped>
.lottie-container {
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.lottie-container :deep(svg) {
  width: 100% !important;
  height: auto !important;
  max-width: 100%;
}
</style>

