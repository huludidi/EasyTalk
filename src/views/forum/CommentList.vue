<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">评论<span class="count">0</span></div>
      <div class="tab">
        <v-btn-toggle divided mandatory color="#64B5F6">
          <v-btn size="x-small">最新</v-btn>
          <v-btn size="x-small">最热</v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <!-- 发表评论 -->
    <div class="comment-form-panel">
      <PostComment></PostComment>
    </div>
    <div class="comment-list">
      <!-- <template #default="{data}"></template> -->
      <CommentListItem :commentData="data" @hiddenAllReply="hiddenAllReplyHandler"></CommentListItem>
      <CommentListItem :commentData="data"></CommentListItem>
      <CommentListItem :commentData="data"></CommentListItem>
      <CommentListItem :commentData="data"></CommentListItem>
    </div>
  </div>
</template>

<script setup>
import PostComment from "./PostComment.vue";
import CommentListItem from "./CommentListItem.vue";
import { ref, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const { proxy } = getCurrentInstance();
const store = useStore();

const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});


// 评论列表
const commentListInfo = ref({});

// 隐藏所有回复框
const hiddenAllReplyHandler=()=>{
  
}
</script>

<style lang="scss" scoped>
.comment-body {
  .comment-title {
    display: flex;
    align-items: flex-end;
    .title {
      font-size: 25px;
      .count {
        font-size: 20px;
      }
    }
    .tab {
      height: 30px;
      margin-left: 10px;
      .v-btn__content {
        font-size: 15px;
      }
      .v-btn-group--density-default.v-btn-group {
        height: 25px;
      }
    }
  }
}
</style>