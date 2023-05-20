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
      <el-form
        :rules="rules"
        :model="formData"
        ref="formDataRef"
        label-width="50px"
      >
        <el-form-item label="标题">
          {{ formData.title }}
        </el-form-item>
        <el-form-item label="板块" prop="boardIds" required>
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
// import { pa } from "element-plus/es/locale";
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
} from "vue";
const { proxy } = getCurrentInstance();
const checkBoard = (rule, value, callback) => {
  if (value == null || value.length < 2) {
    callback(new Error("请选择二级板块"));
  } else {
    callback();
  }
};
const rules = {
  boardIds: [{ required: true, message: "请选择板块", validator: checkBoard }],
};
const dialogConfig = reactive({
  show: false,
  title: "修改板块",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click:(e)=>{
        submitForm();
      }
    },
  ],
});
const api = {
  loadBoard: "/board/loadBoard",
  updateBoard: "/manageForum/updateBoard",
};

const formData = ref({});
const formDataRef = ref();

// 加载选择框板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "board_id",
  label: "board_name",
};
const boardList = ref([]);
const loadBoardList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoardList();

const emit = defineEmits();
const submitForm = async () => {
  let params = {
    articleId: formData.value.article_id,
    pBoardId: formData.value.boardIds[0],
    boardId: formData.value.boardIds[1],
  };
  let result = await proxy.Request({
    url: api.updateBoard,
    showLoading: false,
    params: params,
  });
  if (!result) {
    return;
  }
  dialogConfig.show = false;
  emit("reload");
};
const updataBoard = (data) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    data.boardIds = [];
    data.boardIds.push(data.p_board_id);
    if ((data.board_id != null) & (data.board_id != 0)) {
      data.boardIds.push(data.board_id);
    }
    formData.value = data;
  });
};
defineExpose({ updataBoard });
</script>

<style>
</style>