<template>
  <div class="school-list">
    <div class="list-head">
      <v-icon icon="mdi mdi-medal" color="red"></v-icon>
      <span>高校发布榜 TOP5</span>
    </div>
    <v-divider :thickness="1"></v-divider>
    <div class="list-body">
      <v-list :items="listitems" item-props lines="three">
        <template v-slot:subtitle="{ subtitle }">
          <div v-html="subtitle"></div>
        </template>
      </v-list>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from "vue";
const listitems = ref([
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/1.jpg",
    title: "剑桥大学",
    subtitle: "发布数量：520",
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/2.jpg",
    title: "伦敦大学",
    subtitle: "发布数量：519",
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/3.jpg",
    title: "休斯顿大学",
    subtitle: "发布数量：518",
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/4.jpg",
    title: "哈佛大学",
    subtitle: "发布数量：517",
  },
  { type: "divider", inset: true },
  {
    prependAvatar: "https://cdn.vuetifyjs.com/images/lists/5.jpg",
    title: "香港大学",
    subtitle: "发布数量：515",
  },
]);
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
    .v-list-item--density-default.v-list-item--three-line {
      min-height: 70px;
    }
    .v-list-item-title {
      margin-bottom: 8px;
      font-size: 17px;
    }
  }
}
</style>