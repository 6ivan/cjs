const pMixin = {
	data() {
		return {
			pages: {
				number: 1,
				total: 0,
				size: 10
			}
		}
	},
	filters: {
		formatDate(t) {
			if(!t) return '--'
			let date=new Date(t);
			let y=date.getFullYear();
			let m=date.getMonth()+1;
			let d=date.getDate();
			let m2=m<10?"0"+m:m;
			let d2=d<10?"0"+d:d;
			return y+"-"+m2+"-"+d2
		}
	},
	created() {},
	methods: {
		pTableHead(){
			return 'p-table-header-row'
		},
		pTableCell(){
			return 'p-table-cell'
		}
		
	}
}
export default pMixin
