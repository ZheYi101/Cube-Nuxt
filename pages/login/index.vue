<template>
  <div :class="styles.login">
    <div :class="styles.logo">
      <img :src="LogoImage" alt="logo" :draggable="false" />
    </div>
    <section :class="styles.form">
      <el-input
        v-model="apiKey"
        size="large"
        placeholder="请输入 API Key"
        type="password"
        show-password
        clearable
      />
      <el-button
        size="large"
        :disabled="apiKey.length <= 0"
        :class="styles.loginButton"
        type="info"
        @click="handleConfirmAPIKey"
      >
        登录
      </el-button>
    </section>
  </div>
</template>
<script setup lang="ts">
import { useQueryClient } from "@tanstack/vue-query";
import { useRouter } from "vue-router";

import LogoImage from "@/assets/logo.png";
import { useApiKey } from "@/composables/use-api-key";
import { getBucket } from "~/services/service";

import styles from "./index.module.scss";
definePageMeta({
  layout: false
});

const apiKey = useApiKey();
const router = useRouter();
const queryClient = useQueryClient();
const handleConfirmAPIKey = async () => {
  try {
    await queryClient.fetchQuery({
      queryKey: ["bucketList"],
      queryFn: getBucket
    });
    ElMessage.success("key正确");
    router.push("/home");
  } catch (e: unknown) {
    if (e instanceof Error) {
      ElMessage.error(e.message);
    }
  }
};
</script>
