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
                    :src="proxy.globalInfo.avatarUrl + userInfo.userId"
                  ></v-img>
                </v-avatar>
                <div class="nick-name">
                  <span>{{ userInfo.nickName }}</span>
                  <v-icon
                    v-if="userInfo.sex"
                    icon="mdi mdi-gender-male"
                    color="rgb(50, 133, 255)"
                  ></v-icon>
                  <v-icon
                    v-else
                    icon="mdi mdi-gender-female"
                    color="rgb(251, 54, 36)"
                  ></v-icon>
                </div>
                <div :style="{ width: '255px', margin: '5px 0 5px 0' }">
                  <v-divider
                    :thickness="1"
                    class="border-opacity-25"
                  ></v-divider>
                </div>
                <div class="desc" >
                  <v-icon
                    size="small"
                    icon="mdi mdi-card-account-details"
                  ></v-icon>
                  {{ userInfo.personDescription?userInfo.personDescription:"这家伙很懒，什么都没有留下" }}
                </div>
                <div class="editor-btn">
                  <v-btn
                    v-if="isCurrentUser"
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
                    <span :style="{ 'margin-left': '3px' }">学校</span>
                  </div>
                  <div class="value">{{ userInfo.school }}</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi-thumbs-up-down"></v-icon>
                    <span :style="{ 'margin-left': '3px' }"> 获赞</span>
                  </div>
                  <div class="value">{{ userInfo.likeCount }}</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi-bookshelf"></v-icon>
                    <span :style="{ 'margin-left': '3px' }">发帖</span>
                  </div>
                  <div class="value">{{ userInfo.postCount }}</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi-login"></v-icon>
                    <span :style="{ 'margin-left': '3px' }">加入</span>
                  </div>
                  <div class="value">{{ userInfo.joinTime }}</div>
                </div>
                <div class="info-item">
                  <div class="icon">
                    <v-icon icon="mdi-login"></v-icon>
                    <span :style="{ 'margin-left': '3px' }">最后登录</span>
                  </div>
                  <div class="value">{{ userInfo.lastLoginTime }}</div>
                </div>
              </v-sheet>
            </div>
          </div>
        </v-col>
        <v-col cols="9">
          <div class="article-panel">
            <v-sheet class="pa-2 ma2">
              <el-tabs :model-value="activeTabName" @tab-change="changeTab">
                <el-tab-pane label="发帖" :name="0"></el-tab-pane>
                <el-tab-pane label="评论" :name="1"></el-tab-pane>
                <el-tab-pane label="点赞" :name="2"></el-tab-pane>
              </el-tabs>
              <div class="article-list">
                <DataList
                  :dataSource="articleListInfo"
                  :loading="loading"
                  noDataMsg="暂无数据"
                  @loadData="loadArticle"
                >
                  <template #default="{ data }">
                    <ArticleListItem :data="data"></ArticleListItem>
                  </template>
                </DataList>
              </div>
            </v-sheet>
          </div>
        </v-col>
      </v-row>
    </div>
    <UcenterEditUserInfo ref="UcenterEditUserInfoRef" @resetUserInfo="resetUserInfoHandler"></UcenterEditUserInfo>
  </div>
</template>

<script setup>
import UcenterEditUserInfo from "./UcenterEditUserInfo.vue";
import ArticleListItem from "@/views/forum/ArticleListItem.vue";
import { useStore } from "vuex";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  getUserInfo: "/ucenter/getUserInfo",
  loadUserArticle: "/ucenter/loadUserArticle",
};

const userId = ref(null);
const userInfo = ref({});
const loadUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    showLoading: false,
    params: {
      userId: userId.value,
    },
    errorCallback: () => {
      setTimeout(() => {
        router.push("/");
      }, 1500);
    },
  });
  if (!result) {
    return;
  }
  userInfo.value = result.data;
};
// 是否为当前登录用户
const isCurrentUser = ref(false);
const resetCurrentUser = () => {
  const loginUserInfo=store.getters.getLoginUserInfo;
  if (loginUserInfo && loginUserInfo.userId == userId.value) {
    isCurrentUser.value = true;
  } else {
    isCurrentUser.value = false;
  }
};
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    resetCurrentUser();
  },
  { immediate: true, deep: true }
);
watch(
  () => route.params.userId,
  (newVal, oldVal) => {
    if (newVal) {
      userId.value = newVal;
      resetCurrentUser();
      loadUserInfo();
    }
  },
  {immediate:true,deep:true}
);
// 右侧文章
const loading = ref(false);
const articleListInfo = ref({});
const activeTabName = ref(0);
const changeTab = (type) => {
  activeTabName.value = type;
  loadArticle();
};
const loadArticle = async () => {
  loading.value = true;
  let result = await proxy.Request({
    url: api.loadUserArticle,
    showLoading: false,
    params: {
      userId: userId.value,
      type: activeTabName.value,
      pageNo: articleListInfo.value.pageNo,
    },
  });
  if (!result) {
    return;
  }
  loading.value = false;
  articleListInfo.value = result.data;
};
// 修改用户信息
const UcenterEditUserInfoRef = ref(null);
const updateUserInfo = () => {
  UcenterEditUserInfoRef.value.showEditUserInfoDialog(userInfo.value);
};
onMounted(() => {
  userId.value = route.params.userId;
  // loadUserInfo();
  loadArticle();
});

const resetUserInfoHandler=(data)=>{
  userInfo.value=data
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
        padding: 10px 5px 10px 5px;
      }
    }
    .user-extend-panel {
      .info-item {
        margin-top: 4px;
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