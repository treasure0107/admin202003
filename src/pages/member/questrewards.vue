<template>
    <div class="table-content" style="height: 100%">
        <el-form ref="form" :inline="true" :model="form" :rules="rules" v-loading="loading">
        <div class="title">激励任务</div>
        <table style="border: #c3ffc5">
            <tr style="height: 40px">
                <td style="width: 150px;border-right: none;border-bottom: none;text-align: center">
                    <label style="color: red">* </label> 注册成功
                </td>
                <td style="width: 400px;border-right: none;border-bottom: none;">
                    <span class="line-high">成长值</span>
                    <el-form-item label="" style="margin-bottom: 0px;" prop="growth_value1">
                        <el-input-number controls-position="right" :min="0" style="width: 120px" v-model="form.growth_value1" placeholder="请输入有效值"></el-input-number>
                    </el-form-item>
                </td>
                <td style="width: 150px;border-bottom: none;">
                    <el-form-item label=" ">
                        <el-switch v-model="form.action1"></el-switch>
                    </el-form-item>
                </td>
            </tr>
            <tr style="height: 40px">
                <td style="width: 150px;border-right: none;border-bottom: none;text-align: center">
                    <label style="color: red">* </label>消费
                </td>
                <td style="width: 400px;border-right: none;border-bottom: none;">
                    <el-row>
                        <span class="line-high">每消费</span>
                        <el-form-item label="" style="margin: 0px;" prop="targe_score2">
                            <el-input-number controls-position="right" :min="0" style="width: 120px" v-model="form.targe_score2" placeholder="请输入有效值"></el-input-number>
                        </el-form-item>
                        <span class="line-high">元，获得成长值</span>
                        <el-form-item label="" style="margin: 0px;" prop="growth_value2">
                            <el-input-number controls-position="right" :min="0" style="width: 120px" v-model="form.growth_value2" placeholder="请输入有效值"></el-input-number>
                        </el-form-item>
                    </el-row>
                </td>
                <td style="width: 150px;border-bottom: none;">
                    <el-form-item label=" ">
                        <el-switch v-model="form.action2"></el-switch>
                    </el-form-item>
                </td>
            </tr>
            <tr style="height: 40px">
                <td style="width: 150px;border-right: none;text-align: center">
                    <label style="color: red">* </label>评价商品
                </td>
                <td style="width: 400px;border-right: none;">
                    <span class="line-high">每评价商品一次，获得成长值</span>
                    <el-form-item label="" style="margin: 0px;" prop="growth_value3">
                        <el-input-number controls-position="right" :min="0" style="width: 120px" v-model="form.growth_value3" placeholder="请输入有效值"></el-input-number>
                    </el-form-item>
                </td>
                <td style="width: 150px;">
                    <el-form-item label=" ">
                        <el-switch v-model="form.action3"></el-switch>
                    </el-form-item>
                </td>
            </tr>
        </table>
        <div class="title">日常任务</div>
        <table style="border: #c3ffc5">
            <tr style="height: 40px">
                <td style="width: 150px;border-right: none;border-bottom: none;text-align: center">
                    <label style="color: red">* </label> 每日登录
                </td>
                <td style="width: 400px;border-right: none;border-bottom: none;">
                    <span class="line-high">每天第一次登录，获得成长值</span>
                    <el-form-item label="" style="margin: 0px;" prop="growth_value4">
                        <el-input-number style="width: 120px" :min="0" controls-position="right" v-model="form.growth_value4" placeholder="请输入有效值"></el-input-number>
                    </el-form-item>
                </td>
                <td style="width: 150px;border-bottom: none;">
                    <el-form-item label=" ">
                        <el-switch v-model="form.action4"></el-switch>
                    </el-form-item>
                </td>
            </tr>
            <tr style="height: 40px">
                <td style="width: 150px;border-right: none;text-align: center">
                    <label style="color: red">* </label>分享商品
                </td>
                <td style="width:400px;border-right: none;">
                    <el-row>
                        <span class="line-high">每分享商品一次，获取成长值</span>
                        <el-form-item label="" style="margin: 0px;" prop="growth_value5">
                            <el-input-number style="width: 120px" :min="0" controls-position="right" v-model="form.growth_value5" placeholder="请输入有效值"></el-input-number>
                        </el-form-item>
                        <span class="line-high">，每天最多奖励</span>
                        <el-form-item label="" style="margin: 0px;" prop="max_times5">
                            <el-input-number style="width: 120px" :min="0" controls-position="right" v-model="form.max_times5" placeholder="请输入有效值"></el-input-number>
                        </el-form-item>
                        <span class="line-high">次。</span>
                    </el-row>
                </td>
                <td style="width: 150px;">
                    <el-form-item label=" ">
                        <el-switch v-model="form.action5"></el-switch>
                    </el-form-item>
                </td>
            </tr>
        </table>
            <div style="margin-top: 20px">
                <el-button type="primary" @click="onSubmit">保存</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
    export default {
        data() {
            let validateGrowthValue = (rule, value, callback) => {
                if (value < 0) {
                    callback(new Error('请输入大于或等于0的整数'));
                }else if(parseInt(value) != value){
                    callback(new Error('请输入整数'));
                }
                callback();
            };
            return {
                loading:false,
                form:{
                    targe_score2: 1,
                    max_times5: 1,
                    action1: false,
                    action2: false,
                    action3: false,
                    action4: false,
                    action5: false,
                    growth_value1:'',
                    growth_value2:'',
                    growth_value3:'',
                    growth_value4:'',
                    growth_value5:'',
                },
                rules: {
                    growth_value1: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                    growth_value2: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                    growth_value3: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                    growth_value4: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                    growth_value5: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                    targe_score2: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                    max_times5: [
                        {required: true, message: '请输入数字值', trigger: 'blur'},
                        { type: 'number', message: '必须为数字值'},
                        { validator:validateGrowthValue, trigger: 'blur'}
                    ],
                }
            }
        },
        created () {
            this.memberSet()
        },
        methods: {
            async memberSet(){
                this.loading = true;
                let {data} = await this.$request.get(this.$API.common_api, {}, 'main', {
                    router_path: 'mission/rewards',
                    request_host: 'MEMBER_USER_HOST',
                    handle_desc: '查看会员-任务奖励;'
                });
                data.forEach(trance => {
                    switch (trance.task_key) {
                        case 'registered':
                            this.form.growth_value1 = trance.growth_value
                            this.form.action1 = trance.is_active == 1 ? true : false
                            break;
                        case 'consumption':
                            this.form.growth_value2 = trance.growth_value
                            this.form.action2 = trance.is_active == 1 ? true : false
                            this.form.targe_score2 = trance.targe_score
                            break;
                        case 'appraise':
                            this.form.growth_value3 = trance.growth_value
                            this.form.action3 = trance.is_active == 1 ? true : false
                            break;
                        case 'login':
                            this.form.growth_value4 = trance.growth_value
                            this.form.action4 = trance.is_active == 1 ? true : false
                            break;
                        case 'share':
                            this.form.growth_value5 = trance.growth_value
                            this.form.action5 = trance.is_active == 1 ? true : false
                            this.form.max_times5 = trance.max_times
                            break;
                        default:
                            break;
                    }
                });
                this.loading = false;
            },
            async onSubmit(){
                let params = [];
                params['0'] = {task_key:'registered',growth_value:this.form.growth_value1,action:this.form.action1==true?'available':'unavailable'};
                params['1'] = {task_key:'consumption',growth_value:this.form.growth_value2,action:this.form.action2==true?'available':'unavailable',targe_score:this.form.targe_score2};
                params['2'] = {task_key:'appraise',growth_value:this.form.growth_value3,action:this.form.action3==true?'available':'unavailable'};
                params['3'] = {task_key:'login',growth_value:this.form.growth_value4,action:this.form.action4==true?'available':'unavailable'};
                params['4'] = {task_key:'share',growth_value:this.form.growth_value5,action:this.form.action5==true?'available':'unavailable',max_times:this.form.max_times5};

                this.$refs.form.validate((valid) => {
                    if (valid) {
                        params.forEach(trance=>{
                            let data = this.$request.request(this.$API.common_api, trance, 'main', 'PUT', {
                                router_path: 'mission/editrewards',
                                request_host: 'MEMBER_USER_HOST',
                                handle_desc: '编辑会员-任务奖励;' + trance.task_key
                            })
                        });
                        SendMessage({message: '保存成功', type: 'success'});
                    } else {
                        return false;
                    }
                });
            },
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
    table, td, th
    {
        border:1px solid #ebeef5;

    }
    table {
        position: relative;
        overflow: hidden;
        box-sizing: border-box;
        flex: 1;
        width: 80%;
        max-width: 100%;
        background-color: #fff;
        font-size: 14px;
        color: #606266;
    }
    .title{
        font-size: 14px;
        color: #333333;
        font-weight:bold;
        padding: 10px;
    }
    .line-high{
        line-height: 56px;
        margin: 0 10px;
    }
</style>
