<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      :showCancel="false"
      @close="dialogConfig.show = false"
      width="400px"
    >
      <el-form :model="formData" label-width="120px">
        <el-form-item label="发布人：">
          <v-avatar
            color="grey-darken-3"
            :image="proxy.globalInfo.avatarUrl + formData.user_id"
          ></v-avatar>
          <span :style="{ 'margin-left': '5px' }">{{
            formData.nick_name
          }}</span>
        </el-form-item>
        <el-form-item label="文件名：">
          {{ formData.file_name }}
        </el-form-item>
        <el-form-item label="大小：">
          {{ formattedSize }}
        </el-form-item>
        <el-form-item label="">
          <a
            target="_bank"
            class="a-link"
            :href="
              `/api/manageForum/attachmentDownload?fileId=` + formData.file_id
            "
          >
          下载
          </a>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance} from "vue";
const { proxy } = getCurrentInstance();

const dialogConfig = reactive({
  show: false,
  title: "附件查看",
  buttons:[
    {
        text:"关闭",
        click:(e)=>{
            dialogConfig.show=false;
        }
    }
  ]
});

const formData = ref({});
const show = async (nickName, articleId) => {
  dialogConfig.show = true;
  let result = await proxy.Request({
    url: "/manageForum/getAttachment",
    showLoading: false,
    params:{
        articleId:articleId
    }
  });
  if (!result) {
    return;
  }
  formData.value = result.data;
  formData.value.nick_name = nickName;

};
const formattedSize = computed(() => {
  const size = formData.value.file_size;
  if (size > 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(2) + " MB";
  } else {
    return (size / 1024).toFixed(2) + " KB";
  }
});
defineExpose({ show });
</script>

<style lang="scss">

</style>