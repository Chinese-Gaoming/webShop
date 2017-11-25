<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="dist/css/bootstrap.min.css">
<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="dist/css/bootstrapValidator.min.css">
<link rel="stylesheet" href="dist/css/bootstrap-datetimepicker.min.css">
<link rel="stylesheet" href="dist/css/fileinput.min.css">
<title>Insert title here</title>
<style type="text/css">
.nessary {
	color: #ff0000;
}
</style>
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="dist/js/jquery-3.1.1.min.js"></script>
<script src="dist/js/j1.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="dist/js/bootstrap.min.js"></script>
<script src="dist/js/bootstrapValidator.min.js"></script>
<script src="dist/js/bootstrap-datetimepicker.min.js"></script>
<script src="dist/js/fileinput.min.js"></script>
<script src="dist/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script src="dist/js/zh_CN.js"></script>
<script type="text/javascript">

function GetQueryString(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  decodeURI(r[2]); return null;
}
function init() {
   var xx=	GetQueryString("goodsName")
   var xx=encodeURI(encodeURI(xx))
	
  
	$.ajax({
		url : "getdetailGoods?goodsName="+xx+"",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			//srchGH();
		
			var data = eval(data);//解析jsonString成object
			console.log(data);
			var result = data;
			var aa="dist/imagePath/"+result[0].goodsImage;
			var favourEle = $("#imageDivId");
			favourEle.empty();
			favourEle.append("<img  class='dealImg' src='"+aa
					+ "' >");
		
			$("#GoodsNameId").val(result[0].goodsName)
			$("#GoodsIdId").val(result[0].goodsNumber)
			$("#PackageId").val(result[0].package)
			$("#TypeId").val(result[0].typeId)
			$("#ProducterId").val(result[0].producter)
			$("#sjId").val(result[0].sjsj)
			$("#SalePriceId").val(result[0].salePrice)
			$("#numberId").val("1")
			
			
		}
	});
	
}

function Save() {

	
	$form = $('#modalFormId'); 
	// Use Ajax to submit form data 提交至form标签中的action，result自定义
	$.post($form.attr('action'), $form.serialize(), function(data) {
		
		if(data==1){
		alert("已成功加入购物车提交")
			
		}else{
		alert("提交失败！请登录")
		//window.location.href="http://www.hao123.com";
		window.location.href="index.jsp";
		}
		
		//do something...
		//var data = eval(data);//解析jsonString成object
		//console.log(data);
		//var result = data;
		//$('#modalFormId')[0].reset()

	});

}


</script>
</head>
<body onload="init()">
	<div class="container-fluid jumbotron ">
		<div class="row col-md-11">
			<form action="InsertBasket" 
				method="post" id="modalFormId">
				<div class="row">
					<div class="row col-md-4 col-md-offset-4">
						<p>
							<font size=7>商品详情界面</font>
						</p>
					</div>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-md-10 col-md-offset-1">
							<div id="imageDivId" class="col-md-6 " style="margin-top: 60px;">
							</div>

							<div class="col-md-5" style="margin-top: 60px">

								<div class="form-group">
									<label for="cardId2" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品名称</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="GoodsName"
											id="GoodsNameId" readonly="readonly">
									</div>
								</div>
								<div class="form-group">
									<label for="cardId2" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品号</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="GoodsId"
											id="GoodsIdId" readonly="readonly">
									</div>
								</div>

								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>包装样式</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="Package"
												id="PackageId" readonly="readonly">
									</div>
								</div>
								
								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品类型</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="TypeId"
												id="TypeId" readonly="readonly">
										
									</div>
								</div>
								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>产地</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="Producter"
												id="ProducterId" readonly="readonly">
										
									</div>
								</div>
								<div class="form-group">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>生产日期</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="sj"
												id="sjId" readonly="readonly">
										
									</div>
								</div>
								<div class="form-group" style="margin-bottom: 50px">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>商品价格</label>
									<div class="col-md-8">
										<input type="text" class="form-control" name="SalePrice"
											id="SalePriceId" readonly="readonly">
									</div>
								</div>
								<div class="form-group" style="margin-top: 60px;">
									<label for="nameId" class="col-md-4 control-label"><span
										class="glyphicon glyphicon-star nessary"></span>购买数量</label>
									<div class="col-md-4">
										<input type="number" min="1" max="100" class="form-control" name="Number"
											id="numberId">
									</div>
								</div>
								<div >
										<button id="saveBtn" type="button" class="btn btn-primary"
											onclick="Save()">加入购物车</button>
									</div>


							</div>

						</div>
					</div>
				</div>
				
			</form>
		</div>
	</div>
</body>
</html>