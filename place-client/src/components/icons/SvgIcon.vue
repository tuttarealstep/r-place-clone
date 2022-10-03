<script lang="ts" setup>
import { defineAsyncComponent } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
});

const asyncComponent = defineAsyncComponent(() =>
  import(`./${props.name}.svg.vue`/* @vite-ignore */)
)
</script>

<template>
  <component :is="asyncComponent" />
</template>