<template>
  <Dialog
    :show="dialogConfig.show"
    :title="dialogConfig.title"
    :buttons="dialogConfig.buttons"
    :showCancel="false"
    @close="dialogConfig.show = false"
    width="400px"
  >
    <el-form :model="formData" :rules="rules" ref="formDataRef">
      <el-form-item label="昵称" prop="nickName">
        <el-input
          size="large"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="头像" prop="avatar">
        <CoverUpload
          :imageUrlPrefix="proxy.globalInfo.avatarUrl"
          v-model="formData.avatar"
        ></CoverUpload>
      </el-form-item>
      <el-form-item label="性别" prop="sex">
        <el-radio-group v-model="formData.sex">
          <el-radio :label="0">男</el-radio>
          <el-radio :label="1">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="学校" prop="school">
          <el-autocomplete
        v-model="state2"
        :fetch-suggestions="querySearch"
        :trigger-on-focus="false"
        clearable
        class="inline-input w-50"
        placeholder="请输入学校"
        @select="handleSelect"
      />
      </el-form-item>
      <el-form-item label="简介" prop="">
        <el-input
          clearable
          placeholder="请输入简介，让别人认识你！"
          type="textarea"
          :row="5"
          :maxlength="100"
          resize="none"
          show-word-limit
          v-model="formData.personDescription"
        >
        </el-input>
      </el-form-item>
    </el-form>
  </Dialog>
</template>

<script setup lang="ts">
import {
  ref,
  reactive,
  getCurrentInstance,
  onMounted,
  watch,
  nextTick,
} from "vue";
const { proxy } = getCurrentInstance();
const formData = ref({});
const formDataRef = ref();

// 自动补全输入框
interface RestaurantItem {
  value: string
  link: string
}
const state2 = ref('')
const restaurants = ref<RestaurantItem[]>([])
const querySearch = (queryString: string, cb: any) => {
  const results = queryString
    ? restaurants.value.filter(createFilter(queryString))
    : restaurants.value
  // call callback function to return suggestions
  cb(results)
}
const createFilter = (queryString: string) => {
  return (restaurant: RestaurantItem) => {
    return (
      restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
    )
  }
}
const loadAll = () => {
  return [
    { value: 'vue', link: 'https://github.com/vuejs/vue' },
    { value: 'element', link: 'https://github.com/ElemeFE/element' },
    { value: 'cooking', link: 'https://github.com/ElemeFE/cooking' },
    { value: 'mint-ui', link: 'https://github.com/ElemeFE/mint-ui' },
    { value: 'vuex', link: 'https://github.com/vuejs/vuex' },
    { value: 'vue-router', link: 'https://github.com/vuejs/vue-router' },
    { value: 'babel', link: 'https://github.com/babel/babel' },
  ]
}
const handleSelect = (item: RestaurantItem) => {
  console.log(item)
}

onMounted(() => {
  restaurants.value = loadAll()
})


const dialogConfig = reactive({
  show: false,
  title: "编辑个人信息",
  buttons: [
    {
      type: "danger",
      text: "确定",
      click: () => {
        updateUserInfoHandler();
      },
    },
  ],
});

const updateUserInfoHandler = () => {};

const showEditUserInfoDialog = (userinfo) => {
  dialogConfig.show = true;
  nextTick(() => {
    formDataRef.value.resetFields();
    const dataInfo = JSON.parse(JSON.stringify(userinfo));
    dataInfo.avatar = {
      imageUrl: dataInfo.userId,
    };
    formData.value = dataInfo;
  });
};
defineExpose({ showEditUserInfoDialog });
</script>

<style>
</style>