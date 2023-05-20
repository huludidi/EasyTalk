<template>
  <div>
    <div class="top-panel">
      <el-form  :model="searchFormData" label-width="70px">
        <el-row>
          <el-col :span="5">
            <el-form-item label="学校名称" prop="schoolNameFuzzy">
              <el-input
                placeholder="支持模糊查询(中文名称)"
                v-model="searchFormData.schoolNameFuzzy"
                clearable
                @keyup.native="loadDataList"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-button-group>
              <el-button type="primary" @click="loadDataList">搜索</el-button>
              <el-button type="success" @click="addSchool"
                >添加学校</el-button
              >
            </el-button-group>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="data-list">
      <Table
        :columns="columns"
        :showPagination="true"
        :dataSource="tableData"
        :fetch="loadDataList"
        :options="tableOptions"
      >
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="delSchool(row)">
                    删除
                  </el-dropdown-item>
                  <el-dropdown-item @click="editSchool(row)">
                    修改
                  </el-dropdown-item>
                  <el-dropdown-item @click="updateLocation(row)">
                    更新经纬度
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <UpdateSchoolInfo ref="UpdateSchoolInfoRef" @reload="loadDataList"></UpdateSchoolInfo>
  </div>
</template>

<script setup>
import UpdateSchoolInfo from "./UpdateSchoolInfo.vue"
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  getSchoolInfo: "/school/getSchoolInfo",
  updateLocation: "/school/updateLocation",
  delSchool: "/school/delSchool",
};
// 列表
const columns = [
  {
    label: "学校名",
    prop: "ch_name",
  },
  {
    label: "英文名",
    prop: "en_name",
  },
  {
    label: "经度",
    prop: "longitude",
  },
  {
    label: "纬度",
    prop: "latitude",
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
const tableOptions = {
  extHeight: 70,
};
// 更新数据列表
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.pageNo,
    pageSize: tableData.value.pageSize,
    schoolNameFuzzy: searchFormData.value.schoolNameFuzzy,
  };
  let result = await proxy.Request({
    url: api.getSchoolInfo,
    showLoading: false,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};
loadDataList();

// 添加学校
const addSchool=()=>{
    UpdateSchoolInfoRef.value.show({});
}
// 删除学校
const delSchool = async (row) => {
  proxy.Confirm(`你确定要删除【${row.ch_name}】学校吗？`, async () => {
    let result = await proxy.Request({
      url: api.delSchool,
      showLoading: false,
      params: {
        id: row.id,
      },
    });
    if (!result) {
      return;
    }
    proxy.Message.success("删除成功");
    loadDataList();
  });
};

// 修改学校信息
const UpdateSchoolInfoRef=ref();
const editSchool = (row) => {
    UpdateSchoolInfoRef.value.show(row);
};

// 更新经纬度
const updateLocation = async (row) => {
  let result = await proxy.Request({
    url: api.updateLocation,
    showLoading: false,
    params: {
      id: row.id,
    },
  });
  if (!result) {
    return;
  }
  proxy.Message.success("更新成功");
  loadDataList();
};
</script>

<style lang="scss">
.op {
  cursor: pointer;
}
.el-button-group {
  display: flex;
  margin-left: 5px;
}
</style>