<template>
  <div>
    <div class="header" v-show="showHeader">
      <div
        class="header-content"
        :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
      >
        <router-link to="" @click="goFirstPage" class="logo">
          <span
            v-for="(item, index) in logoInfo"
            :key="index"
            :style="{ color: item.color }"
            >{{ item.letter }}</span
          >
        </router-link>
        <!-- 板块信息 -->
        <div class="menu-panel">
          <v-chip-group v-model="selection" mandatory>
            <v-chip color="#3285FF" to="/" :value="0" @click="allHandler()"
              >全部
            </v-chip>
            <el-popover
              placement="bottom-start"
              :width="250"
              trigger="hover"
              disable="false"
              v-for="(item, key) in boardList"
              :key="key"
            >
              <template #reference>
                <v-chip
                  :value="item.board_id"
                  color="#FB3624"
                  @click="boardClickHandler(item)"
                  >{{ item.board_name }}
                </v-chip>
              </template>
              <v-chip-group v-if="item.children">
                <v-chip
                  v-for="child in item.children"
                  :key="child.board_id"
                  @click="subBoardClickHandler(child)"
                  >{{ child.board_name }}
                </v-chip>
              </v-chip-group>
            </el-popover>
            <v-chip color="#25B24E" @click="goResource" :value="1">周边</v-chip>
          </v-chip-group>
        </div>
        <!-- 登录、注册、用户信息 -->
        <div class="user-info-panel">
          <div class="op-btn">
            <v-btn
              rounded="pill"
              color="rgb(50, 133, 255)"
              size="large"
              :style="{ height: '40px', color: '#fff' }"
              @click="newPost"
            >
              发帖
              <v-icon class="iconfont" icon="mdi-plus" />
            </v-btn>
            <v-btn
              rounded="pill"
              color="rgb(50, 133, 255)"
              size="large"
              :style="{ 'margin-left': '10px', height: '40px', color: '#fff' }"
              @click="goSearch"
            >
              搜索
              <v-icon class="iconfont" icon="mdi mdi-magnify" />
            </v-btn>
          </div>
          <div v-if="userInfo.userId" class="container">
            <div class="message-info">
              <el-dropdown>
                <div>
                  <v-badge dot color="error" v-if="messageCountInfo.total > 0">
                    <v-icon
                      class="message"
                      size="x-large"
                      color="rgb(50, 133, 255)"
                      icon="mdi-message"
                    ></v-icon>
                  </v-badge>
                  <v-icon
                    v-else
                    class="message"
                    size="x-large"
                    color="rgb(50, 133, 255)"
                    icon="mdi-message"
                  ></v-icon>
                </div>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      @click="gotoMessage('reply')"
                      class="manage-item"
                    >
                      <v-icon icon="mdi-message-reply-text"></v-icon>
                      <span class="text">回复了我</span>
                      <v-badge
                        v-if="messageCountInfo.reply > 0"
                        class="count-tag"
                        color="error"
                        :content="messageCountInfo.reply"
                        inline
                      ></v-badge>
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('likePost')"
                      class="manage-item"
                    >
                      <v-icon icon="mdi mdi-hand-heart"></v-icon>
                      <span class="text">赞了文章</span>
                      <v-badge
                        v-if="messageCountInfo.likePost > 0"
                        class="count-tag"
                        color="error"
                        :content="messageCountInfo.likePost"
                        inline
                      ></v-badge>
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('likeComment')"
                      class="manage-item"
                    >
                      <v-icon icon="mdi mdi-hand-heart"></v-icon>
                      <span class="text">赞了评论</span>
                      <v-badge
                        v-if="messageCountInfo.likeComment > 0"
                        class="count-tag"
                        color="error"
                        :content="messageCountInfo.likeComment"
                        inline
                      ></v-badge>
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('attachmentDownload')"
                      class="manage-item"
                    >
                      <v-icon icon="mdi-file-cloud"></v-icon>
                      <span class="text">下载了附件</span>
                      <v-badge
                        v-if="messageCountInfo.attachmentDownload > 0"
                        class="count-tag"
                        color="error"
                        :content="messageCountInfo.attachmentDownload"
                        inline
                      ></v-badge>
                    </el-dropdown-item>
                    <el-dropdown-item
                      @click="gotoMessage('sys')"
                      class="manage-item"
                    >
                      <v-icon icon="mdi mdi-cog"></v-icon>
                      <span class="text">系统消息</span>
                      <v-badge
                        v-if="messageCountInfo.sys > 0"
                        class="count-tag"
                        color="error"
                        :content="messageCountInfo.sys"
                        inline
                      ></v-badge>
                    </el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="user-avatar">
              <avatar
                :userInfo="userInfo"
                :class="`${
                  isHovering ? 'animate__animated animate__rotateIn' : ''
                }`"
                @mouseover="onMouseOver"
                @mouseleave="onMouseLeave"
              ></avatar>
            </div>
          </div>
          <v-btn-group
            v-else
            divided
            rounded="xl"
            :style="{ 'margin-left': '10px', height: '40px' }"
          >
            <v-btn @click="loginAndregister(1)"> 登录 </v-btn>
            <v-btn @click="loginAndregister(0)"> 注册 </v-btn>
          </v-btn-group>
        </div>
      </div>
    </div>
    <div class="body-content">
      <router-view></router-view>
    </div>
    <!-- 登录 注册 -->
    <LoginAndRegister ref="loginRegisterRef"></LoginAndRegister>
  </div>
</template>

<script setup>
import {ElMessageBox} from "element-plus"
import { useStore } from "vuex";
import LoginAndRegister from "./LoginAndRegister.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
// 获取按下的chip的值
const api = {
  getUserInfo: "/getUserInfo",
  loadBoard: "/board/loadBoard",
  getMessageCount: "/ucenter/getMessageCount",
};

const logoInfo = ref([
  {
    letter: "E",
    color: "#3285FF",
  },
  {
    letter: "a",
    color: "#FB3624",
  },
  {
    letter: "s",
    color: "#FFBA02",
  },
  {
    letter: "y",
    color: "#3285FF",
  },
  {
    letter: "t",
    color: "#25B24E",
  },
  {
    letter: "a",
    color: "#FD3224",
  },
  {
    letter: "l",
    color: "#FFBA02",
  },
  {
    letter: "k",
    color: "#3285FF",
  },
]);
const showHeader = ref(true);
// 展示和关闭弹窗
const showDialog = ref(true);
// 获取滚动条的高度
const getScrollTop = () => {
  let scrollTop = document.documentElement.scrollTop;
  document.body.scrollTop || window.pageYOffset;
  return scrollTop;
};
const initScroll = () => {
  let initScroll = getScrollTop();
  let scrollType = 0;
  window.addEventListener("scroll", () => {
    let currentScroll = getScrollTop();
    if (currentScroll > initScroll) {
      // 往下滚动
      scrollType = 1;
    } else {
      // 往下滚动
      scrollType = 0;
    }
    if (scrollType == 1 && currentScroll > 100) {
      showHeader.value = false;
    } else if (scrollType == 0) {
      showHeader.value = true;
    }
    initScroll = currentScroll;
  });
};

// 登录函数
const loginRegisterRef = ref();
const loginAndregister = (type) => {
  loginRegisterRef.value.showPanel(type);
};

onMounted(() => {
  initScroll();
  getUserInfo();
});

// 获取用户信息
const getUserInfo = async () => {
  let result = await proxy.Request({
    url: api.getUserInfo,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  store.commit("updateloginUserInfo", result.data);
};
// 获取板块信息
const boardList = ref([]);
const loadBoard = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoard();
// 板块点击跳转
const selection = ref(0);
const subselection = ref(0);
watch(
  () => store.state.activeBoard,
  (newVal, oldVal) => {
    console.log(newVal);
    if (newVal != oldVal) {
      selection.value = newVal;
    }
  },
  { immediate: true, deep: true }
);
const allHandler = () => {
  store.commit("setActiveBoard", 0);
};
const boardClickHandler = (board) => {
  router.push(`/forum/${board.board_id}`);
};
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.p_board_id}/${subBoard.board_id}`);
  store.commit("setActiveBoard", subBoard.p_board_id);
};
// 点击图标跳转
const goFirstPage = () => {
  selection.value = 0;
  store.commit("setActiveBoard", 0);
  router.push("/");
};
// 监听登录用户信息
const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal;
      loadMessgeCount();
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);

// 监听是否展示登录框
watch(
  () => store.state.showLogin,
  (newVal, oldVal) => {
    if (newVal) {
      loginAndregister(1);
    }
  },
  { immediate: true, deep: true }
);
// 周边
const goResource = () => {
  if (!store.getters.getLoginUserInfo) {
    loginAndregister(1);
  } else {
    if (!store.getters.getLoginUserInfo.school) {
      ElMessageBox.alert("请先绑定学校", "提示", {
        "show-close": false,
        callback: (action) => {
          router.go(-1);
        },
      });
    }
  }
  router.push("/forum/resource");
};
// 发帖
const newPost = () => {
  if (!store.getters.getLoginUserInfo) {
    loginAndregister(1);
  } else {
    if (!store.getters.getLoginUserInfo.school) {
      ElMessageBox.alert("请先绑定学校", "提示", {
        "show-close": false,
        callback: (action) => {
          router.go(-1);
        },
      });
    }
    router.push("/newPost");
  }
};
// 跳转消息中心
const gotoMessage = (type) => {
  router.push(`/user/message/${type}`);
};
const messageCountInfo = ref({});
const loadMessgeCount = async () => {
  let result = await proxy.Request({
    url: api.getMessageCount,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  store.commit("setMessageCountInfo", result.data);
};

watch(
  () => store.state.messageCountInfo,
  (newVal, oldVal) => {
    messageCountInfo.value = newVal || {};
  },
  { immediate: true, deep: true }
);
// 头像旋转
const isHovering = ref(false);
const onMouseOver = () => {
  isHovering.value = true;
};
const onMouseLeave = () => {
  isHovering.value = false;
};

const goSearch = () => {
  router.push("/search");
};
</script>

<style lang="scss">
.header {
  top: 0px;
  z-index: 999;
  background: #ffffff;
  width: 100%;
  height: 60px;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  .header-content {
    display: flex;
    align-items: center;
    margin: 0px auto;
    align-content: center;
    height: 60px;
  }
  .logo {
    display: block;
    text-decoration: none;
    margin-right: 5px;
    span {
      font-size: 35px;
    }
  }
  .menu-panel {
    display: flex;
    flex: 1;
    height: 60px;
    .v-chip-group {
      align-items: flex-end;
      margin-left: 10px;
    }
  }
  .user-info-panel {
    width: 345px;
    display: flex;
    align-items: center;
    justify-content: end;
    flex-direction: row;
    .user-avatar {
      margin-left: 5px;
    }
    .op-btn {
      .iconfont {
        margin-left: 0px;
        margin-top: 3px;
      }
    }
    .container {
      display: flex;
      align-items: center;
      justify-content: end;
      .message-info {
        .message {
          margin-left: 10px;
          margin-right: 10px;
        }
      }
    }
  }
}
.el-popover.el-popper {
  padding: 5px;
  .v-chip {
    margin: 2px 4px 2px 0;
  }
}
.body-content {
  margin-top: 60px;
}
.v-main {
  background: rgb(245, 245, 245);
}
.manage-item {
  display: flex;
  justify-content: space-around;
  .text {
    margin-left: 10px;
    flex: 1;
  }
  .count-tag {
    display: block;
  }
}
.el-dropdown-menu {
  width: 170px;
}
</style>