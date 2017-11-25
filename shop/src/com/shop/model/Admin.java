package com.shop.model;

public class Admin {
	private String AdminId;
	private String Password;
	private String Name;
	private String zcsj;//出生时间
	private String remark;
	private String cjsj;//创建时间
	public String getAdminId() {
		return AdminId;
	}
	public void setAdminId(String adminId) {
		AdminId = adminId;
	}
	public String getPassword() {
		return Password;
	}
	public void setPassword(String password) {
		Password = password;
	}
	public String getName() {
		return Name;
	}
	public void setName(String name) {
		Name = name;
	}
	public String getZcsj() {
		return zcsj;
	}
	public void setZcsj(String zcsj) {
		this.zcsj = zcsj;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getCjsj() {
		return cjsj;
	}
	public void setCjsj(String cjsj) {
		this.cjsj = cjsj;
	}

}
