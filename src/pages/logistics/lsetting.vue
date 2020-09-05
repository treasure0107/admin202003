<template>
    <div class="content">
        <div class="pages-header">
            <div>配送方式</div>
            <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics" icon="el-icon-plus" size="medium" @click="add_info()">添加配送方式</el-button>
        </div>
        <!--搜索区-->
        <div class="pages-header" style="line-height: 130px;height: 130px;margin-top: 15px">
            <el-form :model="form" label-width="80px" ref="searchForm">
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple">
                        <el-form-item label="快递公司" prop="name" >
                            <el-input v-model="logistics_name" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple-light">
                        <el-form-item label="对接编码" prop="code">
                            <el-input v-model="logistics_code" placeholder="请输入"></el-input>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple">
                        <el-form-item label="电子面单" prop="is_electronic">
                            <el-select v-model="is_electronic" placeholder="请选择" style="width: 100%">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="支持" value="1"></el-option>
                                <el-option label="不支持" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div></el-col>
                </el-row>
                <el-row>
                    <el-col :span="6"><div class="grid-content bg-purple">
                        <el-form-item label="状态" prop="state">
                            <el-select v-model="logistics_status" style="width: 100%" placeholder="请选择">
                                <el-option label="请选择" value=""></el-option>
                                <el-option label="开启" value="1"></el-option>
                                <el-option label="停用" value="0"></el-option>
                            </el-select>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light">
                        <el-form-item>
                            <el-button type="primary" @click="wuliu_list('',1)">查询</el-button>
                            <el-button  @click="onClear('searchForm')">清空筛选</el-button>
                        </el-form-item>
                    </div></el-col>
                </el-row>
            </el-form>
        </div>
        <!--表格区-->
        <div class="table-content">
            <el-table :data="tableData" stripe  style="width: 100%" v-loading="loading">
                <el-table-column fixed prop="id" label="序号" width="60"></el-table-column>
                <el-table-column prop="logistics_name" label="快递公司" show-overflow-tooltip></el-table-column>
                <el-table-column prop="logistics_code" label="对接编码" show-overflow-tooltip></el-table-column>
                <el-table-column prop="logistics_link" label="网址" show-overflow-tooltip></el-table-column>
                <el-table-column prop="is_electronic" label="电子面单" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <label v-if="scope.row.is_electronic==1">支持</label>
                            <label v-else>不支持</label>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="logistics_state" label="状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <div slot="reference" class="name-wrapper">
                            <label style="color: #67C23A;" v-if="scope.row.logistics_status==1">开启</label>
                            <label style="color: #E6A23C;" v-else>停用</label>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="desc" label="说明" show-overflow-tooltip></el-table-column>
                <el-table-column prop="add_user" label="添加人" show-overflow-tooltip></el-table-column>
                <el-table-column  label="添加时间" width="250" show-overflow-tooltip>
                    <template slot-scope="scope">
                    {{scope.row.add_time | Date}}
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" fixed="right">
                    <template slot-scope="scope">
                        <el-row >
                            <!-- <el-button type="success"  size="mini" @click="show_edit_company=false" plain>查看</el-button>-->
                            <el-button type="primary"  circle size="mini " @click="edit_company(scope.row.id)" icon="el-icon-edit"></el-button>
                            <el-button type="warning"  circle size="mini " v-if="scope.row.logistics_status==1" @click="state_company(scope.row.id,'end')" icon="el-icon-close"></el-button>
                            <el-button type="success"  circle size="mini " v-else @click="state_company(scope.row.id,'start')" icon="el-icon-check"></el-button>
                            <el-button type="danger"   circle size="mini " @click="del_company(scope.row.id)" icon="el-icon-delete"></el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <div class="pages-style">
                <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-sizes="pageSizes"
                        :page-size="pagesize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="total">
                </el-pagination>
            </div>
        </div>
        <!--添加-->
        <el-dialog title="添加配送方式" :visible.sync="add_company" top="100px" width="60%">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="快递公司"
                              prop="logistics_name" :rules="[{ required: true, message: '快递名称不能为空'}]">
                    <el-input v-model="form.logistics_name" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="对接编码">
                    <el-input v-model="form.logistics_code" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="跟踪网址"
                              prop="logistics_link" :rules="[{ required: true, message: '跟踪网址不能为空'}]">
                    <el-input v-model="form.logistics_link" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="电子面单" prop="is_electronic" :rules="[{ required: true}]">
                    <el-select v-model="form.is_electronic" placeholder="请选择" >
                        <el-option label="支持" value="1"></el-option>
                        <el-option label="不支持" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="form.desc" style="width: 100%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(form,'add')">立即提交</el-button>
                    <el-button @click="add_company=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
        <!--编辑查看-->
        <el-dialog title="编辑配送方式" :visible.sync="show_edit_company" top="100px" width="60%">
            <el-form ref="form" :model="form" label-width="120px">
                <el-form-item label="快递公司"
                              prop="logistics_name" :rules="[{ required: true, message: '快递名称不能为空'}]">
                    <el-input v-model="form.logistics_name" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="对接编码">
                    <el-input v-model="form.logistics_code" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="跟踪网址"
                              prop="logistics_link" :rules="[{ required: true, message: '跟踪网址不能为空'}]">
                    <el-input v-model="form.logistics_link" style="width: 50%;"></el-input>
                </el-form-item>
                <el-form-item label="电子面单" prop="is_electronic" :rules="[{ required: true}]">
                    <el-select v-model="form.is_electronic" placeholder="请选择" >
                        <el-option label="支持" value="1"></el-option>
                        <el-option label="不支持" value="0"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input type="textarea" v-model="form.desc" style="width: 100%;"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm(form,'edit')">立即提交</el-button>
                    <el-button @click="show_edit_company=false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import UploadImg from '@/components/UplodaImg'

    export default {
        data () {
            return {
                add_company: false,
                show_edit_company:false,
                loading: false,
                currentPage4: 1,
                pageSizes:[10,30,50],
                pagesize:10,
                total:0,
                id: '',
                logistics_name: '',
                logistics_code: '',
                logistics_link: '',
                is_electronic: '',
                logistics_status: '',
                add_user: '',
                add_time: '',
                desc: '',
                form: {
                    id: '',
                    logistics_name: '',
                    logistics_code: '',
                    logistics_link: '',
                    is_electronic: '',
                    logistics_status: '',
                    add_user: '',
                    add_time: '',
                    desc: ''
                },
                formInline: {
                    user: '',
                    region: ''
                },
                tableData: []
            }
        },
        created () {
            this.wuliu_list()
        },
        methods: {
            async wuliu_list (id = 0,type = 0) {
                this.loading = true;
                let currentPage = type === 0 ? this.currentPage4 : 1;
                let data = await this.$request.request(this.$API.logistics_api, {
                    page_size: this.pagesize,
                    current_page:currentPage,
                    logistics_name:this.logistics_name,
                    logistics_code:this.logistics_code,
                    is_electronic:this.is_electronic,
                    logistics_status:this.logistics_status,
                    type:type
                }, 'main', 'GET',{handle_desc:"物流配送列表;"});//DELETE
                let _this = this;
                setTimeout(function (){_this.loading = false;},"400");
                this.total = data.total_page['count'];
                this.tableData = data.data
            },
            async submitForm (data,type) {
                if (!data.logistics_name || !data.logistics_code || !data.is_electronic) {
                    this.Message('请按规则填写信息！','warning',1000);
                    return false;
                }
                let _this = this;
                if (type === 'edit'){
                    let result =  await this.$request.request(this.$API.logistics_edit_api, {
                        desc:data.desc,
                        id:data.id,
                        is_electronic:data.is_electronic,
                        logistics_code:data.logistics_code,
                        logistics_link:data.logistics_link,
                        logistics_name:data.logistics_name,
                        add_user:this.$common.getNowUserId(false)['user_name']
                    }, 'main', 'POST',{handle_desc:"修改配送信息;"+data.id});//DELETE
                    let type_message = result.code === 200 ? 'success' : 'error';
                    SendMessage({message: result.msg, type: type_message});
                    if (result.code === 200) {
                        _this.show_edit_company = false;
                        _this.wuliu_list();
                    }
                }else{
                    let result = await this.$request.request(this.$API.logistics_add_api, {
                        desc:data.desc,
                        is_electronic:data.is_electronic,
                        logistics_code:data.logistics_code,
                        logistics_link:data.logistics_link,
                        logistics_name:data.logistics_name,
                        add_user:this.$common.getNowUserId(false)['user_name']
                    }, 'main', 'POST',{handle_desc:"添加配送信息;"+data.logistics_name});//DELETE
                    let type_message = result.code === 200 ? 'success' : 'error';
                    SendMessage({message: result.msg, type: type_message});
                    if (result.code === 200) {
                        _this.add_company = false;
                        _this.wuliu_list();
                    }
                }
            },
            state_company (edit_id,type){
                if (!edit_id ||!type){
                    this.Message('参数错误！','warning',1000);
                }
                let msg = type === 'end' ? '确认停用此配送方式？' : '确认开启此配送方式？';
                let _this = this;
                this.$confirm(msg, '确认信息', {
                    distinguishCancelAndClose: true,
                    confirmButtonText:'确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let data = await this.$request.request(this.$API.logistics_status_api, {
                        id:edit_id
                    }, 'main', 'GET',{handle_desc:"修改配送状态;"+edit_id});//DELETE
                    let return_message = data.code === 200 ? data.msg : data.msg;
                    let type_message = data.code === 200 ? 'success' : 'error';
                    SendMessage({message: return_message, type: type_message});
                    _this.wuliu_list()
                }).catch(() => {

                });
            },
            del_company(del_id){
                if (!del_id){
                    this.Message('参数错误！','warning',1000);
                }
                let _this = this;
                this.$confirm('是否删除此记录信息？', '确认信息', {
                    distinguishCancelAndClose: false,
                    confirmButtonText:'确认',
                    cancelButtonText: '取消',
                }).then(async () => {
                    let data = await this.$request.request(this.$API.logistics_del_api, {
                        id:del_id
                    }, 'main', 'GET',{handle_desc:"删除配送信息;"+del_id});//DELETE
                    let type_message = data.code === 200 ? 'success' : 'error';
                    SendMessage({message: data.msg, type: type_message});
                    _this.wuliu_list()
                }).catch(() => {});
            },
            add_info(){
                this.add_company = true;
                this.form.id = '';
                this.form.logistics_name ='';
                this.form.logistics_code = '';
                this.form.logistics_link = '';
                this.form.is_electronic = '';
                this.form.desc = '';
            },
            async edit_company(edit_id){
                this.show_edit_company = true;
                let data = await this.$request.request(this.$API.logistics_one_api, {
                    id: `${edit_id}`
                }, 'main', 'GET',{handle_desc:"编辑配送信息;"+edit_id});
                this.form.id = data.data.id;
                this.form.logistics_name = data.data.logistics_name;
                this.form.logistics_code = data.data.logistics_code;
                this.form.logistics_link = data.data.logistics_link;
                this.form.is_electronic = data.data.is_electronic.toString();
                this.form.desc = data.data.desc;
            },
            async handleSizeChange(val) {
                this.pagesize = val
                this.wuliu_list()
            },
            async handleCurrentChange(val) {
                this.currentPage4=val
                this.wuliu_list()
            },
            async onSearch(data){
                this.wuliu_list()
            },
            onClear(searchForm){
                this.logistics_name=''
                this.logistics_code=''
                this.is_electronic=''
                this.logistics_status=''
                // this.$refs[searchForm].resetFields();
            },
            Message(msg='这是一条提示信息',type='error',time=3000){
                this.$message({
                    showClose: true,
                    message: msg,
                    type: type,
                    duration:time
                });
            }
        },
        components: {

        },
        filters: {
            Date(str) {
                let strs = str.replace('T',' ');
                return strs;
            }
        },
    }
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .content {
        width: 100%;
        background: #f5f5f5;
        border-bottom: 1px #eeeeee solid;
        border-radius: 5px;


        .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }

        .avatar-uploader .el-upload:hover {
            border-color: #409EFF;
        }

        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }

        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
        #add-logistics{
            float: left;
        }
        .search-content{
            margin-bottom: 0px;
            margin-left: 15px;
            margin-top: 15px;
            height: 52px;
        }
        .table-page{
            float: right;
            margin: 15px;
        }
        .table-content{
            margin-left: 15px;
        }
    }
    .grid-content {
        border-radius: 4px;
        height: 40px;
    }
    .el-col{
        margin-top: 15px;
    }
</style>