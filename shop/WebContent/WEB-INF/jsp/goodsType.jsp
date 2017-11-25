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
		url : "getGoodsType",
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
     
				number++;
				favourEle.append("<tr><td style='width:300px'>" + number
						+ "</td><td id='typeId"+i+"'  style='width:500px'>" + result[i].type
						+ "</td><td style='width:200px'><a onclick='deleteGoodsType("+i
						+")'>删除<a></td></tr>");
			}

		
		}
	});
}
/*删除商品类别方法*/
function deleteGoodsType(i) {
	//alert(i)
	//alert(zzzz);
  // alert(zzzz[i].type);
   var cc=zzzz[i].type;
   var ccc=encodeURI(encodeURI(cc))
   
	$.ajax({
		url : "deleteGoodsType?Type="+ccc+"",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			alert("删除成功");
			init();

		
		}
	});
}

function ModalShow() {
	$('#myModal').modal('show')
	
}
/*添加商品类别方法*/
function modalSave() {
	//开启验证
	/* $('#modalFormId').data('bootstrapValidator').validate();
	if (!$('#modalFormId').data('bootstrapValidator').isValid()) {
		return;
	}
	*/
	
	$form = $('#modalFormId'); 
	// Use Ajax to submit form data 提交至form标签中的action，result自定义
	$.post($form.attr('action'), $form.serialize(), function(data) {
		alert("已成功提交")
		//do something...
		var data = eval(data);//解析jsonString成object
		console.log(data);
		var result = data;
		$('#myModal').modal('hide');//手动关闭弹出框 */ */
		
		init();

	});

}

$(function() {
	/****modal关闭触发函数****/
	//Modal验证销毁重构
	$('#myModal').on('hidden.bs.modal', function() {
		//alert(123);
/* 		$("#modalFormId").data('bootstrapValidator').destroy();//销毁bootstrapValidator验证
		$('#modalFormId').data('bootstrapValidator', null);
		formValidator();//重新开启 */
		$('#modalFormId')[0].reset()
	});

/* 	formValidator();//加载模态框表单验证
	formValidatorMain();//加载模态框表单验证 */

})

</script>
</head>
<body onload="init()">
<div class="container-fluid jumbotron ">

		<div class="row">
			<div class="row col-md-4 col-md-offset-4">
				<p>
					<font size=7>商品类别界面</font>
				</p>
			</div>
		</div>
		<div class="row col-md-12">
			<form action="" class="form-horizontal " method="get" id="formId">

				<div class="col-md-12">
					<!-- 表格 -->
					<div class="col-md-11 " align="right">
							<button id="validateBtn" type="button" onclick="ModalShow()"
								class="btn btn-primary btn-inline example-p-1  ">  添加  </button>
							
					</div>
					<div class="col-md-12 " >
					<table class="table table-striped">
						<caption>
							<strong>商品类别记录</strong>
							
						</caption>
						<thead style="display: block; height: 30px">
							<tr>
								<td style="width:300px"  class="success">序号</td>
								<td style="width:500px" class="success">商品类别</td>
								<td style="width:200px" class="success">删除</td>
							</tr>
						</thead>

						<tbody id="tableId"
							style="display: block; max-height: 400px; overflow-y: scroll">
						</tbody>


					</table>
					</div>
				</div>
			</form>
		</div>
	</div>
	
	<!-- Modal -->
	<div class="modal fade" id="myModal">
		<div class="modal-dialog" style="width: 900px">
			<div class="modal-content">
				<fieldset>
					<form id="modalFormId" class="form-horizontal "
						action="InsertGoodsType" method="post">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">
								<span>&times;</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">商品类别添加</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-10 col-md-offset-1">
									<div class="col-md-8 " style="margin-top: 60px">
										<div class="form-group">
											<label for="UserId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>商品类别名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Type"
													id="TypeId">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div class="modal-footer">
							<button id="www" type="button" class="btn btn-default"
								data-dismiss="modal">关闭</button>
							<button id="saveBtn" type="button" class="btn btn-primary"
								onclick="modalSave()">保存</button>
						</div>
					</form>
				</fieldset>
			</div>
		</div>
	</div>

</body>
</html>