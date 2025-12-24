<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  baseImageSrc: String,
  heatmapImageSrc: String,
  opacity: Number,
  brushSize: Number,
  tool: String
});

// We emit the final lines back to the parent when saved
const emit = defineEmits(['update:lines']);

const stageConfig = ref({ width: 500, height: 500 });
const isDrawing = ref(false);
const lines = ref([]);

// Load Images
const baseImage = new Image();
baseImage.src = props.baseImageSrc;
const heatmapImage = new Image();
heatmapImage.src = props.heatmapImageSrc || ""; // Handle empty heatmap

// Drawing Logic
const handleMouseDown = (e) => {
  isDrawing.value = true;
  const pos = e.target.getStage().getPointerPosition();
  lines.value = [...lines.value, { tool: props.tool, points: [pos.x, pos.y] }];
};

const handleMouseMove = (e) => {
  if (!isDrawing.value) return;
  const stage = e.target.getStage();
  const point = stage.getPointerPosition();
  
  let lastLine = lines.value[lines.value.length - 1];
  lastLine.points = lastLine.points.concat([point.x, point.y]);
  lines.value.splice(lines.value.length - 1, 1, lastLine);
};

const handleMouseUp = () => {
  isDrawing.value = false;
  emit('update:lines', lines.value); // Tell parent we drew something
};
</script>

<template>
  <div class="bg-black rounded-lg overflow-hidden relative shadow-inner cursor-crosshair">
    <v-stage 
      :config="stageConfig"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
      @mouseleave="handleMouseUp"
    >
      <v-layer>
        <v-image :config="{ image: baseImage, width: 500, height: 500 }" />

        <v-image :config="{ image: heatmapImage, width: 500, height: 500, opacity: props.opacity }" />

        <v-line
          v-for="(line, i) in lines"
          :key="i"
          :config="{
            points: line.points,
            stroke: '#00ff00', 
            strokeWidth: props.brushSize,
            tension: 0.5,
            lineCap: 'round',
            globalCompositeOperation: line.tool === 'eraser' ? 'destination-out' : 'source-over'
          }"
        />
      </v-layer>
    </v-stage>
  </div>
</template>