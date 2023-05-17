<template>
  <div class="image-viewer">
    <el-image-viewer
      :initial-index="previewImgIndex"
      :hide-on-click-modal="true"
      close-on-press-escape
      :url-list="imageList"
      @click="closeImgViewer"
      v-if="previewImgIndex != null"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import { ref } from "vue";
const props = defineProps({
  imageList: {
    type: Array,
  },
});
const previewImgIndex = ref(null);
const show = (index) => {
  stopScroll();
  previewImgIndex.value = index;
};
const closeImgViewer = () => {
  startScroll();
  previewImgIndex.value = null;
};
const stopScroll = () => {
  document.body.style.overflow = "hidden";
};
const startScroll = () => {
  document.body.style.overflow = "auto";
};
defineExpose({ show });
</script>

<style lang="scss">
</style>