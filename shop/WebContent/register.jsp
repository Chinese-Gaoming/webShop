
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>Insert title here</title>
<!-- 新 Bootstrap 核心 CSS 文件 -->
<link rel="stylesheet" href="dist/css/bootstrap.min.css">
<!-- 可选的Bootstrap主题文件（一般不用引入） -->
<link rel="stylesheet" href="dist/css/bootstrap-theme.min.css">
<link rel="stylesheet" href="dist/css/bootstrapValidator.min.css">
<link rel="stylesheet" href="dist/css/bootstrap-datetimepicker.min.css">
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
	/**
	 * 方法1：页面初始化下拉列表
	 */
	function init() {
		srchGH();
		$.ajax({
			url : "loadAjax",
			type : "get",
			dataType : "json",
			success : function(data) {//回调函数
				//srchGH();
				var data = eval(data);//解析jsonString成object
				console.log(data);
				console.log(data[0][0].zdxmmc);
				console.log(data[2][0].zdxmmc);
				var favourEle = $("#mzlxId");
				var favourEle2 = $("#ghksId");
				var favourEle3 = $("#operatorId");
				var favourEle4 = $("#klxId2");//卡类型
				var favourEle5 = $("#xbID2");//性别
				favourEle.empty();
				favourEle2.empty();
				favourEle3.empty();
				favourEle4.empty();
				favourEle5.empty();
				var result = data[0];
				var result2 = data[1];
				var result3 = data[2];
				var result4 = data[3];
				var result5 = data[4];
				for (var i = 0; i < result.length; i++) {
					//document.write(result[i].ZDXMDM)
					favourEle.append("<option value='"+result[i].zdxmdm+"'>"
							+ result[i].zdxmmc + "</option>");
				}
				for (var i = 0; i < result2.length; i++) {
					favourEle2.append("<option value='"+result2[i].ksdm+"'>"
							+ result2[i].ksmc + "</option>");
				}
				for (var i = 0; i < result3.length; i++) {
					favourEle3.append("<option value='"+result3[i].gh+"'>"
							+ result3[i].xm + "</option>");
				}
				for (var i = 0; i < result4.length; i++) {
					favourEle4.append("<option value='"+result4[i].zdxmdm+"'>"
							+ result4[i].zdxmmc + "</option>");
				}
				for (var i = 0; i < result5.length; i++) {
					favourEle5.append("<option value='"+result5[i].zdxmdm+"'>"
							+ result5[i].zdxmmc + "</option>");
				}
			}
		});
	}

	/**
	 * 方法2查询卡号是否已注册
	 */

	function srch() {

		document.getElementById("modalFormId").reset();
		$('#formId').data('bootstrapValidator').validate();
		if (!$('#formId').data('bootstrapValidator').isValid()) {
			return;
		}
		$form = $('#formId');

		var sss = $("#cardId").val()
		$.ajax({
			url : "loadAjax2?cardId=" + sss + "",
			type : "get",
			dataType : "json",
			success : function(data) {//回调函数
				var data = eval(data);//解析jsonString成object
				console.log(data)
				console.log(data.jtzz);
				var result = data;
				if (data.xm == null) {
					alert("无此卡号请注册")

					$("#cardId2").val(sss);
					$('#myModal').modal('show')

				} else {
					var sex;
					switch (result.xb) {
					case "0":
						var sex = "未知的性别";
						break;
					case "1":
						var sex = "男性";
						break;
					case "2":
						var sex = "女性";
						break;
					default:
						var sex = "未说明的性别"
						break;

					}
					$("#xbId").val(sex);
					$("#xmId").val(result.xm);
					$("#klxId2").val(result.klx)
					$("#dhhmId1").val(result.dhhm);
					$("#jtzzId").val(result.jtzz);
					var nl = new Date(result.csrq);
					var datetime = new Date();
					var nl = datetime.getFullYear() - nl.getFullYear();
					$("#nlId").val(nl);
				}

			}
		});
	}
	/**
	 * 方法3：患者保存注册及校验
	 */

	

	/**表单验证**/
	function formValidator() {
		$('#modalFormId').bootstrapValidator({
			feedbackIcons : {
				valid : 'glyphicon glyphicon-ok',
				invalid : 'glyphicon glyphicon-remove',
				validating : 'glyphicon glyphicon-refresh'
			},
			fields : {
				KH : {
					message : '卡号不合法',
					validators : {
						notEmpty : {
							message : '卡号不能为空！'
						},
						stringLength : {
							max : 32,
							message : '卡号长度不能超过32位'
						}
					}
				},
				KLX : {
					message : '卡类型不合法',
					validators : {
						notEmpty : {
							message : '卡类型不能为空！'
						}
					}
				},
				XM : {
					message : '姓名不合法',
					validators : {
						notEmpty : {
							message : '姓名不能为空'
						},
						stringLength : {
							min : 2,
							max : 32,
							message : '姓名长度不能低于2位超过12位'
						}
					}
				},
				XB : {
					message : '性别不合法',
					validators : {
						notEmpty : {
							message : '性别不能为空！'
						}
					}
				},
				CSRQ : {
					message : '出生日期不合法',
					validators : {
						notEmpty : {
							message : '出生日期不能为空'
						}
					}
				}
			}
		})
	}
	function formValidatorMain() {
		$('#formId').bootstrapValidator({
			feedbackIcons : {
				valid : 'glyphicon glyphicon-ok',
				invalid : 'glyphicon glyphicon-remove',
				validating : 'glyphicon glyphicon-refresh'
			},
			fields : {
				KH : {
					message : '卡号不合法',
					validators : {
						notEmpty : {
							message : '卡号不能为空！'
						},
						stringLength : {
							max : 32,
							message : '卡号长度不能超过32位'
						}
					}
				}
			}
		})
	}

	/****弹出页面保存****/
	function modalSave() {
		//开启验证
		$('#modalFormId').data('bootstrapValidator').validate();
		if (!$('#modalFormId').data('bootstrapValidator').isValid()) {
			return;
		}

		$form = $('#modalFormId');
		// Use Ajax to submit form data 提交至form标签中的action，result自定义
		$.post($form.attr('action'), $form.serialize(), function(data) {
			alert("已成功提交")
			//do something...
			var data = eval(data);//解析jsonString成object
			console.log(data);
			var result = data;
			$("#xmId").val(result.xm);
			$("#dhhmId1").val(result.dhhm);
			$("#jtzzId").val(result.jtzz);
			$("#xbId").val(result.xb);
			var nl = new Date(result.csrq);
			var datetime = new Date();
			var nl = datetime.getFullYear() - nl.getFullYear() + 1;
			$("#nlId").val(nl);
			$("#klxId2").val(result.klx);
			$('#myModal').modal('hide');//手动关闭弹出框 */ */

		});

	}

	/**
	方法4： 挂号信息保存及显示 
	 */
	function SaveGH() {

		$('#formId').data('bootstrapValidator').validate();
		if (!$('#formId').data('bootstrapValidator').isValid()) {
			return;
		}
		$form = $('#formId');

		var kh = $("#cardId").val();
		var klx = $("#klxId2").val();
		//var ghsj=new Date();
		var ghf = $("#ghfId").val();
		//var mzlx=$("#mzlxId").val();
		var mzlx = $('#mzlxId option:selected').text();
		var ghksdm = $("#ghksId").val();
		var ghksmc = $('#ghksId option:selected').text();
		var ghysdm = $("#operatorId").val();
		var ghysmc = $('#operatorId option:selected').text();
		$.ajax({
			url : "SaveGH?KH=" + kh + "&KLX=" + klx + "&GHF=" + ghf + "&MZLX="
					+ mzlx + "&GHKSDM=" + ghksdm + "&GHKSMC=" + ghksmc
					+ "&GHYSDM=" + ghysdm + "&GHYSXM=" + ghysmc + "",
			type : "get",
			dataType : "json",

			success : function(data) {//回调函数

				var data = eval(data);//解析jsonString成object
				console.log(data)
				console.log(data[0].xm);
				var result7 = data;
				if (data[0].xm == null) {
					alert("无此卡号患者请先录入患者信息")
				} else {
					alert("操作已生效")
					var favourEle7 = $("#tableId");
					favourEle7.empty();
					var number = result7.length + 1;
					for (var i = 0; i < result7.length; i++) {
						var sex = null;
						switch (result7[i].xb) {
						case "0":
							sex = "未知的性别";
							break;
						case "1":
							sex = "男性";
							break;
						case "2":
							sex = "女性";
							break;

						default:
							sex = "未说明的性别";
							break;
						}
						number--;
						favourEle7.append("<tr><td style='width:130px'>"
								+ number + "</td><td style='width:130px'>"
								+ result7[i].kh
								+ "</td><td style='width:130px'>"
								+ result7[i].xm
								+ "</td><td style='width:130px'>" + sex
								+ "</td><td style='width:130px'>"
								+ result7[i].ghksmc
								+ "</td><td style='width:130px'>"
								+ result7[i].ghysxm
								+ "</td><td style='width:130px'>"
								+ result7[i].mzlx
								+ "</td><td style='width:130px'>"
								+ result7[i].ghf + "</td></tr>");

					}
				}

			}

		})

	}

	/***方法5 查询挂号信息***/
	function srchGH() {
		$.ajax({
			url : "srchGH",
			type : "get",
			dataType : "json",
			success : function(data) {//回调函数
				$("#formId").data('bootstrapValidator').destroy();//销毁bootstrapValidator验证
				$('#formId').data('bootstrapValidator', null);
				formValidatorMain();//重新开启
				document.getElementById("formId").reset();
				var data = eval(data);//解析jsonString成object
				console.log(data)
				console.log(data[0].xm);
				var result7 = data;
				var favourEle7 = $("#tableId");
				favourEle7.empty();
				var number = result7.length + 1;
				for (var i = 0; i < result7.length; i++) {
					var sex = null;
					switch (result7[i].xb) {
					case "0":
						sex = "未知的性别";
						break;
					case "1":
						sex = "男性";
						break;
					case "2":
						sex = "女性";
						break;

					default:
						sex = "未说明的性别";
						break;
					}
					number--;
					favourEle7.append("<tr><td style='width:130px'>" + number
							+ "</td><td style='width:130px'>" + result7[i].kh
							+ "</td><td style='width:130px'>" + result7[i].xm
							+ "</td><td style='width:130px'>" + sex
							+ "</td><td style='width:130px'>"
							+ result7[i].ghksmc
							+ "</td><td style='width:130px'>"
							+ result7[i].ghysxm
							+ "</td><td style='width:130px'>" + result7[i].mzlx
							+ "</td><td style='width:130px'>" + result7[i].ghf
							+ "</td style='width:130px'></tr>");

				}

			}

		})

	}
</script>


<script type="text/javascript">
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
	function proChange(GHKS) {
		$.ajax({
			url : "getDoctor?GHKS=" + GHKS + "",
			type : "get",
			dataType : "json",
			success : function(data) {//回调函数
				var data = eval(data);//解析jsonString成object
				console.log(data)
				var result8 = data;
				var favourEle8 = $("#operatorId");
				favourEle8.empty();
				for (var i = 0; i < result8.length; i++) {
					favourEle8.append("<option value='"+result8[i].gh+"'>"
							+ result8[i].xm + "</option>");

				}
			}

		})
	}
</script>

</head>
<body onload="init()">
	



	<!-- Modal -->
	<div >
		<div  style="width: 900px">
			<div >
				<fieldset>
					<form  class="form-horizontal "
						action="InsertHzxxAjax">
						<div>
							<button type="button" class="close" data-dismiss="modal">
								<span>&times;</span>
							</button>
							<h4 class="modal-title" id="myModalLabel">患者信息录入</h4>
						</div>
						<div class="modal-body">
							<div class="row">
								<div class="col-md-10 col-md-offset-1">



									<div class="col-md-5 " style="margin-top: 60px">
										<div class="form-group">
											<label for="cardId2" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>卡号</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="KH"
													id="cardId2">
											</div>
										</div>
										<div class="form-group">
											<label for="xmId2" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>姓名</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="XM" id="xmId2">
											</div>
										</div>
										<div class="form-group">
											<label for="csrqId2" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>出生日期</label>
											<div class="col-md-8">
												<div class="input-group date form_datetime"
													data-data-format="yyyy-MM-dd">
													<input type="text" class="form-control input-sm"
														id="csrqId2" placeholder="请输入出生日期" name="CSRQ" readonly>
													<span class="input-group-addon"> <span
														class="glyphicon glyphicon-calendar"></span>
													</span>
												</div>
											</div>

										</div>
										<div class="form-group">
											<label for="jtzzId2" class="col-md-4 control-label">家庭住址</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="JTZZ"
													id="jtzzId2">
											</div>
										</div>

									</div>

									<div class="col-md-6 col-md-offset-1" style="margin-top: 60px">

										<div class="form-group">
											<label for="nameId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>卡类型</label>
											<div class="col-md-8">
												<select class="form-control " name="KLX" id="klxId2">

												</select>
											</div>
										</div>
										<div class="form-group">
											<label for="nameId" class="col-md-4 control-label"><span
												class="glyphicon glyphicon-star nessary"></span>性别</label>
											<div class="col-md-8">
												<select class="form-control " name="XB" id="xbID2">

												</select>
											</div>
										</div>
										<div class="form-group">
											<label for="nameId" class="col-md-4 control-label">电话号码</label>
											<div class="col-md-8">
												<input type="text" class="form-control" name="DHHM"
													id="dhhmId2">
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