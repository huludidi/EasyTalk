<template>
  <div>
    <div class="data-list">
      <div class="top-panel">
        <el-form :model="searchFormData" label-width="50px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="文章" prop="articleId">
                <el-input
                  placeholder="请输入文章Id"
                  v-model="searchFormData.articleId"
                  clearable
                  @keyup.native="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="内容" prop="contentFuzzy">
                <el-input
                  placeholder="支持模糊查询"
                  v-model="searchFormData.contentFuzzy"
                  clearable
                  @keyup.native="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="昵称" prop="nickNameFuzzy">
                <el-input
                  placeholder="请输入昵称"
                  v-model="searchFormData.nickNameFuzzy"
                  clearable
                  @keyup.native="loadDataList"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="状态" prop="status">
                <el-select
                  placeholder="请选择状态"
                  clearable
                  v-model="searchFormData.status"
                  :style="{ width: '100%' }"
                >
                  <el-option :value="-1" label="已删除"></el-option>
                  <el-option :value="0" label="待审核"></el-option>
                  <el-option :value="1" label="已审核"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="审核" prop="audit">
                <el-select
                  placeholder="请选择转台"
                  clearable
                  v-model="searchFormData.audit"
                  :style="{ width: '100%' }"
                >
                  <el-option :value="0" label="未通过"></el-option>
                  <el-option :value="1" label="已通过"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-button-group>
                <el-button type="primary" @click="loadDataList">搜索</el-button>
                <el-button type="success" @click="auditBatch"
                  >批量审批</el-button
                >
                <el-button type="danger" @click="delBatch">批量删除</el-button>
              </el-button-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <Table
        ref="tableRef"
        :columns="columns"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
      >
        <!-- 用户信息 -->
        <template #userInfo="{ row }">
          <div class="user-info">
            <v-avatar
              color="grey-darken-3"
              :image="proxy.globalInfo.avatarUrl + row.user_id"
            ></v-avatar>
            <div class="name-info">
              <div>
                <a
                  :href="`${proxy.globalInfo.webDomain}user/${row.user_id}`"
                  class="a-link"
                  target="_blank"
                  >{{ row.nick_name }}</a
                >
              </div>
            </div>
          </div>
        </template>

        <!-- 评论内容 -->
        <template #contentInfo="{ row }">
          <span>
            <a
              class="a-link"
              target="_blank"
              :href="proxy.globalInfo.webDomain + 'post/' + row.article_id"
              >查看文章</a
            >
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.img_path">
            <CommentImage
              :src="proxy.globalInfo.imageUrl + row.img_path"
            ></CommentImage>
          </div>
        </template>
        <!-- 状态 -->
        <template #statusInfo="{ row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
          <div v-if="row.audit == 0" :style="{ color: 'red' }">未通过</div>
          <div v-if="row.audit == 1" :style="{ color: 'green' }">已通过</div>
        </template>
        <!-- 地址 -->
        <template #addressInfo="{ row }">
          <div>
            {{ JSON.parse(row.user_ip_address).country_name }}
            /{{ JSON.parse(row.user_ip_address).region }}
          </div></template
        >
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delComment(row)">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item @click="audit(row)" v-if="row.audit == 0">
                    审核
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
  </div>
</template>

<script setup>
import CommentImage from "@/views/forum/CommentImage.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
const { proxy } = getCurrentInstance();
// 列表
const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 200,
    scopedSlots: "userInfo",
  },
  {
    label: "评论内容",
    prop: "content",
    scopedSlots: "contentInfo",
  },
  {
    label: "点赞",
    width: 150,
    prop: "good_count",
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "发布时间",
    prop: "post_time",
    width: 180,
  },
  {
    label: "发布地址",
    prop: "userIpAddress",
    width: 100,
    scopedSlots: "addressInfo",
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const api = {
  loadComment: "/manageForum/loadComment",
  delComment: "/manageForum/delComment",
  auditComment: "/manageForum/auditComment",
};
const searchFormData = ref({});

// 列表
const tableData = ref({});
const tableOptions = {
  extHeight: 95,
  selectType: "checkbox",
};
// 加载信息
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    articleId: searchFormData.value.articleId,
    contentFuzzy: searchFormData.value.contentFuzzy,
    nickNameFuzzy: searchFormData.value.nickNameFuzzy,
    status: searchFormData.value.status,
    audit: searchFormData.value.audit,
  };
  let result = await proxy.Request({
    url: api.loadComment,
    showLoading: false,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};
loadDataList();
// 批量选择
const seleckBatchList = ref([]);
const setRowSelected = (rows) => {
  seleckBatchList.value = [];
  rows.forEach((element) => {
    seleckBatchList.value.push(element.comment_id);
  });
};
// 批量审批
const tableRef=ref();
const auditBatch = () => {
  proxy.Confirm("你确定要批量审批吗？", async () => {
    let result = await proxy.Request({
      url: api.auditComment,
      params: {
        commentIds: seleckBatchList.value,
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  });
};
// 单条审核
const audit = (row) => {
  proxy.Confirm(`你确定要审核通过此评论吗？`, async () => {
    let result = await proxy.Request({
      url: api.auditComment,
      params: {
        commentIds: row.comment_id,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};
// 批量删除
const delBatch = () => {
    proxy.Confirm("你确定要批量删除吗？", async () => {
    let result = await proxy.Request({
      url: api.delComment,
      params: {
        commentIds: seleckBatchList.value,
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  });
};
// 单个删除
const delComment=(row)=>{
  proxy.Confirm(`确定要删除此评论吗？`, async () => {
    let result = await proxy.Request({
      url: api.delComment,
      params: {
        commentIds: row.comment_id,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
}
</script>

<style lang="scss" scoped>
.el-button-group {
  display: flex;
  margin-left: 5px;
}
.data-list {
  .user-info {
    display: flex;
    align-items: center;
    .name-info {
      margin-left: 5px;
      font-size: 13px;
      display: flex;
      flex-direction: column;
    }
  }
  .op {
    .iconfont {
      cursor: pointer;
    }
  }
}
</style>