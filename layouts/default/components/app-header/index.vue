<template>
  <header :class="styles.appHeader">
    <div />
    <div :class="styles.actions">
      <el-button type="primary" :icon="ElIconUpload" @click="isUploadDialogVisible = true"
        >上传文件</el-button
      >
      <el-button plain @click="router.push('/login')">返回登录</el-button>
    </div>
    <client-only>
      <upload-dialog
        :key="uploadDialogKey"
        v-model:visible="isUploadDialogVisible"
        :bucket="props.bucket"
        :folder="props.folder"
      />
    </client-only>
  </header>
</template>

<script setup lang="ts">
import UploadDialog from "../upload-dialog/index.vue";
import styles from "./index.module.scss";
const props = defineProps<{
  bucket?: string;
  folder?: string;
}>();

const uploadDialogKey = computed(() => {
  const bucket = props.bucket || "";
  const folder = props.folder || "";
  return `${bucket}-${folder}`;
});

const router = useRouter();
const isUploadDialogVisible = ref(false);
</script>
