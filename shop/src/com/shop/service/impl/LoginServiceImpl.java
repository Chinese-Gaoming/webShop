package com.shop.service.impl;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Component;

import com.shop.dao.LoginDao;
import com.shop.model.Admin;
import com.shop.model.Users;
import com.shop.service.LoginService;

@Component
public class LoginServiceImpl implements LoginService{
	@Resource
	private LoginDao loginDao;

	@Override
	public Users userLogin(Users user) {
		// TODO Auto-generated method stub
		
		
		return loginDao.userLogin(user);
	}

	@Override
	public void register(Users user) {
		// TODO Auto-generated method stub
		 loginDao.register(user);
	}

	@Override
	public Admin adminLogin(Admin admin) {
		// TODO Auto-generated method stub
		
		return loginDao.adminLogin(admin);
	}

	@Override
	public List<Admin> adminManagerInfo() {
		// TODO Auto-generated method stub
		return loginDao.adminManagerInfo();
	}

	@Override
	public int deleteAdmin(String AdminId) {
		// TODO Auto-generated method stub
		 return loginDao.deleteAdmin(AdminId);
	}

	@Override
	public int InsertAdmin(Admin Admin) {
		// TODO Auto-generated method stub
		return loginDao.InsertAdmin(Admin);
	}

	@Override
	public int changeAdminPassword(Admin Admin) {
		// TODO Auto-generated method stub
		return loginDao.changeAdminPassword(Admin);
	}

	@Override
	public List<Users> userManagerInfo() {
		// TODO Auto-generated method stub
		return loginDao.userManagerInfo();
	}

	@Override
	public int deleteUser(String UserId) {
		// TODO Auto-generated method stub
		return loginDao.deleteUser(UserId);
	}

	@Override
	public int changeUsersPassword(Users users) {
		// TODO Auto-generated method stub
		return loginDao.changeUsersPassword(users);
	}

}
