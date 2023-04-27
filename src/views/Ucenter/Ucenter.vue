<template>
  <div
    class="container-body ucenter"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="ucenter-panel">
      <v-row no-gutters>
        <v-col cols="3">
          <div class="user-side">
            <!-- 头像信息 -->
            <v-sheet class="pa-2 ma1">
              <div class="avatar-panel">
                <v-avatar size="120px">
                  <v-img
                    src="https://cdn.vuetifyjs.com/images/john.jpg"
                  ></v-img>
                </v-avatar>
                <div class="nick-name">
                  <span>葫芦弟弟</span>
                  <v-icon
                    icon="mdi mdi-gender-male"
                    color="rgb(50, 133, 255)"
                  ></v-icon>
                  <!-- <v-icon icon="mdi mdi-gender-female" color="rgb(251, 54, 36)"></v-icon> -->
                </div>
                <div :style="{ width: '255px', margin: '5px 0 5px 0' }">
                  <v-divider
                    :thickness="1"
                    class="border-opacity-25"
                  ></v-divider>
                </div>
                <div class="desc">
                  <v-icon
                    size="small"
                    icon="mdi mdi-card-account-details"
                  ></v-icon>
                  这是一个来自家里蹲大学的留学生
                </div>
                <div class="editor-btn">
                  <v-btn
                    variant="outlined"
                    color="rgb(50, 133, 255)"
                    @click="updateUserInfo"
                    :style="{
                      height: '34px',
                      width: '100%',
                      margin: '5px 0 0 0',
                    }"
                  >
                    编辑个人资料</v-btn
                  >
                </div>
              </div>
            </v-sheet>
            <!-- 拓展信息 -->

            <div class="user-extend-panel">
              <v-sheet class="pa-2 ma1">
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi mdi-school"></v-icon>
                    <span>学校</span>
                  </div>
                  <div class="value">家里蹲大学</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi mdi-school"></v-icon>
                    <span>获赞</span>
                  </div>
                  <div class="value">12</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi mdi-school"></v-icon>
                    <span>发帖</span>
                  </div>
                  <div class="value">11</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi mdi-school"></v-icon>
                    <span>加入</span>
                  </div>
                  <div class="value">2023-01-02</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi mdi-school"></v-icon>
                    <span>最后登录</span>
                  </div>
                  <div class="value">2023-01-02</div>
                </div>
              </v-sheet>
            </div>
          </div>
        </v-col>
        <v-col>
          <div class="article-panel">
            <v-sheet class="pa-2 ma2">
              <el-tabs :model-value="activeTabName" @tab-change="changeTab">
                <el-tab-pane label="发帖" :name="0"></el-tab-pane>
                <el-tab-pane label="评论" :name="1"></el-tab-pane>
                <el-tab-pane label="点赞" :name="2"></el-tab-pane>
              </el-tabs>
              <div class="article-list">
                <DataList :dataSource="articleListInfo">
                  <template #default="{ data }">
                    <ArticleListItem :data="data"></ArticleListItem>
                    <ArticleListItem :data="data"></ArticleListItem>
                    <ArticleListItem :data="data"></ArticleListItem>
                    <ArticleListItem :data="data"></ArticleListItem>
                    <ArticleListItem :data="data"></ArticleListItem>
                  </template>
                </DataList>
              </div>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </div>
    <UcenterEditUserInfo ref="UcenterEditUserInfoRef"></UcenterEditUserInfo>
  </div>
</template>

<script setup>
import UcenterEditUserInfo from "./UcenterEditUserInfo.vue"
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { useStore } from "vuex";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();

const articleListInfo = ref({
  pagNo:1,
  pageTotal:12,
  totalCount:5,
})

// 右侧文章
const activeTabName = ref(0);
const changeTab = () => {};

// 修改用户信息
const UcenterEditUserInfoRef=ref(null);
const updateUserInfo=()=>{
UcenterEditUserInfoRef.value.showEditUserInfoDialog();
}
</script>

<style lang="scss">
.ucenter-panel {
  .user-side {
    .ma1 {
      margin-top: 8px;
      margin-right: 10px;
    }
    .avatar-panel {
      //   display: flex;
      //   flex-direction: column;
      //   align-items: center;
      text-align: center;
      .nick-name {
        display: flex;
        justify-content: center;
        margin-top: 5px;
      }
      .desc {
        text-align: left;
        font-size: 14px;
      }
    }
    .user-extend-panel {
      .info-item {
        display: flex;
        justify-content: space-between;
        font-size: 14px;
        line-height: 30px;
        .icon {
          display: flex;
          align-items: center;
        }
      }
    }
  }
  .article-panel {
    flex: 1;
    padding: 0 10px 10px 10px;
    .ma2 {
      margin-top: 8px;
      margin-left: 10px;
    }
  }
}
</style>