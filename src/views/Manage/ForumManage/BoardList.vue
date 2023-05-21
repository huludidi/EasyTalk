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
                :image="
                  proxy.globalInfo.imageUrl +
                  (row.cover == null ? '1/1' : row.cover)
                "
              ></v-avatar>
            </template>
            <!-- 类别信息 -->
            <template #boardInfo="{ row }">
              <div>类别名称：{{ row.board_name }}</div>
              <div>发帖权限：{{ postTypeMap[row.post_type] }}</div>
            </template>
            <template #op="{ index, row }">
              <div class="op">
                <a
                  href="javascript:void(0)"
                  class="a-link"
                  @click="showEdit('update', 0, row)"
                  >修改</a
                >
                <el-divider direction="vertical"></el-divider>
                <a class="a-link" @click="del(row)"
                  >删除</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[index == 0 ? 'not-allow' : 'a-link']"
                  @click="changeSort(index, 'up', 0)"
                  >上移</a
                >
                <el-divider direction="vertical"></el-divider>
                <a
                  href="javascript:void(0)"
                  :class="[
                    index == tableData.list.length - 1 ? 'not-allow' : 'a-link',
                  ]"
                  @click="changeSort(index, 'down', 0)"
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
                :image="
                  proxy.globalInfo.imageUrl +
                  (row.cover == null ? '1/1' : row.cover)
                "
              ></v-avatar>
            </template>
            <!-- 类别信息 -->
            <template #boardInfo="{ row }">
              <div>类别名称：{{ row.board_name }}</div>
              <div>发帖权限：{{ postTypeMap[row.post_type] }}</div>
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
                    index == tableChildData.list.length - 1 ? 'not-allow' : 'a-link',
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
          prop="p_board_name"
          v-if="formData.board_type == 1"
        >
          {{ formData.p_board_name }}
        </el-form-item>
        <el-form-item label="板块名称" prop="board_name">
          <el-input placeholder="请输入名称" v-model="formData.board_name">
          </el-input>
        </el-form-item>
        <el-form-item label="发帖权限" prop="post_type">
          <el-radio-group v-model="formData.post_type">
            <el-radio :label="true">{{ postTypeMap[true] }}</el-radio>
            <el-radio :label="false">{{ postTypeMap[false] }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="封面" prop="cover">
          <CoverUpload v-model="formData.cover"></CoverUpload>
        </el-form-item>
        <el-form-item label="简介" prop="board_desc">
          <el-input
            placeholder="请输入简介"
            text="textarea"
            v-model="formData.board_desc"
            :autosize="{ minRows: 4, maxRows: 4 }"
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
const api = {
  loadBoard: "/manageBoard/loadBoard",
  saveBoard: "/manageBoard/saveBoard",
  delBoard: "/manageBoard/delBoard",
  changeBoardSort: "/manageBoard/changeBoardSort",
};
const postTypeMap = {
  false: "只允许管理员发帖",
  true: "任何人都可以发帖",
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
    prop: "board_desc",
  },
  {
    label: "操作",
    prop: "op",
    width: 190,
    scopedSlots: "op",
  },
];
const tableOptions = {
  extHeight: 110,
};

const dataTableRef = ref();
const tableData = ref({});
const tableChildData = ref({});
// 加载数据
const currentBoard = ref(null);
const loadDataList = async () => {
  let result = await proxy.Request({
    url: api.loadBoard,
    showLoading: false,
  });
  if (!result) {
    return;
  }
  tableData.value.list = result.data;
  if (currentBoard.value == null && tableData.value.list.length > 0) {
    rowClick(tableData.value.list[0]);
  } else {
    currentBoard.value = result.data.find((item) => {
      return item.board_id == currentBoard.value.board_id;
    });
    rowClick(currentBoard.value);
  }
  nextTick(() => {
    dataTableRef.value.setCurrentRow("board_id", currentBoard.value.board_id);
  });
};
loadDataList();
// 选择一级板块加载二级板块
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
  board_name: [{ required: true, message: "请输入板块名称" }],
  post_type: [{ required: true, message: "请选择发帖权限" }],
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
    formData.value.board_type = boardType;
    if (boardType == 1) {
      formData.value.p_board_name = currentBoard.value.board_name;
      formData.value.p_board_id = currentBoard.value.board_id;
    } else {
      formData.value.p_board_id = 0;
    }
  });
};
// 提交修改
const submitForm = async () => {
  let result = await proxy.Request({
    url: api.saveBoard,
    showLoading: false,
    params: formData.value,
  });
  if (!result) {
    return;
  }
  loadDataList();
  proxy.Message.success("修改成功");
  dialogConfig.show = false;
};
// 删除板块
const del = (data) => {
  proxy.Confirm(`你确定要删除${data.board_name}吗？`, async () => {
    let result = await proxy.Request({
      url: api.delBoard,
      showLoading: false,
      params:{
        board_id:data.board_id
      }
    });
    if (!result) {
      return;
    }
    if(currentBoard.value.board_id==data.board_id){
      currentBoard.value=null;
    }
    loadDataList();
  });
};
// 修改顺序
const changeSort=async(index,type,boardType)=>{
  let dataList=tableData.value.list;
  if(boardType==1){
    dataList=tableChildData.value.list;
  }
  if(
    (type==="down" && index==dataList.length-1)||
    (type==="up"&&index==0)
  ){
    return
  }
  let temp = dataList[index];
  let number=type=="down"?1:-1;
  dataList.splice(index,1);
  dataList.splice(index+number,0,temp);
  let boardIdList=[];
  dataList.forEach(element=>{
    boardIdList.push(element.board_id);
  })
  let result=await proxy.Request({
    url:api.changeBoardSort,
    showLoading:false,
    params:{
      boardIds:boardIdList
    }
  })
  if(!result){
    return
  }
  proxy.Message.success("排序成功");
  loadDataList();
}
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