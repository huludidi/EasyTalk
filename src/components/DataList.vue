<template>
  <div>
    <!-- <div v-for="(item,index) in dataSource.list" :key="index">
      <slot :data="item"></slot>
    </div> -->
    <div>
      <slot :data="item"></slot>
    </div>
    <div class="pagination">
      <el-pagination
        v-if="dataSource.pageTotal > 1"
        background
        :total="dataSource.totalCount"
        :current-page.sync="dataSource.pagNo"
        layout="prev,pager,next"
        @current-change="handlePageNoChange"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const props = defineProps({
  dataSource: {
    type: Object,
  },
});
const item = ref({});
item.value = {
  title: "title",
  data: "这是信息",
  userId: "123",
};
const handlePageNoChange = (pageNo) => {
  console.log(pageNo);
};
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}
</style>