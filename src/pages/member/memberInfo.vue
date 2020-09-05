<template>
    <div class="content">
        <div class="pages-header">
            <div>会员详情</div>
            <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" type="primary" id="add-logistics" icon="el-icon-back" size="medium" @click="$router.push('/member/memberlist')">返回列表</el-button>
            <el-button round style="float: right;margin-top: 15px;margin-right: 40px;" v-if="this.table_type==4" type="primary" id="add-logmaintain" icon="el-icon-plus" size="medium" @click="editShows()">添加维护记录</el-button>

        </div>
        <div class="table-content">
            <el-menu :default-active="table_type" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="0"  @click="memberInfo()">基本信息</el-menu-item>
                <el-menu-item index="1"  @click="addressList()">地址列表</el-menu-item>
                <el-menu-item index="3"  @click="uploadFile()">文件列表</el-menu-item>
                <el-menu-item index="2"  @click="loginList()">登录日志</el-menu-item>
                <el-menu-item index="4"  @click="maintainList()">维护记录</el-menu-item>
            </el-menu>
            <el-form ref="form" :model="form" :label-position="labelPosition" class="memberForm" label-width="100px" v-if="this.table_type == 0" v-loading="loading">
                <el-row>
                    <el-col :span="4"><div class="grid-content bg-purple">
                        <div class="memberImg">
                            <preview-image v-if="form.header" :image="form.header" :width="'150px'"  style="margin-top: 15px;"></preview-image>
                        </div>
                    </div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple">
                        <el-form-item label="状态">
                            <span style="color: #67C23A;" v-if="form.status == 1"><i class="el-icon-success"></i> 开启</span>
                            <span style="color: #E6A23C;" v-else><i class="el-icon-error"></i> 关闭</span>
                        </el-form-item>
                        <el-form-item label="手机">
                            <span>{{form.mobile}}</span>
                        </el-form-item>
                        <el-form-item label="昵称">
                            <span>{{form.nick_name}}</span>
                        </el-form-item>
                        <el-form-item label="微博">
                            <span>{{form.wb_union_id}}</span>
                        </el-form-item>
                        <el-form-item label="会员等级">
                            <span>{{userLever[form.level]}}</span>
                        </el-form-item>
                        <el-form-item label="邮箱">
                            <span>{{form.email}}</span>
                        </el-form-item>
                        <el-form-item label="微信">
                            <span>{{form.wx_union_id}}</span>
                        </el-form-item>
                        <el-form-item label="Q Q">
                            <span>{{form.qq_union_id}}</span>
                        </el-form-item>
                        <el-form-item label="成长值">
                            <span>{{form.growth_value}}</span>
                        </el-form-item>
                        <el-form-item label="城市">
                            <span>{{form.live_city}}</span>
                        </el-form-item>
                        <el-form-item label="会员类型">
                            <span v-if="form.type === 0">买家</span>
                            <span v-else>卖家</span>
                        </el-form-item>
                        <el-form-item label="注册平台">
                            <span v-if="form.register_source === 1">拍拍印-PC</span>
                            <span v-if="form.register_source === 2">拍拍印-Android</span>
                            <span v-if="form.register_source === 3">拍拍印-IOS</span>
                            <span v-if="form.register_source === 4">拍拍印-H5</span>
                            <span v-if="form.register_source === 5">拍拍印-小程序</span>
                            <span v-if="form.register_source === 6">H5-拍拍快印终端机</span>
                            <span v-if="form.register_source === 7">企业印微应用</span>
                            <span v-if="form.register_source === 8">H5-私域店</span>
                        </el-form-item>
                        <el-form-item label="注册时间">
                            <span>{{form.reg_time}}</span>
                        </el-form-item>
                        <el-form-item label="联系电话">
                            <span>{{form.enterprise_mobile}}</span>
                        </el-form-item>
                        <el-form-item label="邀请码">
                            <span>{{form.invitation_code}}</span>
                        </el-form-item>
                    </div></el-col>
                    <el-col :span="8"><div class="grid-content bg-purple-light">
                        <el-form-item label="注册IP">
                            <span>{{form.login_user_ip}}</span>
                        </el-form-item>
                        <el-form-item label="订单数">
                            <span>{{order_count}} 笔</span>
                        </el-form-item>
                        <el-form-item label="客单价">
                            <span>{{avg_price}} 元</span>
                        </el-form-item>
                        <el-form-item label="成交次数">
                            <span>{{order_count}} 笔</span>
                        </el-form-item>
                        <el-form-item label="订单总金额">
                            <el-link @click="$router.push({name:'/orders/index',query:{user_id:user_id}})">{{total_account}} 元</el-link>
                        </el-form-item>
                        <el-form-item label="成交总金额">
                            <span >{{total_account}} 元</span>
                        </el-form-item>
                        <el-form-item label="最后登录 IP">
                            <span>{{form.login_ip}}</span>
                        </el-form-item>
                        <el-form-item label="最后消费时间">
                            <span>{{order_time}}</span>
                        </el-form-item>
                        <el-form-item label="最后登录平台">
                            <span v-if="form.device_info === 'web'">PC</span>
                            <span v-else>APP</span>
                        </el-form-item>
                        <el-form-item label="最后登录时间">
                            <span>{{form.last_login_time}}</span>
                        </el-form-item>
                        <el-form-item label="企业名称">
                            <span>{{form.enterprise_name}}</span>
                        </el-form-item>
                        <el-form-item label="企业邮箱">
                            <span>{{form.enterprise_email}}</span>
                        </el-form-item>
                        <el-form-item label="注册来源">
                            <span>{{form.promote}}</span>
                        </el-form-item>
                        <el-form-item label="用户标签">
                            <span style="font-size: 14px;" v-for="label in form.labels"><i style="color: #00b7ee;font-size: 17px;" class="el-icon-s-flag"></i>{{label}}  &nbsp;&nbsp;</span>
                        </el-form-item>
                    </div></el-col>
                </el-row>
            </el-form>
            <el-table
                    :data="addressData"
                    style="width: 100%;min-height: 520px"
                    fixed
                    key="address"
                    v-if="this.table_type == 1">
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="consignee" label="收件人"></el-table-column>
                <el-table-column prop="mobile" label="手机号码" width="120"></el-table-column>
                <el-table-column prop="phone" label="电话号码">
                    <span>未知</span>
                </el-table-column>
                <el-table-column prop="area" label="所在地区" width="300">
                    <template slot-scope="scope">
                        <span>{{scope.row.province_id}}/{{scope.row.city_id}}/{{scope.row.area_id}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="详细地址" width="500"></el-table-column>
                <el-table-column prop="is_default" label="默认地址" fixed="right">
                    <template slot-scope="scope">
                        <span v-if="scope.row.is_default == 1" style="color: #67C23A;">是</span>
                        <span v-else style="color: #E6A23C;">否</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-table
                    :data="loginData"
                    style="width: 100%;min-height: 520px"
                    key="login"
                    v-if="this.table_type == 2">
                <el-table-column prop="log_id" label="序号"></el-table-column>
                <el-table-column label="登录平台">
                    <template slot-scope="scope">
                        <span v-if="scope.row.device_info == 'web'">PC</span>
                        <span v-else>APP</span>
                    </template>
                </el-table-column>
                <el-table-column prop="login_ip" label="登录IP"></el-table-column>
                <el-table-column prop="login_time" label="登陆时间"></el-table-column>
            </el-table>
            <div v-if="this.table_type == 3">
                <el-menu :default-active="file_type" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                    <el-menu-item index="0"  @click="uploadFile()">上传的文件</el-menu-item>
                    <el-menu-item index="1"  @click="onLineFile()">在线设计的文件</el-menu-item>
                </el-menu>
                <el-table
                    :data="uploadFileData"
                    style="width: 100%;"
                    key="uploadFile"
                    v-show="this.file_type == 0">
                    <el-table-column prop="file_id" label="序号"></el-table-column>
                    <el-table-column prop="file_name" label="文件名"></el-table-column>
                    <el-table-column label="文件大小">
                        <template slot-scope="scope">
                            {{ scope.row.file_size | handleSize() }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="create_time" label="上传时间"></el-table-column>
                </el-table>
                <el-table
                    :data="onLineFileData"
                    style="width: 100%;"
                    key="onLineFile"
                    v-show="this.file_type == 1">
                    <el-table-column prop="templateId" label="文件编号"></el-table-column>
                    <el-table-column label="文件预览">
                        <template slot-scope="scope">
                            <preview-image v-if="scope.row.thumbnailUrl" :image="scope.row.thumbnailUrl" :height="'30px'" ></preview-image>
                        </template>
                    </el-table-column>
                    <el-table-column prop="title" label="文件名"></el-table-column>
                    <el-table-column prop="thumbnail_should_at" label="上传日期"></el-table-column>
                </el-table>
            </div>
            <el-table
                    :data="maintainData"
                    style="width: 100%;min-height: 520px"
                    fixed
                    v-if="this.table_type == 4">
                <el-table-column prop="id" label="序号"></el-table-column>
                <el-table-column prop="maintain_operator" label="操作者"></el-table-column>
                <el-table-column prop="maintain_time" label="时间" ></el-table-column>
                <el-table-column prop="maintain_images"  label="上传图片">
                    <template slot-scope="scope">
                        <preview-image v-for="(item,idx) in scope.row.maintain_images" :key="idx" :image="item.image_url" :height="'30px'"></preview-image>
                    </template>
                </el-table-column>
                <el-table-column prop="maintain_content" label="活动形式" width="300"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                        <el-row >
                            <el-button type="success" circle size="mini" @click="editShows(scope.row)" icon="el-icon-edit"></el-button>
                        </el-row>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pages-style" v-if="this.table_type > 0 && this.table_type != 4">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="currentPage4"
                        :page-size=pagesize
                        layout="total, prev, pager, next, jumper"
                        :total=total
                        background>
                </el-pagination>
            </div>
            <el-dialog title="修改维护记录" :visible.sync="editShow" @close='closeDialog' width="65%" class="user-window">
            <el-form ref="forms" :model="forms" label-width="120px">
                <el-form-item label="操作者" style="margin-bottom: 15px;margin-top: 15px;">
                    <label style="color: #909399">{{forms.maintain_operator}}</label>
                </el-form-item>
                <el-form-item label="最新" style="margin-bottom: 15px;">
                    <label style="color: #909399">{{forms.maintain_time}}</label>
                </el-form-item>
                <el-form-item label="上传图片" style="margin-bottom: 5px;" >
                    <div style="width: 100px;height: 100px;border: 1px dashed #909399;border-radius: 3px;text-align:center">
                        <upload-img  :keystr="'class_img'"  style="font-size: 40px;color:#909399;margin-top: 20px;" @uploaded="uploadImg" :maxsize="255.5 * 1204"></upload-img>
                    </div>
                </el-form-item>
                <el-form-item label="已上传" v-if="imageOssUrl.length > 0">
                    <el-row class="imgrows">
                        <el-col :span="3" v-if="imageOssUrl[0]"><div class="grid-content bg-purple-dark">
                            <preview-image  :image="imageOssUrl[0]" :height="'100px'" :width="'100px'"></preview-image>
                            <i class="el-icon-delete" style="color: red;font-size: 15px;" @click="deleteImg(0)"></i>
                        </div></el-col>
                        <el-col :span="3" v-if="imageOssUrl[1]"><div class="grid-content bg-purple-dark">
                            <preview-image  :image="imageOssUrl[1]" :height="'100px'" :width="'100px'" ></preview-image>
                            <i class="el-icon-delete" @click="deleteImg(1)" style="color: red;font-size: 15px;"></i>
                        </div></el-col>
                        <el-col :span="3" v-if="imageOssUrl[2]"><div class="grid-content bg-purple-dark">
                            <preview-image  :image="imageOssUrl[2]" :height="'100px'" :width="'100px'" ></preview-image>
                            <i class="el-icon-delete" style="color: red;font-size: 15px;" @click="deleteImg(2)"></i>
                        </div></el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="维护内容">
                    <el-input type="textarea" maxlength="1000" v-model="forms.maintain_content" style="width: 400px;color: #909399;margin-top: 12px" :autosize="{ minRows: 10}"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="maintainAdd"  v-if="this.is_edit">修改</el-button>
                    <el-button type="primary" @click="maintainAdd" v-else>添加</el-button>
                </el-form-item>
            </el-form>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import UploadImg from '@/components/UplodaImg'
    import PreviewImage from '@/components/PreviewImage'
    import {LEVEL} from '../../config/user'
    export default {
        accDiv(arg1,arg2){
            let t1=0,t2=0,r1,r2;
            try{t1=arg1.toString().split(".")[1].length}catch(e){}
            try{t2=arg2.toString().split(".")[1].length}catch(e){}
            r1=Number(arg1.toString().replace(".",""));
            r2=Number(arg2.toString().replace(".",""));
            return (r1/r2)*Math.pow(10,t2-t1);
        },
        data() {
            return {
                activeName: 'second',
                labelPosition: 'right',
                userLever: LEVEL,
                table_type: '0',
                URL:['https://static-test.paipaiyin.cn/test/2DdR47kJQE1578544667326.jpg','https://static-test.paipaiyin.cn/test/wXds3MY4aN1578544662903.jpg'],
                file_type: '0',
                loading: false,
                editShow:false,
                is_edit:false,
                user_id:'',
                addressData:[],
                loginData:[],
                uploadFileData: [],
                onLineFileData: [],
                maintainData:[],
                imageOssUrl:[],
                pageSizes: [10,20],
                pagesize: 10,
                currentPage4: 1,
                total:0,
                avg_price:0,
                total_account:0,
                maintain_records_id:0,
                order_count:0,
                order_time:'',
                is_add:true,
                form:{},
                forms:{
                    maintain_operator:'',
                    maintain_time:'',
                    maintain_images:[],
                    maintain_content:'',
                },
            };
        },
        created () {
            this.memberInfo();
        },
        methods: {
            async memberInfo(){
                this.table_type = '0';
                if (!this.user_id){
                    this.user_id = this.$route.query.user_id;
                }
                if (!this.$route.query.user_id) {
                    SendMessage({message: '参数错误', type: 'error'});
                    return false;
                }
                //this.loading = true;
                let {data} = await this.$request.request(this.$API.common_api,{
                    user_id:this.$route.query.user_id
                }, 'main', 'GET', {
                    router_path: 'user/info',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"查看会员信息详情;"+this.$route.query.user_id
                });
                this.form = data;
                if (data){
                    let statistics = await this.$request.request(this.$API.common_api,{
                        user_id:this.$route.query.user_id
                    }, 'main', 'GET', {
                        router_path: 'buyer/statistic',
                        request_host:'ORDERS_SERVER_HOST',
                        handle_desc:"查看会员详情订单统计;"+this.$route.query.user_id
                    });
                    this.avg_price = statistics.data ? statistics.data[0].avg_price : 0;
                    this.total_account = statistics.data ? statistics.data[0].total_account : 0;
                    this.order_count = statistics.data ? statistics.data[0].order_count : 0;
                    this.order_time = statistics.data ? statistics.data[0].order_time : '';
                }
                this.loading = false;
            },
            async addressList(){
                this.table_type = '1';
                let {data} = await this.$request.request(this.$API.common_api,{
                    user_id:this.user_id,
                    page:this.currentPage4,
                    page_size:this.pagesize
                }, 'main', 'GET', {
                    router_path: 'user/adderss',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"查看会员地址信息;"+this.user_id
                });
                this.addressData = data.data;
                this.total = data.total;
            },
            async closeDialog(){
                this.maintainList();
            },
            async editShows(data){
                this.editShow = true;
                if (data){
                    this.is_edit = true;
                    this.forms = data;
                    this.imageOssUrl = [];
                    this.maintain_records_id = data.id;
                    if (data.maintain_images.length > 0){
                        data.maintain_images.forEach((item,index)=>{
                            this.imageOssUrl.push(item.image_url);
                        });
                    }
                }else{
                    this.is_edit = false;
                    this.imageOssUrl = [];
                    this.forms.maintain_content = '';
                    this.forms.maintain_time =  new Date().toLocaleString('chinese', { hour12: false });
                    this.forms.maintain_operator = this.$common.getNowUserId(false)['user_name']
                }
            },
            //上传文件列表
            async uploadFile(){
                if(this.file_type == '1'){
                    this.currentPage4 = 1
                }
                this.table_type = '3';
                this.file_type = '0';
                let {data} = await this.$request.request(this.$API.common_api,{
                    user_id:this.user_id,
                    page:this.currentPage4,
                    page_size:this.pagesize
                }, 'main', 'GET', {
                    router_path: 'user/uploadFile',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"查看会员上传文件列表;"+this.user_id
                });
                this.uploadFileData = data.data;
                this.total = data.total;
            },
            //在线编辑文件列表
            async onLineFile(){
                if(this.file_type == '0'){
                    this.currentPage4 = 1
                }
                this.table_type = '3';
                this.file_type = '1';
                let {data} = await this.$request.request(this.$API.common_api,{
                    user_id:this.user_id,
                    username:this.form.nick_name,
                    page:this.currentPage4,
                    limit:this.pagesize
                }, 'main', 'GET', {
                    router_path: 'user/editFile',
                    request_host:'TUBANGZHU_HOST',
                    handle_desc:"查看会员编辑文件列表;"+this.user_id
                });
                this.onLineFileData = data.data;
                this.total = data.total;
            },
            async maintainList(){
                let {data} = await this.$request.request(this.$API.common_api,{
                    user_id:this.user_id,
                }, 'main', 'GET', {
                    router_path: 'maintain/records',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"获取维护记录;"+this.user_id
                });
                this.maintainData = data;
            },
            async maintainAdd(){
                let requestType = '';
                let param = {};
                if (this.is_edit) {
                    requestType = 'PUT';
                    param['maintain_records_id'] = this.maintain_records_id;
                    param['maintain_content'] = this.forms.maintain_content;
                    param['image_urls'] = this.imageOssUrl;
                }else{
                    requestType = 'POST';
                    param['user_id'] = this.user_id;
                    param['maintain_operator'] = this.$common.getNowUserId(false)['user_name'];
                    param['maintain_content'] = this.forms.maintain_content;
                    param['image_urls'] = this.imageOssUrl;
                }
                let {data} = await this.$request.request(this.$API.common_api,param, 'main', requestType, {
                    router_path: 'maintain/records',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"添加维护记录;"+this.user_id
                });
                this.maintainList();
                data == 200 && SendMessage({message: '添加成功', type: 'success'});
                this.editShow = false;
            },
            async deleteImg(val){
                this.imageOssUrl.splice(val,1);
                console.log(this.imageOssUrl);
            },
            async uploadImg(data,strkey){
                this.imageOssUrl.unshift(data.imageOssUrl);
                this.imageOssUrl.length > 3 && this.imageOssUrl.pop();
            },
            async loginList(){
                this.table_type = '2';
                let {data} = await this.$request.request(this.$API.common_api,{
                    user_id:this.user_id,
                    page:this.currentPage4,
                    page_size:this.pagesize
                }, 'main', 'GET', {
                    router_path: 'user/login',
                    request_host:'MEMBER_USER_HOST',
                    handle_desc:"查看会员登录信息;"+this.user_id
                });
                this.loginData = data.data;
                this.total = data.total;
            },
            async handleClick(tab, event) {
            },
            async handleSelect(val){
                this.table_type = val;
            },
            async handleCurrentChange(val) {
                this.currentPage4 = val;
                if (this.table_type === '1'){
                    this.addressList();
                }
                if (this.table_type === '2'){
                    this.loginList();
                }
                if (this.table_type === '3' && this.file_type === '0'){
                    this.uploadFile();
                }
                if (this.table_type === '3' && this.file_type === '1'){
                    this.onLineFile();
                }
            },
            async handleSizeChange (val) {
                this.pagesize = val;
                if (this.table_type === '1'){
                    this.addressList();
                }
                if (this.table_type === '2'){
                    this.loginList();
                }

            },
        },
        components:{
            PreviewImage,
            UploadImg,
        },
        filters:{
            handleSize:function(value){
                if(value && value>=1024){
                    let a = value/1024
                    return a.toFixed(1) + 'KB'
                }else if(value && value>=1024*1024){
                    let a = value/1024/1024
                    return a.toFixed(1)+'MB'
                }else if(value && value>=1024*1024*1024){
                    let a = value/1024/1024/1024
                    return a.toFixed(1)+'GB'
                }
                return value + 'B'
            },
        }
    };
</script>
<style lang="less" scoped>
    @import "../../assets/pageHeader";
    .content{

    }
    .memberForm .el-form-item{
        margin-bottom: 0px;
    }
    .memberImg{

    }
    .memberForm{
        min-height: calc(~"100vh - 300px");
    }
    .bg-purple span{
        font-size: 12px;
    }
    .bg-purple-light span{
        font-size: 12px;
    }
    .imgrows img{
        max-width: 100px;max-height: 100px;height: 100px;
    }

</style>
