<script setup>
import { ref, watch } from 'vue'; // Import watch

const props = defineProps({
  baseImageSrc: String,
  showGradCam: Boolean,
  gradCamOpacity: Number
});

const emit = defineEmits(['update:drawings']);

const width = 400;
const height = 400;
const stageConfig = { width, height };

const isDrawing = ref(false);
const lines = ref([]);
const baseImageObj = ref(null);

// --- 1. ROBUST IMAGE LOADING FUNCTION ---
const loadImage = (src) => {
  if (!src) return;

  const img = new Image();

  // 1. KEEP THIS COMMENTED OUT (for local images)
  // img.crossOrigin = "Anonymous";

  // 2. DEFINE THE LISTENER FIRST
  img.onload = () => {
    baseImageObj.value = img;
  };

  img.onerror = (err) => {
    console.error("Canvas failed to load image:", src, err);
  };

  // 3. TRIGGER THE LOAD LAST (Swap this to the bottom)
  img.src = src;
};

// --- 2. THE FIX: WATCH FOR CHANGES ---
// This tells the canvas: "If the image source changes, run loadImage again!"
watch(() => props.baseImageSrc, (newSrc) => {
  loadImage(newSrc);
  lines.value = []; // Clear old drawings
}, { immediate: true }); // 'immediate: true' makes it run on the very first load too

// --- Drawing Logic ---
const handleMouseDown = (e) => {
  isDrawing.value = true;
  const pos = e.target.getStage().getPointerPosition();
  lines.value = [...lines.value, { points: [pos.x, pos.y] }];
};

const handleMouseMove = (e) => {
  if (!isDrawing.value) return;
  const stage = e.target.getStage();
  const point = stage.getPointerPosition();

  if (lines.value.length === 0) return;

  let lastLine = lines.value[lines.value.length - 1];
  lastLine.points = lastLine.points.concat([point.x, point.y]);
  lines.value.splice(lines.value.length - 1, 1, lastLine);
};

const handleMouseUp = () => {
  isDrawing.value = false;
  emit('update:drawings', lines.value);
};
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 justify-center">

    <div class="flex flex-col items-center">
      <div class="rounded-xl overflow-hidden border-4 border-white shadow-lg relative bg-black"
        :style="{ width: width + 'px', height: height + 'px' }">
        <v-stage :config="stageConfig">
          <v-layer>
            <v-image v-if="baseImageObj" :config="{ image: baseImageObj, width, height }" />

            <v-rect v-if="showGradCam" :config="{
              x: 0, y: 0, width, height,
              fill: 'blue',
              opacity: 0.3,
              globalCompositeOperation: 'overlay'
            }" />
            <v-circle v-if="showGradCam" :config="{
              x: width / 2, y: height / 2 + 20, radius: 60,
              fillRadialGradientStartPoint: { x: 0, y: 0 },
              fillRadialGradientStartRadius: 0,
              fillRadialGradientEndPoint: { x: 0, y: 0 },
              fillRadialGradientEndRadius: 60,
              fillRadialGradientColorStops: [0, 'red', 0.5, 'yellow', 1, 'transparent'],
              opacity: gradCamOpacity,
              globalCompositeOperation: 'screen'
            }" />
            <v-line :config="{
              points: [150, 180, 200, 150, 250, 180, 240, 240, 160, 240, 150, 180],
              stroke: '#0099ff', strokeWidth: 4, tension: 0.5, closed: true
            }" />
          </v-layer>
        </v-stage>
      </div>
      <p class="mt-3 font-bold text-slate-600">Model Output</p>
    </div>

    <div class="flex flex-col items-center">
      <div class="rounded-xl overflow-hidden border-4 border-white shadow-lg bg-black cursor-crosshair"
        :style="{ width: width + 'px', height: height + 'px' }">
        <v-stage :config="stageConfig" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
          @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
          <v-layer>
            <v-image v-if="baseImageObj" :config="{ image: baseImageObj, width, height }" />

            <v-line v-for="(line, i) in lines" :key="i" :config="{
              points: line.points,
              stroke: '#39db4a',
              strokeWidth: 5,
              tension: 0.5,
              lineCap: 'round',
              lineJoin: 'round'
            }" />
          </v-layer>
        </v-stage>
      </div>
      <p class="mt-3 font-bold text-slate-600">Brush</p>
    </div>

  </div>
</template>