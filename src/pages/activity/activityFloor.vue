<template>
    <div class="content">
        <div class="pages-header">
            <div><router-link to="/activity/activityList" style="text-decoration:none;color:#000000;">活动模板列表</router-link>/活动模板楼层</div>
            <el-button style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics" size="medium" @click="addFlor()">增加楼层</el-button>
            <el-dialog :title="dialog_title" :visible.sync="addFloor">
                <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                    <el-form-item>
                        <el-row>
                            <el-col :span="14">
                                <div class="form-item">
                                    <el-form-item label="楼层名称" prop="floor_name">
                                        <el-input v-model="form.floor_name"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="8">
                                <div class="form-item">
                                    <el-form-item label="排序(越大越靠前)" prop="is_order">
                                        <el-input v-model="form.is_order" v-model.number="form.is_order"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="form-item">
                                    <el-form-item label="PC楼层图片" prop="pc_floor_image">
                                        <el-row>
                                            <el-col :span="4">
                                                <el-image style="width: 100px; height: 100px" :src="form.pc_floor_image" :fit="fit"
                                                          v-if="form.pc_floor_image"></el-image>
                                            </el-col>
                                            <el-col :span="8">
                                                <upload-img @uploaded="pcUploadedFloor"></upload-img>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="24">
                                                <el-button @click="form.pc_floor_image = ''" type="text" v-if="form.pc_floor_image">删除
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="form-item">
                                    <el-form-item label="移动端楼层图片" prop="mobile_floor_image">
                                        <el-row>
                                            <el-col :span="4">
                                                <el-image style="width: 100px; height: 100px" :src="form.mobile_floor_image" :fit="fit"
                                                          v-if="form.mobile_floor_image"></el-image>
                                            </el-col>
                                            <el-col :span="8">
                                                <upload-img @uploaded="mUploadedFloor"></upload-img>
                                            </el-col>
                                        </el-row>
                                        <el-row>
                                            <el-col :span="24">
                                                <el-button @click="form.mobile_floor_image = ''" type="text" v-if="form.mobile_floor_image">删除
                                                </el-button>
                                            </el-col>
                                        </el-row>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <div class="form-item">
                                    <el-form-item label="状态" prop="is_show">
                                        <el-switch v-model="form.is_show"></el-switch>
                                    </el-form-item>
                                </div>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="20" :offset="4">
                                <div class="form-item">
                                    <el-button type="primary" @click="onSubmit(form)">保存</el-button>
                                    <el-button @click="addFloor = false">取消</el-button>
                                </div>
                            </el-col>
                        </el-row>
                    </el-form-item>
                </el-form>
            </el-dialog>
        </div>
        <div class="table-content">
            <el-table ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%" v-loading="loading">
                <el-table-column prop="floor_id" label="序号"></el-table-column>
                <el-table-column label="PC楼层图片">
                    <template slot-scope="scope">
                        <preview-image :image="scope.row.pc_floor_image" :height="'50px'" :key="scope.$index"></preview-image>
                    </template>
                </el-table-column>
                <el-table-column prop="object_id" label="移动端楼层图片">
                    <template slot-scope="scope">
                        <preview-image :image="scope.row.mobile_floor_image" :height="'50px'" :key="scope.$index"></preview-image>
                    </template>
                </el-table-column>
                <el-table-column prop="floor_name" label="楼层名称"></el-table-column>
                <el-table-column prop="is_order" label="排序值(越大越靠前)"></el-table-column>
                <el-table-column prop="goods_number" label="设置商品数"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.is_show" @change="changeShow(scope.row,scope.row.is_show)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="" label="操作" fixed="right" width="300px">
                    <template slot-scope="scope">
                        <el-button size="mini" @click="clickJump(scope.row.floor_id)">设置商品</el-button>
                        <el-button size="mini" @click="editFloor(scope.row)">编辑</el-button>
                        <el-button size="mini" @click="deleteFloor(scope.row.floor_id)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
<!--            <div class="table-page">-->
<!--                <div class="block">-->
<!--                    <el-pagination-->
<!--                        background-->
<!--                        @current-change="handleCurrentChange"-->
<!--                        :current-page="pageNo"-->
<!--                        :page-size="pageSize"-->
<!--                        layout="total, prev, pager, next, jumper"-->
<!--                        :total="total">-->
<!--                    </el-pagination>-->
<!--                </div>-->
<!--            </div>-->
        </div>
    </div>

</template>

<script>
    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'

    export default {
        data() {
            return {
                pageNo: 1,
                pageSize: 10,
                total: 0,
                tableData: [],
                searchForm: {
                    operator_time: '',
                    admin_id: '',
                },
                dialog_title: '',
                loading: false,
                is_edit: false,
                member_name_list: [],
                activity_id:'',
                addFloor: false,
                uploading: false,
                fit: 'contain',
                form: {
                    floor_name: '',
                    is_order: '',
                    pc_floor_image: '',
                    mobile_floor_image: '',
                    is_show: 0
                },
                rules: {
                    floor_name: [
                        { required: true, message: '请输入楼层名称', trigger: 'blur' },
                        { min: 1, max: 20, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
                    is_order: [
                        { required: true, message: '请输入排序值', trigger: 'blur' },
                        { type: 'number', message: '排序值必须为数字值'}
                    ],
                    pc_floor_image: [
                        { required: true, message: '请上传PC楼层图片', trigger: 'change' },
                    ],
                    mobile_floor_image: [
                        { required: true, message: '请上传移动端楼层图片', trigger: 'change' },
                    ],
                }
            }
        },
        created() {
            this.activity_floor_list();
            this.activity_id=this.$route.query.activity_id;
        },
        methods: {
            pcUploadedFloor (data) {
                this.form.pc_floor_image = data.imageOssUrl
            },
            mUploadedFloor (data) {
                this.form.mobile_floor_image = data.imageOssUrl
            },
            async activity_floor_list() {
                this.loading = true
                let params = {activity_id: this.$route.query.activity_id}
                let data = await this.$request.get(this.$API.common_api,params,'main',{
                    router_path: 'activity/activityFloorList',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: '查看活动模版楼层列表;'
                });
                this.tableData = data.data;
                this.tableData.forEach( (item,index) => {
                    this.tableData[index]['is_show'] = item.is_show == 1 ? true : false
                })
                this.total = data.total
                this.loading = false
            },
            async changeShow(floor,is_show){
                let params = floor
                delete params['goods_number']
                delete params['goodslist']
                params['is_show'] = is_show == true ? 1 : 0
                let data = await this.$request.request(this.$API.common_api,params,'main','PUT',{
                    router_path: 'activity/editActivityFloor',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: '修改模版楼层状态;' + params.floor_id,
                    extra_url:'?floor_id='+params.floor_id
                })
                if(data.code == '200' && data.data){
                    this.activity_floor_list()
                    this.success()
                }else{
                    this.errorMessage = '操作失败'
                    this.fail()
                }
            },
            editFloor(floor){
                this.is_edit = true
                this.dialog_title ='编辑楼层'
                this.form = floor
                this.addFloor = true
            },
            addFlor(){
                this.is_edit = false
                this.dialog_title = '添加楼层'
                this.form= {
                    floor_name: '',
                        is_order: '',
                        pc_floor_image: '',
                        mobile_floor_image: '',
                        is_show: 0
                }
                this.addFloor = true
            },
            onSubmit(){
                this.$refs.form.validate(async (valid) => {
                    if (valid) {
                        let data = {}
                        let params = this.form
                        params['is_show'] = params['is_show'] == true ? 1 : 0
                        params['activity_id'] = this.$route.query.activity_id
                        if(this.is_edit == true){
                            delete params['goods_number']
                            delete params['goodslist']
                            data = await this.$request.request(this.$API.common_api,params,'main','PUT',{
                                router_path: 'activity/editActivityFloor',
                                request_host: 'CATEGORY_SERVER_HOST',
                                handle_desc: '编辑模版楼层;' + params.floor_id,
                                extra_url:'?floor_id='+params.floor_id
                            })
                        }else{
                            data = await this.$request.post(this.$API.common_api,params,'main',{
                                router_path: 'activity/addActivityFloor',
                                request_host: 'CATEGORY_SERVER_HOST',
                                handle_desc: '添加模版楼层;'
                            })
                        }
                        if(data.code == '200' && data.data){
                            this.activity_floor_list()
                            this.addFloor = false
                            this.success()
                        }else{
                            this.errorMessage = '更新失败'
                            this.fail()
                        }
                    } else {
                        return false;
                    }
                });
            },
            async deleteFloor(floor_id) {
                let params = {floor_id: floor_id}
                let data = await this.$request.request(this.$API.common_api,params,'main','DELETE',{
                    router_path: 'activity/deleteActivityFloor',
                    request_host: 'CATEGORY_SERVER_HOST',
                    handle_desc: '删除模版楼层;' + params.floor_id,
                    extra_url:'?floor_id='+params.floor_id
                })
                if(data.code == '200' && data.data){
                    this.activity_floor_list()
                    this.addFloor = false
                    this.success()
                }else{
                    this.errorMessage = '删除失败'
                    this.fail()
                }
            },
            success() {
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
            },
            fail() {
                this.$message({
                    showClose: true,
                    message: this.errorMessage,
                    type: 'error'
                });
            },
            clickJump(floor_id){
              this.$router.push({
                path: '/activity/activitySetGoods',
                query:{floor_id:floor_id,activity_id:this.activity_id}
              })
            }
        },
        components: {
            UploadImg,
            PreviewImage
        }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/pageHeader";

    .content-cont {
        width: calc(~"100% - 30px");
        margin: 15px;
        min-height: 10px;
        background: #ffffff;
    }
    .form-item{
        margin-bottom: 20px;
    }

</style>
