<template>
    <el-card shadow='never'>
		<div slot="header" >
			<span>报告集合管理</span>
		    <el-button type="text" style="float: right;padding: 3px 0" @click="add_sns_set" >添加集合</el-button>
		</div>
        <div>
            <el-table :data="tableList">
				<el-table-column prop="title" label="标题" ></el-table-column>
				<el-table-column prop="status" label="状态">
                    <template slot-scope="s">
                        <el-select v-model="s.row.status" @change="changeSetStatus(s.row,$event)">
                            <el-option :value="-1" label="关闭"></el-option>
                            <el-option :value="1" label="开启"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
				<el-table-column prop="created" label="创建时间" ></el-table-column>
				<el-table-column prop="action" :label="$t('operation')" min-width="100" >
					<template slot-scope="scope"    >
                        <el-button size="mini" type="primary" @click="editSet(scope.row)">{{$t('edit')}}</el-button>
						<el-button size="mini" type="danger" @click="delSet(scope.row)">{{$t('delete')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
        </div>
    </el-card>    
</template>
<script>
import { GET_SETLIST, CHANGE_SET_STATUS, THE_SET_EDIT, THE_SET_ADD, THE_SET_DEL } from '@/api/sns'
export default{
    data() {
        return{
            tableList: [],
        }
    },
    methods:{
		
        getList(){
            GET_SETLIST().then( res => {
                this.tableList = res.data;
            })
        },
        changeSetStatus(data,val){
            let postData = {
                id: data.id,
                status: val,
            };
            CHANGE_SET_STATUS(postData).then(res => {
                this.$message.success('修改成功')
                this.getList();
            }).catch(res => {
                data.status = (val == -1?1:-1)
            })
        },
        add_sns_set(){
            this.$router.push({
                name:'snsSetAdd'
            })
        },
        
        editSet(data){
            this.$router.push({
                name:'snsSetAdd',
                params: {data}
            })
        },
        delSet(data){
            this.$confirm('此操作将永久删除该集合, 是否继续?', '提示', {
				confirmButtonText: '确认删除',
				cancelButtonText: '取消',
				type: 'warning'
			})
            .then(() => {
                let postData = {knowledgeSetId: data.id}
                THE_SET_DEL(postData).then(res => {
                    this.$message.success('删除成功')
                    this.getList()
                })
            })
        }
        
    },
    created(){
        this.getList();
    }
}
</script>
