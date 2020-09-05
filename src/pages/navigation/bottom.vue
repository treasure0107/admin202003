<template>
  <div>
    <div class="pages-header">
      <div>底部导航</div>
      <el-button type="primary" round icon="el-icon-plus" size="medium" @click="showEdit=true">添加底部导航</el-button>
    </div>
    <div class="table-content">
      <el-table :data="tableData" border stripe style="width: 100%">
        <el-table-column fixed prop="date" label="序号" width="150"></el-table-column>
        <el-table-column prop="name" label="店铺名称" width="120"></el-table-column>
        <el-table-column prop="province" label="跳转链接"></el-table-column>
        <el-table-column prop="address" label="排序值"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div slot="reference" class="name-wrapper">
              <el-button type="success" size="mini" v-if="scope.row.status==1" plain>开启</el-button>
              <el-button type="info" size="mini" v-else plain>关闭</el-button>
            </div>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="300">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="small" circle></el-button>
            <el-button type="success" icon="el-icon-check" size="small" circle></el-button>
            <el-button type="success" icon="el-icon-minus" size="small" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--添加修改-->
    <el-dialog title="添加主导航" :visible.sync="showEdit" width="60%">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="导航名称">
          <el-input v-model="form.stores_name"></el-input>
        </el-form-item>

        <el-form-item label="跳转地址">
          <el-input v-model="form.stores_url"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary">立即提交</el-button>
          <el-button @click="showEdit=false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!--添加修改-->
  </div>
</template>
<script>
    export default {
        data () {
            return {
                showEdit: false,
                options: [{
                    value: '选项1',
                    label: '黄金糕'
                }, {
                    value: '选项2',
                    label: '双皮奶'
                }, {
                    value: '选项3',
                    label: '蚵仔煎'
                }, {
                    value: '选项4',
                    label: '龙须面'
                }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                form: {
                    stores_name: '',
                    stores_url: '',
                    type: '1'
                },
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    province: '上海',
                    status: 1,
                    address: '上海市普陀区金沙江路 1518 弄',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    status: 2,
                    address: '上海市普陀区金沙江路 1517 弄',
                    zip: 200333
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    province: '上海',
                    status: 2,
                    address: '上海市普陀区金沙江路 1517 弄',
                    zip: 200333
                }]
            }
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/pageHeader";

  .table-content {
    width: calc(~"100% - 30px");
    margin: 15px;
  }
</style>
