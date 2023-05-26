<template>
  <div
    class="container-body message-center"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="message-panel">
      <el-tabs :model-value="activeTabName" @tab-change="tabChange">
        <el-tab-pane name="reply">
          <template #label>
            <div class="tab-item">
              <span>回复了我</span>
              <span class="count-tag" v-if="messageCountInfo.reply > 0">{{
                messageCountInfo.reply
              }}</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likePost">
          <template #label>
            <div class="tab-item">
              <span>攒了我的文章</span>
              <span class="count-tag" v-if="messageCountInfo.likePost > 0">{{
                messageCountInfo.likePost
              }}</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likeComment">
          <template #label>
            <div class="tab-item">
              <span>攒了我的评论</span>
              <span class="count-tag" v-if="messageCountInfo.likeComment > 0">{{
                messageCountInfo.likeComment
              }}</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="attachmentDownload">
          <template #label>
            <div class="tab-item">
              <span>下载了附件</span>
              <span
                class="count-tag"
                v-if="messageCountInfo.attachmentDownload > 0"
                >{{ messageCountInfo.attachmentDownload }}</span
              >
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="sys">
          <template #label>
            <div class="tab-item">
              <span>系统消息</span>
              <span class="count-tag" v-if="messageCountInfo.sys > 0">{{
                messageCountInfo.sys
              }}</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <router-link :to="`/user/${currentUserInfo.userId}`" class="a-link go-ucenter"
        >&lt;&lt;个人中心</router-link>
    </div>
    <div class="message-list">
      <DataList
        :dataSource="messageListInfo"
        :loading="loading"
        @loadData="loadMessageList"
        noDataMsg="暂无消息"
      >
        <template #default="{ data }">
          <!-- 系统消息 -->
          <div class="message-item" v-if="activeTabName == 'sys'">
            <div class="message-content" :style="{'margin-top':'10px'}">
              <span v-html="data.message_content"></span>
              <span class="create-time">{{ data.create_time }}</span>
            </div>
          </div>
          <!-- 回复了我 -->
          <div class="message-item" v-if="activeTabName == 'reply'">
            <v-avatar>
              <v-img
                :src="proxy.globalInfo.avatarUrl + data.send_user_id"
              ></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.send_user_id}`"
                  >@{{ data.send_nick_name }}</router-link
                >
                对我的文章 【
                <router-link class="a-link" :to="`/post/${data.article_id}`">{{
                  data.article_title
                }}</router-link>
                】发表了评论
                <span class="create-time">{{ data.create_time }}</span>
              </div>
              <div class="reply-content" v-html="data.message_content"></div>
            </div>
          </div>
          <!-- 攒了我评论 -->
          <div class="message-item" v-if="activeTabName == 'likeComment'">
            <v-avatar>
              <v-img :src="proxy.globalInfo.avatarUrl + data.send_user_id"></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.send_user_id}`"
                  >@{{ data.send_nick_name }}}</router-link
                >
                对我的文章 【
                <router-link class="a-link" :to="`/post/${data.article_id}`">{{
                  data.article_title
                }}</router-link>
                】赞了我的评论
                <span class="create-time">{{ datacreate_time }}</span>
              </div>
            </div>
          </div>
          <!-- 下载了附件 -->
          <div
            class="message-item"
            v-if="activeTabName == 'attachmentDownload'"
          >
            <v-avatar>
              <v-img :src="proxy.globalInfo.avatarUrl + data.send_user_id"></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.send_user_id}`"
                  >@{{ data.send_nick_name }}</router-link
                >
                下载了我的文章 【
                <router-link class="a-link" :to="`/post/${data.article_id}`">{{
                  data.article_title
                }}</router-link>
                】中的附件
                <span class="create-time">{{ data.create_time }}</span>
              </div>
            </div>
          </div>
          <!-- 攒了我文章 -->
          <div class="message-item" v-if="activeTabName == 'likePost'">
            <v-avatar>
              <v-img :src="proxy.globalInfo.avatarUrl + data.send_user_id"></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.send_user_id}`"
                  >@{{ data.send_nick_name }}</router-link
                >
                攒了我的 【
                <router-link class="a-link" :to="`/post/${data.article_id}`">{{
                  data.article_title
                }}</router-link>
                】文章
                <span class="create-time">{{ data.create_time }}</span>
              </div>
            </div>
          </div>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
import { useStore } from "vuex";
const store = useStore();
const router = useRouter();
const route = useRoute();
const api = {
  loadMessageList: "/ucenter/loadMessageList",
};

const loading = ref(false);
const messageListInfo = ref({});
const activeTabName = ref("reply");
const tabChange = (type) => {
  router.push(`/user/message/${type}`);
};
const loadMessageList = async () => {
  loading.value = true;
  let result = await proxy.Request({
    url: api.loadMessageList,
    showLoading: false,
    params: {
      code: activeTabName.value,
      pageNo: messageListInfo.value.pageNo,
    },
  });
  if (!result) {
    return;
  }
  loading.value = false;
  messageListInfo.value = result.data;
  store.commit("resetMessage", activeTabName.value);
};
// 消息数量
const messageCountInfo = ref({});
watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
watch(
  () => route.params.type,
  (newval, oldval) => {
    if (newval) {
      activeTabName.value = newval;
      loadMessageList();
    }
  },
  { immediate: true, deep: true }
);
const currentUserInfo = ref({});
onMounted(
  ()=>{
    currentUserInfo.value=store.getters.getLoginUserInfo;
  }
)
watch(
  ()=>store.state.loginUserInfo,
  (newVal,oldVal)=>{
    if(newVal){
      currentUserInfo.value=newVal
    }
  },
  {immediate:true,deep:true}
)
</script>

<style lang="scss">
.message-center {
  background: #fff;
  .user-banner {
    color: #9ba7b9;
    line-height: 35px;
    .icon-right {
      padding: 0 5px;
    }
  }
  .message-panel {
    background: #fff;
    padding: 10px;
    // margin-top: 5px;
    .tab-item {
      padding: 0 10px;
      position: relative;
      .count-tag {
        position: absolute;
        right: -10px;
        height: 15px;
        line-height: 15px;
        min-width: 20px;
        display: inline-block;
        background: #f56c6c;
        border-radius: 10px;
        font-size: 13px;
        text-align: center;
        color: #fff;
        margin-left: 10px;
      }
    }
    .go-ucenter {
      position: absolute;
      top: 85px;
      right: 240px;
      font-size: 14px;
    }
  }
  .message-list {
    .message-item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      font-size: 14px;
      border-bottom: 1px solid #ddd;
      padding: 0px 10px 10px 20px;
      .message-content {
        margin-left: 5px;
        .create-time {
          color: #9ba7b9;
          margin-left: 10px;
        }
        .reply-content {
          border-left: 2px solid rgb(50, 133, 255);
          padding-left: 5px;
          margin-top: 5px;
        }
      }
    }
  }
}
</style>