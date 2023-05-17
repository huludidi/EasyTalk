<template>
  <div>
    <el-dialog
      :model-value="show"
      :title="title"
      :top="top"
      :width="width"
      :show-close="showClose"
      :draggable="false"
      :close-on-click-modal="false"
      class="cust-dialog"
      @close="close"
    >
      <div class="dialog-body">
        <slot></slot>
      </div>

      <template v-if="(buttons && buttons.length > 0) || showCancel">
        <div class="dialog-footer">
          <el-button @click="close" v-if="showCancel">取消</el-button>
          <el-button
            v-for="(btn, index) in buttons"
            :key="index"
            :type="btn.type"
            @click="btn.click"
          >
            {{ btn.text }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  show: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "嘿嘿",
  },
  showClose: {
    type: Boolean,
    default: true,
  },
  width: {
    type: String,
    default: "30%",
  },
  top: {
    type: String,
    dafault: "50px",
  },
  buttons: {
    type: Array,
  },
  showCancel: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits();
const close = () => {
  emit("close");
};
</script>

<style lang="scss">
.cust-dialog {
  margin-bottom: 10px;
  border-radius: 20px;
  .dialog-body {
    border-top: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 15px;
    min-height: 100px;
    max-height: calc(100vh - 200px);
    overflow: auto;
  }
  .dialog-footer {
    text-align: right;
    padding: 15px 20px 5px;
  }
}
.el-dialog__body {
  padding: 10px 10px 10px 10px;
}
.el-popup-parent--hidden {
  padding-right: 0 !important;
}
</style>