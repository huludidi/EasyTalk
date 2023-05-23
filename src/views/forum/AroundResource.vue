<template>
  <div
    class="container-body resource-body"
    :style="{ width: proxy.globalInfo.bodyWidth + 'px' }"
  >
    <div class="tags-group">
      <v-chip-group v-model="selection" color="#3285FF" mandatory filter>
        <v-chip value="酒店">酒店</v-chip>
        <v-chip value="饭店">饭店</v-chip>
        <v-chip value="医院">医院</v-chip>
        <v-chip value="酒吧">酒吧</v-chip>
      </v-chip-group>
      <div class="search-box">
        <el-input
          v-model="formData.target"
          placeholder="Please input"
        ></el-input>
        <v-btn
          color="rgb(50, 133, 255)"
          :style="{ 'margin-left': '5px', height: '30px', color: '#fff' }"
          @click="searchResource"
          >搜索</v-btn
        >
      </div>
    </div>
    <div class="resource-inner">
      <v-row v-if="dataList.length > 0">
        <v-col cols="4" v-for="(item, key) in dataList" :key="key">
          <ResourceItem :data="item"></ResourceItem>
        </v-col>
      </v-row>
      <div v-else>
        <div class="null-inner">
          <v-icon size="120" icon="mdi-emoticon-dead-outline"></v-icon>
          <span>什么都没有查到~~</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, watch, onBeforeMount, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";
const store = useStore();
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  getResource: "/resource/getResource",
};
const formData = ref({});
const selection = ref();
onMounted(() => {
  selection.value = "酒店";
});
watch(
  () => selection.value,
  (newVal, oldVal) => {
    console.log(newVal);
    formData.value.target = newVal;
    loadDataList();
  }
);

// 加载周边资源
const dataList = ref([]);
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.getResource,
    params: {
      target: formData.value.target,
    },
  });
  if (!result) {
    return;
  }
  dataList.value = result.data;
  console.log(dataList);
};
const searchResource = () => {
  loadDataList();
};
</script>

<style lang="scss" scoped>
.resource-body {
  .tags-group {
    display: flex;
    justify-content: space-between;
    .search-box {
      width: 300px;
      display: flex;
      align-items: center;
    }
  }
  .resource-inner {
    background: #fff;
    min-height: calc(100vh - 140px);
    margin-top: 15px;
    padding: 0 10px 0 10px;
    .null-inner {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: center;
    }
  }
}
</style>