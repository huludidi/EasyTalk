<template>
  <v-app>
    <v-main>
      <el-config-provider :locale="locale" :message="config">
        <router-view />
      </el-config-provider>
    </v-main>
  </v-app>
</template>

<script setup>
import { reactive } from "vue";
import zhCn from "element-plus/lib/locale/lang/zh-cn";
const locale = zhCn;
const config = reactive({
  max: 1,
});
</script>
<style lang="scss">
// ::-webkit-scrollbar {
//   width: 0 !important;
// }
// ::-webkit-scrollbar {
//   width: 0 !important;height: 0;
// }
::-webkit-scrollbar {
  -webkit-appearance: none;
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0;
}
::-webkit-scrollbar-thumb {
  cursor: pointer;
  border-radius: 5px;
  background: rgba(50, 132, 255, 0.568);
  transition: color 0.2s ease;
}
::-webkit-scrollbar-thumb:hover {
  background: rgba(50, 132, 255, 0.826);
}

</style>
