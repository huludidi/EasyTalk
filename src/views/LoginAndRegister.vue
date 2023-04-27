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
      <el-form :model="formData" :rules="rules" ref="formDataRef">
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
                @click="sendEmailCode"
                class="send-email-btn"
                type="primary"
                size="large"
                >获取验证码</el-button
              >
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
import { nextTick, reactive, ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();
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

    if(onType.value==1){
      const cookieLoginInfo=proxy.VueCookies.get("loginInfo");
      if(cookieLoginInfo){
        formData.value=cookieLoginInfo;
      }
    }
  });
};

const api = {
  login: "/user/login",
  register: "/user/register",
  captcha: "/user/captcha/email",
  resetPwd: "/resetPwd",
};
// 发送邮箱验证码
const sendEmailCode = () => {
  formDataRef.value.validateField("email", (valid) => {
    if (!valid) {
      return;
    }
    //
    console.log("发送验证码");
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
    if (onType.value == 0) {
      params.password = formData.value.registerPassword;
      url = api.register;
    } else if (onType.value == 1) {
      url = api.login;
      let cookieLoginInfo = proxy.VueCookies.get("loginInfo");
      let cookiePassword =
        cookieLoginInfo == null ? null : cookieLoginInfo.passwod;
        if(params.password!=cookiePassword){
          params.password=md5(params.password)
        }
    } else if (onType.value == 2) {
      url = api.resetPwd;
    }
    let result = await proxy.Request({
      url: url,
      params: params,
    });
    if (!result) {
      return;
    }
    // 注册返回
    if (onType.value == 0) {
      proxy.Message.success("注册成功");
      showPanel(1);
    } else if (onType.value == 1) {
      // 登录
      if (params.remeberMe) {
        const loginInfo = {
          email: params.email,
          passwod: params.password,
          remeberMe: params.remeberMe,
        };
        proxy.VueCookies.set("loginInfo", loginInfo, "7d");
      } else {
        proxy.VueCookies.remove("loginInfo");
      }
    } else if (onType.value == 2) {
    }
  });
};
</script>

<style lang="scss" scoped>
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