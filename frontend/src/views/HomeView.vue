<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import { getHealth, type HealthResponse } from '../api/client';

const loading = ref(true);
const health = ref<HealthResponse>();
const error = ref('');

async function checkHealth() {
  loading.value = true;
  error.value = '';
  try {
    health.value = await getHealth();
  } catch (err) {
    error.value = err instanceof Error ? err.message : '无法连接后端';
    ElMessage.error(error.value);
  } finally {
    loading.value = false;
  }
}

onMounted(checkHealth);
</script>

<template>
  <div class="page-stack">
    <section class="hero-card">
      <div>
        <span class="eyebrow">PROJECT FOUNDATION</span>
        <h2>把一次请求完整跑通</h2>
        <p>前端、NestJS API、Swagger、requestId 和 MySQL 迁移已经准备就绪。</p>
      </div>
      <el-button type="primary" :loading="loading" @click="checkHealth">重新检查 API</el-button>
    </section>

    <el-card shadow="never">
      <template #header>
        <div class="card-title-row">
          <span>系统状态</span>
          <el-tag v-if="health" type="success">API 正常</el-tag>
          <el-tag v-else-if="error" type="danger">连接失败</el-tag>
          <el-tag v-else type="info">检查中</el-tag>
        </div>
      </template>
      <el-skeleton v-if="loading" :rows="3" animated />
      <el-alert v-else-if="error" :title="error" type="error" show-icon />
      <el-descriptions v-else :column="1" border>
        <el-descriptions-item label="服务">{{ health?.service }}</el-descriptions-item>
        <el-descriptions-item label="状态">{{ health?.status }}</el-descriptions-item>
        <el-descriptions-item label="Request ID">{{ health?.requestId }}</el-descriptions-item>
        <el-descriptions-item label="检查时间">{{ health?.timestamp }}</el-descriptions-item>
      </el-descriptions>
    </el-card>

    <div class="stat-grid">
      <el-card shadow="never"><strong>Vue 3</strong><span>前端应用</span></el-card>
      <el-card shadow="never"><strong>NestJS</strong><span>模块化 API</span></el-card>
      <el-card shadow="never"><strong>Prisma</strong><span>数据库迁移</span></el-card>
    </div>
  </div>
</template>
