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
$(document).ready(function() {
$(function () {
    $('#formId').bootstrapValidator({
    	message: 'This value is not valid',
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
			invalid: 'glyphicon glyphicon-remove',
			validating: 'glyphicon glyphicon-refresh'
		},
        fields: {
            Password2: {
                message: '原密码验证失败',
                validators: {
                    notEmpty: {
                        message: '原密码不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 18,
                        message: '密码长度必须在1到18位之间'
                    },
                }
            },
            Password1: {
                message: '新密码名验证失败',
                validators: {
                    notEmpty: {
                        message: '新密码不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 18,
                        message: '密码长度必须在1到18位之间'
                    },
                }
            },
            Password: {
                message: '密码验证失败',
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 18,
                        message: '密码长度必须在1到18位之间'
                    },
                }
            }
        }
    });
   
})
});
function changepassword() {
	//开启验证
	/* $('#modalFormId').data('bootstrapValidator').validate();
	if (!$('#modalFormId').data('bootstrapValidator').isValid()) {
		return;
	}
	*/
	$form = $('#formId'); 
	// Use Ajax to submit form data 提交至form标签中的action，result自定义
	$.post($form.attr('action'), $form.serialize(), function(data) {
		alert("成功修改密码")
		
		//do something...
		var data = eval(data);//解析jsonString成object
		console.log(data);
		var result = data;
		window.location.href="index.jsp"
		
	});

}


</script>
</head>
<body>
<div class="container-fluid jumbotron ">

		<div class="row">
			<div class="row col-md-6 col-md-offset-3" align="center">
				<p>
					<font size=7>修改密码界面</font>
				</p>
			</div>
		</div>
		<div class="row col-md-11">
			<form action="changeUserPasswordInfo" class="form-horizontal " method="post" id="formId">

				<div class="col-md-8 col-md-offset-2" style="margin-top: 60px">
						<div class="form-group">
							<label for="UserId" class="col-md-4 control-label"><span
								class="glyphicon glyphicon-star nessary"></span>原密码</label>
							<div class="col-md-8">
								<input type="password" class="form-control" name="Password1"
									id="PasswordId1">
							</div>
						</div>
						<div class="form-group">
							<label for="PasswordId" class="col-md-4 control-label"><span
								class="glyphicon glyphicon-star nessary"></span>新密码</label>
							<div class="col-md-8">
								<input type="password" class="form-control" name="Password2" id="PasswordId2">
							</div>
						</div>
						<div class="form-group">
							<label for="UserNameId" class="col-md-4 control-label"><span
								class="glyphicon glyphicon-star nessary"></span>确认密码</label>
							<div class="col-md-8">
								<input type="password" class="form-control" name="Password"
									id="PasswordId3">
							</div>
						</div>
						

						<div class="form-group" >
								<div style="margin-left: 500px">
								<button id="www" type="reset" class="btn btn-default">重置</button>
								<button id="saveBtn" type="button" class="btn btn-primary"
									onclick="changepassword()">保存</button>
								</div>	
						</div>
					</div>
					
			</form>
		</div>
	</div>

</body>
</html>