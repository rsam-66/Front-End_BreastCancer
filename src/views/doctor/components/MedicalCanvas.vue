<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
  baseImageSrc: String,
  brushType: { type: String, default: 'normal' }, // 'normal' (green), 'benign' (yellow), 'malignant' (red), 'erase'
  brushSize: { type: Number, default: 1 }, // Multiplier for brush diameter 
  viewMode: { type: String, default: 'raw' } // 'raw' | 'normalized'
});

const emit = defineEmits(['update:drawings']);

const width = 400;
const height = 400;
const CELL_SIZE = 8; // Fixed 50x50 grid (400/8 = 50)
const stageConfig = { width, height };

const isDrawing = ref(false);
const baseImageObj = ref(null);
const stageRef = ref(null);

// -- GRID STATE --
// We store drawings as a Map of "x,y" => colorString
const gridData = ref(new Map());

// Colors mapping
const brushColors = {
  normal: '#00FF00', // Green (Low)
  benign: '#FFC107', // Yellow (Medium)
  malignant: '#FF0000', // Red (High)
  erase: null
};

// Robust Image Loading with Fallbacks
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
      // If CORS attempt failed, try Tainted fallback
      if (useCrossOrigin) {
        console.warn("CORS load failed, displaying tainted image.");
        setImgSrc(src, false); // Retry without CORS
        isTainted.value = true;
      } else {
        console.error("Failed to load image even in tainted mode:", src);
      }
    };
    img.src = url;
  };

  try {
    // Attempt 1: Blob (Secure, Best for Saving)
    const blobUrl = await loadViaBlob();
    setImgSrc(blobUrl, false); // Blob URLs don't need crossOrigin
  } catch (err) {
    console.warn("Blob load failed, falling back to standard load:", err);
    // Attempt 2: Standard CORS Load (Good for Saving if server allows)
    setImgSrc(src, true);
  }
};

watch(() => props.baseImageSrc, (newSrc) => {
  loadImage(newSrc);
  gridData.value.clear();
}, { immediate: true });


// --- DRAWING LOGIC (PIXEL GRID + BRUSH RADIUS) ---
const getGridCoord = (stageX, stageY) => {
  const col = Math.floor(stageX / CELL_SIZE);
  const row = Math.floor(stageY / CELL_SIZE);
  return { col, row };
};

const paintCell = (stageX, stageY) => {
  const { col: centerCol, row: centerRow } = getGridCoord(stageX, stageY);
  const color = brushColors[props.brushType];
  const radius = Math.max(0, props.brushSize - 0.5); // 1 = point, 2 = small circle, etc.

  // Iterate over bounding box of the brush
  const rCeil = Math.ceil(radius);

  for (let y = -rCeil; y <= rCeil; y++) {
    for (let x = -rCeil; x <= rCeil; x++) {
      // Circle test
      if (x * x + y * y <= radius * radius + 0.5) { // +0.5 enables 1x1 painting for radius 1
        const targetCol = centerCol + x;
        const targetRow = centerRow + y;

        // Bounds check
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

  // Force update reactive map
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
  // Convert map to array for emit
  const drawings = Array.from(gridData.value.entries()).map(([key, color]) => ({ key, color }));
  emit('update:drawings', drawings);
};

// --- RENDER HELPERS ---
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

// Expose method to get data URL
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

    <!-- CANVAS WRAPPER -->
    <div class="flex flex-col items-center">
      <div class="rounded-xl overflow-hidden border-4 border-white shadow-lg relative bg-black cursor-crosshair group"
        :style="{ width: width + 'px', height: height + 'px' }">
        <v-stage ref="stageRef" :config="stageConfig" @mousedown="handleMouseDown" @mousemove="handleMouseMove"
          @mouseup="handleMouseUp" @mouseleave="handleMouseUp">
          <v-layer>
            <!-- 1. BASE IMAGE -->
            <v-image v-if="baseImageObj" :config="{ image: baseImageObj, width, height }" />

            <!-- 2. DEFAULT BLUE OVERLAY (The "Nothing Touched" State) -->
            <!-- Always present, opacity adjusts based on if we are simulating GradCam or just raw -->
            <!-- Per user request: "blue color (the nothing's touched)" -->
            <v-rect :config="{
              x: 0, y: 0, width, height,
              fill: '#0099ff',
              opacity: 0.3,
              listening: false
            }" />

            <!-- 3. DRAWINGS (PIXEL GRID) -->
            <!-- Group for filter application -->
            <v-group :config="{
              // If NORMALIZED mode, we could apply filters here if Konva supports generic CSS filters on Group?
              // Unfortunately Konva filters are canvas-pixel based. 
              // For visual blur, we might need a workaround or just use opacity/shadows.
              // ACTUALLY: Let's use opacity overlap + shadowBlur for 'Normalized' look?
            }">
              <v-rect v-for="(rect, i) in gridRects" :key="`${rect.x}-${rect.y}`" :config="{
                ...rect,
                opacity: viewMode === 'normalized' ? 0.6 : 0.8,
                // Simulate blur in normalized mode using shadow
                shadowColor: rect.fill,
                shadowBlur: viewMode === 'normalized' ? 20 : 0,
                shadowOpacity: viewMode === 'normalized' ? 1 : 0,
                cornerRadius: viewMode === 'normalized' ? rect.width / 2 : 0 // Make them rounder in normalized?
              }" />
            </v-group>

          </v-layer>
        </v-stage>

        <!-- CSS BLUR OVERLAY FOR NORMALIZED MODE (Visual Only Trick) -->
        <!-- Since Konva blur filter is expensive/complex to set up dynamically on groups -->
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