<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss">
@import '@/styles/p-common.scss';
#app .main-container{
    height: calc(100% - 70px);
}
.app-main{
    height: calc(100vh - 140px);
}
.mt-30{
    margin-top: 30px;
}
.el-table::before {
	background-color: transparent !important;
}
</style>
