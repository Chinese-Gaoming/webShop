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
		url : "userManagerInfo",
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
     			if(result[i].sex==1){
     				var a="男";
     			}else{
     				var a="女";
     			}
				number++;
				favourEle.append("<tr><td style='width:300px'>" + number
						+ "</td><td id='adminId"+i+"'  style='width:300px'>" + result[i].userId
						+ "</td><td style='width:300px'>" + result[i].userName
						+ "</td><td style='width:300px'>" + a
						+ "</td><td style='width:200px'><a onclick='deleteUser("+i
						+")'>删除<a></td></tr>");
			}

		
		}
	});
}

function deleteUser(i) {
	//alert(i)
	//alert(zzzz);
  // alert(zzzz[i].adminId);
   var bb=zzzz[i].userId;
	$.ajax({
		url : "deleteUser?UserId="+bb+"",
		type : "get",
		dataType : "json",
		success : function(data) {//回调函数
			alert("删除成功");
			init();

		
		}
	});
}

function RegisterModalShow() {
	$('#myModal').modal('show')
	
}
$(function() {
	$('.form_datetime').datetimepicker({
		language : 'zh-CN',
		weekStart : 1,
		todayBtn : 1,
		autoclose : 1,
		todayHighlight : 1,
		startView : 2,
		minView : 2,
		forceParse : 0,
		format : "yyyy-mm-dd"
	})
}).on(
		'hide',
		function(e) {
			$('#modalFormId').data('bootstrapValidator').updateStatus(
					'CSRQ', 'NOT_VALIDATED', null).validateField('CSRQ');
		});
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
		/* $("#xmId").val(result.xm);
		$("#dhhmId1").val(result.dhhm);
		$("#jtzzId").val(result.jtzz);
		$("#xbId").val(result.xb);
		var nl = new Date(result.csrq);
		var datetime = new Date();
		var nl = datetime.getFullYear() - nl.getFullYear() + 1;
		$("#nlId").val(nl);
		$("#klxId2").val(result.klx); */
		$('#myModal').modal('hide');//手动关闭弹出框 */ */
		init();

	});

}

</script>
</head>
<body onload="init()">
<div class="container-fluid jumbotron ">

		<div class="row">
			<div class="row col-md-3 col-md-offset-4">
				<p>
					<font size=7>管理员界面</font>
				</p>
			</div>
		</div>
		<div class="row col-md-12">
			<form action="" class="form-horizontal " method="get" id="formId">

				<div class="col-md-12" align="center">
					<!-- 表格 -->
					<div class="col-md-11 " align="right">
							<button id="validateBtn" type="button" onclick="RegisterModalShow()"
								class="btn btn-primary btn-inline example-p-1  ">  添加  </button>
							
						</div>
					<table class="table table-striped">
						<caption>
							<strong>管理员记录</strong>
							
						</caption>
						<thead style="display: block; height: 30px">
							<tr>
								<td style="width: 300px" class="success">序号</td>
								<td style="width: 300px" class="success">管理员</td>
								<td style="width: 300px" class="success">创建时间</td>
								<td style="width: 300px" class="success">备注</td>
								<td style="width: 200px" class="success">删除</td>
							</tr>
						</thead>

						<tbody id="tableId"
							style="display: block; max-height: 300px; overflow-y: scroll">
						</tbody>


					</table>
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
						action="InsertAdmin" method="post">
						<div class="modal-header">
							<button type="button" class="close" data-dismiss="modal">
								<span>&times;</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">管理员添加</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-10 col-md-offset-1">



									<div class="col-md-8 " style="margin-top: 60px">
										<div class="form-group">
											<label for="UserId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>用户名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="AdminId"
													id="AdminId">
											</div>
										</div>
										<div class="form-group">
											<label for="PasswordId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>密码</label>
											<div class="col-md-8">
												<input type="password" class="form-control" name="Password" id="PasswordId">
											</div>
										</div>
										<div class="form-group">
											<label for="UserNameId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>真实姓名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="Name"
													id="NameId">
											</div>
										</div>
										<div class="form-group">
											<label for="csrqId2" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>出生日期</label>
											<div class="col-md-8">
												<div class="input-group date form_datetime"
													data-data-format="yyyy-MM-dd">
													<input type="text" class="form-control input-sm"
														id="csrqId2" placeholder="请输入出生日期" name="zcsj" readonly>
													<span class="input-group-addon"> <span
														class="glyphicon glyphicon-calendar"></span>
													</span>
												</div>
											</div>

										</div>
										<div class="form-group">
											<label for="AddressId" class="col-md-4 control-label">备注</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="remark"
													id="remarkId">
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