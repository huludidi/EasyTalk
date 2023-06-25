<template>
  <Dialog
    top="30px"
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="false"
    @close="dialogConfig.show = false"
    width="400px"
  >
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="60px"
    >
      <el-form-item label="验证码" prop="emailCode">
        <el-input size="large"> </el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const dialogConfig = reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
      },
    },
  ],
});
</script>

<style lang="scss">
</style>