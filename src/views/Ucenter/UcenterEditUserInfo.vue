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
        <span v-if="formData.schoolEmail"
          >{{ formData.schoolEmail }}
          <span class="iconfont icon-edit a-link btn-edit" @click="cencelbind">解绑</span>
        </span>
        <span
          v-else
          class="iconfont icon-edit a-link btn-edit"
          @click="showBindEmail"
          >去绑定</span
        >
      </el-form-item>
      <el-form-item label="简介" prop="personDescription">
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

  <Dialog
    top="30px"
    :show="dialogConfigBindEmail.show"
    :title="dialogConfigBindEmail.title"
    :buttons="dialogConfigBindEmail.buttons"
    :showCancel="false"
    @close="dialogConfigBindEmail.show = false"
    width="400px"
  >
    <el-form
      :model="emailformData"
      :rules="emailRules"
      ref="emailformDataRef"
      label-width="65px"
    >
      <el-form-item prop="schoolEmail" label="邮箱">
        <el-input
          size="large"
          placeholder="请输入邮箱"
          v-model="emailformData.schoolEmail"
        >
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="emailCode" label="验证码">
        <div class="send-email-panel">
          <el-input
            size="large"
            clearable
            placeholder="请输入邮箱验证码"
            v-model="emailformData.emailCode"
          >
            <template #prefix>
              <span class="iconfont icon-checkcode"> </span>
            </template>
          </el-input>
          <el-button
            @click="sendEmailCode(3)"
            class="send-email-btn"
            type="primary"
            size="large"
            :disabled="isBtnDisable"
          >
            {{ isBtnDisable ? `重新发送(${countdown}s)` : "获取验证码" }}
          </el-button>
        </div>
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
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const api = {
  updateUserInfo: "/ucenter/updateUserInfo",
  getSchoolInfo: "/school/getSchoolInfo",
  sendEmailCode: "/sendEmailCode",
  bindSchoolEmail: "/ucenter/bindSchoolEmail",
  cencelBindSchoolEmail:"/ucenter/cencelBindSchoolEmail"
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
  personDescription:[{required:true,message:"请输入点内容，让别人认识你"}]
};
const emailRules = {
  schoolEmail: [
    { required: true, message: "请输入学校邮箱" },
    { max: 100, message: "邮箱过长" },
    { validator: proxy.Verify.schoolEmail, message: "请输入教育邮箱" },
  ],
  emailCode: [{ required: true, message: "请输入验证码" }],
};

const formData = ref({});
const formDataRef = ref();

// 自动补全输入框
interface RestaurantItem {
  value: string;
}
const restaurants = ref<RestaurantItem[]>([]);
const querySearch = (queryString: string, cb: (arg: any) => void) => {
  let timeout: NodeJS.Timeout;
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value;
  clearTimeout(timeout);
  timeout = setTimeout(() => {
    cb(results);
  }, 3000 * Math.random());
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
      params: {
        pageNo: 1,
        pageSize: 10000,
      },
    });
    if (!result || !result.data || result.data.length === 0) {
      return [];
    }
    const info = result.data.list.map((element: any) => ({
      value: element.ch_name,
    }));
    return info;
  } catch (error) {
    return [];
  }
};
onMounted(async () => {
  const info = await loadSchoolInfo();
  restaurants.value = info;
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
    store.commit("updateloginUserInfo", result.data);
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

// 解绑
const cencelbind=()=>{
   proxy.Confirm("确定要解绑邮箱吗？", async () => {
    let result = await proxy.Request({
      url: api.cencelBindSchoolEmail,
    });
    if (!result) {
      return;
    }
    formData.value.schoolEmail=null;
    store.commit("updateloginUserInfo",result.data);
    proxy.Message.success("解绑成功");
  });
}

// 绑定邮箱弹窗
const emailformData = ref({});
const emailformDataRef = ref();
const dialogConfigBindEmail = reactive({
  show: false,
  title: "绑定学校邮箱",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        bindEmailHandler();
      },
    },
  ],
});
// 显示弹窗
const showBindEmail = () => {
  dialogConfigBindEmail.show = true;
};
// 发送验证码
const isBtnDisable = ref(false);
const countdown = ref(0);
const sendEmailCode = (type) => {
  emailformDataRef.value.validateField("schoolEmail", async (valid) => {
    if (!valid) {
      return;
    }
    isBtnDisable.value = true;

    // 设置倒计时为 60 秒
    countdown.value = 60;

    // 定时器，每秒更新一次 countdown，直到倒计时结束
    let timer = setInterval(() => {
      if (countdown.value > 0) {
        countdown.value--;
      } else {
        // 倒计时结束，启用按钮
        isBtnDisable.value = false;
        clearInterval(timer);
      }
    }, 1000);
    //
    const params = Object.assign(
      {},
      { email: emailformData.value.schoolEmail, type: type }
    );
    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      showLoading: false,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("验证码发送成功，请登录邮箱查看");
  });
};
const bindEmailHandler = () => {
  emailformDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let result = await proxy.Request({
      url: api.bindSchoolEmail,
      showLoading: false,
      params: {
        schoolEmail: emailformData.value.schoolEmail,
        emailCode: emailformData.value.emailCode,
      },
    });
    if (!result) {
      return;
    }
    formData.value.schoolEmail = emailformData.value.schoolEmail;
    proxy.Message.success("邮箱绑定成功");
    dialogConfigBindEmail.show = false;
    store.commit("updateloginUserInfo", result.data);
  });
};
</script>

<style lang="scss">
.send-email-panel {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .send-email-btn {
    margin-left: 5px;
  }
}
</style>