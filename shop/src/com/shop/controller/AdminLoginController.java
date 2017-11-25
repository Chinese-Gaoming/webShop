package com.shop.controller;

import java.io.IOException;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;




import org.springframework.web.bind.annotation.ResponseBody;

import com.shop.model.Admin;
import com.shop.model.Users;
import com.shop.service.LoginService;

@Controller
public class AdminLoginController {
	@Resource
	private LoginService loginService;
	
	
	/*管理员登录跳转后台首页 */
	@RequestMapping("/test")
	public String adminIndex() throws IOException{
		
		return "adminLoginIndex";
		
	}
	/*管理员跳转管理页 */
	@RequestMapping("/adminManager")
	public String adminManager() throws IOException{
		
		return "adminManager";
		
	}
	/*管理员跳转修改密码页 */
	@RequestMapping("/changeAdminPassword")
	public String changeAdminPassword() throws IOException{
		
		return "changePassword";
		
	}
	/*前台用户注册 */
	@RequestMapping(value="/InsertUser",method={RequestMethod.POST})
	@ResponseBody
	public  void register(Users user){
		
		loginService.register(user);
	}
	
	/*管理员登录 */
	@RequestMapping(value="/adminLogin",method={RequestMethod.POST})
	public String adminLogin(Admin admin,HttpServletRequest request,HttpServletResponse response) throws IOException{
		HttpSession session=request.getSession(true);
		Admin admins=loginService.adminLogin(admin);
		if(admins!=null){
			session.setAttribute("admin",admins);
			return "Overview";	
		}else{
			response.sendRedirect(request.getContextPath()+"/adminLogin.jsp");
		}
		return null;

}
	/*用户登录 */
	@RequestMapping(value="/userLogin",method={RequestMethod.POST})
	@ResponseBody
	public Users userLogin(Users user,HttpServletRequest request,HttpServletResponse response) throws IOException{
		HttpSession session=request.getSession(true);
		Users users=loginService.userLogin(user);
		if(users==null){
			users=new Users();
			
		}else{
			session.setAttribute("users",users);
		}
		return users;
		
	}
	@RequestMapping("/loginExit")
	@ResponseBody
	public String userExit(HttpServletRequest request,HttpServletResponse response) throws IOException{
		HttpSession session=request.getSession(true);
		System.out.println("111111");
		session.setAttribute("users", null);
		return "1";
		
		
	}
	@RequestMapping("/adminManagerInfo")
	@ResponseBody
	public List<Admin> adminManagerInfo(HttpServletRequest request,HttpServletResponse response) throws IOException{
		List<Admin> list=loginService.adminManagerInfo();
		
		return list;
	}
	@RequestMapping("/deleteAdmin")
	@ResponseBody
	public int deleteAdmin(String AdminId) throws IOException{
		
		return loginService.deleteAdmin(AdminId);
		
	}
	@RequestMapping("/deleteUser")
	@ResponseBody
	public int deleteUser(String UserId) throws IOException{
		
		return loginService.deleteUser(UserId);
		
	}
	@RequestMapping("/InsertAdmin")
	@ResponseBody
	public int insertAdmin(Admin Admin) throws IOException{
		
		return loginService.InsertAdmin(Admin);
		
	}
	@RequestMapping("/changeAdminPasswordInfo")
	@ResponseBody
	public int changeAdminPasswordInfo(Admin admins,HttpServletRequest request,HttpServletResponse response) throws IOException{
		Admin aa= (Admin) request.getSession().getAttribute("admin");
		admins.setAdminId(aa.getAdminId());
		return loginService.changeAdminPassword(admins);
		
	}
	@RequestMapping("/changeUserPasswordInfo")
	@ResponseBody
	public int changeUserPasswordInfo(Users users,HttpServletRequest request,HttpServletResponse response) throws IOException{
		Users users2= (Users) request.getSession().getAttribute("users");
		String UserId=users2.getUserId();
		users.setUserId(UserId);
		request.getSession().setAttribute("users", null);
		return loginService.changeUsersPassword(users);
		
	}
	@RequestMapping("/userManagerInfo")
	@ResponseBody
	public List<Users> userManagerInfo() throws IOException{
		return loginService.userManagerInfo();
		
	}

}
