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
<!-- jQuery文件。务必在bootstrap.min.js 之前引入 -->
<script src="dist/js/jquery-3.1.1.min.js"></script>
<!-- 最新的 Bootstrap 核心 JavaScript 文件 -->
<script src="dist/js/bootstrap.min.js"></script>
<script src="dist/js/bootstrapValidator.min.js"></script>
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
            AdminId: {
                message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },
                    stringLength: {
                        min: 1,
                        max: 18,
                        message: '用户名长度必须在1到18位之间'
                    },
                }
            },
            Password: {
                validators: {
                    notEmpty: {
                        message: '密码不能为空'
                    }
                }
            }
        }
    });
   
})
});
</script>
</head>
<body class="jumbotron">
	<div class="container-fluid  ">
		<div class="row"style="margin-top: 50px">
			<div class="col-md-8 col-md-offset-2">
				<p align=center>
					<font size=7>网上购物后台管理员系统</font>
				</p>
			</div>
		</div>
		<div class="row" style="margin-top: 100px">
			<div class="col-md-8 col-md-offset-2">
				<form id="formId" action="adminLogin" class="form-horizontal " method="post">
					<div class="form-group">
						<label for="nameId" class="col-md-3 control-label">用户名</label>
						<div class="col-md-6">
							<input type="text" class="form-control" name="AdminId" id="AdminId"
								placeholder="请输入用户名">
						</div>
					</div>
					<div class="form-group">
						<label for="ageId" class="col-md-3 control-label">密码:</label>
						<div class="col-md-6">
							<input type="password" name="Password" class="form-control" id="PasswordId"
								placeholder="请输入密码">
						</div>
					</div>
					<div class="form-group" style="margin-top: 80px">
						
						
					</div>
					<div class="form-group">

						<div class="col-md-3 col-md-offset-5">
							<button id="validateBtn" type="submit"
								class="btn btn-primary btn-inline example-p-1  ">  登录  </button>
							
						</div>
					</div>
				</form>
			</div>
			</div>	
	</div>
	


</body>
</html>