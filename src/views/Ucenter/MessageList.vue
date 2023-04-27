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
              <span class="count-tag">50</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likePost">
          <template #label>
            <div class="tab-item">
              <span>攒了我的文章</span>
              <span class="count-tag">50</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="likeComment">
          <template #label>
            <div class="tab-item">
              <span>攒了我的评论</span>
              <span class="count-tag">50</span>
            </div>
          </template>
        </el-tab-pane>
        <el-tab-pane name="sys">
          <template #label>
            <div class="tab-item">
              <span>系统消息</span>
              <span class="count-tag">50</span>
            </div>
          </template>
        </el-tab-pane>
      </el-tabs>
      <router-link :to="`/user/${userId}`" class="a-link go-ucenter"
        >&lt;&lt;个人中心</router-link
      >
    </div>
    <div class="message-list">
      <DataList :dataSource="articleListInfo">
        <template #default="{ data }">
          <!-- 系统消息 -->
          <div class="message-item" v-if="activeTabName == 'sys'">
            <div class="message-content">
              <span v-html="`<h>这是系统消息<h>`"></span>
              <span class="create-time">2023-01-01</span>
            </div>
          </div>
          <!-- 回复了我 -->
          <div class="message-item" v-if="activeTabName == 'reply'">
            <v-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.sendUserId}`"
                  >@葫芦哥哥</router-link
                >
                对我的文章
                【 
                <router-link class="a-link" :to="`/post/123`"
                  >怎样五天赚两亿</router-link
                >
                】发表了评论
                <span class="create-time">2023-01-01 12:12:12</span>
              </div>
              <div class="reply-content" v-html="`<p>这是回复消息<p>`"></div>
            </div>
          </div>
          <!-- 攒了我评论 -->
          <div class="message-item" v-if="activeTabName == 'likeComment'">
            <v-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.sendUserId}`"
                  >@葫芦哥哥</router-link
                >
                对我的文章
                【 
                <router-link class="a-link" :to="`/post/123`"
                  >怎样五天赚两亿！！</router-link
                >
                】赞了我的评论
                <span class="create-time">2023-01-01 12:12:12</span>
              </div>
            </div>
          </div>
          <!-- 攒了我文章 -->
          <div class="message-item" v-if="activeTabName == 'likePost'">
            <v-avatar>
              <v-img src="https://cdn.vuetifyjs.com/images/john.jpg"></v-img>
            </v-avatar>
            <div class="message-content">
              <div>
                <router-link class="a-link" :to="`/user/${data.sendUserId}`"
                  >@葫芦哥哥</router-link
                >
                攒了我的
                【 
                <router-link class="a-link" :to="`/post/123`"
                  >怎样五天赚两亿！！</router-link
                >
                】文章
                <span class="create-time">2023-01-01 12:12:12</span>
              </div>
            </div>
          </div>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const articleListInfo = ref({
  pagNo: 1,
  pageTotal: 1,
  totalCount: 5,
});

const activeTabName = ref("reply");
const tabChange = (type) => {
  router.push(`/user/message/${type}`);
};

watch(
  () => route.params.type,
  (newval, oldval) => {
    if (newval) {
      activeTabName.value = newval;
    }
  }
);
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
    margin-top: 5px;
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
      top: 15px;
      right: 10px;
      font-size: 14px;
    }
  }
  .message-list {
    .message-item {
      display: flex;
      justify-content: flex-start;
      font-size: 14px;
      border-bottom: 1px solid #ddd;
      padding: 0px 10px 10px 20px;
      .message-content {
        margin-left: 5px;
        .create-time {
          color: #9ba7b9;
          margin-left: 10px;
        }
        .reply-content{
          border-left: 2px solid rgb(50, 133, 255);
          padding-left: 5px;
          margin-top: 5px;

        }
      }
    }
  }
}
</style>