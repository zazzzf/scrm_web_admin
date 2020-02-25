<template>
	<div>
		<el-card>
            <span slot="header">
				<el-page-header :title="$t('back')" @back="cancel" :content="formData.script_id?'编辑集合':'添加集合'" ></el-page-header>
			</span>
            <div style="max-width: 500px">
                <el-form ref="form" :model="formData" label-width="150px" :rules="rules" label-position="top">
                    <el-form-item label="选择分类" prop="categoryId">
                        <el-select clearable  v-model="formData.categoryId"  placeholder="选择分类">
                            <el-option v-for="item in categoryList" :key="item.category_id" :label="item.name" :value="item.category_id"></el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="集合名称" prop="title">
                        <el-input v-model="formData.title"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="集合封面" prop="img">
                        <Upload :fileList="formData.id?[{url:formData.img,name:formData.img}]:[]" :data="formData.img" :type="1" :prefix="'JH_'" :accept="'image/*'" :qnlink="'http://scrm-image-qn.xaxhl.net'" :md5="true" @on-success="getLink"></Upload>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button type="primary" @click="submit" >确定</el-button>
                    <el-button @click="cancel">取消</el-button>
                </span>
            </div>
        </el-card>
	</div>
</template>
<script>
import Upload from '@/components/img-upload'
import setsApi from '@/api/sets.js'
export default {
    components:{
        Upload
    },
	data(){
        return{
            formData:{
                categoryId:'',
                title:'',
                img:'',
            },
            rules:{
                title: [{ required: true, message: '请填入名称', trigger: 'change' }],
                categoryId: [{ required: true, message: '请选择分类', trigger: 'change', type:"number" }],
                img: [{ required: true, message: '请上传封面', trigger: 'change' }],
            },
        }
    },
    computed:{
        categoryList(){
				return this.$store.getters.categoryList
			}
    },
    methods:{
        cancel(){
            this.$router.push('sets')
        },
        getData(){
            var data = this.$route.params.data
            console.log(data)
            if(data){
                this.formData = data
                this.formData.categoryId = data.category_id
                this.formData.img = data.img.indexOf('http://')==-1?"http://"+data.img:data.img
            }

        },
        getLink(link){
            this.formData.img = link
        },
        
        submit(){
            let postData = {
                    categoryId: this.formData.categoryId,
                    title: this.formData.title,
                    img: this.formData.img,
            };
            this.$refs.form.validate(valid => {
                if(valid){
                    if(this.formData.id){
                        postData.id = this.formData.id
                        setsApi.edit(postData).then(res => {
                            this.$message.success('修改成功')
                            this.cancel();
                        })
                    }else{
                        setsApi.add(postData).then(res => {
                            this.$message.success('提交成功')
                            this.cancel();
                        })
                    }
                }
            })
        },
    },
    mounted(){
        this.getData();
    }
}
</script>