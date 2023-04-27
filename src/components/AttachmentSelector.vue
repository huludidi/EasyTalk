<template>
  <div class="attachment-selector">
    <template v-if="modelValue">
      <div class="file-name" :title="modelValue.name">
        {{ modelValue.name }}
      </div>
      <div class="iconfont icon-del"></div>
    </template>
    <el-upload
      v-else
      name="file"
      :show-file-list="false"
      accept=".zip,.rar"
      :multiple="false"
      :http-request="selectFile"
    >
      <v-btn color="rgb(50, 133, 255)" :style="{ color: '#fff' }"
        >选择文件</v-btn
      >
    </el-upload>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();

const props=defineProps({
  modelValue:{
    type:Object,
    default:null,
  },
});

const emit = defineEmits();
const selectFile = async (file) => {
  emit('update:modelValue', file.file);
};
const delFile = () => {
  emit("update:modelValue", null);
};
</script>

<style lang="scss" scoped>
.attachment-selector{
    display: flex;
    .iconfont{
        margin-left: 5px;
    }
}
</style>