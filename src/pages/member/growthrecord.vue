<template>
    <div class="content">
        <div class="pages-header">
            <div>成长记录</div>
        </div>
        <div class="table-content">
            <el-form :inline="true" label-width="85px" :model="form" class="demo-form-inline">
                <el-form-item label="手机号">
                    <el-input v-model="form.mobile"  style="width: 200px" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="邮箱">
                    <el-input v-model="form.email" style="width: 200px" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="奖励成长值">
                    <el-input controls-position="right" style="width: 200px" v-model="form.value" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="奖励时间" prop="create_time">
                    <el-date-picker
                            v-model="form.create_time"
                            style="width: 100%"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            value-format="timestamp"
                            range-separator="至">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label=" ">
                    <el-button type="primary" @click="gettableList('search')">查询</el-button>
                    <el-button type="" @click="clear()">清空条件</el-button>
                </el-form-item>
            </el-form>

            <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
                <el-table-column
                        label="序号"
                        prop="id"
                        width="150">
                </el-table-column>
                <el-table-column prop="mobile" label="手机号">
                </el-table-column>
                <el-table-column prop="email" label="邮箱" show-overflow-tooltip></el-table-column>
                <el-table-column prop="desc" label="任务"></el-table-column>
                <el-table-column prop="value" label="奖励成长值" width="150"></el-table-column>
                <el-table-column prop="create_time" width="220" label="奖励时间" ></el-table-column>
            </el-table>
            <div class="pages-style">
                <el-pagination
                        background
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="count"
                        :page-size="size"
                        :page-sizes=pageSize
                        :current-page="form.page"
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange">

                </el-pagination>
            </div>
        </div>
    </div>
</template>
<script>
    import PreviewImage from '@/components/PreviewImage'
    export default {
        data () {
            return {
                is_edits:false,
                content: '',
                loading: false,
                count: 0,
                size: 20,
                pageSize:[20],
                form: {
                    create_time:'',
                    mobile:'',
                    email:'',
                    value:'',
                    page:1,
                },
                tableData: [],
                pickerOptions: {
                    shortcuts: [{
                        text: '最近一周',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近一个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                            picker.$emit('pick', [start, end]);
                        }
                    }, {
                        text: '最近三个月',
                        onClick(picker) {
                            const end = new Date();
                            const start = new Date();
                            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                            picker.$emit('pick', [start, end]);
                        }
                    }]
                }
            }
        },
        created () {
            this.gettableList()
        },
        methods: {
            async gettableList (str) {
                this.loading = true;
                if(str) this.form.page = 1;
                let {data} = await this.$request.get(this.$API.common_api, {
                    page_size:this.size,
                    page:this.form.page,
                    email:this.form.email,
                    mobile:this.form.mobile,
                    value:this.form.value,
                    reg_start_time:this.form.create_time ? this.form.create_time[0] / 1000 : '',
                    reg_end_time:this.form.create_time ? this.form.create_time[1] / 1000 : ''
                }, 'main', {
                    router_path: 'task/log',
                    request_host: 'MEMBER_USER_HOST',
                    handle_desc: "查看会员成长记录;"
                });
                this.loading = false;
                console.log(data);
                this.tableData = data.data;
                this.count = data.total;
                this.loading = false;
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

            },
            clear(){
                this.form.email='';
                this.form.mobile='';
                this.form.value='';
                this.form.create_time='';
                this.gettableList(1);
            }
        },
        filters: {
            formatDate(str) {

            }
        },
        components: {
            PreviewImage,
        },
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
