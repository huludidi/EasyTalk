<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :rules="rules"
      width="400px"
      :showCancel="false"
      @close="dialogConfig.show = false"
    >
      <el-form :model="formData" ref="formDataRef" label-width="50px">
        <el-form-item label="标题">
          {{ formData.title }}
        </el-form-item>
        <el-form-item label="板块" prop="borderIds" required>
          <el-cascader
            placeholder="请选择板块"
            :options="boardList"
            :props="boardProps"
            v-model="formData.boardIds"
            :style="{ width: '100%' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
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
const { proxy } = getCurrentInstance();

const formData = ref({});
const formDataRef = ref();
const rules = {
  boardIds: [{ required: true, message: "请选择板块" }],
};
const dialogConfig = reactive({
  show: false,
  title: "修改板块",
  buttons: [
    {
      type: "danger",
      text: "确定",
    },
  ],
});

const emit=defineEmits();
const submitForm=()=>{
    console.log("表单提交了");
    dialogConfig.show=false;
    emit("reload");
}

const updataBoard = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    data.boardIds = [];
    data.boardIds.push(data.pBoardId);
    if ((data.boardId != null) & (data.boardId != 0)) {
      data.boardIds.push(data.boardId);
    }
    formData.value = data;
  });
};
defineExpose({updataBoard})
</script>

<style>
</style>