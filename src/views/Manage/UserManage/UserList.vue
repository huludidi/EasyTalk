<template>
  <div>
    <div class="top-panel">
      <el-form :model="searchFormData" label-width="50px">
        <el-row>
          <el-col :span="4">
            <el-form-item label="学校" prop="school">
              <el-input
                placeholder="支持模糊查询"
                v-model="searchFormData.school"
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
        <!-- 头像 -->
        <template #avatar="{ row }">
          <v-avatar
            color="grey-darken-3"
            :image="proxy.globalInfo.avatarUrl + row.user_id"
          ></v-avatar>
        </template>
        <!-- 昵称 -->
        <template #nickName="{ row }">
          {{ row.nick_name }}
          <span v-if="row.sex">({{ row.sex == 0 ? "男" : "女" }})</span>
        </template>
        <!-- 登录信息 -->
        <template #loginInfo="{ row }">
          <div>最后登录时间：{{ row.last_login_time }}</div>
          <div>最后登录IP：{{ row.last_login_ip }}</div>
          <div>
            最后登录地点：
            {{ JSON.parse(row.last_login_ip_address).country_name }}
            /{{ JSON.parse(row.last_login_ip_address).region }}/
            {{ JSON.parse(row.last_login_ip_address).city }}
          </div>
        </template>
        <!-- 状态 -->
        <template #status="{ row }">
          <span v-if="row.status == 1" :style="{ color: 'green' }">正常</span>
          <span v-else :style="{ color: 'red' }">禁用</span>
        </template>
        <!-- 操作信息 -->
        <template #op="{ row }">
          <div class="op" v-if="row.status != -1">
            <el-dropdown trigger="click">
              <span class="iconfont icon-more"></span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="updateUserStatus(row)">
                    {{ row.status == 1 ? "禁用" : "启用" }}
                  </el-dropdown-item>
                  <el-dropdown-item @click="sendMessage(row)">
                    发送系统信息
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </Table>
    </div>
    <SendMessage ref="sendMessageRef"></SendMessage>
  </div>
</template>

<script setup>
import SendMessage from "./SendMessage.vue"
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  loadUserList: "/manageUser/loadUserList",
  updateUserStatus: "/manageUser/updateUserStatus",
  sendMessage: "/manageUser/sendMessage",
};
// 列表
const columns = [
  {
    label: "头像",
    prop: "avatar",
    width: 80,
    scopedSlots: "avatar",
  },
  {
    label: "昵称",
    prop: "nickName",
    width: 150,
    scopedSlots: "nickName",
  },
  {
    label: "邮箱",
    prop: "email",
    width: 180,
  },
  {
    label: "个人描述",
    prop: "person_description",
  },
  {
    label: "学校",
    prop: "school",
  },
  {
    label: "加入时间",
    prop: "join_time",
    width: 180,
  },
  {
    label: "登录信息",
    prop: "lastLoginTime",
    width: 260,
    scopedSlots: "loginInfo",
  },
  {
    label: "状态",
    prop: "status",
    width: 60,
    scopedSlots: "status",
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
    school: searchFormData.value.school,
    nickNameFuzzy: searchFormData.value.nickNameFuzzy,
    status: searchFormData.value.status,
  };
  let result = await proxy.Request({
    url: api.loadUserList,
    showLoading: false,
    params: params,
  });
  if (!result) {
    return;
  }
  tableData.value = result.data;
};
loadDataList();

// 改变用户状态
const updateUserStatus =async (row) => {
  let result=await proxy.Request({
    url:api.updateUserStatus,
    params:{
      userId:row.user_id,
      status:row.status
    },
    showLoading:false
  })
  if(!result){
    return
  }
  proxy.Message.success("禁用成功");
  loadDataList();
};
// 发送系统信息
const sendMessageRef=ref();
const sendMessage = (row) => {
sendMessageRef.value.sendMessageHandler(row);
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