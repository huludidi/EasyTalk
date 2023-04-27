<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
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
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button type="success" @click="auditBatch">批量审批</el-button>
              <el-button type="danger" @click="delBatch">批量删除</el-button>
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <Table
        ref="tableRef"
        :columns="columns"
        :showPagination="true"
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
              image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            ></v-avatar>
            <div class="name-info">
              <div>
                <a
                :href="`${proxy.globalInfo.webDomain}user/123`"
                class="a-link"
                target="_blank"
                >{{ row.nickName }}</a
              >
              </div>
              <div>{{ row.userIpAddress }}</div>
            </div>
          </div>
        </template>
        <!-- 查看文章 -->
        <template #contentInfo="{ row }">
          <span>
            <a 
            class="a-link"
            target="_blank"
            :href="proxy.globalInfo.webDomain + 'post/' + row.articleId"
              >查看文章</a
            >
          </span>
          <div v-html="row.content"></div>
          <div v-if="row.imgPath">
            <CommentImage
              :src="row.imgPath"
            ></CommentImage>
          </div>
        </template>
        <!-- 状态 -->
        <template #statusInfo="{ row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
        </template>
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
                  <el-dropdown-item @click="audit(row)" v-if="row.status == 0">
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
    prop: "goodCount",
  },
  {
    label: "状态",
    prop: "status",
    width: 100,
    scopedSlots: "statusInfo",
  },
  {
    label: "发布时间",
    prop: "postTime",
    width: 180,
  },
  {
    label: "发布地址",
    prop: "userIpAddress",
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];

const searchFormData = ref({});

// 列表
const tableData = ref({
  totalCount: 5,
  pageSize: 1,
  pageNo: 1,
  list: [
    {
      userIpAddress: "未知",
      nickName: "葫芦弟",
      titleInfo: "如何五天赚10亿",
      articleId: "123",
      content: "这是评论",
      status: 1,
      goodCount: 2,
      postIpAddress: "未知",
      postTime: "2023-01-01 12:12:12",
    },
    {
      userIpAddress: "未知",
      nickName: "葫芦弟",
      titleInfo: "如何五天赚10亿",
      articleId: "123",
      content: "这是评论",
      imgPath: proxy.globalInfo.imageUrl,
      status: 0,
      readCount: 1,
      goodCount: 2,
      postIpAddress: "未知",
      postTime: "2023-01-01 12:12:12",
    },
  ],
});
const tableOptions = {
  extHeight: 70,
  selectType: "checkbox",
};

const loadDataList = () => {};
// 批量选择
const seleckBatchList = ref([]);
const setRowSelected = (rows) => {
  seleckBatchList.value = [];
  rows.forEach((element) => {
    seleckBatchList.value.push(element.articleId);
  });
};
// 批量审批
const auditBatch=()=>{

}
// 批量删除
const delBatch=()=>{}
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