<script setup>
import {ref, onMounted} from 'vue'
import MetroDialog from '@/components/base/MetroDialog.vue'


const loading = ref(true)
const licenses = ref({})
const openUri = (url) => {
  windowApi.toRegister(url)
}

onMounted(async () => {
  try {
    const res = await fetch('./licenses.json')
    licenses.value = await res.json()
  } catch (err) {
    console.error('加载 licenses.json 失败', err)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <MetroDialog style="max-height: 80vh;">
    <template v-if="loading">
      <div class="loading">
        <div class="spinner"></div>
        <p class="text">正在加载开源信息...</p>
      </div>
    </template>

    <template v-else :hidden="handleClose">
      <p class="text" style="padding-bottom: 5px;color: #fff;">开源许可</p>
      <div class="licenses">
        <div
          v-for="(info, name) in licenses"
          :key="name"
          class="license-item"
        >
          <div class="license-name">
            <strong>{{ name }}</strong>
          </div>

          <div class="license-meta">
            <span class="license-type">{{ info.licenses || 'Unknown' }}</span>
            <span v-if="info.publisher" class="license-author">by {{ info.publisher }}</span>
            <a v-if="info.repository" href="#" @click.prevent="openUri(info.repository)">仓库</a>
          </div>
        </div>
      </div>

    </template>
  </MetroDialog>
</template>

<style scoped>
.loading {
  text-align: center;
  padding: 20px;
}

.spinner {
  margin: 0 auto 10px;
  border-top-color: transparent;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.licenses {
  max-height: 60vh;
  overflow-y: auto;
  padding: 0.5rem 0;
}

.license-item {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #444;
  padding: 0.5rem 0;
  color: #fff;
}

.license-name strong {
  font: 12px SourceHanSansCN-Bold;
  color: #fff;
}

.license-meta {
  font: 12px SourceHanSansCN-Bold;
  display: flex;
  gap: 8px;
  align-items: center;
  color: #ddd;
}

.license-meta a {
  text-decoration: none;
}

.license-meta a:hover {
  text-decoration: underline;
}


/* 滚动条整体 */
.licenses::-webkit-scrollbar {
  width: 8px; /* 宽度可自定义 */
}

/* 滚动条轨道 */
.licenses::-webkit-scrollbar-track {
  background: #666; /* 轨道白色 */
  border-radius: 0; /* 直角 */
}

/* 滑块（拖动条） */
.licenses::-webkit-scrollbar-thumb {
  background-color: #ffffff; /* 拖动条颜色 */
  border-radius: 0; /* 直角 */
}

/* 滑块悬停 */
.licenses::-webkit-scrollbar-thumb:hover {
  background-color: #999; /* 悬停颜色 */
  margin-right: 5px;
}

</style>
