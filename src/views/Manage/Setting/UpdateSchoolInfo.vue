<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="false"
      @close="dialogConfig.show = false"
      width="400px"
    >
      <el-form ref="formDataRef" :model="formData" label-width="70px" :rules="rules">
        <el-form-item  label="学校名" prop="ch_name">
          <el-input
            clearable
            placeholder="请输入学校中文名"
            v-model="formData.ch_name"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="英文名" prop="en_name">
          <el-input
            clearable
            placeholder="请输入学校英文名"
            v-model="formData.en_name"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="经度" prop="longitude">
          <el-input
            clearable
            placeholder="请输入学校经度(可不填)"
            v-model="formData.longitude"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input
            clearable
            placeholder="请输入学校纬度(可不填)"
            v-model="formData.latitude"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const dialogConfig = reactive({
  show: false,
  title: "学校信息",
  buttons: [
    {
      text: "保存",
      click: (e) => {
        updateInfo();
      },
    },
  ],
});
const rules = {
  ch_name: [{ required: true, message: "请输入中文名" }],
  en_name: [{ required: true, message: "请输入英文名" }],
};
const api = {
  saveSchoolInfo: "/school/saveSchoolInfo",
};

const formData = ref({});
const formDataRef=ref();
const show = async (info) => {
  dialogConfig.show = true;
  formData.value = info;
};
defineExpose({ show });

const emit = defineEmits([]);
const updateInfo = async () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.saveSchoolInfo,
      showLoading: false,
      params: formData.value,
    });
    if (!result) {
      return;
    }
    dialogConfig.show = false;
    proxy.Message.success("修改成功");
    emit(["reload"]);
  });
};
</script>

<style lang="scss">
</style>