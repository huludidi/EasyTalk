<template>
  <div>
    <div class="top-panel">
      <el-button type="primary" @click="showEdit('add', 0)">新增类型</el-button>
    </div>
    <el-row :gutter="10" :style="{ 'margin-top': '10px' }">
      <el-col :span="14">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>一级类别</span>
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableData"
            :fetch="loadDataList"
            :options="tableOptions"
            ref="dataTableRef"
            @rowClick="rowClick"
          >
            <!-- 封面 -->
            <template #cover="{ row }">
              <v-avatar
                color="grey-darken-3"
                image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              ></v-avatar>
            </template>
            <!-- 类别信息 -->
            <template #boardInfo="{ row }">
              <div>类别名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>
            <template #op="{ index, row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('update', 1, row)"
                  >修改</a
                >
                <el-divider direction="vertical"></el-divider>
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                  >删除</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 1)"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
      <el-col :span="10">
        <el-card>
          <template #header>
            <div class="card-header">
              <span>二级类别</span>
              <a
                href="javascipt:void(0)"
                class="a-link"
                @click="showEdit('add', 1)"
                >新增二级板块</a
              >
            </div>
          </template>
          <Table
            :columns="columns"
            :showPagination="false"
            :dataSource="tableChildData"
            :options="tableOptions"
          >
            <!-- 封面 -->
            <template #cover="{ row }">
              <v-avatar
                color="grey-darken-3"
                image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
              ></v-avatar>
            </template>
            <!-- 类别信息 -->
            <template #boardInfo="{ row }">
              <div>类别名称：{{ row.boardName }}</div>
              <div>发帖权限：{{ postTypeMap[row.postType] }}</div>
            </template>
            <template #op="{ index, row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('update', 1, row)"
                  >修改</a
                >
                <el-divider direction="vertical"></el-divider>
                <a href="javascript:void(0)" class="a-link" @click="del(row)"
                  >删除</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 1)"
                  >上移</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 1)"
                  >下移</a
                >
              </div>
            </template>
          </Table>
        </el-card>
      </el-col>
    </el-row>
    <!-- 新增/修改弹窗 -->
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      width="500px"
      @close="dialogConfig.show = false"
    >
      <el-form>
        <el-form-item
          label="一级板块"
          prop="boardName"
          v-if="formData.boardType == 1"
        >
          {{ formData.pBoardName }}
        </el-form-item>
        <el-form-item label="板块名称" prop="boardName">
          <el-input placeholder="请输入名称" v-model="formData.boardName">
          </el-input>
        </el-form-item>
        <el-form-item label="发帖权限" prop="postType">
          <el-radio-group v-model="formData.postType">
            <el-radio :label="1">{{ postTypeMap[1] }}</el-radio>
            <el-radio :label="0">{{ postTypeMap[0] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="boardDesc">
          <el-input
            placeholder="请输入简介"
            text="textarea"
            v-model="formData.boardDesc"
            :autosize="{minRows:4,maxRows:4}"
          >
          </el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
} from "vue";
const { proxy } = getCurrentInstance();

const postTypeMap = {
  0: "只允许管理员发帖",
  1: "任何人都可以发帖",
};
// 列表
const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 80,
    scopedSlots: "cover",
  },
  {
    label: "板块信息",
    prop: "boardName",
    width: 210,
    scopedSlots: "boardInfo",
  },
  {
    label: "简介",
    prop: "boardDesc",
  },
  {
    label: "操作",
    prop: "op",
    width: 190,
    scopedSlots: "op",
  },
];
const dataTableRef = ref();
const tableData = ref({
  list: [
    {
      boardId: 1,
      boardName: "求助",
      postType: 1,
      boardDesc: "这是简介",
      children: [
        { boardName: "租房", postType: 1, boardDesc: "这是简介" },
        { boardName: "找室友", postType: 1, boardDesc: "这是简介" },
      ],
    },
    {
      boardId: 2,
      boardName: "分享",
      postType: 1,
      boardDesc: "这是简介",
      children: [
        { boardName: "学习分享", postType: 1, boardDesc: "这是简介" },
        { boardName: "经验分享", postType: 1, boardDesc: "这是简介" },
      ],
    },
    {
      boardId: 3,
      boardName: "指南",
      postType: 1,
      boardDesc: "这是简介",
      children: [
        { boardName: "求学指南", postType: 1, boardDesc: "这是简介" },
        { boardName: "回国指南", postType: 1, boardDesc: "这是简介" },
      ],
    },
  ],
});
const tableOptions = {
  extHeight: 110,
};
const tableChildData = ref({});
// 加载数据
const currentBoard = ref(null);
const loadDataList = async () => {
  if (currentBoard.value == null && tableData.value.list.length > 0) {
    rowClick(tableData.value.list[0]);
  } else {
    rowClick(currentBoard.value);
  }
  nextTick(() => {
    dataTableRef.value.setCurrentRow("boardId", currentBoard.value.boardId);
  });
};

const rowClick = (row) => {
  currentBoard.value = row;
  tableChildData.value.list = row.children;
};

// 新增/修改
const dialogConfig = reactive({
  show: false,
  title: "标题",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});
const formData = ref({});
const formDataRef = ref();
const rules = {
  boardName: [{ required: true, message: "请输入板块名称" }],
  postType: [{ required: true, message: "请选择发帖权限" }],
};
const showEdit = (opType, boardType, data) => {
  dialogConfig.show = true;
  nextTick(() => {
    // formDataRef.value.resetFields();
    if (opType == "add") {
      dialogConfig.title = boardType == 0 ? "新增板块" : "新增二级板块";
      formData.value = {};
    } else if (opType == "update") {
      dialogConfig.title = boardType == 0 ? "修改板块" : "修改二级板块";
      formData.value = JSON.parse(JSON.stringify(data));
      if (formData.value.cover) {
        formData.value.cover = {
          imageUrl: formData.value.cover,
        };
      }
    }
    formData.value.boardType = boardType;
    if (boardType == 1) {
      formData.value.pBoardName = currentBoard.value.boardName;
      formData.value.pBoardId = currentBoard.value.boardId;
    } else {
      formData.value.pBoardId = 0;
    }
  });
};
</script>

<style lang="scss" scoped>
.not-allow {
  cursor: not-allowed;
  color: #ddd;
  text-decoration: none;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .a-link {
    font-size: 14px;
  }
}
</style>