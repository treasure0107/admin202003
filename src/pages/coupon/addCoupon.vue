<template>
  <div class="content">
    <div class="pages-header">
      <div>新增优惠券</div>
    </div>
    <div class="content-cont">
      <div class="pages-inline">
        优惠券信息
      </div>
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="优惠券名称" required >
          <el-input v-model="form.node_name" ></el-input>
        </el-form-item>
        <el-form-item label="使用条件" required>
          <el-row><el-radio v-model="radio" label="1">无门槛</el-radio></el-row>
          <el-row ><el-radio v-model="radio" label="2">满<el-input style="width: 200px" v-model="form.node_name" ></el-input>减<el-input  style="width: 200px"  v-model="form.node_name" ></el-input></el-radio></el-row>
          <el-row ><el-radio v-model="radio" label="3">阶梯满减 每满<el-input style="width: 200px" v-model="form.node_name" ></el-input>减<el-input  style="width: 200px"  v-model="form.node_name" ></el-input></el-radio></el-row>
        </el-form-item>
        <el-form-item label="发行量" required >
          <el-input v-model="form.node_name" ></el-input>
        </el-form-item>
        <el-form-item label="使用时间" required>
          <el-radio v-model="radio" label="1">固定时间段有效 <el-input v-model="form.node_name" ></el-input></el-radio>
          <el-radio v-model="radio" label="2">领取当日后<el-input v-model="form.node_name" ></el-input>天，有效使用</el-radio>
        </el-form-item>
        <el-form-item label="使用范围" required >
          <el-radio v-model="radio" label="1">全平台使用</el-radio>
        </el-form-item>
        <el-form-item label="商品范围" required >
          <el-radio v-model="radio" label="1">全品类</el-radio>
          <el-radio v-model="radio" label="1">指定商品/类目</el-radio>
        </el-form-item>
        <div class="pages-inline">
          推广信息
        </div>
        <el-form-item label="领取方式" required >
          <el-radio v-model="radio" label="1">系统发放</el-radio>
          <el-radio v-model="radio" label="1">用户主动领取</el-radio>
        </el-form-item>
        <el-form-item label="领取条件" required>
          <el-radio v-model="radio" label="1">无条件</el-radio>
          <el-radio v-model="radio" label="1">按任务赠送</el-radio>
          <el-radio v-model="radio" label="1">按用户赠送
            <el-select v-model="form.request_type" placeholder="请选择">
              <el-option
                v-for="item in options_request_type"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-radio>
          <el-radio v-model="radio" label="1">按消费金额赠送</el-radio>
        </el-form-item>
        <el-form-item label="领取时间" prop="upload_time">
          <el-date-picker
            v-model="form.is_menu"
            type="datetime"
            placeholder="选择日期时间"
            default-time="12:00:00">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="优惠券是否公开" required >
          <el-radio v-model="radio" label="1">否</el-radio>
          <el-radio v-model="radio" label="1">是</el-radio>
        </el-form-item>
        <el-form-item label="限领" required >
          <el-radio v-model="radio" label="1">否</el-radio>
          <el-radio v-model="radio" label="1">是 限领 <el-input style="width: 200px" v-model="form.node_name" ></el-input> 张</el-radio>
        </el-form-item>
        <el-form-item label="使用规则">
          <el-input type="textarea" v-model="form.sort"  placeholder="用户端领取时展示"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" >立即提交</el-button>
          <el-button >取消</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
  import tagList from '../../components/TagList'

  export default {
    data() {
      return {
        form: {
          node_name: '',
          role_url: '',
          request_type: '',
          is_menu: 0,
          type_id: 0,
          style: '',
          web_url: '',
          sort: 0
        },
      }
    },
    created() {

    },
    methods: {

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

  .form-search {
    margin: 15px;
  }
  .pages-inline {
    width: calc(100% - 48px);
    height: 40px;
    background: #cccccc;
    margin-left: 15px;
    line-height: 40px;
    padding-left: 18px;
  }
</style>
