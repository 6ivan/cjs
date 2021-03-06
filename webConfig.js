module.exports = {
	apiUrl:"/szkj-usersystem",
	// apiUrl:"http://119.96.190.174:8888",//云地址
	basePath:"/",
	// basePath:"/szkj-datamiddleground",
	// 投诉类别
	complaintCategory:{
		1:"有信号无法登录",
		2:"信号弱/不稳定	",
		3:"网速慢",
		4:"无信号",
		5:"有信号无法接通",
		6:"省际漫游质量",
		7:"省内漫游质量",
		8:"频繁掉线",
		9:"网页无法正常打开",
		10:"通话质量",
		11:"业务数据异常",
		12:"有信号无法主被叫",
	},
	// 投诉子类别
	subCategory:{
		1:"所有位置",
		2:"单个位置",
		3:"漫出",
		4:"漫入",
		5:"断线",
		6:"串线",
		7:"杂音",
		8:"掉话",
		9:"回音",
		10:"程控业务使用异常",
		11:"无法订购/退订VOLTE",
		12:"单通",
	},
	// 紧急状态
	degreeUrgency:{
		1:"一般",
		2:"紧急",
		3:"非常紧急",
		4:"不紧急",
	},
	// 派单状态
	dispatchState:{
		1:"未派单",
		2:"已派单",
		3:"已回单",
	},
	// 工单类型
	workOrderType:{
		1: "疑难工单", 
		2: "专项工单",
		3: "贬损工单",
		4: "重复基站",
		5: "重复用户",
	},
	// 工单状态
	workOrderState: { 
		0: "待处理",
		1: "已接受",
		2: "已解决",
		3: "未解决",
	},
}