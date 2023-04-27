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
              <el-button type="danger" @click="delBatch">批量删除</el-button>
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
            image="https://avataaars.io/?avatarStyle=Transparent&topType=ShortHairShortCurly&accessoriesType=Prescription02&hairColor=Black&facialHairType=Blank&clotheType=Hoodie&clotheColor=White&eyeType=Default&eyebrowType=DefaultNatural&mouthType=Default&skinColor=Light"
          ></v-avatar>
        </template>
        <!-- 昵称 -->
        <template #nickName="{ row }"
          >{{ row.nickName }}
          <span v-if="row.sex">({{ row.sex == 0 ? "女" : "男" }})</span>
        </template>
        <!-- 登录信息 -->
        <template #loginInfo="{ row }">
          <div>最后登录时间：{{ row.lastLoginTime }}</div>
          <div>最后登录IP：{{ row.lastLoginIp }}</div>
          <div>最后登录地点：{{ row.lastLoginIpAddress }}</div>
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
  </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, onMounted, watch } from "vue";
const { proxy } = getCurrentInstance();

const searchFormData = ref({});

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
    prop: "personDescription",
  },
  {
    label: "加入时间",
    prop: "joinTime",
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

const tableData = ref({
  totalCount: 5,
  pageSize: 1,
  pageNo: 1,
  list: [
    {
      userIpAddress: "未知",
      nickName: "葫芦弟",
      sex: 0,
      email: "testqq.com",
      personDescription: "这是一条个人描述",
      joinTime: "2023-01-01 12:12:12",
      lastLoginTime: "2023-01-01 12:12:12",
      lastLoginIp: "127.0.0.0:3004",
      lastLoginIpAddress: "西红市",
      status: 1,
      Time: "2023-01-01 12:12:12",
    },
    {
      userIpAddress: "未知",
      nickName: "葫芦哥",
      sex: 1,
      email: "testqq.com",
      personDescription: "这是一条个人描述",
      joinTime: "2023-01-01 12:12:12",
      lastLoginTime: "2023-01-01 12:12:12",
      lastLoginIp: "127.0.0.0:3004",
      lastLoginIpAddress: "红富市",
      status: 1,
      Time: "2023-01-01 12:12:12",
    },
  ],
});
const tableOptions = {
  extHeight: 70,
};
// 更新数据列表
const loadDataList = () => {};
// 删除
const delBatch=()=>{}


// 改变用户状态
const updateUserStatus = () => {};
// 发送系统信息
const sendMessage = () => {};


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