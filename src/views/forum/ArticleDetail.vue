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
                <div class="title">这是标题</div>
                <v-divider class="border-opacity-40"></v-divider>
                <div class="user-info">
                  <v-avatar size="x-large">
                    <v-img :src="proxy.globalInfo.avatarUrl" alt="John"></v-img>
                  </v-avatar>
                  <div class="user-info-meta">
                    <router-link class="name-box" to="/user/123 "
                      >葫芦弟弟</router-link
                    >
                    <div class="meta-box">
                      <span> 2023年4月11日 13:01:00</span>
                      <div class="views-count">
                        <v-icon icon="mdi mdi-eye-outline"> </v-icon>
                        <span>32</span>
                      </div>
                    </div>
                  </div>
                </div>
                <v-divider class="border-opacity-40"></v-divider>
                <!-- 文章详细 -->
                <div class="detail" id="detail" v-html="content"></div>
              </div>
            </v-sheet>
            <!-- 附件下载 -->
            <v-sheet class="pa-2 ma1">
              <div class="attachment-panel" v-if="true" id="view-attachment">
                <div class="title">附件</div>
                <div class="attachment-info">
                  <v-icon class="item" icon="mdi-zip-box"></v-icon>
                  <div class="file-name item">附件下载</div>
                  <div class="size item">1024kb</div>
                  <div class="download-count item">已下载3次</div>
                  <div class="download-btn item">
                    <v-btn
                      variant="tonal"
                      size="small"
                      color="rgb(50, 133, 255)"
                    >
                      下载
                    </v-btn>
                  </div>
                </div>
              </div>
            </v-sheet>
            <!-- 评论 -->
            <v-sheet class="pa-2 ma1" id="view-comment">
              <CommentList></CommentList>
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
                        src="https://cdn.vuetifyjs.com/images/john.jpg"
                      ></v-img>
                    </v-avatar>
                  </div>
                  <div class="nick-name">
                    <span :style="{ 'font-size': '18px' }">葫芦弟弟</span>
                    <span :style="{ color: '#929292' }">剑桥大学</span>
                  </div>
                </div>
                <v-divider :thickness="1"></v-divider>
                <div class="user-article-info">
                  <div class="like">
                    <v-icon
                      icon="mdi-thumb-up"
                      color="rgb(50, 133, 255)"
                    ></v-icon>
                    <span :style="{ 'margin-left': '8px' }">获得点赞 520</span>
                  </div>
                  <div class="pageview">
                    <v-icon icon="mdi-eye" color="rgb(50, 133, 255)"></v-icon>
                    <span :style="{ 'margin-left': '8px' }"
                      >文章被阅读 520</span
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
        <v-badge :content="0" floating color="rgb(50, 133, 255)">
          <v-btn
            icon="mdi-thumb-up"
            flat
            variant="text"
            :color="[havelike ? 'red-lighten-2' : '']"
            @click="doLikeHandle"
          ></v-btn>
        </v-badge>
      </div>
      <div class="comment">
        <v-badge :content="5" floating color="rgb(50, 133, 255)">
          <v-btn
            icon="mdi-comment-multiple"
            variant="text"
            flat
            @click="goToPosition('view-comment')"
          ></v-btn>
        </v-badge>
      </div>
      <div class="link">
        <v-btn
          icon="mdi-link-variant"
          variant="text"
          flat
          @click="goToPosition('view-attachment')"
        ></v-btn>
      </div>
    </div>
    <!-- 图片预览 -->
    <ImageViewer ref="imageViewerRef" :imageList="previewImgList"></ImageViewer>
  </div>
</template>

<script setup>
import Schoolsort from "./Schoolsort.vue"
import CommentList from "./CommentList.vue";
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter;
const route = useRoute();

const items = ref([
  {
    title: "求助",
    disabled: false,
    href: "/forum/求助",
  },
  {
    title: "求室友",
    disabled: false,
    href: "/forum/找室友",
  },
  {
    title: "title",
    disabled: true,
    href: "/forum/找室友",
  },
]);

// 获取面包屑数据
const newarr = ref([]);
onMounted(() => {
  for (let i = 0; i < items.value.length; i++) {
    console.log(items.value[i]);
    let arr = {};
    arr.title = items.value[i].title;
    arr.disable = false;
    arr.href = items.value[i].href;
    newarr.value.push(arr);
  }
  console.log(newarr.value);
});

// 获取文章详情
const content = ref(
  "<p>这里是文章内容</p></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br></br>"
);

// 左侧快捷栏
const quickPanelLeft =
  (window.innerWidth - proxy.globalInfo.bodyWidth) / 2 - 80;
const goToPosition = (domId) => {
  document.querySelector("#" + domId).scrollIntoView();
};
// 点赞
const havelike = ref(true);
const doLikeHandle = () => {
  havelike.value = !havelike.value;
};
// 文章图片预览
const previewImgList = ref([]);
</script>

<style lang="scss" scoped>
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
            margin-left: 5px;
          }
        }
      }
    }
    .detail {
      a {
        text-decoration: none;
        color: var(--link);
      }
      img {
        max-width: 90%;
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
    .list-body{
      .v-list-item__prepend
      {
        align-self: center;
      }
      .v-list-item--density-default.v-list-item--three-line{
        min-height: 70px
      }
      .v-list-item-title{
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