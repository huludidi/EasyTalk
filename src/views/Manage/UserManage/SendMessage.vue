<template>
  <div>
    <Dialog
      :show="dialogConfig.show"
      :title="dialogConfig.title"
      :buttons="dialogConfig.buttons"
      @close="dialogConfig.show = false"
      width="500px"
    >
      <el-form
        ref="formDataRef"
        :model="formData"
        label-width="80px"
        :rules="rules"
      >
        <el-form-item label="消息内容" prop="message">
          <el-input
            placeholder="请输入消息内容"
            v-model="formData.message"
            clearable
            type="textarea"
            :rows="5"
            :maxlength="200"
            resize="none"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, getCurrentInstance, nextTick } from "vue";
const { proxy } = getCurrentInstance();
const api = {
  sendMessage: "/manageUser/sendMessage",
};
const dialogConfig = reactive({
  show: false,
  title: "发送消息",
  buttons: [
    {
      text: "确定",
      click: (e) => {
        submitForm();
      },
    },
  ],
});

const formData=ref({});
const formDataRef=ref();
const rules={
    message:[{required:true,message:"请输入消息内容"}],
}

const sendMessageHandler=(data)=>{
    dialogConfig.show=true;
    nextTick(()=>{
        formDataRef.value.resetFields();
        formData.value={
            userId:data.user_id,
        }
    })
}
defineExpose({sendMessageHandler});

// 提交表单
const emit=defineEmits(["reload"]);
const submitForm=()=>{
    formDataRef.value.validate(async(valid)=>{
        if(!valid){
            return
        }
        let params={};
        Object.assign(params,formData.value);
        let result=await proxy.Request({
            url:api.sendMessage,
            params,
            showLoading:false
        })
        if(!result){
            return
        }
        dialogConfig.show=false;
        proxy.Message.success("发送成功");
        emit('reload');
    });
}
</script>

<style lang="scss">
</style>