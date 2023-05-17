<template>
  <div class="school-list">
    <div class="list-head">
      <v-icon icon="mdi mdi-medal" color="red"></v-icon>
      <span>高校发布榜 TOP5</span>
    </div>
    <v-divider :thickness="1"></v-divider>
    <div class="list-body">
      <v-list :items="listitems" item-props lines="two">
        <template v-slot:subtitle="{ subtitle }">
          <div v-html="subtitle"></div>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadSchoolSort: "/school/schoolSort",
};

const sortInfo = ref([]);
const listitems = ref([]);
const loadSchoolSort = async () => {
  let result = await proxy.Request({
    url: api.loadSchoolSort,
    showLoading:false

  });
  if (!result) {
    return;
  }
  sortInfo.value = result.data;
  let items = [];
  const keys = Object.keys(sortInfo.value);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    let cover = sortInfo.value[key].cover==null?"11/11":sortInfo.value[key].cover
    let dict = {
      prependAvatar: proxy.globalInfo.imageUrl + cover,
      title: sortInfo.value[key].ch_name,
      subtitle: "发布数量：" + sortInfo.value[key].count,
    };
    items.push(dict);
    if (i !== keys.length - 1) {
      items.push({
        type: "divider",
        inset: true,
      });
    }
  }
  listitems.value = items;
};
loadSchoolSort();
</script>

<style lang="scss" scoped>
.school-list {
  .list-head {
    padding: 10px 0 0 0;
    margin-bottom: 10px;
  }
  .list-body {
    .v-list-item__prepend {
      align-self: center;
    }
    .v-list-item-title {
      margin-bottom: 8px;
      font-size: 17px;
    }
  }
}
</style>