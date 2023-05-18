<template>
  <div
    class="container-body search-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div
      class="search-panel"
      :style="{ 'padding-top': startSearch ? '0px' : '200px' }"
    >
      <el-form :model="formData" :rules="rules" ref="formDataRef">
        <el-form-item prop="">
          <el-input
            size="large"
            placeholder="请输入想要搜索的内容"
            v-model="formData.keyword"
            @keyup.enter="search"
            @focus="startSearchHandler"
          >
            <template #suffix>
              <v-icon
                icon="mdi-search-web"
                @click="search"
                @blur="formData.keyword = $event.target.value.trim()"
              ></v-icon>
              <!-- <span class="iconfont icon-account"></span> -->
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <div>
      <v-sheet class="pa-2 ma1">
        <DataList
          :loading="loading"
          :dataSource="articleListInfo"
          noDataMsg="暂时还没有此数据呦"
          @loadData="search"
        >
          <template #default="{ data }">
            <ArticleListItem :data="data"></ArticleListItem>
          </template>
        </DataList>
      </v-sheet>
    </div>
  </div>
</template>

<script setup>
import ArticleListItem from "./forum/ArticleListItem.vue";
import { useStore } from "vuex";
import LoginAndRegister from "./LoginAndRegister.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store = useStore();
const api = {
  search: "/forum/search",
};
const rules = {
  keyword: [
    { required: true, message: "请输入内容哦" },
    { min: 2, message: "不要吝啬你的键盘，多敲几下呗" },
  ],
};
const formData = ref({});
const formDataRef = ref();
const articleListInfo = ref({});
// 开始搜索
const startSearch = ref(false);
const loading = ref(false);
const search = async () => {
  loading.value = true;
  let params = {
    pageNo: articleListInfo.value.pageNo,
    keyword: formData.value.keyword,
  };
  let result = await proxy.Request({
    url: api.search,
    showLoading: false,
    params: params,
  });
  loading.value = false;
  if (!result) {
    return;
  }
  articleListInfo.value = result.data;
};
const startSearchHandler = () => {
  startSearch.value = true;
};
</script>

<style lang="scss">
.search-body {
  background: #fff;
  padding: 10px;
  min-height: calc(100vh - 60px);
  .search-panel {
    display: flex;
    justify-content: center;
    .el-input {
      width: 700px;
    }
  }
}
</style>