<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="false"
      @close="closeDialog"
      width="400px"
    >
      <el-form
        class="login-register"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
      >
        <el-form-item prop="email">
          <el-input
            size="large"
            placeholder="请输入邮箱"
            v-model="formData.email"
          >
            <template #prefix>
              <span class="iconfont icon-account"></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 登录状态才有 -->
        <el-form-item prop="password" v-if="onType == 1">
          <el-input
            :type="passwordEyeType.passwordEye ? 'text' : 'password'"
            size="large"
            placeholder="请输入密码"
            v-model="formData.password"
          >
            <template #prefix>
              <span class="iconfont icon-password"></span>
            </template>
            <template #suffix>
              <span
                @click="eyeChange('passwordEye')"
                :class="[
                  'iconfont',
                  passwordEyeType.passwordEye ? 'icon-eye' : 'icon-close-eye',
                ]"
              ></span>
            </template>
          </el-input>
        </el-form-item>
        <!-- 注册才有 -->
        <div v-if="onType == 0 || onType == 2">
          <el-form-item prop="emailCode">
            <div class="send-email-panel">
              <el-input
                size="large"
                clearable
                placeholder="请输入邮箱验证码"
                v-model="formData.emailCode"
              >
                <template #prefix>
                  <span class="iconfont icon-checkcode"> </span>
                </template>
              </el-input>
              <el-button
                @click="sendEmailCode(onType)"
                class="send-email-btn"
                type="primary"
                size="large"
                :disabled="isBtnDisable"
              >
                {{ isBtnDisable ? `重新发送(${countdown}s)` : "获取验证码" }}
              </el-button>
            </div>
            <el-popover placement="left" :width="450" size="large">
              <div>
                <p>1.在垃圾箱中查找验证码</p>
                <p>2.在邮箱中头像>设置>反垃圾>白名单>设置邮箱地址白名单</p>
                <p>3.将邮箱：1398471354@qq.com添加到白名单</p>
              </div>
              <template #reference>
                <span class="a-link" :style="{ 'font-size': '14px' }"
                  >未收到邮箱验证码？</span
                >
              </template>
            </el-popover>
          </el-form-item>
          <el-form-item prop="nickName" v-if="onType == 0">
            <el-input
              size="large"
              clearable
              placeholder="请输入昵称"
              v-model="formData.nickName"
            >
              <template #prefix>
                <span class="iconfont icon-account"></span>
              </template>
            </el-input>
          </el-form-item>

          <el-form-item prop="registerPassword">
            <el-input
              :type="passwordEyeType.registerPasswordEye ? 'text' : 'password'"
              size="large"
              placeholder="请输入密码"
              v-model="formData.registerPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('registerPasswordEye')"
                  :class="[
                    'iconfont',
                    passwordEyeType.registerPasswordEye
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                ></span>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="confirmPassword">
            <el-input
              :type="passwordEyeType.confirmPasswordEye ? 'text' : 'password'"
              size="large"
              placeholder="请再次输入密码"
              v-model="formData.confirmPassword"
            >
              <template #prefix>
                <span class="iconfont icon-password"></span>
              </template>
              <template #suffix>
                <span
                  @click="eyeChange('confirmPasswordEye')"
                  :class="[
                    'iconfont',
                    passwordEyeType.confirmPasswordEye
                      ? 'icon-eye'
                      : 'icon-close-eye',
                  ]"
                ></span>
              </template>
            </el-input>
          </el-form-item>
        </div>
        <el-form-item prop="checkCode">
          <div class="check-code-panel">
            <el-input
              size="large"
              clearable
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              @keyup-enter="doSubmit"
            >
              <template #prefix>
                <span class="iconfont icon-checkcode"></span>
              </template>
            </el-input>
            <img
              :src="checkCodeUrl"
              class="check-code"
              @click="changeCheckCode"
            />
          </div>
        </el-form-item>
        <el-form-item v-if="onType == 1">
          <div class="remeberme-panel">
            <el-checkbox v-model="formData.remeberMe">记住我</el-checkbox>
          </div>
          <div class="no-account">
            <a class="a-link" href="javascript:void(0)" @click="showPanel(2)"
              >忘记密码？</a
            >
            <a class="a-link" href="javascript:void(0)" @click="showPanel(0)"
              >没有账号？</a
            >
          </div>
        </el-form-item>
        <el-form-item v-if="onType == 0">
          <a class="a-link" href="javascript:void(0)" @click="showPanel(1)"
            >已有帐号？</a
          >
        </el-form-item>
        <el-form-item v-if="onType == 2">
          <a class="a-link" href="javascript:void(0)" @click="showPanel(1)"
            >去登录？</a
          >
        </el-form-item>
        <el-form-item>
          <el-button class="op-btn" type="primary" @click="doSubmit">
            <span v-if="onType == 0">注册</span>
            <span v-if="onType == 1">登录</span>
            <span v-if="onType == 2">重置密码</span>
          </el-button>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import md5 from "js-md5";
import { useStore } from "vuex";
import { nextTick, reactive, ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
const store = useStore();

// 确认密码校验
const checkConfirmPassword = (rule, value, callback) => {
  if (value != formData.value.registerPassword) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const rules = {
  title: [{ required: true, message: "请输入内容" }],
  email: [
    { required: true, message: "请输入邮箱" },
    { max: 150, message: "邮箱过长" },
    { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
  ],
  password: [{ required: true, message: "请输入密码" }],
  emailCode: [{ required: true, message: "请输入邮箱验证码" }],
  nickName: [
    { required: true, message: "请输入昵称" },
    { max: 20, message: "昵称过长" },
  ],
  registerPassword: [
    { required: true, message: "请输入密码" },
    {
      validator: proxy.Verify.password,
      message: "密码只能是数字、大小写字母和特殊字符，8-18位",
    },
  ],
  confirmPassword: [
    { required: true, message: "请再次输入密码" },
    { validator: checkConfirmPassword, message: "两次输入的密码不一致" },
  ],
};

const dialogConfig = reactive({
  show: false,
  title: "标题",
});

// 密码眼睛显示隐藏操作
const passwordEyeType = reactive({
  passwordEye: false,
  registerPasswordEye: false,
  confirmPasswordEye: false,
});
const eyeChange = (type) => {
  passwordEyeType[type] = !passwordEyeType[type];
};

// 0:注册 1：登录 2：找回密码
const onType = ref();
const showPanel = (type) => {
  onType.value = type;
  resetForm();
};
defineExpose({ showPanel });

// 重置表单
const resetForm = () => {
  dialogConfig.show = true;
  if (onType.value == 0) {
    dialogConfig.title = "注册";
  } else if (onType.value == 1) {
    dialogConfig.title = "登录";
  } else if (onType.value == 2) {
    dialogConfig.title = "重置密码";
  }
  nextTick(() => {
    // elements自带重置表单
    formDataRef.value.resetFields();
    formData.value = {};
    changeCheckCode();
    if (onType.value == 1) {
      const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      if (cookieLoginInfo) {
        formData.value = cookieLoginInfo;
      }
    }
  });
};

const api = {
  login: "/login",
  register: "/register",
  captcha: "/user/captcha/email",
  resetPwd: "/resetPwd",
  checkCode: "/api/checkCode",
  sendEmailCode: "/sendEmailCode",
};

// 验证码
const checkCodeUrl = ref(api.checkCode);
const changeCheckCode = () => {
  checkCodeUrl.value = api.checkCode + "?time=" + new Date().getTime();
};
// 发送邮箱验证码
const isBtnDisable = ref(false);
const countdown = ref(0);
const sendEmailCode = (type) => {
  formDataRef.value.validateField("email", async (valid) => {
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
      { email: formData.value.email, type: type }
    );

    let result = await proxy.Request({
      url: api.sendEmailCode,
      params: params,
      errorCallback: () => {
        changeCheckCode();
      },
      showLoading:false
    });
    if (!result) {
      return;
    }
    proxy.Message.success("验证码发送成功，请登录邮箱查看");
  });
};

// 登录、注册、重置密码 提交表单
const doSubmit = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    let url = null;
    // 注册
    if (onType.value == 0) {
      params.password = formData.value.registerPassword;
      url = api.register;
    }
    // 登录
    else if (onType.value == 1) {
      url = api.login;
      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword =
        cookieLoginInfo == null ? null : cookieLoginInfo.passwod;
      if (params.password != cookiePassword) {
        params.password = params.password;
      }
    }
    // 重置密码
    else if (onType.value == 2) {
      url = api.resetPwd;
      params.password = formData.value.confirmPassword;
    }
    // 发送请求
    let result = await proxy.Request({
      url: url,
      params: params,
      errorCallback: () => {
        changeCheckCode();
      },
    });
    if (!result) {
      return;
    }

    // 注册返回
    if (onType.value == 0) {
      proxy.Message.success("注册成功");
      showPanel(1);
    } else if (onType.value == 1) {
      // 登录返回
      if (params.remeberMe) {
        const loginInfo = {
          email: params.email,
          password: params.password,
          remeberMe: params.remeberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
      dialogConfig.show = false;
      proxy.Message.success("登录成功");
      store.commit("updateloginUserInfo", result.data);
    } else if (onType.value == 2) {
      proxy.Message.success("重置密码成功，请重新登录");
      showPanel(1);
    }
  });
};

const closeDialog = () => {
  dialogConfig.show = false;
  store.commit("showLogin", false);
};
</script>

<style lang="scss" scoped>
.login-register {
  .check-code-panel {
    display: flex;
    .check-code {
      height: 42px;
      width: 150px;
      margin-left: 5px;
      cursor: pointer;
    }
  }
}
.send-email-panel {
  display: flex;
  width: 100%;
  justify-content: space-between;
  .send-email-btn {
    margin-left: 5px;
  }
}
.remeberme-panel {
  width: 100%;
}
.no-account {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.op-btn {
  width: 100%;
}
</style>