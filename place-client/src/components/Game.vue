<script setup lang="ts">
import { computed, onMounted, reactive, ref, Ref } from "vue";
import Sound from "../engine/classes/Sound";
/// <reference types="vite-svg-loader" />

import SvgIcon from "./icons/SvgIcon.vue";
import Engine from "../engine/Engine";
import EngineColor from "../engine/interfaces/IEngineColor";
import Coordinates from "./game/Coordinates.vue";
import ZoomControl from "./game/ZoomControl.vue";
import Utils from "../engine/classes/Utils";
import Camera from "../engine/classes/Camera";

const engine = new Engine();

const colors: Ref<EngineColor[]> = ref([]);
const selectedColor: Ref<EngineColor | null> = ref(null);
const colorPaletteVisible = ref(false);

const coordinates = reactive({ x: 0, y: 0, zoom: 1, zoomText: "1" });

const zoomSliderVisible = ref(false);

const selectColor = (color: EngineColor, allowSound: boolean = true) => {
  selectedColor.value = color;
  engine.elements.selectedColor = color;
  engine.camera.renderPosition();

  if (allowSound) {
    Sound.selectColor();
  }
};

const closeColorPalette = (allowSound: boolean = true) => {
  selectColor(
    {
      id: -1,
      value: "transparent",
      hex: {
        r: -1,
        g: -1,
        b: -1,
      },
    },
    false
  );
  if (allowSound) Sound.closePalette();

  colorPaletteVisible.value = false;
};

const drawColor = () => {
  if (selectedColor.value?.id == -1) return;

  const currentPixel = engine.camera.getSelectedPixel();

  let color = selectedColor.value?.id;

  if (color == null) color = -1;

  engine.world.drawColorRequest(currentPixel.x, currentPixel.y, color);
  closeColorPalette(false);
};

const placeTile = () => {
  colorPaletteVisible.value = true;
  zoomSliderVisible.value = false;
};

const updateZoom = (zoomValue: number) => {
  engine.camera.zoom = zoomValue;
  engine.camera.renderPosition();
};

const setUpcustomEvents = () => {
  document.addEventListener("click", function (e) {
    if (
      (e.target as HTMLElement).id != "zoomRange" &&
      zoomSliderVisible.value == true
    ) {
      zoomSliderVisible.value = false;
    }
  });
};

const mapContainerZoom = computed(() => {
  return Utils.isIOS || Utils.isSafari
    ? { zoom: `${Camera.ZOOM_MAX}` }
    : { transform: `scale(${Camera.ZOOM_MAX});` };
});

onMounted(async () => {
  setUpcustomEvents();

  engine.elements.coordinates = coordinates;
  await engine.init();

  engine.options.colors.forEach((c) => {
    colors.value.push(c);
  });
});
</script>

<template>
  <div class="canvas-wrapper">
    <div class="camera-wrapper">
      <div class="camera">
        <div class="position-container">
          <div class="zoom-container">
            <div class="map-container" :style="[mapContainerZoom]">
              <canvas id="map"></canvas>
            </div>
            <div class="pixel">
              <div class="pixel-icon">
                <SvgIcon name="pixel" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="top-shadow"></div>
    <div class="bottom-shadow"></div>
    <div class="top-controls">
      <div class="coordinates-container">
        <Coordinates
          :zoom="coordinates.zoomText"
          :x="coordinates.x"
          :y="coordinates.y"
        />
      </div>
      <div class="icon-button" style="opacity: 0">
        <button>
          <div class="icon-button-layout">
            <div class="icon-button-icon">
              <SvgIcon name="help" />
            </div>
          </div>
        </button>
      </div>
    </div>
    <div class="bottom-controls">
      <div class="color-palette-container" v-show="colorPaletteVisible">
        <div class="color-palette">
          <button
            class="color"
            v-for="color in colors"
            :key="color.id"
            :class="{ selected: color.id == selectedColor?.id }"
            @click="selectColor(color)"
          >
            <div :style="{ backgroundColor: color.value }"></div>
          </button>
        </div>
        <div class="buttons">
          <div class="pill" @click="closeColorPalette(true)">
            <SvgIcon name="close" />
          </div>
          <div class="divider"></div>
          <div class="pill" @click="drawColor">
            <SvgIcon name="check" />
          </div>
        </div>
      </div>
      <div class="place-tile-container">
        <div class="pill place-tile" @click="placeTile">Place a tile</div>
      </div>
      <div class="zoom-slider-wrapper">
        <div class="icon-button" @click.stop="zoomSliderVisible = true">
          <button>
            <div class="icon-button-layout">
              <div
                class="icon-button-icon icon-search"
                v-show="!zoomSliderVisible"
              >
                <SvgIcon name="search" />
              </div>
            </div>
          </button>
        </div>
        <ZoomControl
          :zoom="coordinates.zoom"
          :zoomText="coordinates.zoomText"
          @update-zoom="updateZoom"
          v-show="zoomSliderVisible"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.canvas-wrapper {
  display: flex;
  flex-flow: column nowrap;
  height: 100vh;
}

.camera-wrapper {
  display: flex;
  box-sizing: border-box;
  display: block;
  flex: 1 1 0%;
  width: 100%;
}

.camera {
  display: block;
  height: 100%;
  overflow: hidden;
  position: relative;
  width: 100%;
  user-select: none !important;
}

.position-container {
  position: absolute;
  pointer-events: none;
}

.position-container.animate {
  transition: transform 0.3s ease;
}

.zoom-container {
  position: relative;
  transform-origin: left top;
}

.map-container {
  transform-origin: left top;
}

.top-shadow,
.bottom-shadow {
  content: "";
  position: fixed;
  left: 0px;
  right: 0px;
  background: linear-gradient(
    rgba(0, 0, 0, 0.6) 0%,
    rgba(196, 196, 196, 0) 100%
  );
  height: 120px;
  pointer-events: none;
}

.top-shadow {
  top: 0;
}

.bottom-shadow {
  bottom: 0;
  transform: rotate(180deg);
}

#map {
  image-rendering: pixelated;
  background-color: #fff;
}

.pixel {
  display: block;
  position: absolute;
  left: 0px;
  top: 0px;
  height: 50px;
  width: 50px;
}

.pixel-icon {
  width: 100%;
  display: block;
  transform: translate(-5px, -5px);
  transition: background-color 0.3s linear 0s, border-color 0.3s linear 0s;
}
.top-controls,
.bottom-controls {
  position: fixed;
  left: 16px;
  right: 16px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: center;
  height: 40px;
  pointer-events: none;
}

.top-controls {
  top: 16px;
}

.coordinates-container {
  flex: 1 1 0%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.bottom-controls {
  bottom: 16px;
}

.color-palette-container {
  position: fixed;
  bottom: 0px;
  width: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  z-index: 1;

  .buttons {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    .pill {
      margin-right: 16px;
      margin-bottom: 16px;
      cursor: pointer;

      & svg {
        height: 1em;
      }
    }
  }
}
.color-palette {
  padding: 16px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  box-shadow: 0 -3px 3px 0px rgb(0 0 0 / 15%);

  @media (min-width: 800px) {
    flex-flow: row nowrap;
  }
}

.color {
  height: 32px;
  border: none;
  position: relative;
  outline: none;
  width: 100%;
  border: 2px solid #fff;
  padding: 0;
  margin: 0;
  background: transparent;
  cursor: pointer;
  max-width: 12.5%;
  display: flex;
  justify-content: center;
  align-items: center;

  & div {
    border: 1px solid #e9ebed;
    height: 100%;
    width: 100%;
  }

  &.selected {
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
    z-index: 1;
  }
}

.place-tile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1 1 0%;
}

.place-tile {
  cursor: pointer;
  pointer-events: auto;
  user-select: none;
}

.zoom-slider-wrapper {
  position: relative;
}
</style>