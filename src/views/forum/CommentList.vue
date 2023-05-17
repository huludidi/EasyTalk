<template>
  <div class="comment-body">
    <div class="comment-title">
      <div class="title">
        评论<span class="count">{{ commentListInfo.totalCount }}</span>
      </div>
      <div class="tab">
        <v-btn-toggle divided mandatory color="#64B5F6" v-model="orderType">
          <v-btn size="x-small" :value="0">最新</v-btn>
          <v-btn size="x-small" :value="1">最热</v-btn>
        </v-btn-toggle>
      </div>
    </div>
    <!-- 发表评论 -->
    <div class="comment-form-panel">
      <PostComment
        pCommentId="0"
        :articleId="articleId"
        :userId="currentUserInfo.userId"
        :showInsertImg="currentUserInfo.userId != null"
        @postCommentFinish="postCommentFinish"
      ></PostComment>
    </div>
    <div class="comment-list">
      <DataList
        :dataSource="commentListInfo"
        :loading="false"
        @loadData="loadComment"
      >
        <template #default="{ data }">
          <CommentListItem
            :commentData="data"
            :articleUserId="articleUserId"
            :currentUserId="currentUserInfo.userId"
            @hiddenAllReply="hiddenAllReplyHandler"
          ></CommentListItem>
        </template>
      </DataList>
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
const api = {
  loadComment: "/comment/loadComment",
  postComment: "/comment/postComment",
  doLike: "/comment/doLike",
};
const props = defineProps({
  articleId: {
    type: String,
  },
  articleUserId: {
    type: String,
  },
});
// 排序类型
const orderType = ref(0);
watch(
  () => orderType.value,
  (newVal, oldVal) => {
    loadComment();
  }
);
// 当前用户信息
const currentUserInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
// 评论列表
const loading = ref(null);
const commentListInfo = ref({});
const loadComment = async () => {
  let params = {
    pageNo: commentListInfo.value.pageNo,
    articleId: props.articleId,
    orderType: orderType.value,
  };
  loading.value = true;
  let result = await proxy.Request({
    url: api.loadComment,
    showLoading: false,
    params: params,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  commentListInfo.value = result.data;
};
loadComment();

const emit=defineEmits(["updateCommentCount"])
// 评论发布完成
const postCommentFinish = (resultData) => {
  commentListInfo.value.list.unshift(resultData);
  commentListInfo.value.totalCount+=1;
  emit("updateCommentCount")
};
// 隐藏所有回复框
const hiddenAllReplyHandler = () => {
  commentListInfo.value.list.forEach((element) => {
    element.showReply = false;
  });
};
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