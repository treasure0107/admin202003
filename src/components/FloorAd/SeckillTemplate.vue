<template>
  <div class="seckill-content">
    <el-table :data="goodsList" style="width: 100%;min-height: 300px">
      <el-table-column prop="id" label="序号" width="80">
      </el-table-column>
      <el-table-column prop="goods_id" label="商品" width="280">
        <template slot-scope="scope">
          <div class="table-goods">
            <img :src="scope.row.goods_pic" alt="">
            <div>
              <div>{{scope.row.goods_name}}</div>
              <div>¥{{scope.row.goods_price}} <span>¥{{scope.row.goods_activity_price}}</span></div>
              <div>ID：{{scope.row.goods_id}}</div>
              <div>店铺：{{scope.row.shop_id}}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="start_time" label="活动时间">
        <template slot-scope="scope">
          <div>{{$common.formatDate(scope.row.start_time)}}</div>
          至
          <div>{{$common.formatDate(scope.row.end_time)}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="is_sort" label="排序" width="180">
        <template slot-scope="scope">
          <el-input
            placeholder="请输入内容"
            v-model="scope.row.is_sort" type="number">
          </el-input>
        </template>
      </el-table-column>
      <el-table-column prop="rz_shop_name" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="deleteGoods(scope.$index,scope.row.aid)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="add-goods-but">
      <el-button @click="showEdit=true">添加活动商品</el-button>
    </div>

    <el-dialog title="设置活动商品" :visible.sync="showEdit" width="50%" append-to-body>
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="起始时间">
          <el-date-picker
            v-model="formInline.start_time"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="formInline.end_time"
            type="daterange"
            align="left"
            value-format="timestamp"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="商品名称">
          <el-input v-model="formInline.goods_name" placeholder="商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品ID">
          <el-input v-model="formInline.goods_id" placeholder="商品ID"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSizeChange(size)">查询</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="tableData" class="goods-lists" style="width: 100%;min-height: 300px" ref="multipleTable"
                @select="handleSelectionChange" @select-all="handleSelectionChange">
        <el-table-column
          type="selection" :selectable='checkboxT'
          width="55">
        </el-table-column>
        <el-table-column prop="aid" label="序号" width="80">
        </el-table-column>
        <el-table-column prop="goods_id" label="商品" width="280">
          <template slot-scope="scope">
            <div class="table-goods">
              <img :src="scope.row.goods_pic" alt="">
              <div>
                <div>{{scope.row.goods_name}}</div>
                <div>¥{{scope.row.goods_price}} <span>¥{{scope.row.goods_activity_price}}</span></div>
                <div>ID：{{scope.row.goods_id}}</div>
                <div>店铺：{{scope.row.shop_id}}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <!--<el-table-column prop="rz_shop_name" label="限购数量" width="180">
        </el-table-column>
        <el-table-column prop="rz_shop_name" label="剩余数量" width="180">
        </el-table-column>-->
        <el-table-column prop="rz_shop_name" label="活动时间">
          <template slot-scope="scope">
            <div>{{$common.formatDate(scope.row.start_time)}}</div>
            至
            <div>{{$common.formatDate(scope.row.end_time)}}</div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pages-style">
        <el-pagination
          :total="count" :page-size="size"
          :current-page="page"
          @size-change="handleSizeChange"
          layout="sizes,total,prev, pager, next"
          :page-sizes="[5, 10, 20, 50,100]"
          @current-change="handleCurrentChange">
        </el-pagination>
      </div>

      <div class="submit-cont">
        <el-badge class="item">
          <el-button type="primary" @click="submitGoods">确定</el-button>
        </el-badge>
        <el-button @click="showEdit=false" style="margin-left: 20px">取消</el-button>
      </div>

    </el-dialog>

  </div>
</template>
<script lang="ts">
    import {Vue, Prop, Component, Watch} from "vue-property-decorator";

    @Component({name: "SeckillTemplate"})
    export default class SeckillTemplate extends Vue {
        @Prop({
            type: Array,
            default: [],
        }) goodsList: any;

        @Prop({
            type: Number,
            default: 3,
        }) status: number;

        showEdit: boolean = false;
        count: number = 0;
        size: number = 5;
        page: number = 1;
        selectGoodsList: any = {};
        newSelectList: any = {};
        tableData: any = [];
        loading: boolean = false;
        formInline: any = {
            start_time: [],
            end_time: [],
            goods_name: '',
            goods_id: ''
        };

        async mounted() {

        }

        async activityGoods(): Promise<void> {
            this.loading = true;

            const select_item = async () => {
                await this.$common.wait(100);
                this.tableData.forEach((item) => {
                    if (this.selectGoodsList[item.aid] || this.newSelectList[item.aid]) {
                        this.$refs.multipleTable.toggleRowSelection(item)
                    }
                })
            };

            const set_times = (time) => {
                if (!time.length) return '';
                else return [time[0] / 1000, time[1] / 1000 + 60 * 60 * 24 - 1].join(',')
            };

            let {data} = await this.$request.get(this.$API.activity_list_web, {
                type: this.status == 3 ? 1 : 2,
                status: 3,
                goods_name: this.formInline.goods_name,
                goods_id: this.formInline.goods_id,
                start_time: set_times(this.formInline.start_time),
                end_time: set_times(this.formInline.end_time),
                pageNo: this.page,
                pageSize: this.size
            });
            this.tableData = data.data ? data.data : [];
            this.count = data.count ? data.count : 0;
            await select_item();
            this.loading = false
        }

        submitGoods(): void {
            Object.keys(this.newSelectList).forEach((item, index) => {
                let indexs = _.findIndex(this.goodsList, (o) => {
                    return o.aid == item
                });
                if (indexs < 0) {
                    this.goodsList.push(JSON.parse(JSON.stringify(this.newSelectList[item])));
                    this.selectGoodsList[item] = this.newSelectList[item];
                }
            });
            this.newSelectList = {};
            this.showEdit = false;
        }

        deleteGoods(index: number, aid: number): void {
            this.$delete(this.selectGoodsList, aid);
            this.$delete(this.goodsList, index);
        }

        handleCurrentChange(index: number): void {
            this.page = index;
            this.activityGoods().then();
        }

        handleSizeChange(event: number): void {
            this.page = 1;
            this.size = event;
            this.activityGoods().then()
        }

        /**
         * table选择
         * @param event
         * @param row
         */
        handleSelectionChange(event, row) {
            if (!this.loading) {
                if (!this.selectGoodsList[row.aid] && !this.newSelectList[row.id]) {
                    row['is_sort'] = 1;
                    row['id'] = '';
                    this.newSelectList[row.aid] = row
                } else {
                    delete this.newSelectList[row.aid]
                }
            }
        }

        checkboxT(row, index): boolean {
            if (this.selectGoodsList[row.aid]) {
                return false
            } else {
                return true
            }
        }

        @Watch('showEdit', {immediate: true, deep: true})
        onPersonChanged(val: Person, oldVal: Person) {
            this.page = 1;
            this.size = 5;
            this.formInline = {
                start_time: [],
                end_time: [],
                goods_name: '',
                goods_id: ''
            };
            this.newSelectList = {};
            if (val) {
                this.goodsList.forEach((item) => {
                    this.$set(this.selectGoodsList, item.aid, item)
                });
                this.activityGoods().then();
            }
        }
    }
</script>
<style lang="less" scoped>
  .seckill-content {
    width: 90%;
    margin-left: 5%;

    .add-goods-but {
      margin: 20px 0;
    }
  }

  .table-goods {
    width: 100%;

    > img {
      width: 70px;
      height: 100%;
      float: left;
    }

    > div {
      padding-left: 10px;
      width: calc(~"100% - 72px");
      float: right;

      > div {
        font-size: 13px;

        &:first-child {
          color: #2D64B3;
        }

        &:nth-child(2) {
          color: #f16c6c;

          > span {
            color: #cccccc;
            margin-left: 20px;
            text-decoration: line-through;
          }
        }
      }
    }
  }
</style>
<style>
  .goods-lists .el-table__header thead tr:first-child th:first-child .cell {
    display: none;
  }
</style>