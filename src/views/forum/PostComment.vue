<template>
  <div class="post-comment-panel">
    <v-avatar :style="{ background: '#f0f0f0' }">
      <v-img v-if="userId" :src="proxy.globalInfo.avatarUrl + userId"></v-img>
      <div v-else class="no-login">未登录</div>
    </v-avatar>
    <div class="comment-form">
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="content">
          <el-input
            clearable
            v-model="formData.content"
            :maxlength="800"
            show-word-limit
            resize="none"
            type="textarea"
            :placeholder="placeholderInfo"
          />
          <div class="insert-img" v-if="true">
            <div class="pre-img" v-if="commentImg">
              <CommentImage :src="commentImg"></CommentImage>
              <span
                class="iconfont icon-remove"
                @click="removeCommentImg"
              ></span>
            </div>
            <el-upload
              v-else
              name="file"
              :show-file-list="false"
              accept=".png,.PNG,.jpg,.JPG,.jpeg,.JPEG,.gif,.GIF,.bmp,.BMP"
              :multiple="false"
              :http-request="selectImg"
            >
              <v-icon icon="mdi-image-area" size="large"></v-icon>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="send-btn">
      <v-btn
        color="rgb(50, 133, 255)"
        variant="tonal"
        :style="{ height: '40px' }"
        @click="postCommentDo"
        >发表</v-btn
      >
    </div>
  </div>
</template>

<script setup>
import {ElMessageBox} from "element-plus"
import CommentImage from "./CommentImage.vue";
import { ref, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();
const api = {
  postComment: "/comment/postComment",
};
const props = defineProps({
  userId: {
    type: String,
  },
  showInsertImg: {
    type: Boolean,
  },
  placeholderInfo: {
    type: String,
    default: "请文明发言，做一个棒棒的留学生哦~",
  },
  articleId: {
    type: String,
  },
  pCommentId: {
    type: String,
  },
  replyUserId: {
    type: String,
  },
});

// form信息
const checkPostComment = (rule, value, callback) => {
  if (value == null && formData.value.image == null) {
    callback(new Error(rule.message));
  } else {
    callback();
  }
};
const formData = ref({});
const formDataRef = ref();
const rules = {
  content: [
    { required: true, message: "我还是空的呢~", validator: checkPostComment },
    { min: 3, message: "请多敲点字再发布吧~" },
  ],
};
const emit = defineEmits(["postCommentFinish"]);

//发布评论
const postCommentDo = () => {
  formDataRef.value.validate(async (valid) => {
    if (!props.userId) {
      store.commit("showLogin", true);
      return;
    } else {
      if (!store.getters.getLoginUserInfo.school) {
        ElMessageBox.alert("请先绑定学校", "提示", {
          "show-close": false,
          callback: (action) => {
            router.go(-1);
          },
        });
      }
    }
    if (!valid) {
      return;
    }
    let params = Object.assign({}, formData.value);
    params.articleId = props.articleId;
    params.pCommentId = props.pCommentId;
    params.replyUserId = props.replyUserId;
    let result = await proxy.Request({
      url: api.postComment,
      params: params,
      showLoading: false,
    });
    if (!result) {
      return;
    }
    proxy.Message.success("评论发表成功");
    formDataRef.value.resetFields();
    removeCommentImg();
    emit("postCommentFinish", result.data);
  });
};

// 选择图片
const commentImg = ref(null);
const selectImg = (file) => {
  file = file.file;
  let img = new FileReader();
  img.readAsDataURL(file);
  img.onload = ({ target }) => {
    let imgData = target.result;
    commentImg.value = imgData;
    formData.value.image = file;
  };
};

// 删除照片
const removeCommentImg = () => {
  commentImg.value = null;
  formData.value.image = null;
};
</script>

<style lang="scss" scoped>
.post-comment-panel {
  .no-login {
    cursor: pointer;
    width: 100%;
    text-align: center;
    font-size: 13px;
  }
  display: flex;
  padding-top: 10px;
  .comment-form {
    flex: 1;
    padding: 0 10px 0 10px;
    .el-textarea__inner {
      height: 40px;
    }
    .insert-img {
      line-height: normal;
      .pre-img {
        margin-top: 10px;
        position: relative;
        .iconfont {
          cursor: pointer;
          position: absolute;
          top: -10px;
          right: -10px;
          color: rgb(121, 121, 121);
        }
      }
    }
  }
}
</style>