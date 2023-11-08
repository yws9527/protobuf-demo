<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="onMockClick">mock请求计数： {{ mockCount }} 次</button>
    <button type="button" @click="onTreeClick">tree请求计数： {{ treeCount }} 次</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Install
    <a href="https://github.com/vuejs/language-tools" target="_blank">Volar</a>
    in your IDE for a better DX
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue'
  import { storage } from '@/utils/storage';
  import { getSchoolList, getSchoolTree } from '@/api/school.ts';

  defineProps<{ msg: string }>();
  const mockCount = ref(0);
  const treeCount = ref(0);
  const inputTokenVal = ref('');

  function inputToken() {
    inputTokenVal.value = storage.get('token');
    !inputTokenVal.value && setTimeout(() => {
      const input = window.prompt('请输入测试token');
      if (input) {
        storage.set('token', input);
        inputTokenVal.value = input;
      }
    }, 1500);
  }

  function onMockClick() {
    mockCount.value += 1;
    getSchoolListReq();
  }
  
  function onTreeClick() {
    treeCount.value += 1;
    getSchoolTreeReq();
  }

  async function getSchoolListReq() {
    try {
      console.count('=========mock请求次数=========');
      const response = await getSchoolList({
        limit: 20,
        offset: 0,
      });
      console.log('mockResponse', response);
    } catch (error) {
      throw error;
    }
  }

  async function getSchoolTreeReq() {
    try {
      console.count('=========tree请求次数=========');
      const response = await getSchoolTree();
      console.log('treeResponse', response);
      if (response.resultCode === 902 || response.resultCode === 903) {
        storage.clear();
        inputToken();
      }
    } catch (error) {
      throw error;
    }
  }

  onMounted(inputToken);
</script>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
