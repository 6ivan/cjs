<!--优化室列表-->
<template>
	<div class="ruTask-container">
		<div class="p-dbox">
				<h3>筛选查询</h3>
			<div class="text item">
				<el-form ref="filterForm" :model="filterForm" label-width="100px" inline size="small">
					<el-form-item label="工单号" prop="workOrderNumber">
						<el-input v-model="filterForm.workOrderNumber" placeholder="请输入工单号" :maxlength="30" clearable
							:style="{ width: '100%' }" />
					</el-form-item>
					<el-form-item class="btn-box">
						<el-button type="primary" @click="searchBtn">查询</el-button>
						<el-button @click="refreshBtn">重置</el-button>
					</el-form-item>
					<el-form-item prop="status" />
				</el-form>
			</div>
		</div>
		<div class="p-dbox">
			<el-table  class="p-table" :cell-class-name="pTableCell" :header-cell-class-name="pTableHead" ref="multipleTable" v-loading="tableLoading" :data="list" :row-key="(row) => row.id"
				tooltip-effect="dark" border style="width: 100%;font-size: 12px;">
				<el-table-column prop="workOrderNumber" label="工单编号" align="center"/>
				<el-table-column label="预警类型" align="center">
					<template slot-scope="scope">
						<div @click="jumpDetail(scope.row)">
							{{ $webConfig.workOrderType[scope.row.workOrderType] || '--' }}
						</div>
					</template>
				</el-table-column>
				<el-table-column prop="region" label="工单所属区域" align="center" />
				<el-table-column label="工单状态" align="center">
					<template slot-scope="scope">
						<div>
							{{ $webConfig.workOrderState[scope.row. workOrderState] }}
						</div>
					</template>
				</el-table-column>
				<el-table-column label="预警对象" align="center">
					<template slot-scope="scope">
						<!-- workOrderType=1,2,3 取 region
						// workOrderType=4 取 baseNumber
						// workOrderType=5 取 telephone -->
						<div v-if="scope.row.workOrderType==1||scope.row.workOrderType==2||scope.row.workOrderType==3">
							{{ scope.row.region }}
						</div>
						<div v-else-if="scope.row.workOrderType==4">
							{{ scope.row.baseNumber }}
						</div>
						<div v-else-if="scope.row.workOrderType==5">
							{{ scope.row.telephone }}
						</div>
						<div v-else>--</div>
					</template>
				</el-table-column>
				<el-table-column prop="complaintTime" label="投诉时间" align="center" />
				<el-table-column label="操作" align="center" width="90">
				  <template slot-scope="scope">
				    <div class="table-btn">
					  <span class="edit-btn"  @click="jumpDetail(scope.row)">查看</span>
					  <el-popconfirm
					    confirm-button-text='确定'
					    cancel-button-text='不用了'
					    icon="el-icon-info"
					    icon-color="red"
					    title="确定接收？"
						@onConfirm="acceptWorkOrder(scope.row)"
						v-if="scope.row.workOrderState==0"
					  >
					  <span slot="reference" class="edit-btn edit-btn2">接收</span>
					  </el-popconfirm>
				    </div>
				  </template>
				</el-table-column>
			</el-table>
			<div class="pagination-box">
			<p-page :pageNumber.sync="pages.number" :pageTotal="pages.total" :pageSize="pages.size"
					@pageChange="pageRefresh"></p-page>
			</div>
		</div>
	</div>
</template>

<script>
	import FilterList from '@/mixins/FilterList'
	export default {
		mixins: [FilterList],
		data() {
			return {
				filterForm: {
					workOrderNumber: ""
				},
				list: [],
				type:1 //1 24小时工单列表  2被催办信息列表
			}
		},
		created() {
			
			this.getList()
		},
		methods: {
			getList() {
				let param = {
					workOrderNumber: this.filterForm.workOrderNumber,
					pageNumber: this.pages.number,
					pageSize: this.pages.size,
					orgIdList:[5]
				};
				let url='/szkj-datamiddleground/order/getPageOrderListAndOrganizeBy24';
				if(this.type==2){
					url='/szkj-datamiddleground/order/getPageUrgencyCount'
				}
				this.tableLoading=true;
				this.$http.post(url, param).then(res => {
					this.tableLoading=false;
					if (res.code == 200) {
						let data = res.data;
						this.pages.total = data.total;
						this.list = data.records;
						this.list.forEach((item) => {
							item.complaintTime = item.complaintTime.substring(0, 10);
						});
					}
				}).catch((e)=>{
					this.tableLoading=false;
				})
			},
			//接收工单
			acceptWorkOrder(item){
				this.$http.post('/szkj-datamiddleground/order/acceptWorkOrder',{
					workOrderId:item.workOrderId,
					orgId:item.orgId
				}).then(res=>{
					if(res.code==200){
						this.$message("操作成功");
						this.getList()
					}
				}).catch(e=>{
				})
			},
			pageRefresh(){
				this.getList()
			},
			jumpDetail(item){
				this.$router.push({
					path:'/optimization/detail',
					query:item
				})
			},
			link(row) {
				this.dialogVisible = true
			}
		}
	}
</script>
<style lang="scss" scoped>
	.pagination-box {
		margin-top: 30px;
	}
	.edit-btn {
		color: #6276f3;
		cursor: pointer;
	}
	.edit-btn2 {
		margin-left: 5px;
	}
</style>
