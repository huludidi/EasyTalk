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
              v-model="formData.markdown_content"
              v-if="editorType == 1"
              @htmlContent="setHtmlContent"
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
            <el-form-item prop="summary" label="摘要">
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
            <el-form-item prop="attachment" label="附件">
              <AttachmentSelector
                v-model="formData.attachment"
              ></AttachmentSelector>
            </el-form-item>
            <!-- 保存按钮 -->
            <el-form-item prop="" label="">
              <v-btn
                color="rgb(50, 133, 255)"
                :style="{ width: '100%', color: '#fff' }"
                @click="postHandler"
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
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
} from "vue";
import { ElMessageBox } from "element-plus";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  loadBoard: "/forum/loadBoard4Post",
  postArticle: "/forum/postArticle",
  updateArticle: "/forum/updateArticle",
  articleDetail4Update: "/forum/articleDetail4Update",
};
const markdownHeight = window.innerHeight - 210;
const htmlEditorHeight = window.innerHeight - 209;

const formData = ref({});
const formDataRef = ref();

const checkBoard = (rule, value, callback) => {
  if (value == null || value.length < 2) {
    callback(new Error("请选择二级板块"));
  } else {
    callback();
  }
};
const rules = {
  title: [
    { required: true, message: "请输入标题" },
    { max: 150, message: "标题过长" },
  ],
  boardIds: [{ required: true, message: "请选择板块", validator: checkBoard }],
  summary: [{ required: true, message: "请输入文章摘要" }],
  content: [{ required: true, message: "请输入正文" }],
};

// 提交信息
const postHandler = () => {
  formDataRef.value.validate(async (valid) => {
    if (!valid) {
      return;
    }
    let params = {};
    Object.assign(params, formData.value);
    // 设置板块id
    params.p_board_id = params.boardIds[0];
    params.board_id = params.boardIds[1];
    delete params.boardIds;
    // 设置编辑器类型
    params.editor_type = editorType.value;
    // 获取内容
    const contentText = params.content.replace(/<(?!img).*?>/g, "");
    if (contentText == "") {
      proxy.Message.warning("正文不能为空");
    }
    if (params.attachment != null) {
      params.attachment_type = 1;
    } else {
      params.attachment_type = 0;
    }
    // 封面判断
    if (!params.cover instanceof File) {
      delete params.cover;
    }
    // 附件类型判断
    if (!params.attachment instanceof File) {
      delete params.attachment;
    }
    let result = await proxy.Request({
      url: params.article_id ? api.updateArticle : api.postArticle,
      params: params,
    });
    if (!result) {
      return;
    }
    if (!result.data.audit) {
      proxy.Message.error("此文章审核不通过，请注意内容及封面的合法性");
    } else {
      proxy.Message.success("保存成功");
    }
    router.push(`/post/${result.data.article_id}`);
  });
};

// 板块信息
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
// 编辑器类型 0：：富文本 1：markdown
const editorType = ref(null);
const changeEditor = () => {
  proxy.Confirm("切换编辑器会清空正在编辑的内容，确定要切换吗？", () => {
    editorType.value = editorType.value == 0 ? 1 : 0;
    formData.value.content = "";
    formData.value.markdownContent = "";
    proxy.VueCookies.set("editorType", editorType.value, -1);
  });
};

// 判断新增/修改,获取信息
const articleId = ref(null);
const getArticleDetail = () => {
  nextTick(async () => {
    formDataRef.value.resetFields();
    if (articleId.value) {
      // 修改
      let result = await proxy.Request({
        url: api.articleDetail4Update,
        showLoading: false,
        params: {
          articleId: articleId.value,
        },
        showError: false,
        errorCallback: (response) => {
          ElMessageBox.alert(response.error, "错误", {
            "show-close": false,
            callback: (action) => {
              router.go(-1);
            },
          });
        },
      });
      if (!result) {
        return;
      }
      let articleInfo = result.data.forumArticle;
      // 设置编辑器
      editorType.value = articleInfo.editor_type;
      formData.value = articleInfo;
      // 板块信息
      articleInfo.boardIds = [];
      articleInfo.boardIds.push(articleInfo.p_board_id);
      articleInfo.boardIds.push(articleInfo.board_id);
      // 封面信息
      if (articleInfo.cover) {
        articleInfo.cover = {
          imageUrl: articleInfo.cover,
        };
      }
      // 附件
      if (articleInfo.attachment_type) {
        articleInfo.attachment = {
          name: result.data.attachment.file_name,
        };
      }
    } else {
      // 新增
      formData.value = {};
      editorType.value = proxy.VueCookies.get("editorType") || 0;
    }
  });
};
watch(
  () => route,
  (newVal, oldVal) => {
    if (
      newVal.path.indexOf("/editPost") != -1 ||
      newVal.path.indexOf("/newPost") != -1
    ) {
      articleId.value = newVal.params.articleId;
      getArticleDetail();
    }
  },
  { immediate: true, deep: true }
);

const setHtmlContent = (HTMLContent) => {
  formData.value.content = HTMLContent;
};
</script>

<style lang="scss" >
.edit-post {
  .post-panel {
    display: flex;
    .el-card__header {
      padding: 5px 10px 5px 10px;
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