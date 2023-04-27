<template>
  <div
    class="container-body article-list-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="article-panel">
      <div class="top-tab">
        <div class="sort">
          <v-btn-toggle color="#3285FF" variant="plain">
            <v-btn>发布时间</v-btn>
            <v-divider vertical></v-divider>
            <v-btn>评论最多</v-btn>
          </v-btn-toggle>
        </div>
        <div class="filterate">
          <v-btn-toggle color="#3285FF" variant="plain">
            <v-btn>与我同校</v-btn>
            <v-divider vertical></v-divider>
            <v-btn>与我同城</v-btn>
          </v-btn-toggle>
        </div>
      </div>
      <div class="article_list">
        <v-row no-gutters>
          <v-col cols="9">
            <v-sheet class="pa-2 ma1">
              <DataList :dataSource="articleListInfo">
                <template #default="{ data }">
                  <ArticleListItem :data="data"></ArticleListItem>
                  <ArticleListItem :data="data"></ArticleListItem>
                  <ArticleListItem :data="data"></ArticleListItem>
                  <ArticleListItem :data="data"></ArticleListItem>
                  <ArticleListItem :data="data"></ArticleListItem>
                </template>
              </DataList>
            </v-sheet>
          </v-col>
          <v-col>
            <v-sheet class="ma2">
              <v-card class="mx-auto" max-width="267px">
                <v-img
                  class="align-end text-white"
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
                    <div class="count-item">
                      <span style="margin-bottom: 10px">求助</span>
                      <v-chip color="rgb(50, 133, 255)" size="small">12</v-chip>
                    </div>
                    <div class="count-item">
                      <span style="margin-bottom: 10px">分享</span>
                      <v-chip color="rgb(50, 133, 255)" size="small">12</v-chip>
                    </div>
                    <div class="count-item">
                      <span style="margin-bottom: 10px">指南</span>
                      <v-chip color="rgb(50, 133, 255)" size="small">12</v-chip>
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
import Schoolsort from "./Schoolsort.vue";
import ArticleListItem from "./ArticleListItem.vue";
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const item = ref({});
item.value = {
  title: "title",
  data: "这是信息",
  userId: "123",
};

const articleListInfo = ref({
  pagNo: 1,
  pageTotal: 12,
  totalCount: 5,
});
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
      .filterate{
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