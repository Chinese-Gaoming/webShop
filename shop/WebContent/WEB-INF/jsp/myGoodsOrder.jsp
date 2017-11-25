<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head >
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="dist/css/bootstrap.min.css">
<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="dist/css/bootstrapValidator.min.css">
<link rel="stylesheet" href="dist/css/bootstrap-datetimepicker.min.css">
<title>Insert title here</title>
<style type="text/css">
.nessary {
	color: #ff0000;
}
</style>
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="dist/js/jquery-3.1.1.min.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="dist/js/bootstrap.min.js"></script>
<script src="dist/js/bootstrapValidator.min.js"></script>
<script src="dist/js/bootstrap-datetimepicker.min.js"></script>
<script src="dist/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="dist/js/zh_CN.js"></script>
<script type="text/javascript">
var zzzz;
function init() {
	
	$.ajax({
		url : "getNoMoneyGoodsOrder",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			//srchGH();
		
			var data = eval(data);//解析jsonString成object
			console.log(data);
			var result = data;
			zzzz=data;
			var favourEle = $("#tableId");
			favourEle.empty();
			var number = 0;
			for (var i = 0; i < result.length; i++) {
                 console.log(result)
                 if(result[i].zt==1){
      				var ztzt="已发货";
      			}else{
      				var ztzt="未发货";
      			}
				number++;
				favourEle.append("<tr><td style='width:100px'>" + number
						+ "</td><td id='typeId"+i+"'style='width:200px'>" + result[i].ddh
						+ "</td><td style='width:100px'>" + result[i].lxr
						+ "</td><td style='width:200px'>" + result[i].goodsName
						+ "</td><td style='width:100px'>" + result[i].address
						+ "</td><td style='width:200px'>" + result[i].sj
						+ "</td><td style='width:200px'>" + ztzt
						+ "</td><td style='width:100px'><a onclick='giveMoney("+i
						+")'>付款<a></td><td style='width:100px'><a onclick='deleteMyGoodsOrder("+i
						+")'>删除<a></td></tr>");
			}

		
		}
	});
}
/*删除商品类别方法*/
function deleteMyGoodsOrder(i) {
	//alert(i)
	//alert(zzzz);
  // alert(zzzz[i].type);
   var cc=zzzz[i].ddh;
   alert(cc)
   //var ccc=encodeURI(encodeURI(cc))
   
	$.ajax({
		url : "deleteGoodsOrder?DDH="+cc+"",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			alert("删除成功");
			init();

		
		}
	});
}
function giveMoney(i) {
	//alert(i)
	//alert(zzzz);
  // alert(zzzz[i].type);
   var cc=zzzz[i].ddh;
   alert(cc)
   //var ccc=encodeURI(encodeURI(cc))
   
	$.ajax({
		url : "giveMoney?DDH="+cc+"",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			alert("付款成功");
			init();

		
		}
	});
}








</script>
</head>
<body onload="init()">
<div class="container-fluid jumbotron ">

		<div class="row">
			<div class="row col-md-4 col-md-offset-4">
				<p>
					<font size=7>我的订单界面</font>
				</p>
			</div>
		</div>
		<div class="row col-md-12">
			<form action="goodsManagerInfo" class="form-horizontal " method="get" id="formId">

				<div class="col-md-12">
					<!-- 表格 -->
					<div class="col-md-3 col-md-offset-9 control-label" >
							<div class="input-group date form_date">
						
					</div>
							
					</div>
					<div class="col-md-12 " >
					<table class="table table-striped">
						<caption>
							<strong>我的订单记录</strong>
							
						</caption>
						<thead style="display: block; height: 30px">
							<tr>
								<td style="width:100px"  class="success">序号</td>
								<td style="width:200px" class="success">订单编号</td>
								<td style="width:100px" class="success">用户名</td>
								<td style="width:200px" class="success">商品名</td>
								<td style="width:100px" class="success">地址</td>
								<td style="width:200px" class="success">下单时间</td>
								<!-- <td style="width:200px" class="success">商品名称</td> -->
								<td style="width:200px" class="success">发货状态</td>
								<td style="width:200px" class="success">操作</td>
							</tr>
						</thead>

						<tbody id="tableId"
							style="display: block; max-height: 400px; height:400px; overflow-y: scroll">
						</tbody>
						


					</table>
					</div>
				</div>
			</form>
		</div>
	</div>


</body>
</html>