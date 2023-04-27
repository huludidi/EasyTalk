<template>
  <div class="layout-body">
    <el-container>
      <el-aside class="aside" :style="{ width: asideWidth + 'px' }">
        <div class="logo">
          <span v-if="!menuCollapse">Easytalk管理后台</span>
        </div>
        <div class="menu-panel">
          <el-menu>
            <el-menu
              :default-openeds="defaultOpends"
              :collapse-transition="false"
              :collapse="menuCollapse"
              class="el-menu-vertical-demo"
              default-active="2"
              active-text-color="#ffd04b"
              background-color="#242434"
              text-color="#fff"
              router
              :defaultActive="defaultActive"
            >
              <template v-for="(item, index) in menuList">
                <el-sub-menu :index="item.path" v-if="item.children">
                  <template #title>
                    <i :class="['iconfont', item.icon]"></i>
                    <span class="menu-name">{{ item.menuName }}</span>
                  </template>
                  <el-menu-item
                    v-for="subItem in item.children"
                    :index="subItem.path"
                  >
                    <span class="menu-name">{{ subItem.menuName }}</span>
                  </el-menu-item>
                </el-sub-menu>
              </template>
            </el-menu>
          </el-menu>
        </div>
      </el-aside>
      <el-container class="content-container">
        <el-header class="header-container">
          <div
            :class="[
              'op-menu',
              'iconfont',
              menuCollapse ? 'icon-expand' : 'icon-collapse',
            ]"
            @click="opMenu"
          ></div>
          <div class="menu-bread">
            <el-breadcrumb>
              <template v-for="item in menuBreadCrumList">
                <el-breadcrumb-item v-if="item.name">{{
                  item.name
                }}</el-breadcrumb-item>
              </template>
            </el-breadcrumb>
          </div>
        </el-header>
        <el-main class="main-container">
          <div class="tag-content">
            <el-tabs
              type="border-card"
              closable
              v-model="defaultActive"
              @tab-change="tabClick"
              @edit="editTab"
            >
              <el-tab-pane
                v-for="item in tabList"
                :name="item.path"
                :label="item.menuName"
              >
                <router-view /></el-tab-pane
              >
            </el-tabs>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, computed, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const asideWidth = ref(250);

// 默认选中
const defaultActive = ref();

const menuList = [
  {
    menuName: "数据统计",
    icon: "icon-article",
    path: "/manage/datashow",
    children: [
      {
        menuName: "数据页",
        path: "/manage/datashow/show",
      },
    ],
  },
  {
    menuName: "内容管理",
    icon: "icon-article",
    path: "/manage/forum",
    children: [
      {
        menuName: "帖子管理",
        path: "/manage/forum/article",
      },
      {
        menuName: "评论管理",
        path: "/manage/forum/comment",
      },
      {
        menuName: "板块管理",
        path: "/manage/forum/board",
      },
    ],
  },
  {
    menuName: "用户管理",
    icon: "icon-user",
    path: "/manage/user",
    children: [
      {
        menuName: "用户列表",
        path: "/manage/user/list",
      },
    ],
  },
  {
    menuName: "设置",
    icon: "icon-settings",
    path: "/manage/settings",
    children: [
      {
        menuName: "系统设置",
        path: "/manage/settings/sys",
      },
    ],
  },
];

const menuMap = {};
// 默认打开的菜单
const defaultOpends = ref([]);
const init = () => {
  menuList.forEach((item) => {
    defaultOpends.value.push(item.path);
    if (item.children) {
      item.children.forEach((subItem) => {
        menuMap[subItem.path] = subItem;
      });
    }
  });
};

// 收起关闭菜单
const menuCollapse = ref(false);
const opMenu = () => {
  menuCollapse.value = !menuCollapse.value;
  if (menuCollapse.value) {
    asideWidth.value = 64;
  } else {
    asideWidth.value = 250;
  }
};
// tab操作
const tabList = ref([]);
const tabClick = (name) => {
  router.push(name);
};
const editTab = (targetKey, action) => {
  if (action !== "remove") {
    return;
  }
  let currentPath = defaultActive.value;
  let tabs = tabList.value;
  // 关闭当前选中的tab
  if (targetKey == defaultActive.value) {
    tabs.forEach((tab, index) => {
      if (tab.path == targetKey) {
        let nextTab = tabs[index + 1] || tabs[index - 1];
        if (nextTab) {
          currentPath = nextTab.path;
        }
      }
    });
  }
  tabList.value = tabs.filter((tab) => {
    return tab.path != targetKey;
  });
  if (currentPath != defaultActive.value) {
    router.push(currentPath);
  }
};
// 面包屑
const menuBreadCrumList = ref([]);
init();
watch(
  () => route,
  (newval, oldval) => {
    defaultActive.value = route.path;
    menuBreadCrumList.value = route.matched;
    let currentMenu = tabList.value.find((item) => {
      return item.path == defaultActive.value;
    });
    if (!currentMenu) {
      tabList.value.push(menuMap[route.path]);
    }
  },
  { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.el-popper {
  background: #383849;
  border: none !important;
  .el-menu-item.is-active {
    background: var(--el-coloe-primary);
  }
  .el-menu-item:hover {
    color: #d8d8ee;
  }
  .el-menu--popup {
    padding: 0px;
  }
}
.layout-body {
  .aside {
    color: #242434;
    background: #272732;
    .logo {
      display: flex;
      height: 50px;
      color: #fff;
      background: #191828;
      align-items: center;
      font-size: 18px;
      padding-left: 5px;
    }
    .menu-panel {
      height: calc(100vh - 50px);
      .menu-name {
        padding-left: 10px;
      }
      // 去除边框
      .el-menu {
        border-right: none;
      }
      // 每个菜单的颜色
      .el-menu-item {
        background: rgb(58, 58, 71);
      }
      // 选中的颜色
      .el-menu-item.is-active {
        color: #fff;
        background: var(--el-color-primary);
      }
      .el-menu-item:hover {
        color: #9c9c9c;
      }
    }
  }
  .content-container {
    display: flex;
    flex-direction: column;
    flex: auto;
    .header-container {
      background: #fff;
      border-bottom: 1px solid #ddd;
      height: 50px;
      line-height: 50px;
      padding: 0px 5px !important;
      display: flex;
      align-items: center;
      .op-menu {
        font-size: 20px;
        cursor: pointer;
        color: #3a3a40;
      }
      .menu-bread {
        margin-left: 10px;
      }
    }
    .main-container {
      padding: 0px;
    }
  }
}
</style>