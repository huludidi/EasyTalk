<template>
  <div class="comment-item">
    <v-avatar>
      <v-img :src="proxy.globalInfo.avatarUrl"></v-img>
    </v-avatar>
    <div class="comment-info">
      <div class="nick-name">
        <span class="name">葫芦弟弟</span>
        <span v-if="true" class="tag-author">作者</span>
      </div>
      <div class="comment-content">
        <span v-html="content"></span>
        <CommentImage
        :style="{'margin-top':'10px'}"
          v-if="true"
          :src="proxy.globalInfo.imageUrl"
          :imgList="[proxy.globalInfo.imageUrl]"
        ></CommentImage>
      </div>
      <div class="op-panel">
        <div class="time">
          <span>2023-04-13 13:13:00</span>
          <span> · </span>
          <span class="school">剑桥大学</span>
        </div>
        <div class="comment-good">
          <v-icon icon="mdi-thumb-up-outline"></v-icon>
          <span>点赞</span>
        </div>
        <div class="comment-comment" @click="showReplyForm(commentData)">
          <v-icon icon="mdi-comment-processing-outline"></v-icon>
          <span>回复</span>
        </div>
      </div>
      <div class="comment-sub-list">
        <div class="comment-sub-item">
          <v-avatar>
            <v-img :src="proxy.globalInfo.avatarUrl"></v-img>
          </v-avatar>
          <div class="comment-sub-info">
            <div class="nick-name">
              <span class="name">葫芦哥</span>
              <span class="tag-author">作者</span>
              <span class="reply-name">回复</span>
              <span>@葫芦弟弟</span>
              <span>：</span>
              <span class="sub-content">111</span>
            </div>
            <div class="op-panel">
              <div class="time">
                <span>2023-04-13 13:13:00</span>
                <span> · </span>
                <span class="school">剑桥大学</span>
              </div>
              <div class="comment-good">
                <v-icon icon="mdi-thumb-up-outline"></v-icon>
                <span>点赞</span>
              </div>
              <div class="comment-comment" @click="showReplyForm(commentData)">
                <v-icon icon="mdi-comment-processing-outline"></v-icon>
                <span>回复</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="reply-info" v-if="false">
        <PostComment placeholderInfo="回复@葫芦弟弟"></PostComment>
      </div>
    </div>
  </div>
</template>

<script setup>
import CommentImage from "./CommentImage.vue";
import PostComment from "./PostComment.vue";
import { ref, getCurrentInstance, watch } from "vue";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const props = defineProps({
  commentData: {
    type: Object,
  },
});
const content = ref("<h>这是评论这是评论这是评论<h>");

const emit = defineEmits(["hiddenAllReply"]);
// 显示评论框
const showReplyForm = (curData) => {
  emit("hiddenAllReply");
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
        font-size: 14px;
        color: rgba(0, 0, 0, 0.45);
        margin-right: 5px;
        cursor: pointer;
      }
      .tag-author {
        background: pink;
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