<template>
  <div class="image-view">
    <el-image-viewer
      :initial-index="previewImgIndex"
      hide-on-click-modal
      url-list="imageList"
      @click="closeImgViewer"
      v-if="previewImgIndex!=null"
    >
    </el-image-viewer>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
const props=defineProps({
    imageList:{
        type:Array,
    }
})
const previewImgIndex = ref(null);
const show=(index)=>{
    previewImgIndex.value=index;
}
defineExpose({show});

const closeImgViewer = ()=>{

}
</script>

<style>
</style>