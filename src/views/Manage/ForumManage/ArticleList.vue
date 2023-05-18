<template>
  <div>
    <div class="data-list">
      <div class="top-panel">
        <el-form :model="searchFormData" label-width="50px">
          <el-row>
            <el-col :span="4">
              <el-form-item label="标题" prop="titleFuzzy">
                <el-input
                  placeholder="请输入标题"
                  v-model="searchFormData.titleFuzzy"
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
              <el-form-item label="板块" prop="boardIds">
                <el-cascader
                  placeholder="请选择板块"
                  :options="boardList"
                  :props="boardProps"
                  v-model="searchFormData.boardIds"
                  :style="{ width: '100%' }"
                ></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="附件" prop="sex">
                <el-select
                  placeholder="请选择"
                  v-model="searchFormData.attachmentType"
                  clearable
                  :style="{ width: '100%' }"
                >
                  <el-option :value="1" label="有附件"></el-option>
                  <el-option :value="0" label="无附件"></el-option>
                </el-select>
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
              <el-form-item label="置顶" prop="topType">
                <el-select
                  placeholder="请选择"
                  clearable
                  v-model="searchFormData.topType"
                  :style="{ width: '100%' }"
                >
                  <el-option :value="1" label="已置顶"></el-option>
                  <el-option :value="0" label="未置顶"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button-group>
                <el-button type="primary" @click="loadDataList">搜索</el-button>
                <el-button
                  type="success"
                  @click="auditBatch"
                  :disabled="seleckBatchList.length == 0"
                  >批量审批</el-button
                >
                <el-button
                  type="danger"
                  @click="delBatch"
                  :disabled="seleckBatchList.length == 0"
                  >批量删除</el-button
                >
              </el-button-group>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <Table
        ref="tableRef"
        :dataSource="tableData"
        :columns="columns"
        :fetch="loadDataList"
        :options="tableOptions"
        @rowSelected="setRowSelected"
      >
        <!-- 用户信息 -->
        <template #userInfo="{  row }">
          <div class="user-info">
            <v-avatar
              color="grey-darken-3"
              image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
            ></v-avatar>
            <div class="name-info">
              <a
                :href="`${proxy.globalInfo.webDomain}user/123`"
                class="a-link"
                target="_blank"
                >{{ row.nickName }}</a
              >
              <span>{{ row.userIpAddress }}</span>
            </div>
          </div>
        </template>
        <!-- 封面 -->
        <template #cover="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="proxy.globalInfo.imageUrl"
            fit="cover"
          />
        </template>
        <!-- 标题 -->
        <template #titleInfo="{  row }">
          <a
            :href="`${proxy.globalInfo.webDomain}post/qwer`"
            class="a-link"
            target="_blank"
            tag="a"
            >{{ row.titleInfo }}</a
          >
        </template>
        <!-- 板块 -->
        <template #boardInfo="{  row }">
          <div>
            <span>{{ row.pBoardName }}</span>
            <span v-if="row.boardName">/{{ row.boardName }}</span>
          </div>
        </template>
        <!-- 互动消息 -->
        <template #interactionInfo="{  row }">
          <div>
            <div>阅读：{{ row.readCount }}</div>
            <div>点赞：{{ row.goodCount }}</div>
            <div>
              评论：<span>{{ row.commentCount }}</span>
              <span
                class="a-link"
                :style="{ 'margin-left': '5px' }"
                @click="showComment(row.articleId)"
                v-if="row.commentCount"
              >
                查看
              </span>
            </div>
          </div>
        </template>
        <!-- 附件信息 -->
        <template #attachmentInfo="{  row }">
          <div v-if="row.attachmentType == 0">无附件</div>
          <div v-if="row.attachmentType == 1">
            <span
              @click="showAttachment(row.nickName, row.articleId)"
              class="a-link"
              >查看附件</span
            >
          </div>
        </template>
        <!-- 状态 -->
        <template #statusInfo="{  row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
          <div v-if="row.topType == 1" :style="{ color: 'green' }">已置顶</div>
          <div v-if="row.topType == 0" :style="{ color: 'green' }">未置顶</div>
        </template>
        <!-- 操作信息 -->
        <template #op="{  row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updataBoard(row)">
                    修改板块
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 1 && row.status == 1"
                  >
                    取消置顶
                  </el-dropdown-item>
                  <el-dropdown-item
                    @click="topArticle(row)"
                    v-if="row.topType == 0 && row.status == 1"
                  >
                    置顶
                  </el-dropdown-item>
                  <el-dropdown-item @click="delArticle(row)">
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
    <ArticleBoard ref="articleBoardRef" @reload="loadDataList"></ArticleBoard>
  </div>
</template>

<script setup>
import ArticleBoard from "./ArticleBoard.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();

const columns = [
  {
    label: "用户信息",
    prop: "avatar",
    width: 150,
    scopedSlots: "userInfo",
  },
  {
    label: "封面",
    prop: "cover",
    width: 100,
    scopedSlots: "cover",
  },
  {
    label: "标题",
    scopedSlots: "titleInfo",
    width: 340,
  },
  {
    label: "板块",
    width: 100,
    scopedSlots: "boardInfo",
  },
  {
    label: "互动信息",
    width: 120,
    scopedSlots: "interactionInfo",
  },
  {
    label: "是否有附件",
    prop: "attachment",
    width: 100,
    scopedSlots: "attachmentInfo",
  },
  {
    label: "状态信息",
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
    prop: "postIpAddress",
    width: 100,
  },
  {
    label: "操作",
    prop: "op",
    width: 80,
    scopedSlots: "op",
  },
];
const tableData = ref({
  totalCount: 5,
  pageSize: 1,
  pageNo: 1,
  list: [
    {
      userIpAddress: "未知",
      nickName: "葫芦弟",
      titleInfo: "如何五天赚10亿",
      pBoardId:1,
      pBoardName: "求助",
      boardName: "其他",
      readCount: 1,
      goodCount: 2,
      commentCount: 3,
      attachmentType: 0,
      status: 0,
      topType: 1,
      postIpAddress: "未知",
      postTime: "2023-01-01 12:12:12",
    },
    {
      userIpAddress: "未知",
      nickName: "葫芦哥",
      titleInfo: "如何五天花光10亿",
      pBoardName: "求助",
      boardName: "其他",
      readCount: 1,
      goodCount: 2,
      commentCount: 3,
      attachmentType: 1,
      status: 1,
      topType: 0,
      postIpAddress: "未知",
      postTime: "2023-01-01 12:12:12",
    },
  ],
});

const loadDataList = () => {};

// 搜索
const searchFormData = ref({});
// 板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "boardId",
  label: "boardName",
};
const boardList = ref([]);
// 修改板块信息
const articleBoardRef = ref();
const updataBoard = (data) => {
  articleBoardRef.value.updataBoard(data);
};
// 批量选择
const seleckBatchList = ref([]);
const tableOptions=ref({
  selectType:"checkbox",
  extHeight:100
})
const setRowSelected = (rows) => {
  seleckBatchList.value=[];
  rows.forEach((element)=>{
    seleckBatchList.value.push(element.articleId)
  })
};
// 批量审批
const auditBatch=()=>{

}
// 批量删除
const delBatch=()=>{}

// 查看
const showComment=(id)=>{
  router.push("/post/"+id)
}
</script>

<style lang="scss" scoped>
.el-button-group {
  display: flex;
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