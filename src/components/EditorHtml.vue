<template>
  <div class="editor-html">
    <Toolbar
      :style="{ 'border-bottom': '1px solid #ccc' }"
      :editor="editorRef"
      :defaultConfig="toolbarConfig"
      :mode="mode"
    />
    <Editor
      :style="{ height: height + 'px' }"
      :model-value="modelValue"
      :defaultConfig="editorConfig"
      :mode="mode"
      @onCreated="handleCreated"
      @onChange="onChange"
    />
  </div>
</template>

<script setup>
import "@wangeditor/editor/dist/css/style.css";
import { onBeforeUnmount, ref, shallowRef } from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  height: {
    type: Number,
    default: 500,
  },
});

const mode = ref("default");
const editorRef = shallowRef();

const toolbarConfig = {
  excludeKeys: ["fullScreen"],
};
const editorConfig = {
  placeholder: "请输入内容···",
  MENU_CONF: {
    uploadImage: {
      maxFileSize: 3 * 1024 * 1024,
      server: "/api/file/uploadImage",
      fieldName: "file",
      customInsert(responsData, insertFn) {
        if(responsData.code==200){
          insertFn(
            proxy.globalInfo.imageUrl+responsData.data.fileName,
            "",
            ""
          );
          return
        }
        proxy.Message.error(responsData.error)
      },
    },
    uploadVideo: {
      maxFileSize: 50 * 1024 * 1024,
      server: "/api/file/uploadVideo",
      fieldName: "file",
      customInsert(responsData, insertFn) {
        if(responsData.code==200){
          insertFn(
            proxy.globalInfo.videoUrl+responsData.data.fileName,
            "",
            ""
          );
          return
        }
        proxy.Message.error(responsData.error)
      },
    },
  },
};

const emit = defineEmits();
const onChange = (editor) => {
  emit("update:modelValue", editor.getHtml());
};
// 组件销毁时，及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});
const handleCreated = (editor) => {
  editorRef.value = editor;
};
</script>

<style lang="scss">
.w-e-toolbar {
  padding-right: 10px;
}
.editor-html {
  border: 1px solid #ddd;
}
</style>