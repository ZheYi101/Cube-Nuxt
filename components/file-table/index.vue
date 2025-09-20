<template>
  <el-table row-key="name" :data="fileList" height="100%">
    <el-table-column
      prop="name"
      label="文件名"
      width="320"
      column-key="lastModified"
      show-overflow-tooltip
    />
    <el-table-column label="预览">
      <template #default="scope">
        <el-image
          :class="styles.imagePreview"
          :src="getFileRealUrl(scope.row.objectKey)"
          :preview-src-list="[getFileRealUrl(scope.row.objectKey)]"
          preview-teleported
          hide-on-click-modal
          fit="cover"
        />
      </template>
    </el-table-column>
    <el-table-column prop="type" label="文件类型" />
    <el-table-column label="文件大小">
      <template #default="scope">
        {{ bytesToSizeString(scope.row.size) }}
      </template>
    </el-table-column>
    <el-table-column label="最后修改" width="200">
      <template #default="scope">
        {{ dayjs(scope.row.lastModified).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
    </el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
          link
          type="primary"
          :icon="ElIconLink"
          @click="handleCopyFileUrl(scope.row.objectKey)"
        />
        <el-button
          link
          type="primary"
          :icon="ElIconDownload"
          @click="downloadFileByObjectKey(scope.row.objectKey, scope.row.name)"
        />
        <el-button
          type="danger"
          link
          :icon="ElIconDelete"
          @click="deleteSelectedFile(props.bucket, scope.row.objectKey)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import { useClipboard } from "@vueuse/core";
import dayjs from "dayjs";

import { deleteFile, getFolderOrFile } from "~/services/service";

import styles from "./index.module.scss";

const props = defineProps<{
  bucket: string;
  folder: string;
}>();
const { refreshFileTree } = useRefreshFileTree();
const { copy } = useClipboard();

const handleCopyFileUrl = async (objectKey: string) => {
  await copy(getFileRealUrl(objectKey));
  ElMessage.success("已复制Url至剪贴板");
};

// http://remote/api/file?bucket=forum&object_key=abcccc/088afb14-3a15-11f0-b300-00163e7ed273.jpg
const getFileRealUrl = (objectKey: string) => {
  const url = new URL(import.meta.env.VITE_API_URL);
  url.href = `${url.href}api/file`;
  url.searchParams.append("bucket", props.bucket);
  url.searchParams.append("object_key", objectKey);
  return url.href;
};
const downloadFileByObjectKey = (objectKey: string, fileName: string) => {
  const url = getFileRealUrl(objectKey);
  ElMessage.success(`正在下载 ${fileName}`);
  downloadFile(url, fileName);
};

/** 删除所选, 点击删除icon时触发 */
const deleteSelectedFile = async (bucket: string, objectKey: string) => {
  try {
    await ElMessageBox.confirm("确定删除该文件?", "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      type: "warning"
    });
  } catch {
    return;
  }

  try {
    await deleteFile(bucket, objectKey);
    ElMessage.success("删除成功");
    refreshFileTree({ folderList: true, fileList: true });
  } catch (e: unknown) {
    if (e instanceof Error) {
      ElMessage.error(e.message);
    }
  }
};

const { data: fileList } = useQuery({
  queryKey: ["fileList", props.bucket, props.folder] as const,
  queryFn: ({ queryKey }) =>
    getFolderOrFile({
      bucket: queryKey[1],
      location: queryKey[2]
    }),
  select: (res) => res.fileList
});
</script>
