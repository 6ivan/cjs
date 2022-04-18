<template>
  <div class="p-page-box u-flex u-flex-center" v-show="pageTotal > 0">
    <el-pagination
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNum"
      :page-size="pageSizes"
      layout="prev, pager, next, jumper"
      :total="pageTotal"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  props: {
    // 当前页码
    pageNumber: {
      default: 2,
      type: [Number],
    },
    // 每页条数
    pageSize: {
      default: 5,
      type: [Number, String],
    },
    // 总条数
    pageTotal: {
      default: 0,
      type: [Number, String],
    },
  },
  data() {
    return {};
  },
  computed: {
    pageNum: {
      get() {
        return this.pageNumber;
      },
      set(val) {
        this.$emit("update:pageNumber", val);
      },
    },
    pageSizes: {
      get() {
        return this.pageSize;
      },
      set(val) {
        this.$emit("update:pageSize", val);
      },
    },
  },
  // computed:{
  //   pageNum:{
  //     return this.pageNumber
  //   }
  // },
  methods: {
    // 每页
    handleSizeChange(val) {
      this.$emit("sizeChange", val);
    },
    handleCurrentChange(val) {
      this.$emit("pageChange", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.p-page-box {
  width: 100%;
  padding: 20px 0;
  text-align: right;
}
// .p-page-box .el-pagination.is-background .el-pager li:not(.disabled).active {
//   background-color: $c !important;
// }
</style>
