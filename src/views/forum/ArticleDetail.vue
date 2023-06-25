<template>
  <div>
    <div
      class="container-body article-list-body"
      :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
    >
      <div class="board-info">
        <v-breadcrumbs :items="newarr" color="rgb(50, 133, 255)">
          <template v-slot:divider>
            <v-icon icon="mdi-chevron-right"></v-icon>
          </template>
        </v-breadcrumbs>
      </div>
      <div
        class="detail-container"
        :style="{ width: proxy.globalInfo.width + 'px' }"
      >
        <v-row no-gutters>
          <v-col cols="9">
            <v-sheet class="pa-2 ma1">
              <div class="article-detail">
                <div class="title">{{ articleInfo.title }}</div>
                <v-divider class="border-opacity-40"></v-divider>
                <div class="user-info">
                  <v-avatar size="x-large">
                    <v-img
                      :src="proxy.globalInfo.avatarUrl + articleInfo.author_id"
                      alt="John"
                    ></v-img>
                  </v-avatar>
                  <div class="user-info-meta">
                    <router-link
                      class="name-box"
                      :to="`/user/${articleInfo.author_id}`"
                      >{{ articleInfo.nick_name }}</router-link
                    >
                    <div class="meta-box">
                      <span> {{ articleInfo.post_time }}</span>
                      <div class="post-address">
                        <span :style="{ 'font-size': '14px' }">发布于 </span>
                        <span>
                          {{ address.country_name }}
                          -
                          {{ address.region }}
                        </span>
                      </div>
                      <div class="views-count">
                        <v-icon icon="mdi mdi-eye-outline"> </v-icon>
                        <span>{{ articleInfo.read_count }}</span>
                      </div>
                      <div
                        v-if="articleInfo.author_id == currentUserInfo.userId"
                      >
                        <router-link
                          :to="`/editPost/${articleInfo.article_id}`"
                          class="a-link btn-edit"
                        >
                          <span class="iconfont icon-edit ">编辑  </span>
                        </router-link>
                        <span class="iconfont icon-del a-link btn-edit"
                        @click="delarticle"
                          >删除</span
                        >
                      </div>
                    </div>
                  </div>
                </div>
                <v-divider class="border-opacity-40"></v-divider>
                <!-- 文章详细 -->
                <div
                  class="detail font-weight-medium"
                  id="detail"
                  v-html="articleInfo.content"
                ></div>
              </div>
            </v-sheet>
            <!-- 附件下载 -->
            <v-sheet class="pa-2 ma1" v-if="attachmentInfo.file_id">
              <div class="attachment-panel" id="view-attachment">
                <div class="title">附件</div>
                <div class="attachment-info">
                  <v-icon class="item" icon="mdi-zip-box"></v-icon>
                  <div class="file-name item">
                    {{ attachmentInfo.file_name }}
                  </div>
                  <div class="size item">{{ formattedSize }}</div>
                  <div class="download-count item">
                    已下载{{ attachmentInfo.download_count }}次
                  </div>
                  <div class="download-btn item">
                    <v-btn
                      variant="tonal"
                      size="small"
                      color="rgb(50, 133, 255)"
                      @click="downloadAttachment(attachmentInfo)"
                    >
                      下载
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-sheet>
            <!-- 评论 -->
            <v-sheet class="pa-2 ma1" id="view-comment">
              <CommentList
                v-if="articleInfo.article_id"
                :articleId="articleInfo.article_id"
                :articleUserId="articleInfo.author_id"
                @updateCommentCount="updateCommentCount"
              ></CommentList>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="pa-2 ma2">
              <!-- 作者介绍 -->
              <div class="user-intro">
                <div class="avatar-panel">
                  <div class="avatar">
                    <v-avatar size="60px">
                      <v-img
                        :src="
                          proxy.globalInfo.avatarUrl + articleInfo.author_id
                        "
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="nick-name">
                    <span :style="{ 'font-size': '18px' }">
                      <v-icon icon="mdi-account-box" size="small"></v-icon>
                      {{ authorInfo.nickName }}</span
                    >
                    <span :style="{ color: '#929292' }">
                      <v-icon icon="mdi-school" size="small"></v-icon>
                      {{ authorInfo.school }}</span
                    >
                  </div>
                </div>
                <v-card-text>
                  <div :style="{ 'line-height': '30px', 'font-size': '16px' }">
                    {{ authorInfo.personDescription }}
                  </div>
                </v-card-text>
                <v-divider :thickness="1"></v-divider>
                <div class="user-article-info">
                  <div class="like">
                    <v-icon
                      icon="mdi-thumb-up"
                      color="rgb(50, 133, 255)"
                    ></v-icon>
                    <span :style="{ 'margin-left': '8px' }"
                      >获得点赞 {{ authorInfo.likeCount }}</span
                    >
                  </div>
                  <div class="pageview">
                    <v-icon icon="mdi-eye" color="rgb(50, 133, 255)"></v-icon>
                    <span :style="{ 'margin-left': '8px' }"
                      >文章被阅读 {{ authorInfo.readCount }}</span
                    >
                  </div>
                  <div class="article-count">
                    <v-icon
                      icon="mdi-bookshelf"
                      color="rgb(50, 133, 255)"
                    ></v-icon>
                    <span :style="{ 'margin-left': '8px' }"
                      >发布文章数 {{ authorInfo.postCount }}</span
                    >
                  </div>
                </div>
              </div>
            </v-sheet>
            <!-- 高校排行榜 -->
            <v-sheet class="pa-2 ma2">
              <Schoolsort></Schoolsort>
            </v-sheet>
          </v-col>
        </v-row>
      </div>
    </div>
    <!-- 左侧快捷操作 -->
    <div class="quick-panel" :style="{ left: quickPanelLeft + 'px' }">
      <div class="like">
        <v-badge
          :content="articleInfo.good_count"
          floating
          color="blue-darken-1"
        >
          <v-btn
            icon="mdi-thumb-up"
            flat
            variant="text"
            :color="havelike ? 'red-lighten-2' : 'unset'"
            @click="doLikeHandle"
          ></v-btn>
        </v-badge>
      </div>
      <div class="comment">
        <v-badge
          :content="articleInfo.comment_count"
          floating
          color="blue-darken-1"
        >
          <v-btn
            icon="mdi-comment-multiple"
            variant="text"
            flat
            @click="goToPosition('view-comment')"
          ></v-btn>
        </v-badge>
      </div>
      <div class="link" v-if="attachmentInfo">
        <v-btn
          icon="mdi-link-variant"
          variant="text"
          flat
          @click="goToPosition('view-attachment')"
        ></v-btn>
      </div>
    </div>
    <!-- 图片预览 -->
    <!-- <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer> -->
  </div>
</template>

<script setup>
import Schoolsort from "./Schoolsort.vue";
import CommentList from "./CommentList.vue";
import {
  ref,
  getCurrentInstance,
  onMounted,
  computed,
  nextTick,
  watch,
} from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const route = useRoute();
const api = {
  getArticleDetail: "/forum/getArticleDetail",
  getUserInfo: "/ucenter/getUserInfo",
  downloadAttachment: "/api/forum/attachmentDownload",
  doLike: "/forum/doLike",
  delArticle:"/forum/delArticle"
};
const currentUserInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    currentUserInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
// 获取面包屑数据
const newarr = ref([]);
const makeNewarr = (article) => {
  let pBoard = {
    title: article.p_board_name,
    disabled: false,
    to: "/forum/" + article.p_board_id,
  };
  newarr.value.push(pBoard);
  let board = {
    title: article.board_name,
    disable: false,
    to: "/forum/" + article.p_board_id + "/" + article.board_id,
  };
  newarr.value.push(board);
  let articletitle = {
    title: article.title,
    disabled: true,
  };
  newarr.value.push(articletitle);
};
// 获取作者信息
const authorInfo = ref({});
const getUserInfo = async (userId) => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    showLoading: false,
    params: {
      userId: userId,
    },
  });
  if (!result) {
    return;
  }
  authorInfo.value = result.data;
};
// 点赞
const havelike = ref(false);
const doLikeHandle = async () => {
  if (!store.getters.getLoginUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  let result = await proxy.Request({
    url: api.doLike,
    showLoading: false,
    params: {
      articleId: articleInfo.value.article_id,
      opType: 0,
    },
  });
  if (!result) {
    return;
  }
  havelike.value = !havelike.value;
  let goodCount = 1;
  if (!havelike.value) {
    goodCount = -1;
  }
  articleInfo.value.good_count = articleInfo.value.good_count + goodCount;
};
// 附件
const attachmentInfo = ref({});
const formattedSize = computed(() => {
  const size = attachmentInfo.value.file_size;
  if (size > 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / 1024).toFixed(2) + " KB";
  }
});
const downloadAttachment = async (info) => {
  if (!currentUserInfo) {
    store.commit("showLogin", true);
    return;
  }
  document.location.href = api.downloadAttachment + "?fileId=" + info.file_id;
  attachmentInfo.value.download_count += 1;
};
// 文章发布地址
const address = ref({});
// 文章详情
const articleInfo = ref({});
const getArticleDetail = async (articleId) => {
  let result = await proxy.Request({
    url: api.getArticleDetail,
    showLoading: false,
    params: {
      articleId: articleId,
    },
  });
  if (!result) {
    return;
  }
  articleInfo.value = result.data.forumArticle;
  address.value = JSON.parse(result.data.forumArticle.author_ip_address);
  if (result.data.attachment != null) {
    attachmentInfo.value = result.data.attachment;
  }
  havelike.value = result.data.haveLike;
  getUserInfo(result.data.forumArticle.author_id);
  makeNewarr(result.data.forumArticle);
  imagePreview();

  if (articleInfo.value.p_board_id != store.getters.getActiveBoard) {
    store.commit("setActiveBoard", articleInfo.value.p_board_id);
  }
};
onMounted(() => {
  getArticleDetail(route.params.articleId);
});

// 左侧快捷栏
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 80;
const goToPosition = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};
// 发布评论后，更新数量
const updateCommentCount = () => {
  articleInfo.value.comment_count += 1;
};
// 文章图片预览
const imageViewerRef = ref();
const previewImgList = ref([]);
const imagePreview = () => {
  nextTick(() => {
    const imageNodeList = document
      .querySelector("#detail")
      .querySelectorAll("img");
    const imageList = [];
    imageNodeList.forEach((item, index) => {
      const src = item.getAttribute("src");
      imageList.push(src);
      item.addEventListener("click", () => {
        imageViewerRef.value.show(index);
      });
    });
    previewImgList.value = imageList;
  });
};
// 删除自己的文章
const delarticle=async()=>{
   proxy.Confirm("你确定要删除此文章吗？", async () => {
    let result=await proxy.Request({
      url:api.delArticle,
      showLoading:false,
      params:{
        articleId:articleInfo.value.article_id
      }
    })
    if(!result){
      return
    }
    proxy.Message.success("删除成功")
    router.push("/")
   })
}
</script>

<style lang="scss">
.board-info {
  .v-breadcrumbs--density-default {
    padding-top: 0;
    padding-bottom: 0;
  }
  .v-breadcrumbs {
    padding: 0px;
  }
}
.detail-container {
  .ma1 {
    margin-top: 8px;
    margin-right: 8px;
  }
  .ma2 {
    margin-top: 8px;
    margin-left: 8px;
  }
  .article-detail {
    padding: 10px;
    .title {
      font-size: 25px;
      font-weight: 700;
      line-height: 1.31;
      color: #252933;
      padding-bottom: 10px;
    }
    .user-info {
      margin: 8px 0 8px 0;
      display: flex;
      align-items: center;
      .user-info-meta {
        padding-left: 10px;
        .name-box {
          text-decoration: none;
          color: rgb(50, 133, 255);
          font-size: 18px;
        }
        .name-box:hover {
          color: rgb(121, 188, 255);
        }
        .meta-box {
          color: rgb(138, 145, 159);
          display: flex;
          .views-count {
            display: flex;
            align-items: flex-end;
            margin-left: 10px;
            margin-right: 10px;
          }
          .btn-edit{
            cursor: pointer;
          }
          .post-address {
            margin-left: 10px;
          }
        }
      }
    }
    .detail {
      padding: 10px 0;
      font-size: 20px;
      line-height: 1.6;
      a {
        text-decoration: none;
        color: var(--link);
      }
      img {
        max-width: 80%;
        cursor: pointer;
      }
    }
  }
  .attachment-panel {
    .title {
      font-size: 18px;
    }
    .attachment-info {
      display: flex;
      align-items: center;
      color: rgb(138, 145, 159);
      .item {
        margin-right: 10px;
      }
      .v-icon {
        color: rgb(50, 133, 255);
      }
      .file-name {
        color: rgb(50, 133, 255);
      }
    }
  }
  .user-intro {
    .v-card-text {
      padding: 0 0 5px 0;
    }
    .avatar-panel {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .nick-name {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        // color:#929292
      }
    }
    .description {
      width: 250px;
      line-height: 30px;
      font-size: 16px;
    }
    .user-article-info {
      margin-top: 15px;
      .like {
        margin-bottom: 5px;
      }
    }
  }
  .school-list {
    .list-head {
      padding: 10px 0 0 0;
      margin-bottom: 10px;
    }
    .list-body {
      .v-list-item__prepend {
        align-self: center;
      }
      .v-list-item--density-default.v-list-item--three-line {
        min-height: 70px;
      }
      .v-list-item-title {
        margin-bottom: 8px;
        font-size: 17px;
      }
    }
  }
}
.quick-panel {
  top: 200px;
  position: fixed;
  width: 50px;
  .like {
    margin-bottom: 20px;
  }
  .comment {
    margin-bottom: 20px;
  }
}
</style>