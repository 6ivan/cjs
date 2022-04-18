<template>
  <el-table
    ref="multipleTable"
    :data="listTableModule.moduleValue"
    tooltip-effect="dark"
    style="width: 100%"
    class="headerCellClass"
    :header-cell-style="headerCellClassName"
    :cell-style="cellClassName"
  >
    <el-table-column
      v-for="(item, index) in listTableModule.moduleName"
      :key="index"
      :label="item.name"
    >
      <template slot-scope="scope">
        <span v-if="item.type == 'text'">{{ scope.row[item.code] }}</span>
      </template>
    </el-table-column>
    <el-table-column
      v-if="listTableModule.moduletype.operation == '操作'"
      :label="listTableModule.moduletype.operation"
      :width="operationWidth"
      fixed="right"
    >
      <template slot-scope="scope">
        <el-button
          size="mini"
          v-if="listTableModule.moduletype.operation1"
          @click="handleClick('1', scope.row)"
          >接受
        </el-button>
        <el-button
          size="mini"
          v-if="listTableModule.moduletype.operation2"
          @click="handleClick('2', scope.row)"
          >查看
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  name: "listTable",
  props: {
    listTableModule: {
      type: Object,
    },
  },
  data() {
    return {
      operationWidth: 0, //操作按钮宽度
    };
  },
  methods: {
    handleClick(num, obj) {
      //调用父组件方法，同时给父组件传值
      this.$emit("clickListTable", {
        //编辑查看弹框信息
        num: num,
        obj: obj.id,
      });
    },
    headerCellClassName() {
      return 'color: #8995cb;font-weight: bold;background-color: #e8ecf7;'
      },
    cellClassName() {
      return "color: #302f62;";
    },
  },
  mounted() {
    if (this.listTableModule.moduletype.operation1) {
      this.operationWidth += 80;
    }
    if (this.listTableModule.moduletype.operation2) {
      this.operationWidth += 80;
    }
  },
};
</script>
<style>
.headerCellClass tr.hover-row>td{background-color: #f3f7ff !important;}
</style>