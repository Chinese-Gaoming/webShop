package com.shop.service;

import java.util.List;

import com.shop.model.Admin;
import com.shop.model.Users;

public interface LoginService {
	public Users userLogin(Users user);
	public void register(Users user);
	public int deleteAdmin(String AdminId);
	public int deleteUser(String UserId);
	public int InsertAdmin(Admin Admin);
	public int changeAdminPassword(Admin Admin);
	public int changeUsersPassword(Users users);
	public Admin adminLogin(Admin admin);
	public List<Admin> adminManagerInfo();
	public List<Users> userManagerInfo();

}
