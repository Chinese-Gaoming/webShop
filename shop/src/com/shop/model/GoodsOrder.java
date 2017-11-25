package com.shop.model;

public class GoodsOrder {
	private String DDH;
	private String GoodsId;
	private String GoodsName;
	private String SJ;
	private String ADDRESS;
	private String LXR;
	private String LXFS;
	private String ZT;
	private String FKZT;
	private String money;
	public String getFKZT() {
		return FKZT;
	}
	public void setFKZT(String fKZT) {
		FKZT = fKZT;
	}
	public String getDDH() {
		return DDH;
	}
	public void setDDH(String dDH) {
		DDH = dDH;
	}
	public String getSJ() {
		return SJ;
	}
	public void setSJ(String sJ) {
		SJ = sJ;
	}
	public String getADDRESS() {
		return ADDRESS;
	}
	public void setADDRESS(String aDDRESS) {
		ADDRESS = aDDRESS;
	}
	public String getLXR() {
		return LXR;
	}
	public void setLXR(String lXR) {
		LXR = lXR;
	}
	public String getLXFS() {
		return LXFS;
	}
	public void setLXFS(String lXFS) {
		LXFS = lXFS;
	}
	public String getZT() {
		return ZT;
	}
	public void setZT(String zT) {
		ZT = zT;
	}
	public String getGoodsId() {
		return GoodsId;
	}
	public void setGoodsId(String goodsId) {
		GoodsId = goodsId;
	}
	public String getMoney() {
		return money;
	}
	public void setMoney(String money) {
		this.money = money;
	}
	public String getGoodsName() {
		return GoodsName;
	}
	public void setGoodsName(String goodsName) {
		GoodsName = goodsName;
	}

}
