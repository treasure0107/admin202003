<template>
  <div class="content">
    <div class="pages-header">
      <div><router-link to="/activity/seckill" style="text-decoration:none;color:#000000;">秒杀管理</router-link>/秒杀详情</div>
    </div>
    <div class="content-cont table-content">
      <div class="pages-inline">
        秒杀信息
      </div>
      <el-form ref="form" :model="form"  label-width="120px">
        <el-form-item label="秒杀时间" prop="time">
          {{formatDate(form.start_time)}}至{{formatDate(form.end_time)}}
        </el-form-item>
        <div class="pages-inline">
          商品信息
        </div>
        <el-form-item label="商品名称" prop="goods_name" >
          {{addForm.goods_name}}
        </el-form-item>
        <div style="margin: 20px">
          <el-table :data="skuArrList1" stripe border style="width: 100%">
            <el-table-column prop="attr_desc" label="已添加属性" ></el-table-column>
            <el-table-column prop="price" label="商品价格" >
              <template slot-scope="scope">
                ￥{{scope.row.price}}
              </template>
            </el-table-column>
            <el-table-column prop="activity_price" label="秒杀价格" >
              <template slot-scope="scope">
                ￥{{scope.row.activity_price}}
              </template>
            </el-table-column>
            <el-table-column prop="subsidy_precent" label="平台补贴比例" >
              <template slot-scope="scope">
                {{scope.row.subsidy_precent}}%
              </template>
            </el-table-column>
            <el-table-column prop="subsidy_money" label="预计补贴金额" >
              <template slot-scope="scope">
                ￥{{scope.row.subsidy_money}}/{{tableData.unit}}
              </template>
            </el-table-column>
            <el-table-column prop="sale_num" label="销售数量" ></el-table-column>
            <el-table-column prop="real_sale_num" label="实际销售数量" ></el-table-column>
            <el-table-column prop="order_num" label="订单数量" ></el-table-column>
            <el-table-column prop="limit_num" label="限购" ></el-table-column>
          </el-table>
        </div>
        <el-form-item label="商品描述:" prop="goods_desc">
          {{form.goods_desc}}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

  export default {
    data() {
      return {
        skuArrList:[],
        skuArrList1:[],
        tableData: [],
        skuArr:[],
        skuPri:null,
        form:{
          goods_name:'',
          goods_id:'',
          goods_pic:'',
          goods_price:'',
          goods_activity_price:'',
          spu_id:'',
          shop_id:'',
          time:[],
          goods_desc:'',
        },
        activityInfo:{
          time:[]
        },
        addForm:{
          goods_name:'',
          activity_price:[],
          subsidy_precent:[],
          subsidy_money:[],
          limit_num:[],
          goods_desc:''
        },
        showAdd:false,
        goods_name:'',
        selectRows:[],
        multipleSelection: [],
      }
    },
    created() {
      this.get_seckill_info();
    },
    methods: {
      async get_seckill_info(){
        let aid = this.$route.query.aid;
        let res = await this.$request.post(this.$API.get_seckill_info,
          {
            aid: aid,
          },'main',
          {
            handle_desc:'查看秒杀详情;'+aid
          });
        this.form=res.data;
        this.form.time=[];
        this.form.time.push(this.form.start_time*1000);
        this.form.time.push(this.form.end_time*1000)
        this.addForm.goods_name=res.data.goods_name;

        res.data.attr_info.forEach((item,index)=>{
          this.addForm.activity_price.push(item.activity_price);
          this.addForm.subsidy_precent.push(item.subsidy_precent);
          this.addForm.limit_num.push(item.limit_num);
          item.arr = JSON.parse(item.goods_attr)
        });
        this.skuArrList=res.data.attr_info;
        this.skuArrList1=res.data.attr_info;
        this.get_goods_info(this.form.spu_id)
      },

      async get_goods_info(spu_id){
        let param={};
        param['spu_id']=spu_id;
        let data = await this.$request.get(this.$API.common_api,
          param
          ,'main',
          {
            router_path: 'goods/goodsInfo',
            request_host: 'GOODS_SERVER_HOST',
          });
        //默认数据重置第一位 is_defaule = 0
        if(data.data.shop_default_attr_value.specification.length > 1){
          data.data.shop_default_attr_value.specification.map((item1,index1)=>{
            item1.attr_value.map((item2,index2)=>{
              if(item2.is_default){
                item2.is_default = 0;
              }
            })
          })
        }
        this.tableData=data.data;
        this.form.goods_name=data.data.goods_name;
        this.form.goods_id=data.data.goods_id;
        this.form.spu_id=data.data.spu_id;
        this.form.shop_id=data.data.shop_id;
        this.form.goods_pic=data.data.goodspicture_set[0]['pic_url'];

      },
      formatDate(time) {
        let times = time * 1000;
        let date = new Date(times);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
        let D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
        let h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
        let m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
        let s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
        return Y+M+D+h+m+s
      }
    },
    filters:{
      filterT(str){
        if(str){
          return str.replace('T', ' ')
        }else{
          return  '';
        }

      },
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
  .attr_value {
    border: 1px solid #d1d1d1;
    margin-left: 6px;
    padding: 2px 12px;
    cursor: pointer;
  }
  .attr_value_active {
    color: #d13a26;
    border-color: #d13a26;
    border: 1px solid;
    padding: 2px 12px;
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
