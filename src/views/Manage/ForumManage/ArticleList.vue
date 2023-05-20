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
                  clearable
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
              <el-form-item label="审核" prop="audit">
                <el-select
                  placeholder="请选择"
                  clearable
                  v-model="searchFormData.audit"
                  :style="{ width: '100%' }"
                >
                  <el-option :value="1" label="已通过"></el-option>
                  <el-option :value="0" label="未通过"></el-option>
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
        <template #userInfo="{ row }">
          <div class="user-info">
            <v-avatar
              color="grey-darken-3"
              :image="proxy.globalInfo.avatarUrl + row.author_id"
            ></v-avatar>
            <div class="name-info">
              <a
                :href="`${proxy.globalInfo.webDomain}user/${row.author_id}`"
                class="a-link"
                target="_blank"
                >{{ row.nick_name }}</a
              >
              <span>
                {{ row.author_school }}
              </span>
            </div>
          </div>
        </template>
        <!-- 封面 -->
        <template #cover="{ row }">
          <el-image
            style="width: 50px; height: 50px"
            :src="proxy.globalInfo.imageUrl + row.cover"
            fit="cover"
          />
        </template>
        <!-- 标题 -->
        <template #titleInfo="{ row }">
          <a
            :href="`${proxy.globalInfo.webDomain}post/${row.article_id}`"
            class="a-link"
            target="_blank"
            tag="a"
            >{{ row.title }}</a
          >
        </template>
        <!-- 板块 -->
        <template #boardInfo="{ row }">
          <div>
            <span>{{ row.p_board_name }}</span>
            <span v-if="row.board_name">/{{ row.board_name }}</span>
          </div>
        </template>
        <!-- 互动消息 -->
        <template #interactionInfo="{ row }">
          <div>
            <div>阅读：{{ row.read_count }}</div>
            <div>点赞：{{ row.good_count }}</div>
            <div>
              评论：<span>{{ row.comment_count }}</span>
              <span
                class="a-link"
                :style="{ 'margin-left': '5px' }"
                @click="showComment(row.article_id)"
                v-if="row.comment_count"
              >
                查看
              </span>
            </div>
          </div>
        </template>
        <!-- 附件信息 -->
        <template #attachmentInfo="{ row }">
          <div v-if="row.attachment_type == 0">无附件</div>
          <div v-if="row.attachment_type == 1">
            <span
              @click="showAttachment(row.nick_name, row.article_id)"
              class="a-link"
              >查看附件</span
            >
          </div>
        </template>
        <!-- 状态 -->
        <template #statusInfo="{ row }">
          <span v-if="row.status == -1" :style="{ color: 'red' }">已删除</span>
          <span v-if="row.status == 0" :style="{ color: 'red' }">待审核</span>
          <span v-if="row.status == 1" :style="{ color: 'green' }">已审核</span>
          <div v-if="row.audit == 1" :style="{ color: 'green' }">已通过</div>
          <div v-if="row.audit == 0" :style="{ color: 'red' }">未通过</div>
        </template>
        <!-- 发布时间 -->
        <template #timeInfo="{ row }">
          <div>{{ row.post_time }}</div>
        </template>
        <!-- 发布地址 -->
        <template #addressInfo="{ row }">
          <div>
            {{ JSON.parse(row.author_ip_address).country_name }}
            /{{ JSON.parse(row.author_ip_address).region }}
          </div>
        </template>
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updataBoard(row)">
                    修改板块
                  </el-dropdown-item>
                  <el-dropdown-item @click="delArticle(row)">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item @click="audit(row)" v-if="row.audit == 0">
                    审核通过
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <!-- 修改板块 -->
    <ArticleBoard ref="articleBoardRef" @reload="loadDataList"></ArticleBoard>
    <!-- 查看附加 -->
    <ArticleAttachment ref="articleAttachmentRef"></ArticleAttachment>
  </div>
</template>

<script setup>
import ArticleAttachment from "./ArticleAttachment.vue";
import ArticleBoard from "./ArticleBoard.vue";
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const api = {
  loadDataList: "/manageForum/loadArticle",
  loadBoard: "/board/loadBoard",
  delArticle: "/manageForum/delArticle",
  auditArticle: "/manageForum/auditArticle",
};
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
    width: 150,
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
    scopedSlots: "timeInfo",
  },
  {
    label: "发布地址",
    prop: "postIpAddress",
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
const searchFormData = ref({});
const tableData = ref({});

const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    titleFuzzy: searchFormData.value.titleFuzzy,
    nickNameFuzzy: searchFormData.value.nickNameFuzzy,
    boardIds: searchFormData.value.boardIds,
    attachmentType: searchFormData.value.attachmentType,
    status: searchFormData.value.status,
    audit: searchFormData.value.audit,
  };
  let result = await proxy.Request({
    url: api.loadDataList,
    showLoading: false,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};

// 加载选择框板块信息
const boardProps = {
  multiple: false,
  checkStrictly: true,
  value: "board_id",
  label: "board_name",
};
const boardList = ref([]);
const loadBoardList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  boardList.value = result.data;
};
loadBoardList();

// 修改板块信息
const articleBoardRef = ref();
const updataBoard = (data) => {
  articleBoardRef.value.updataBoard(data);
};
// 批量选择
const tableRef = ref();
const seleckBatchList = ref([]);
const tableOptions = ref({
  selectType: "checkbox",
  extHeight: 100,
});
const setRowSelected = (rows) => {
  seleckBatchList.value = [];
  rows.forEach((element) => {
    seleckBatchList.value.push(element.article_id);
  });
  console.log(seleckBatchList.value);
};
// 批量审批
const auditBatch = () => {
  proxy.Confirm("你确定要批量审批吗？", async () => {
    let result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: seleckBatchList.value,
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
  proxy.Confirm(`你确定要审核通过【${row.title}】文章吗？`, async () => {
    let result = await proxy.Request({
      url: api.auditArticle,
      params: {
        articleIds: row.article_id,
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
      url: api.delArticle,
      params: {
        articleIds: seleckBatchList.value,
      },
    });
    if (!result) {
      return;
    }
    tableRef.value.clearSelection();
    loadDataList();
  });
};
// 单条删除
const delArticle = (row) => {
  proxy.Confirm(`确定要删除【${row.title}】文章吗？`, async () => {
    let result = await proxy.Request({
      url: api.delArticle,
      params: {
        articleIds: row.article_id,
      },
    });
    if (!result) {
      return;
    }
    loadDataList();
  });
};
// 查看
const showComment = (id) => {
  router.push("/post/" + id);
};
// 查看附件
const articleAttachmentRef=ref();
const showAttachment = (nickName, articleId) => {
  console.log(articleId)
  articleAttachmentRef.value.show(nickName, articleId);
};
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