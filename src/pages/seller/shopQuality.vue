<template>
    <div class="content">
        <div class="settled-in-search">
            <el-form :inline="true" ref="form" :model="form" label-width="80px">
                <el-form-item label="店铺名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="审核状态" prop="status">
                    <el-select
                            suffix-icon="el-icon-search"
                            v-model="form.status"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请选择"
                            @change="selectChange">
                        <el-option
                                v-for="(item,index) in options"
                                :key="item.value"
                                :label="item.label"
                                :value="index">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="申请时间" prop="value3" label-width="70px">
                    <el-date-picker
                            v-model="form.value3"
                            type="datetimerange"
                            format="yyyy-MM-dd HH:mm:ss"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            range-separator="至">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="dataList()">查询</el-button>
                    <el-button @click="onClear('form')">清空筛选</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table-content">
            <el-table
                    :data="tableData"
                    v-loading="loading"
                    fixed
                    style="width: 100%">
                <el-table-column prop="apply_id" label="序号" width="50px;"></el-table-column>
                <el-table-column prop="shop_name" label="店铺名称"></el-table-column>
                <el-table-column prop="url" label="认证资料" width="220px">
                    <template slot-scope="scope">
                        <el-row v-if="scope.row.pic_url">
                            <el-col :span="8"><div class="grid-content bg-purple-dark">
                                <preview-image v-if="scope.row.pic_url[0]" :image="scope.row.pic_url[0]" :height="'30px'"></preview-image>
                            </div></el-col>
                            <el-col :span="8"><div class="grid-content bg-purple-dark">
                                <preview-image v-if="scope.row.pic_url[1]" :image="scope.row.pic_url[1]" :height="'30px'" ></preview-image>
                            </div></el-col>
                            <el-col :span="8"><div class="grid-content bg-purple-dark">
                                <preview-image v-if="scope.row.pic_url[2]" :image="scope.row.pic_url[2]" :height="'30px'" ></preview-image>
                            </div></el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" label="申请时间" width="160px;" show-overflow-tooltip></el-table-column>
                <el-table-column prop="review_status" label="审核状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.review_status == 1" style="color: #67C23A;">通过</span>
                        <span v-if="scope.row.review_status == 2" style="color: #F56C6C;">不通过</span>
                        <span v-if="scope.row.review_status == 3" style="color: #F56C6C;">待审核</span>
                    </template>
                </el-table-column>
                <el-table-column prop="fail_message" label="审核原因" show-overflow-tooltip></el-table-column>
                <el-table-column prop="reviewer" label="审核人"></el-table-column>
                <el-table-column prop="update_time" label="审核时间" width="160px;" show-overflow-tooltip></el-table-column>
                <el-table-column prop="operation" label="操作" width="100px;" fixed="right">
                    <template slot-scope="scope">
                        <el-row >
                            <el-button type="primary" circle size="mini" @click="checkStore(scope.row)" icon="el-icon-check"></el-button>
                            <el-button type="danger"  circle size="mini" @click="checkCentent(scope.row)" icon="el-icon-close"></el-button>
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
    import PreviewImage from '@/components/PreviewImage'
    export default {
        data () {
            return {
                pageSizes: [10,20],
                pagesize: 10,
                currentPage4: 1,
                total:0,
                check_msg:'',
                loading:false,
                options:[
                    {
                        value: '',
                        label: '请选择'
                    },
                    {
                        value: '1',
                        label: '通过'
                    }, {
                        value: '2',
                        label: '不通过'
                    },{
                        value: '3',
                        label: '待审核'
                    },
                ],
                tableData: [],
                form:{
                    status:'',
                    name:'',
                    value3:'',
                },
            }
        },
        created () {
            this.dataList()
        },
        methods: {
            async dataList () {
                this.loading = false;
                let param = {};
                param['apply_type'] = 2;
                param['page'] = this.currentPage4;
                param['size'] = this.pagesize;
                param['shop_name'] = this.form.name;
                param['review_status'] = this.form.status;
                param['start_time'] = this.form.value3 ? this.form.value3[0] : '';
                param['end_time'] = this.form.value3 ? this.form.value3[1] : '';
                console.log(param);
                let {data} = await this.$request.request(this.$API.common_api,param, 'main', 'GET', {
                    router_path: 'opp/show_info',
                    request_host:'SHOP_CERTIFICATION_HOST',
                    handle_desc:"质量保证列表;",
                });
                this.tableData = data.results;
                this.total = data.count;
                this.loading = false;
            },
            async handleCurrentChange(val) {
                this.currentPage4 = val;
                this.dataList();
            },
            async handleSizeChange (val) {
                this.pagesize = val;
            },
            async checkStore(data){
                this.$confirm('是否设置为审核通过', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(async () => {
                    let userInfo = this.$common.getNowUserId(false);
                    let result = await this.$request.request(this.$API.common_api,{
                        shop_id:data.shop_id,
                        apply_type:2,
                        review_status:1,
                        reviewer:userInfo['user_name'],
                    }, 'main', 'PUT', {
                        router_path: 'opp/train_info',
                        request_host:'SHOP_CERTIFICATION_HOST',
                        handle_desc:"质量保证信息审核通过;"+data.shop_id,
                    });
                    SendMessage({message: '审核成功', type: 'success'});
                    this.dataList();
                }).catch((e) => {

                })
            },
            async checkCentent(data){
                this.$prompt('请输入审核原因', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    inputPattern: /[\u4E00-\u9FA5\uF900-\uFA2D]/,
                    inputErrorMessage: '请输入中文'
                }).then(async({ value }) => {
                    let userInfo = this.$common.getNowUserId(false);
                    let result = await this.$request.request(this.$API.common_api,{
                        shop_id:data.shop_id,
                        apply_type:2,
                        review_status:2,
                        reviewer:userInfo['user_name'],
                        fail_message:value,
                    }, 'main', 'PUT', {
                        router_path: 'opp/train_info',
                        request_host:'SHOP_CERTIFICATION_HOST',
                        handle_desc:"质量保证信息审核不通过;"+data.shop_id,
                    });
                    SendMessage({message: '审核成功', type: 'success'});
                    this.dataList();
                }).catch(() => {});
            },
            onClear(form){
                this.form.status = '';
                this.form.name = '';
                this.form.value3 = '';
            },
            async selectChange(val){
                this.form.status = val;
            },
        },
        components: {
            PreviewImage,
        }
    }
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
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
    .el-form-item{
        margin-top: 20px;
    }
</style>