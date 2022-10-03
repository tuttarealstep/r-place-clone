
<script lang="ts">
import { ref } from "vue";

const x = ref(0);
const y = ref(0);
const zoom = ref(1);
export default {
  props: {
    x: {
      Number,
      default: 0
    },
    y: {
      Number,
      default: 0
    },
    zoom: {
      String,
      default: "1"
    }
  },
  setup() {},
};
</script>

<template>
  <div class="map-coordinates">({{ x }},{{ y }}) {{ zoom }}x</div>
</template>

<style lang="scss" scoped>
.map-coordinates {
  display: flex;
  min-width: 155px;
  height: 24px;
  justify-content: center;
  align-items: center;
  align-self: center;
  background-color: rgb(255, 255, 255);
  color: rgb(0, 0, 0);
  border-radius: 26px;
  font-weight: 700;
  font-size: 14px;
  line-height: 17px;
  box-shadow: rgb(0 0 0 / 25%) 0px 4px 10px;
}
</style>