<template>
  <div
    class="container-body article-list-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div class="sort">
          <v-btn-toggle color="#3285FF" variant="plain" v-model="order">
            <v-btn value="0">点赞最多</v-btn>
            <v-divider vertical></v-divider>
            <v-btn value="1">评论最多</v-btn>
          </v-btn-toggle>
        </div>
        <div class="filterate">
          <v-btn-toggle color="#3285FF" variant="plain" v-model="filter">
            <v-btn value="0">与我同校</v-btn>
            <v-divider vertical></v-divider>
            <v-btn value="1">与我同城</v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div class="article_list">
        <v-row no-gutters>
          <v-col cols="9">
            <v-sheet class="pa-2 ma1">
              <ArticleListLoading
                v-if="loading"
                :loading="loading"
              ></ArticleListLoading>
              <DataList :dataSource="articleListInfo" @loadData="loadArticle">
                <template #default="{ data }">
                  <ArticleListItem :data="data"></ArticleListItem>
                </template>
              </DataList>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="ma2">
              <v-card class="mx-auto" max-width="267px">
                <v-img
                  class="align-end text-white animate__animated animate__fadeInDown animate_duration-5s"
                  src="https://cdn.vuetifyjs.com/images/cards/docks.jpg"
                  cover
                >
                  <v-card-title>EasyTalk</v-card-title>
                </v-img>

                <v-card-text>
                  <div :style="{ 'line-height': '30px', 'font-size': '16px' }">
                    远离故土，旅居异乡，依然衷心向往家的温馨。身处五湖四海，亲友同袍的关怀，始终是留学路上最动人的风景。
                  </div>
                </v-card-text>
                <div class="divider">
                  <v-divider
                    class="border-opacity-25"
                    :style="{ 'margin-right': '30px' }"
                  ></v-divider>
                  <span :style="{ width: '100px', 'font-size': '13px' }"
                    >计数</span
                  >
                  <v-divider
                    class="border-opacity-25"
                    :style="{ 'margin-left': '30px' }"
                  ></v-divider>
                </div>
                <v-card-actions>
                  <div class="count-panel">
                    <div
                      class="count-item"
                      v-for="(item, key) in articleData"
                      :key="key"
                    >
                      <span style="margin-bottom: 10px">{{
                        item.boardName
                      }}</span>
                      <v-chip
                        color="rgb(50, 133, 255)"
                        size="small"
                        :style="{ 'justify-content': 'center' }"
                        >{{ item.count }}</v-chip
                      >
                    </div>
                  </div>
                </v-card-actions>
              </v-card>
            </v-sheet>
            <v-card class="ma2">
              <v-sheet class="pa-2">
                <Schoolsort></Schoolsort>
              </v-sheet>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessageBox } from "element-plus";
import Schoolsort from "./Schoolsort.vue";
import ArticleListItem from "./ArticleListItem.vue";
import { ref, getCurrentInstance, watch, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  loadArticle: "/forum/loadArticle",
  articleTypeData: "/statistics/articleTypeData",
};

const boardId = ref(null);
const pBoardId = ref(null);
if (route.params.boardId) {
  boardId.value = route.params.boardId;
}
if (route.params.pBoardId) {
  pBoardId.value = route.params.pBoardId;
}
const orderType = ref(null);
const filterType = ref(null);
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    boardId: boardId.value,
    orderType: orderType.value,
    filterType: filterType.value,
    pBoardId: pBoardId.value,
  };
  let result = await proxy.Request({
    url: api.loadArticle,
    params: params,
    showLoading: false,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};

// 监听路由变化，获取当前板块信息
watch(
  () => route.params,
  (newVal, oldVal) => {
    if (newVal.boardId) {
      boardId.value = newVal.boardId;
    } else {
      boardId.value = null;
    }
    if (newVal.pBoardId) {
      pBoardId.value = newVal.pBoardId;
    } else {
      pBoardId.value = null;
    }
    articleListInfo.value.pageNo = 1;
    loadArticle();
  },
  { immediate: true, deep: true }
);
// 文章排序 0点赞最多 1评论最多
const order = ref([]);
watch(
  () => order,
  (newVal, oldVal) => {
    orderType.value = order.value;
    articleListInfo.value.pageNo = 1;
    loadArticle();
  },
  { immediate: true, deep: true }
);
// 文章筛选 0同校 1同城
const filter = ref([]);
watch(
  () => filter,
  (newVal, oldVal) => {
    if (!filter.value) {
      filterType.value = null;
    } else {
      filterType.value = filter.value;
    }
    articleListInfo.value.pageNo = 1;
    loadArticle();
  },
  { immediate: true, deep: true }
);
// 右侧文章统计数据
const articleData = ref({});
const loadArticleData = async () => {
  let result = await proxy.Request({
    url: api.articleTypeData,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  articleData.value = result.data;
};
loadArticleData();
</script>

<style lang="scss" scoped>
.article-list-body {
  .article-panel {
    background: rgb(245, 245, 245);
    .top-tab {
      background: #fff;
      display: inline-flex;
      .v-btn-group--density-default.v-btn-group {
        height: 25px;
      }
      .filterate {
        margin-left: 440px;
      }
    }
    .article_list {
      margin-top: 5px;
    }
    .ma1 {
      margin-top: 8px;
      margin-right: 8px;
    }
    .ma2 {
      margin-top: 8px;
      margin-left: 8px;
    }
    .divider {
      display: flex;
      align-items: center;
    }
    .count-panel {
      width: 100%;
      display: flex;
      justify-content: space-around;
      margin-bottom: 15px;
      .count-item {
        display: flex;
        flex-direction: column;
      }
    }
  }
}
</style>