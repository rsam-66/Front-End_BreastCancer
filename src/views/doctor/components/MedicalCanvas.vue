<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  baseImageSrc: String,
  brushType: { type: String, default: 'normal' },
  brushSize: { type: Number, default: 1 },
  viewMode: { type: String, default: 'raw' }
});

const emit = defineEmits(['update:drawings']);

const width = 400;
const height = 400;
const CELL_SIZE = 8;
const stageConfig = { width, height };

const isDrawing = ref(false);
const baseImageObj = ref(null);
const stageRef = ref(null);

const gridData = ref(new Map());

const brushColors = {
  normal: '#00FF00',
  benign: '#FFC107',
  malignant: '#FF0000',
  erase: null
};

let lastObjectUrl = null;
const isTainted = ref(false);

const loadImage = async (src) => {
  if (!src) return;
  isTainted.value = false;

  const loadViaBlob = async () => {
    const response = await fetch(src, { mode: 'cors' });
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    if (lastObjectUrl) URL.revokeObjectURL(lastObjectUrl);
    lastObjectUrl = URL.createObjectURL(blob);
    return lastObjectUrl;
  };

  const setImgSrc = (url, useCrossOrigin) => {
    const img = new Image();
    if (useCrossOrigin) img.crossOrigin = "Anonymous";
    img.onload = () => { baseImageObj.value = img; };
    img.onerror = () => {
      if (useCrossOrigin) {
        console.warn("CORS load failed, displaying tainted image.");
        setImgSrc(src, false);
        isTainted.value = true;
      } else {
        console.error("Failed to load image even in tainted mode:", src);
      }
    };
    img.src = url;
  };

  try {
    const blobUrl = await loadViaBlob();
    setImgSrc(blobUrl, false);
  } catch (err) {
    console.warn("Blob load failed, falling back to standard load:", err);
    setImgSrc(src, true);
  }
};

watch(() => props.baseImageSrc, (newSrc) => {
  loadImage(newSrc);
  gridData.value.clear();
}, { immediate: true });

const getGridCoord = (stageX, stageY) => {
  const col = Math.floor(stageX / CELL_SIZE);
  const row = Math.floor(stageY / CELL_SIZE);
  return { col, row };
};

const paintCell = (stageX, stageY) => {
  const { col: centerCol, row: centerRow } = getGridCoord(stageX, stageY);
  const color = brushColors[props.brushType];
  const radius = Math.max(0, props.brushSize - 0.5);

  const rCeil = Math.ceil(radius);

  for (let y = -rCeil; y <= rCeil; y++) {
    for (let x = -rCeil; x <= rCeil; x++) {
      if (x * x + y * y <= radius * radius + 0.5) {
        const targetCol = centerCol + x;
        const targetRow = centerRow + y;
        if (targetCol >= 0 && targetCol < (width / CELL_SIZE) &&
          targetRow >= 0 && targetRow < (height / CELL_SIZE)) {

          const key = `${targetCol},${targetRow}`;
          if (props.brushType === 'erase') {
            gridData.value.delete(key);
          } else if (color) {
            gridData.value.set(key, color);
          }
        }
      }
    }
  }

  gridData.value = new Map(gridData.value);
};

const handleMouseDown = (e) => {
  isDrawing.value = true;
  const pos = e.target.getStage().getPointerPosition();
  paintCell(pos.x, pos.y);
};

const handleMouseMove = (e) => {
  if (!isDrawing.value) return;
  const pos = e.target.getStage().getPointerPosition();
  paintCell(pos.x, pos.y);
};

const handleMouseUp = () => {
  isDrawing.value = false;
  const drawings = Array.from(gridData.value.entries()).map(([key, color]) => ({ key, color }));
  emit('update:drawings', drawings);
};
const gridRects = computed(() => {
  const rects = [];
  const cellSize = CELL_SIZE;

  for (const [key, color] of gridData.value.entries()) {
    const [col, row] = key.split(',').map(Number);
    rects.push({
      x: col * cellSize,
      y: row * cellSize,
      width: cellSize,
      height: cellSize,
      fill: color
    });
  }
  return rects;
});

const getStageDataURL = () => {
  if (stageRef.value && stageRef.value.getStage()) {
    return stageRef.value.getStage().toDataURL({ pixelRatio: 2 });
  }
  return null;
};

defineExpose({
  getStageDataURL,
  isTainted
});
</script>

<template>
  <div class="flex flex-col md:flex-row gap-6 justify-center">

    <div class="flex flex-col items-center">
      <div class="rounded-xl overflow-hidden border-4 border-white shadow-lg relative bg-black cursor-crosshair group"
        :style="{ width: width + 'px', height: height + 'px' }">
        <v-stage ref="stageRef" :config="stageConfig" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
          @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
          <v-layer>
            <v-image v-if="baseImageObj" :config="{ image: baseImageObj, width, height }" />
            <v-rect :config="{
              x: 0, y: 0, width, height,
              fill: '#0099ff',
              opacity: 0.3,
              listening: false
            }" />

            <v-group :config="{
            }">
              <v-rect v-for="(rect) in gridRects" :key="`${rect.x}-${rect.y}`" :config="{
                ...rect,
                opacity: viewMode === 'normalized' ? 0.6 : 0.8,
                shadowColor: rect.fill,
                shadowBlur: viewMode === 'normalized' ? 20 : 0,
                shadowOpacity: viewMode === 'normalized' ? 1 : 0,
                cornerRadius: viewMode === 'normalized' ? rect.width / 2 : 0
              }" />
            </v-group>

          </v-layer>
        </v-stage>

        <div v-if="viewMode === 'normalized'" class="absolute inset-0 pointer-events-none backdrop-blur-[8px]"
          style="mix-blend-mode: hard-light; opacity: 0.5;">
        </div>

      </div>
      <p class="mt-3 font-bold text-slate-600 uppercase tracking-widest text-xs">
        {{ viewMode }} VIEW
      </p>
    </div>

  </div>
</template>