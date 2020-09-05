<template>
  <div class="settled-in">
    <div class="table-content">
      <el-table :data="tableData" style="width: 100%;min-height: 300px" v-loading="loading" :key="3">
        <el-table-column prop="id" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="company_name" label="公司名称" width="280">
        </el-table-column>
        <el-table-column prop="name" label="公司联系人" width="180">

        </el-table-column>
        <el-table-column prop="mobile" label="联系人电话">
        </el-table-column>
        <el-table-column prop="create_time" label="登记时间">
        </el-table-column>
        <el-table-column prop="remark" label="备注">
          <template slot-scope="scope">
            {{scope.row.remark}}
            <el-button type="text" @click="editRemark(scope.$index)">
              <el-icon class="el-icon-edit"></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pages-style">
        <el-pagination
          background :page-size="size" @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :current-page="index"
          layout="sizes,total,prev, pager, next"
          :page-sizes="[10, 20, 50, 100,200]"
          :total="count">
        </el-pagination>
      </div>

      <el-dialog title="备注" :visible.sync="show" width="45%">
        <el-input type="textarea" rows="5" v-model="desc"></el-input>
        <span slot="footer" class="dialog-footer">
          <el-button @click="show = false">取 消</el-button>
          <el-button type="primary" @click="submitTurn()">确 定</el-button>
        </span>
      </el-dialog>

    </div>
  </div>
</template>
<script>
    export default {
        data () {
            return {
                tableData: [],
                loading: false,
                desc: '',
                show: false,
                count: 0,
                id: 0,
                size: 10,
                index: 1
            }
        },
        created () {
            this.getList()
        },
        methods: {
            async getList () {
                let str = '000@23123123'
                console.log(/\d{3}\@\d/.test(str))
                this.loading = true
                let {data} = await this.$request.get(this.$API.common_api, {
                    size: this.size,
                    page: this.index
                }, 'main', {
                    request_host: 'STORE_JOIN_HOST',
                    router_path: 'shop/add_enter_intention',
                })
                this.tableData = data.data
                this.count = data.count
                this.loading = false
            },
            editRemark (index) {
                this.show = true
                this.desc = this.tableData[index]['remark']
                this.id = this.tableData[index]['id']
            },
            async submitTurn () {
                let {data} = await this.$request.request(this.$API.common_api, {
                    id: this.id,
                    remark: this.desc,
                }, 'main', 'PUT', {
                    request_host: 'STORE_JOIN_HOST',
                    router_path: 'shop/add_enter_intention',
                    handle_desc: `意向商家备注;${this.id}`
                })
                this.show = false
                this.getList()
                SendMessage({type: 'success', message: '备注成功'})
            },
            handleCurrentChange (event) {
                this.index = event
                this.getList()
            },

            handleSizeChange (event) {
                this.index = 1
                this.size = event
                this.getList()
            }
        },
        watch: {
            show (val) {
                if (!val) {
                    this.id = 0
                    this.desc = ''
                }
            }
        }
    }
</script>
<style lang="less" scoped>
  @import "../../assets/variable";

  .settled-in {
    .settled-in-search {
      width: calc(~"100% - 60px");
      padding: 15px;
      margin: 5px 15px 15px 15px;
      background: #ffffff;
      box-shadow: @contentBoxShadow;
      border-radius: @contentBorderRadius;

      .demo-form-inline {
        padding-top: 22px;
      }
    }
  }
</style>
