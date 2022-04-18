<template>
  <el-table :data="tableData" stripe style="width: 100%" align='center'>
    <el-table-column type="index" :index="indexMethod"> </el-table-column>
    <el-table-column prop="name" label="菜品名称" width="180"> </el-table-column>
    <el-table-column prop="isSamples" label="是否留样"> </el-table-column>
  </el-table>
</template>
<script>
export default {
  data() {
    return {};
  },
  props: {
    tableData: {
      type: Array,
      default: [],
    },
  },
  methods: {
      indexMethod(index) {
        return index + 1;
      }
    }
};
</script>
<style>
</style>