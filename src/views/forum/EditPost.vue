<template>
  <div class="edit-post">
    <el-form
      :model="formData"
      :rules="rules"
      ref="formDataRef"
      label-width="60px"
      class="post-panel"
    >
      <div class="post-editor">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <div class="post-editor-title">
              <span>正文</span>
              <div class="change-editor-type" @click="changeEditor">
                <v-icon icon="mdi-swap-horizontal"></v-icon>
                <span
                  >切换为{{
                    editorType == 0 ? "markdown编辑器" : "富文本编辑器"
                  }}</span
                >
              </div>
            </div>
          </template>
          <el-form-item prop="content" label-width="0px">
            <EditorHtml
              :height="htmlEditorHeight"
              v-model="formData.content"
              v-if="editorType == 0"
            ></EditorHtml>
            <EditorMarkdown
              :height="markdownHeight"
               v-model="formData.markdownContent"
              v-if="editorType == 1"
            ></EditorMarkdown>
          </el-form-item>
        </el-card>
      </div>

      <div class="post-setting">
        <el-card :body-style="{ padding: '5px' }">
          <template #header>
            <span>设置</span>
          </template>
          <div class="setting-inner">
            <el-form-item prop="title" label="标题">
              <el-input
                clearable
                placeholder="提示信息"
                v-model="formData.title"
              >
              </el-input>
            </el-form-item>
            <el-form-item prop="boardIds" label="板块">
              <el-cascader
                placeholder="请选择板块"
                :options="boardList"
                :props="boardProps"
                clearable
                v-model="formData.boardIds"
                :style="{ width: '100%' }"
              ></el-cascader>
            </el-form-item>
            <!-- 封面 -->
            <el-form-item prop="cover" label="封面">
             <CoverUpload v-model="formData.cover"></CoverUpload>
            </el-form-item>
            <!-- 摘要 -->
            <el-form-item prop="" label="摘要">
              <el-input
                clearable
                placeholder="提示信息"
                type="textarea"
                :rows="5"
                :maxlength="150"
                resize="none"
                show-word-limit
                v-model="formData.summary"
              >
              </el-input>
            </el-form-item>
            <!-- 附件 -->
            <el-form-item prop="" label="附件">
              <AttachmentSelector
                v-model="formData.attachment"
              ></AttachmentSelector>
            </el-form-item>
            <!-- 保存按钮 -->
            <el-form-item prop="" label="">
              <v-btn
                color="rgb(50, 133, 255)"
                :style="{ width: '100%', color: '#fff' }"
                >保存</v-btn
              >
            </el-form-item>
          </div>
        </el-card>
      </div>
    </el-form>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const markdownHeight = window.innerHeight - 122;
const htmlEditorHeight = window.innerHeight - 202;

const formData = ref({});
const formDataRef = ref();

// 编辑器类型 0：：富文本 1：markdown
const editorType = ref(0);
const changeEditor = () => {
  proxy.Confirm("切换编辑器会清空正在编辑的内容，确定要切换吗？", () => {
    editorType.value = editorType.value == 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value, -1);
  });
};
</script>

<style lang="scss" scoped>
.edit-post {
  .post-panel {
    display: flex;
    .el-card__header {
      padding: 10px;
    }
    .post-editor {
      flex: 1;
      .post-editor-title {
        display: flex;
        justify-content: space-between;
        .change-editor-type {
          display: flex;
          align-items: flex-end;
          cursor: pointer;
          color: rgb(50, 133, 255);
          font-size: 14px;
        }
      }
    }
    .post-setting {
      margin-left: 10px;
      width: 450px;
      .setting-inner {
        max-height: calc(100vh - 100px);
        overflow: auto;
      }
    }
  }
}
</style>