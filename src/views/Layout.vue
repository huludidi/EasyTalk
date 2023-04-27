<template>
    <div>
      <div class="header" v-show="showHeader">
        <div
          class="header-content"
          :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
        >
          <router-link to="/" class="logo">
            <span
              v-for="(item, index) in logoInfo"
              :key="index"
              :style="{ color: item.color }"
              >{{ item.letter }}</span
            >
          </router-link>
          <!-- 板块信息 -->
          <div class="menu-panel">
            <v-chip-group mandatory filter v-model="neighter">
              <v-chip color="#3285FF">全部 </v-chip>
              <el-popover
                placement="bottom-start"
                :width="250"
                trigger="hover"
                disable="false"
              >
                <template #reference>
                  <v-chip color="#FB3624">求助 </v-chip>
                </template>
                <v-chip-group filter>
                  <v-chip>租房 </v-chip>
                  <v-chip>找室友 </v-chip>
                  <v-chip>找材料 </v-chip>
                  <v-chip>找老乡 </v-chip>
                </v-chip-group>
              </el-popover>
              <el-popover placement="bottom-start" :width="250" trigger="hover">
                <template #reference>
                  <v-chip color="#FFBA02">分享 </v-chip>
                </template>
                <v-chip-group filter>
                  <v-chip>学习经验分享 </v-chip>
                  <v-chip>日常生活分享 </v-chip>
                </v-chip-group>
              </el-popover>
              <el-popover placement="bottom-start" :width="250" trigger="hover">
                <template #reference>
                  <v-chip color="#25B24E">指南 </v-chip>
                </template>
                <v-chip-group filter>
                  <v-chip>入学指南 </v-chip>
                  <v-chip>留学申请指南</v-chip>
                  <v-chip>回国指南</v-chip>
                </v-chip-group>
              </el-popover>
                  <v-chip color="#25B24E">资源 </v-chip>
            </v-chip-group>
          </div>
          <!-- 登录、注册、用户信息 -->
          <div class="user-info-panel">
            <div class="op-btn">
              <v-btn
                rounded="pill"
                color="rgb(50, 133, 255)"
                size="large"
                :style="{ height: '40px' ,color:'#fff'}"
                @click="newPost"
              >
                发帖
                <v-icon class="iconfont" icon="mdi-plus" />
              </v-btn>
              <v-btn
                rounded="pill"
                color="rgb(50, 133, 255)"
                size="large"
                :style="{ 'margin-left': '10px', height: '40px' ,color:'#fff'}"
              >
                搜索
                <v-icon class="iconfont" icon="mdi mdi-magnify" />
              </v-btn>
            </div>
            <div v-if="false" class="container">
              <div class="message-info">
                <el-dropdown>
                  <v-badge dot color="error">
                    <v-icon
                      class="message"
                      size="x-large"
                      color="rgb(50, 133, 255)"
                      icon="mdi-message"
                    ></v-icon>
                  </v-badge>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="gotoMessage('reply')">回复了我</el-dropdown-item>
                      <el-dropdown-item @click="gotoMessage('likePost')">赞了我的文章</el-dropdown-item>
                      <el-dropdown-item @click="gotoMessage('likeComment')">赞了我的评论</el-dropdown-item>
                      <el-dropdown-item @click="gotoMessage('sys')">系统消息</el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
              <div class="user-avatar">
                <avatar :userId="123"></avatar>
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
import { useStore } from "vuex";
import LoginAndRegister from "./LoginAndRegister.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
// 获取按下的chip的值
const neighter = ref(0);
const api = {};

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
  let scrollTop =
    document.documentElement.scrollTop ||
    document.body.scrollTop ||
    window.pageYOffset;
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
const getUserInfo = () => {};
// 监听登录用户信息
const userInfo = ref({});
watch(
  () => store.state.loginUserInfo,
  (newVal, oldVal) => {
    if (newVal != undefined && newVal != null) {
      userInfo.value = newVal;
    } else {
      userInfo.value = {};
    }
  },
  { immediate: true, deep: true }
);

// 发帖
const newPost=()=>{
  router.push("/newPost");
}
// 跳转消息中心
const gotoMessage=(type)=>{
  router.push(`/user/message/${type}`);
}


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
</style>