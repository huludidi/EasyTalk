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
      <el-form-item label="昵称" prop="nickName">
        <el-input size="large" v-model="formData.nickName"> </el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <CoverUpload
          :imageUrlPrefix="proxy.globalInfo.avatarUrl"
          v-model="formData.avatar"
        ></CoverUpload>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="1">男</el-radio>
          <el-radio :label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学校" prop="school">
        <el-autocomplete
          v-model="formData.school"
          :fetch-suggestions="querySearch"
          :trigger-on-focus="false"
          clearable
          class="inline-input w-50"
          placeholder="请输入学校"
        />
      </el-form-item>
      <el-form-item label="邮箱" prop="schoolEmail">
        <el-input
          v-model="formData.schoolEmail"
          size="large"
          placeholder="请输入您在学校的邮箱"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="简介" prop="persondescription">
        <el-input
          clearable
          placeholder="请输入简介，让别人认识你！"
          type="textarea"
          :row="5"
          :maxlength="100"
          resize="none"
          show-word-limit
          v-model="formData.personDescription"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
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
const api = {
  updateUserInfo: "/ucenter/updateUserInfo",
  getSchoolInfo: "/school/getSchoolInfo",
};
const checkBoard = (rule, value, callback) => {
  if (value == null || value.length < 2) {
    callback(new Error("请选择二级板块"));
  } else {
    callback();
  }
};
const rules = {
  nickName: [
    { required: true, message: "请输入昵称" },
    { max: 15, message: "昵称过长" },
  ],
  school: [{ required: true, message: "请选择学校" }],
  schoolEmail: [
    { required: true, message: "请输入学校邮箱" },
    { max: 100, message: "邮箱过长" },
    { validator: proxy.Verify.schoolEmail, message: "请输入教育邮箱" },
  ],
};

const formData = ref({});
const formDataRef = ref();

// 自动补全输入框
interface RestaurantItem {
  value: string;
}
const restaurants = ref<RestaurantItem[]>([]);

const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  // call callback function to return suggestions
  cb(results);
};

const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    );
  };
};

const loadSchoolInfo = async () => {
  try {
    const result = await proxy.Request({
      url: api.getSchoolInfo,
      showLoading: false,
    });
    if (!result || !result.data || result.data.length === 0) {
      console.error("Error: No data found.");
      return [];
    }
    const info = result.data.map((element: any) => ({
      value: element.ch_name,
    }));
    return info;
  } catch (error) {
    console.error(error);
    return [];
  }
};

onMounted(async () => {
  restaurants.value = await loadSchoolInfo();
});

const dialogConfig = reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        updateUserInfoHandler();
      },
    },
  ],
});
// 修改信息
const emit = defineEmits(["resetUserInfo"]);
const updateUserInfoHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let result = await proxy.Request({
      url: api.updateUserInfo,
      shwoLoading: false,
      params,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("修改成功");
    dialogConfig.show = false;
    if (params.avatar instanceof File) {
      router.go(0);
    } else {
      emit("resetUserInfo", params);
    }
  });
};

const showEditUserInfoDialog = (userInfo) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    const dataInfo = JSON.parse(JSON.stringify(userInfo));
    dataInfo.avatar = {
      imageUrl: dataInfo.userId,
    };
    formData.value = dataInfo;
  });
};
defineExpose({ showEditUserInfoDialog });
</script>

<style>
</style>