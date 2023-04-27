<template>
  <div style="height:635px">
    <el-scrollbar>
      <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="150px"
        :style="{ width: '800px' }"
      >
        <el-divider content-position="left">用户注册欢迎消息</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="欢迎消息" prop="registerWelcomInfo">
              <el-input
                v-model="formData.registerWelcomInfo"
                placeholder="请输入注册欢迎消息"
                maxlength="250"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">邮箱设置</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="邮箱标题" prop="emailTitle">
              <el-input
                v-model="formData.emailTitle"
                placeholder="请输入邮件标题"
                maxlength="200"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="邮件内容" prop="emailContent">
              <el-input
                v-model="formData.emailContent"
                placeholder="请输入邮件内容，验证码使用%s占位符"
                maxlength="300"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">审核设置</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="帖子是否需要审核" prop="postAudit">
              <el-radio-group v-model="formData.postAudit">
                <el-radio :label="false">无需审核</el-radio>
                <el-radio :label="true">需要审核</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="评论是否需要审核" prop="commentAudit">
              <el-radio-group v-model="formData.commentAudit">
                <el-radio :label="false">无需审核</el-radio>
                <el-radio :label="true">需要审核</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">发帖设置</el-divider>
        <el-row>
          <el-col :span="12">
            <el-form-item label="每天可发帖数量" prop="postDayCountThreshold">
              <el-input
                v-model="formData.postDayCountThreshold"
                placeholder="请输入每天可发帖数量"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="每天可上传图片数量" prop="dayImageUploadCount">
              <el-input
                v-model="formData.dayImageUploadCount"
                placeholder="请输入每天可上传图片数量"
              ></el-input>
            </el-form-item>
            <el-form-item label="允许附件大小（MB）" prop="attachmentSize">
              <el-input
                v-model="formData.attachmentSize"
                placeholder="请输入附件允许最大大小"
              >
                <template #append>MB</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-divider content-position="left">评论设置</el-divider>
        <el-row>
          <el-col :span="24">
            <el-form-item label="是否开启评论" prop="commentOpen">
              <el-fadio-group v-model="formData.commentOpen">
                <el-radio :label="true">开启</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-fadio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              label="每天可发评论数量"
              prop="commentDayCountThreshold"
            >
              <el-input
                v-model="formData.commentDayCountThreshold"
                placeholder="请输入每天可发评论数量"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="saveSetting">保存</el-button>
        </el-form-item>
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
const { proxy } = getCurrentInstance();

const rules = {
  registerWelcomInfo: [{ required: true, message: "请输入欢迎消息" }],
  emailTitle: [{ required: true, message: "请输入邮件标题" }],
  emailContent: [{ required: true, message: "请输入邮件内容" }],
  postAudit: [{ required: true, message: "请选择帖子是否需要审核" }],
  commentAudit: [{ required: true, message: "请选择评论是否需要审核" }],
  postDayCountThreshold: [
    { required: true, message: "请输入每天可发帖数量" },
    { validator: proxy.Verify.number, message: "请输入正确的数字" },
  ],
  dayImageUploadCount: [
    { required: true, message: "请输入每天可上传图片数量" },
    { validator: proxy.Verify.number, message: "请输入正确的数字" },
  ],
  attachmentSize: [
    { required: true, message: "请输入允许的附件大小" },
    { validator: proxy.Verify.number, message: "请输入正确的数字" },
  ],
  commentOpen: [{ required: true, message: "请选择是否开启评论" }],
  commentDayCountThreshold: [
    { required: true, message: "请输入每天可发评论数量" },
    { validator: proxy.Verify.number, message: "请输入正确的数字" },
  ],
};

const formData = ref({});
</script>
 
<style lang="scss">
</style>