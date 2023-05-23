<template>
  <div class="comment-item">
    <v-avatar>
      <v-img :src="proxy.globalInfo.avatarUrl + commentData.user_id"></v-img>
    </v-avatar>
    <div class="comment-info">
      <div class="nick-name">
        <span class="name" @click="gotoUcenter(commentData.user_id)">{{
          commentData.nick_name
        }}</span>
        <span v-if="articleUserId == commentData.user_id" class="tag-author"
          >作者</span
        >
      </div>
      <div class="comment-content">
        <span v-html="commentData.content"></span>
        <CommentImage
          :style="{ 'margin-top': '10px' }"
          v-if="commentData.img_path"
          :src="
            proxy.globalInfo.imageUrl + commentData.img_path.replace('.', '_.')
          "
          :imgList="[proxy.globalInfo.imageUrl + commentData.img_path]"
        ></CommentImage>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>{{ commentData.post_time }}</span>
          <span> · </span>
          <span class="school">{{ commentData.school }}</span>
        </div>
        <div class="comment-good" @click="doLike(commentData)">
          <v-icon
            icon="mdi-thumb-up-outline"
            :color="commentData.haveliked == 1 ? 'red-lighten-2' : null"
          ></v-icon>
          <span v-if="commentData.good_count > 0">{{
            commentData.good_count
          }}</span>
          <span v-else>点赞</span>
        </div>
        <div class="comment-comment" @click="showReplyForm(commentData, 0)">
          <v-icon icon="mdi-comment-processing-outline"></v-icon>
          <span>回复</span>
        </div>
      </div>
      <div class="comment-sub-list" v-if="commentData.chiledren != null">
        <div
          class="comment-sub-item"
          v-for="(item, key) in commentData.chiledren"
          :key="key"
        >
          <v-avatar>
            <v-img :src="proxy.globalInfo.avatarUrl + item.user_id"></v-img>
          </v-avatar>
          <div class="comment-sub-info">
            <div class="nick-name">
              <span class="name" @click="gotoUcenter(item.user_id)">{{
                item.nick_name
              }}</span>
              <span class="tag-author" v-if="item.user_id == articleUserId"
                >作者</span
              >
              <span class="reply-name">回复 @</span>
              <span @click="gotoUcenter(item.reply_user_id)" class="name">{{
                item.reply_nick_name
              }}</span>
              <span>：</span>
              <span class="sub-content">{{ item.content }}</span>
            </div>
            <div class="op-panel">
              <div class="time">
                <span>{{ item.post_time }}</span>
                <span> · </span>
                <span class="school">{{ item.school }}</span>
              </div>
              <div class="comment-good" @click="doLike(item)">
                <v-icon
                  icon="mdi-thumb-up-outline"
                  :color="item.haveliked == 1 ? 'red-lighten-2' : null"
                ></v-icon>
                <span v-if="item.good_count > 0">{{ item.good_count }}</span>
                <span v-else>点赞</span>
              </div>
              <div class="comment-comment" @click="showReplyForm(item, 1)">
                <v-icon icon="mdi-comment-processing-outline"></v-icon>
                <span>回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="reply-info" v-if="commentData.showReply">
        <PostComment
          :placeholderInfo="placeholderInfo"
          :userId="currentUserId"
          :showInsertImg="false"
          :pCommentId="pCommentId"
          :replyUserId="replyUserId"
          :articleId="commentData.article_id"
          @postCommentFinish="postCommentFinish"
        ></PostComment>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ElMessageBox} from "element-plus"
import CommentImage from "./CommentImage.vue";
import PostComment from "./PostComment.vue";
import { ref, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();
const router = useRouter();
const route = useRoute();
const api = {
  doLike: "/comment/doLike",
};
const props = defineProps({
  commentData: {
    type: Object,
  },
  articleUserId: {
    type: String,
  },
  currentUserId: {
    type: String,
  },
});
// 点赞
const doLike = async (data) => {
  if (!props.currentUserId) {
    store.commit("showLogin", true);
    return;
  } else {
    if (!store.getters.getLoginUserInfo.school) {
      ElMessageBox.alert("请前往用户中心绑定学校", "提示", {
        "show-close": false,
        callback: (action) => {
          router.go(-1);
        },
      });
    }
  }
  let result = await proxy.Request({
    url: api.doLike,
    params: {
      commentId: data.comment_id,
    },
    showLoading: false,
  });
  if (!result) {
    return;
  }
  data.good_count = result.data.good_count;
  data.haveliked = result.data.haveliked;
};
// 回复提示文字
const placeholderInfo = ref(null);
// 评论
const pCommentId = ref("0");
const replyUserId = ref(null);

const emit = defineEmits(["hiddenAllReply"]);
// 显示评论框
const showReplyForm = (curData, type) => {
  const haveShow =
    props.commentData.showReply == undefined
      ? false
      : props.commentData.showReply;
  emit("hiddenAllReply");
  if (type == 0) {
    curData.showReply = !haveShow;
  } else {
    props.commentData.showReply = true;
  }
  placeholderInfo.value = "回复 @" + curData.nick_name;
  replyUserId.value = curData.user_id;
  pCommentId.value = props.commentData.comment_id;
};
// 评论发布完成
const postCommentFinish = (resultData) => {
  props.commentData.chiledren = resultData;
  props.commentData.showReply = false;
};
const gotoUcenter = (userId) => {
  router.push(`/user/${userId}`);
};
</script>

<style lang="scss" scoped>
.comment-item {
  display: flex;
  .comment-info {
    flex: 1;
    border-bottom: 1px solid #ddd;
    padding-bottom: 15px;
    margin-left: 10px;
    .nick-name {
      .name {
        font-size: 15px;
        color: rgba(0, 0, 0, 0.45);
        margin-right: 5px;
        cursor: pointer;
      }
      .tag-author {
        background: rgb(255, 102, 128);
        color: #fff;
        font-size: 12px;
        border-radius: 2px;
      }
    }
    .comment-content {
      margin-top: 5px;
      font-size: 15px;
      line-height: 24px;
      display: flex;
      flex-direction: column;
    }
    .op-panel {
      display: flex;
      align-items: center;
      margin-top: 5px;
      font-size: 13px;
      color: rgba(0, 0, 0, 0.501);
      .comment-good {
        display: flex;
        align-items: flex-end;
        margin: 0 10px 0 10px;
        cursor: pointer;
      }
      .comment-comment {
        cursor: pointer;
      }
    }
    .reply-info {
      margin-top: 10px;
    }
    .comment-sub-list {
      margin-top: 10px;
      .comment-sub-item {
        display: flex;
        margin: 5px 0px;
        font-size: 14px;
        .comment-sub-info {
          margin-left: 5px;
          .nick-name {
            .reply-name {
              margin: 0px 5px;
            }
            .sub-content {
              font-size: 15px;
            }
          }
        }
      }
    }
  }
}
</style>