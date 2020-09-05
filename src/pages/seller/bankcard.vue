<template>
    <div class="content">
        <div class="pages-header" style="line-height: 125px;height: 125px;">
            <el-form ref="form" :model="form" label-width="80px">
                <el-row :gutter="20">
                    <el-col :span="6"><div class="grid-content bg-purple">
                        <el-form-item label="店铺名称">
                            <el-input v-model="form.seller_name" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-light">
                        <el-form-item label="公司名称">
                            <el-input v-model="form.company_name" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple">
                        <el-form-item label="银行账号">
                            <el-input v-model="form.account_number" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-light" style="margin-right: 15px">
                        <el-form-item label="开户行">
                            <el-input v-model="form.bank_name_master" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div></el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="6"><div class="grid-content bg-purple">
                        <el-form-item label="审核状态">
                            <el-select
                                    suffix-icon="el-icon-search"
                                    v-model="form.is_auth"
                                    filterable
                                    remote
                                    reserve-keyword
                                    placeholder="请选择"
                                    @change="selectChange"
                                    style="width: 100%;">
                                <el-option
                                        v-for="(item,index) in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light">
                        <el-form-item>
                            <el-button type="primary" @click="dataList()">查询</el-button>
                            <el-button @click="onClear('form')">清空筛选</el-button>
                        </el-form-item>
                    </div></el-col>
                </el-row>
            </el-form>
        </div>
        <div class="table-content">
            <el-table
                    :data="tableData"
                    fixed
                    style="width: 100%">
                <el-table-column prop="id" label="序号" width="80px;"></el-table-column>
                <el-table-column prop="shop" label="店铺名称" show-overflow-tooltip></el-table-column>
                <el-table-column prop="company_name" label="公司名称" width="220px" show-overflow-tooltip></el-table-column>
                <el-table-column prop="account_number" label="银行账号" show-overflow-tooltip></el-table-column>
                <el-table-column prop="bank_name_master" label="开户行" show-overflow-tooltip></el-table-column>
                <el-table-column prop="create_time" label="绑定时间" width="200px;" show-overflow-tooltip></el-table-column>
                <el-table-column prop="update_time" label="审核时间" width="200px;" show-overflow-tooltip></el-table-column>
                <el-table-column prop="is_auth" label="审核状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_auth == 0" style="color: #F56C6C;">失败</span>
                        <span v-if="scope.row.is_auth == 1" style="color: #67C23A;">通过</span>
                        <span v-if="scope.row.is_auth == 2" style="color: #F56C6C;">不通过</span>
                    </template>
                </el-table-column>
                <el-table-column prop="operation" label="操作" width="100px;" fixed="right">
                    <template slot-scope="scope">
                        <el-row >
                            <el-button v-if="scope.row.is_auth == 0" type="success" circle size="mini" @click="checkStore(scope.row)" icon="el-icon-check"></el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages-style">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes=pageSizes
                        :page-size=pagesize
                        layout="total, sizes, prev, pager, next, jumper"
                        :total=total
                        background>
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                pageSizes: [10,20,50],
                pagesize: 10,
                currentPage4: 1,
                total:0,
                options:[
                    {
                        value: '',
                        label: '请选择'
                    },
                    {
                        value: 0,
                        label: '失败'
                    }, {
                        value: 1,
                        label: '通过'
                    }, {
                        value: 2,
                        label: '不通过'
                    }
                ],
                tableData: [],
                form:{
                    status:'',
                    name:'',
                    company_name:'',
                    bank_number:'',
                    bank_name:'',
                    seller_name:'',
                    account_number:'',
                    is_auth:''
                },
            }
        },
        created () {
            this.dataList()
        },
        methods: {
            async dataList () {
                this.loading = true;
                let param = {};
                param['page'] = this.currentPage4;
                param['size'] = this.pagesize;
                param['company_name'] = this.form.company_name;
                param['account_number'] =this.form.account_number;
                param['seller_name'] =this.form.seller_name;
                param['bank_name_master'] = this.form.bank_name_master;
                param['is_auth'] = this.form.is_auth;
                let data = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
                    router_path: 'se_wallet/bank_binding',
                    request_host:'STORE_SERVER_HOST',
                    handle_desc:"绑定银行卡列表;"
                });
                this.tableData = data.data.result;
                console.log(data);
                this.total = data.data.count;
                this.loading = false;
            },
            async handleCurrentChange(val) {
                this.currentPage4 = val;
                this.dataList();
            },
            async handleSizeChange (val) {
                this.pagesize = val;
                this.dataList();
            },
            onClear(){
                this.form.company_name = '';
                this.form.account_number = '';
                this.form.seller_name = '';
                this.form.bank_name_master = '';
                this.form.is_auth = '';
                this.dataList();
            },
            async checkStore(data){
                let result = await this.$request.request(this.$API.common_api,{
                    id:data.id
                }, 'main', 'PUT', {
                    router_path: 'se_wallet/bank_revie',
                    request_host:'STORE_SERVER_HOST',
                    handle_desc:"修改银行卡审核状态;"+data.id
                });
                console.log(result);
                this.dataList();
                SendMessage({message: '修改成功', type: 'success'});
            },
            async selectChange(){

            },
        },
    }
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .el-form-item{
        margin-top: 15px;
    }
    .el-row {
        margin-bottom: 0px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .grid-content {
        border-radius: 4px;
        height: 30px;
    }
</style>