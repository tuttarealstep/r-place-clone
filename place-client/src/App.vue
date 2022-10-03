<script setup lang="ts">
import Game from "./components/Game.vue";
</script>

<template>
  <Game />
</template>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+Mono:wght@300;400;500;700&display=swap");

html,
body {
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  overflow: hidden;
  background-color: #333;
  font-family: "Noto Sans Mono", monospace;
  letter-spacing: -0.5px;
  touch-action: none;
  display: block;
}

.pill {
  width: 155px;
  height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  color: #000;
  border-radius: 26px;
  font-size: 14px;
  font-weight: 700;
  line-height: 17px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.25);
}

.icon-button {
  .icon-button-icon {
    display: inline-flex;

    &.icon-search {
      transform: matrix(-1, 0, 0, 1, 0, 0);
    }

    svg {
      height: 1em;
    }
  }

  button {
    background: 0px 0px;
    cursor: pointer;
    border: none;
    margin: 0px;
    pointer-events: all;
    border-radius: 50%;
    padding: 8px;

    .icon-button-layout {
      background-color: rgb(255, 255, 255);
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      height: 36px;
      width: 36px;
      box-shadow: rgb(0 0 0 / 25%) 0px 4px 10px;
      color: rgb(0, 0, 0);
      font-size: 20px;
      pointer-events: all;
    }
  }
}
</style>
