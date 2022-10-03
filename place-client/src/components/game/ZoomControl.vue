<script lang="ts">
import { SetupContext } from "vue";

export default {
  props: {
    zoom: Number,
    zoomText: String,
  },
  emits: ["updateZoom"],
  setup(_props: any, context: any) {
    return {
      updateZoom: (event: Event) => {
        context?.emit(
          "updateZoom",
          parseInt((event.target as HTMLInputElement).value)
        );
      },
    };
  },
};
</script>

<template>
  <div class="zoom-slider-container">
    <div class="slider">
      <div class="dots-wrapper">
        <div class="dots">
          <div class="dot" style="left: 0%"></div>
          <div class="dot" style="left: 25%"></div>
          <div class="dot" style="left: 50%"></div>
          <div class="dot" style="left: 75%"></div>
          <div class="dot" style="left: 100%"></div>
        </div>
      </div>
      <div class="zoom">{{ zoomText }}x</div>
    </div>
    <input
      id="zoomRange"
      type="range"
      min="1"
      max="50"
      v-model.number="zoom"
      @input="updateZoom"
    />
  </div>
</template>

<style lang="scss" scoped>
.zoom-slider-container {
  position: absolute;
  bottom: 8px;
  left: 44px;
}
.slider {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 36px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  height: 36px;
  width: 340px;
  transform: rotate(-90deg);
  transform-origin: left bottom;

  .dots-wrapper {
    position: relative;
    flex: 1 1 0%;

    .dots {
      background: rgb(255, 255, 255);
      box-sizing: border-box;
      height: 4px;
      position: absolute;
      inset: 50% 18px 0px;
      transform: translate(0px, -1px);
      width: calc(100% - 40px);

      .dot {
        background: rgb(255, 255, 255);
        width: 15px;
        height: 15px;
        top: 50%;
        transform: translate(-50%, -50%);
        position: absolute;
        border-radius: 50%;
      }
    }
  }

  .zoom {
    font-size: 14px;
    line-height: 18px;
    font-weight: 700;
    color: rgb(255, 255, 255);
    transform: rotate(90deg);
    width: 40px;
    text-align: center;
    margin-left: -10px;
    cursor: default;
  }
}

input {
  display: block;
  appearance: none;
  height: 36px;
  width: calc(100% - 36px);
  margin: -36px 0px 0px;
  outline: none;
  position: relative;
  transform: rotate(-90deg);
  transform-origin: left bottom;
  cursor: pointer;
  background: none;
  border-radius: 36px 0px 0px 36px;
  pointer-events: all;
}

input::-moz-range-thumb {
  border: none;
  box-shadow: -4px 0px 4px rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: ns-resize;
  background-color: #ffffff;
  background-image: url("@/assets/icons/zoom.svg");
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 50%;
  transform: matrix(-1, 0, 0, -1, 0, 0);
}

input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;

  border: none;
  box-shadow: 4px 0px 10px rgba(0, 0, 0, 0.25);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  cursor: ns-resize;
  background-image: url("@/assets/icons/zoom.svg");
  background-color: #ffffff;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 50%;
  transform: matrix(-1, 0, 0, -1, 0, 0);
}
</style>