package com.shop.dao.impl;

import java.beans.Statement;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletResponse;

import net.sf.json.JSONArray;

import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.support.SqlSessionDaoSupport;
import org.springframework.stereotype.Component;

import com.shop.dao.LoginDao;
import com.shop.model.Admin;
import com.shop.model.Users;



@Component
public class LoginDaoImpl extends SqlSessionDaoSupport implements LoginDao{

	@Resource
	@Override
	public void setSqlSessionFactory(SqlSessionFactory sqlSessionFactory) {
		// TODO Auto-generated method stub
		super.setSqlSessionFactory(sqlSessionFactory);
	}
	@Override
	public Users userLogin(Users user) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.userLogin";
		Users users=session.selectOne(statement,user);
		return users;
		


	}
	@Override
	public void register(Users user) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.InsertUser";
		int users=session.insert(statement,user);
		System.out.println("用户改变了"+users+"行");
		
	}
	@Override
	public Admin adminLogin(Admin admin) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.adminLogin";
		Admin admins= session.selectOne(statement, admin);
		return admins;
	}
	@Override
	public List<Admin> adminManagerInfo() {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.adminManagerInfo";
		List<Admin> list=session.selectList(statement);
		return list;
		
	}
	@Override
	public int deleteAdmin(String AdminId) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.deleteAdmin";
		int result=session.delete(statement, AdminId);
		System.out.println("删除了"+result+"行");
		return result;
	}
	@Override
	public int InsertAdmin(Admin Admin) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.insertAdmin";
		int result=session.insert(statement, Admin);
		System.out.println("管理员改变"+result+"行");
		return result;
	}
	@Override
	public int changeAdminPassword(Admin Admin) {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.changePassword";
		int result =session.update(statement, Admin);
		return result;
	}
	@Override
	public List<Users> userManagerInfo() {
		// TODO Auto-generated method stub
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.userManagerInfo";
		List<Users> list=session.selectList(statement);
		return list;
	}
	@Override
	public int deleteUser(String UserId) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.deleteUser";
		int result=session.delete(statement, UserId);
		System.out.println("删除了"+result+"行");
		return result;
	}
	@Override
	public int changeUsersPassword(Users users) {
		SqlSession session=getSqlSession();
		String statement="com.shop.mapper.loginMapper.changeUsersPassword";
		int result =session.update(statement, users);
		return result;
	
	}
	

}
