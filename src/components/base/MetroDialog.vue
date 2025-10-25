<script setup>

import {ref, watch} from 'vue'

defineProps({
  show: Boolean,
  description: {
    type: String,
    default: '暂无描述'
  }
})
defineEmits(['close'])

const showDelay = ref(false)
const contentVisible = ref(false)

function onAfterEnter() {
  showDelay.value = true
  contentVisible.value = true
}

function onAfterLeave() {
  showDelay.value = false
  contentVisible.value = false
}

watch(() => show, val => {
  if (val) contentVisible.value = false
})
</script>

<template>
  <transition name="metro" @after-enter="onAfterEnter" @after-leave="onAfterLeave">
    <div
      v-if="show"
      :class="{ 'introduce-detail-text-active': showDelay }"
      class="introduce-detail-text"
      @click.self="$emit('close')"
    >
      <!-- 内容容器 -->
      <slot v-if="contentVisible" class="detail-text"></slot>

      <!-- 关闭按钮 -->
      <div class="text-close" @click="$emit('close')">
        <svg
          class="icon"
          height="20"
          t="1671966797621"
          viewBox="0 0 1024 1024"
          width="20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M576 512l277.333333 277.333333-64 64-277.333333-277.333333L234.666667 853.333333 170.666667 789.333333l277.333333-277.333333L170.666667 234.666667 234.666667 170.666667l277.333333 277.333333L789.333333 170.666667 853.333333 234.666667 576 512z"
            fill="#ffffff"
          />
        </svg>
      </div>

      <!-- 装饰圆点 -->
      <span class="dialog-style dialog-style1"></span>
      <span class="dialog-style dialog-style2"></span>
      <span class="dialog-style dialog-style3"></span>
      <span class="dialog-style dialog-style4"></span>
    </div>
  </transition>
</template>

<style lang="scss" scoped>
.introduce-detail-text {
  width: 0;
  height: 0;
  background-color: rgba(0, 0, 0, 0.9);
  position: fixed;
  z-index: 998;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  &-active {
    width: 80vw;
    max-width: 1200px;
    height: 60vh;
    max-height: 80vh;
    padding: 2rem 3rem;
    display: flex;
    flex-direction: column;
  }

  .detail-text {
    width: 100%;
    flex: 1;
    overflow-y: hidden;
    overflow-x: hidden;
  }

  .text-close {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 15px;
    right: 15px;
    opacity: 0;
    animation: text-close 0.1s 0.6s forwards;

    @keyframes text-close {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }

    &:hover {
      cursor: pointer;
      opacity: 0.8 !important;
    }

    svg {
      width: 100%;
      height: 100%;
    }
  }

  .dialog-style {
    width: 9px;
    height: 9px;
    background-color: rgb(247, 247, 247);
    position: absolute;
    opacity: 0;
    animation: dialog-style-in 0.4s forwards;
    @keyframes dialog-style-in {
      0%, 20%, 40%, 60%, 80% {
        opacity: 0;
      }
      10%, 30%, 50%, 70%, 100% {
        opacity: 1;
      }
    }
  }

  $position: -4px;

  .dialog-style1 {
    top: $position;
    left: $position;
  }

  .dialog-style2 {
    top: $position;
    right: $position;
  }

  .dialog-style3 {
    bottom: $position;
    right: $position;
  }

  .dialog-style4 {
    bottom: $position;
    left: $position;
  }
}

/* 动画 */
.metro-enter-active {
  animation: introduce-detail-in 0.6s 0.3s forwards;
}

.metro-leave-active {
  animation: introduce-detail-in 0.6s 0.1s reverse;
}

@keyframes introduce-detail-in {
  0% {
    width: 0;
    height: 0;
    padding: 0;
  }
  50% {
    width: 80vw;
    height: 0;
    padding: 0 3rem;
  }
  100% {
    width: 80vw;
    height: 60vh;
    padding: 2rem 3rem;
  }
}
</style>
