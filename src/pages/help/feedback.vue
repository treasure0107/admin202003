<template>
    <div class="content">
        <div class="pages-header">
            <div>意见反馈</div>
        </div>
        <div class="table-content">
            <el-form :inline="true" :model="form" class="demo-form-inline">
                <el-form-item label="意见类型">
                    <el-select v-model="form.feedback_type" placeholder="请选择">
                        <el-option label="请选择" value=""></el-option>
                        <el-option label="商品描述" :value="0"></el-option>
                        <el-option label="价格" :value="1"></el-option>
                        <el-option label="产品体验" :value="2"></el-option>
                        <el-option label="活动" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="问题描述">
                    <el-input v-model="form.problem_description" placeholder="问题描述"></el-input>
                </el-form-item>
                <el-form-item label="联系电话">
                    <el-input v-model="form.contact_number" placeholder="联系电话"></el-input>
                </el-form-item>
                <el-form-item label="是否回访">
                    <el-select v-model="form.is_retrun" placeholder="请选择">
                        <el-option label="请选择" value=""></el-option>
                        <el-option label="是" :value="1"></el-option>
                        <el-option label="否" :value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="gettableList()">查询</el-button>
                    <el-button type="" @click="clear()">清空条件</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column
                        label="序号"
                        prop="feedback_id"
                        width="50">
                </el-table-column>
                <el-table-column prop="feedback_type" label="意见类型" sortable>
                    <template slot-scope="scope">
                        <label v-if="scope.row.feedback_type == 0">商品描述</label>
                        <label v-if="scope.row.feedback_type == 1">价格</label>
                        <label v-if="scope.row.feedback_type == 2">产品体验</label>
                        <label v-if="scope.row.feedback_type == 3">活动</label>
                    </template>
                </el-table-column>
                <el-table-column prop="problem_description" label="问题描述" show-overflow-tooltip></el-table-column>
                <el-table-column prop="solved_num" label="图片">
                    <template slot-scope="scope">
                        <preview-image v-if="scope.row.feedback_img" :image="scope.row.feedback_img" :height="'30px'"></preview-image>
                    </template>
                </el-table-column>
                <el-table-column prop="contact_number" label="联系电话" width="150"></el-table-column>
                <el-table-column prop="submission_time" label="提交时间" width="220" sortable>
                    <template slot-scope="scope">
                        {{scope.row.submission_time}}
                    </template>
                </el-table-column>
                <el-table-column prop="return_remarks" label="回访备注" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div>{{scope.row.return_remarks}}</div>
                        <el-button type="primary" plain size="mini" icon="el-icon-edit" @click="edits(scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="return_man" label="回访人" sortable></el-table-column>
                <el-table-column prop="retrun_time" width="220" label="回访时间" sortable></el-table-column>
            </el-table>
            <div class="pages-style">
                <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count"
                        :page-size="size"
                        :page-sizes=pageSize
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange">

                </el-pagination>
            </div>
        </div>
        <!--商品列表-->
        <el-dialog title="回访备注" :visible.sync="is_edits"  width="400px" >
            <el-form :rules="rules" :inline="true" label-position="left" :model="descForm" ref="descForm" label-width="60px" class="descForm">
                <el-row>
                    <el-form-item label="备注" prop="desc" required>
                        <el-input type="textarea" maxlength="500" :rows="4" placeholder="请输入备注内容" style="width: 280px" v-model="descForm.desc"></el-input>
                    </el-form-item>
                </el-row>
                <el-row>
                    <div style="float: right;margin-right: 20px">
                        <el-button size="small" type="primary" @click="submitDesc()">保存</el-button>
                        <el-button size="small" @click="is_edits=false">取消</el-button>
                    </div>
                </el-row>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
    import PreviewImage from '@/components/PreviewImage'
    export default {
        data () {
            return {
                showEdit: false,
                is_edits:false,
                content: '',
                loading: false,
                pageSize:[20,50,100,200],
                form: {
                    param:[],
                    feedback_type:'',
                    problem_description:'',
                    contact_number:'',
                    is_retrun:'',
                    page:1,
                    old_desc:'',
                    desc:'',
                    submission_time:'',
                },
                descForm:{
                    desc:'',
                },
                tableData: [],
                rules: {
                    desc: [
                        {required: true, message: '请输入备注信息', trigger: 'blur'}
                    ]
                },
                count: 0,
                size: 20
            }
        },
        created () {
            this.gettableList()
        },
        methods: {
            async gettableList () {

                this.loading = true;
                let {data} = await this.$request.get(this.$API.common_api, {
                    page_size:this.form.pageSize ? this.form.pageSize : this.size,
                    page:this.form.page,
                    feedback_type:this.form.feedback_type,
                    problem_description:this.form.problem_description,
                    contact_number:this.form.contact_number,
                    is_retrun:this.form.is_retrun
                }, 'main', {
                    router_path: 'pcadmin/feedback',
                    request_host: 'FEEDBACK_SERVER_HOST'
                });
                this.tableData = data.result;
                this.count = data.count;
                this.loading = false;
            },
            edits(data){
                this.form.param = data;
                this.is_edits = true;
                this.form.old_desc = data.problem_description;
                this.descForm.desc = data.return_remarks;
            },
            handleCurrentChange (event) {
                this.form.page = event
                this.gettableList()
            },
            handleSizeChange(event){
                this.form.pageSize = event;
                this.gettableList()
            },
            async submitDesc(){
                if (!this.descForm.desc) {
                    SendMessage({message: '请输入备注信息', type: 'error'});
                    return false;
                }
                let nowDate = new Date();
                let date = {
                    year: nowDate.getFullYear(),
                    month: nowDate.getMonth() + 1,
                    date: nowDate.getDate(),
                    h : (nowDate.getHours() < 10 ? '0'+nowDate.getHours() : nowDate.getHours()) + ':',
                    m : (nowDate.getMinutes() < 10 ? '0'+nowDate.getMinutes() : nowDate.getMinutes()) + ':',
                    s : (nowDate.getSeconds() < 10 ? '0'+nowDate.getSeconds() : nowDate.getSeconds()),
                };
                let systemDate = date.year + '-'  + date.month + '-'  + date.date +" "+date.h + date.m + date.s;

                let param = {
                    return_remarks:this.descForm.desc,
                    return_man:this.$common.getNowUserId(false)['user_name'],
                    retrun_time:systemDate,
                    feedback_type: this.form.param.feedback_type,
                    contact_number: this.form.param.contact_number,
                    problem_description: this.form.param.problem_description,
                };
                let result = await this.$request.request(this.$API.common_api,param, 'main', 'PUT', {
                    router_path: 'pcadmin/feedback_id',
                    request_host: 'FEEDBACK_SERVER_HOST',
                    extra_url: `${this.form.param.feedback_id}`,
                    handle_desc:"意见反馈编辑备注信息，编辑前备注信息|"+this.form.old_desc+"|;"+this.form.param.feedback_id
                });
                if (result.code === 200){
                    this.is_edits = false;
                    SendMessage({message: '编辑成功', type: 'success'});
                    this.gettableList();
                }
            },
            clear(){
                this.form.feedback_type='';
                this.form.problem_description='';
                this.form.contact_number='';
                this.form.is_retrun='';
                this.gettableList();
            }
        },
        filters: {
            formatDate(str) {

            }
        },
        components: {
            PreviewImage,
        },
        watch: {
            showEdit (o) {
                !o && this.unForm()
            }
        }
    }
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .table-content {
        width: calc(~"100% - 30px");
        margin: 15px 15px;

        .demo-form-inline {
            background: #ffffff;
            padding: 20px 15px 10px 15px;
        }
    }
</style>
