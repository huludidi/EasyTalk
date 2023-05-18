<template>
  <div>
    <div v-if="!loading&&dataSource.list!=null&&dataSource.list.length==0">
      <NoData :msg="noDataMsg"></NoData>
    </div>
    <div class="skeleton" v-if="loading">
      <el-skeleton :row="2" animated></el-skeleton>
    </div>
    <div v-else v-for="(item, index) in dataSource.list" :key="index">
      <slot :data="item"></slot>
    </div>
    <div class="pagination">
      <el-pagination
        v-if="dataSource.pageTotal > 1"
        :page-size="dataSource.pageSize"
        :page-count="dataSource.pageTotal"
        background
        :total="dataSource.totalCount"
        :current-page="parseInt(dataSource.pageNo)"
        @current-change="handlePageNoChange"
        layout="prev,pager,next"
        v-model:current-page="dataSource.pageNo"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from "vue";
const props = defineProps({
  pageSize:{
    type:Number,
    default:10
  },
  dataSource: {
    type: Object,
  },
  loading: {
    type: Boolean,
  },
  noDataMsg:{
    type:String,
    default:"这里还未有人涉足~"
  }
});
const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo) => {
  props.dataSource.pageNo = pageNo;
  emit("loadData");
};
</script>

<style lang="scss" scoped>
.skeleton {
  padding: 15px;
}
.pagination {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  margin-bottom: 10px;
}
</style>