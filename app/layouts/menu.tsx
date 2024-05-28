"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "antd";
import type { MenuProps } from 'antd';
import { menus, loginMenu, logoutMenu } from '@/app/common/util/menu';
import { useCookies } from "next-client-cookies";
import store from "../stores/store";
import { useDispatch, useSelector } from 'react-redux'
import { loginAction } from "../stores/action/login";

const MenuLayout = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState('mail');
  const isLogin = useSelector((state: any) => state.login.isLogin)

  const onClick: MenuProps['onClick'] = (e) => {
    if (e.key !== 'logout') {
      router.push(e.key);
      setCurrent(e.key);
    } else {
      handleLogout();
    }
  };

  const handleLogout = () => {
    cookies.remove('token');
    dispatch(loginAction(false));
    router.push('/login');
  }

  const ListMenu = () => {
    let menuItem: MenuProps['items'] = menus;
    if (isLogin) {
      if (logoutMenu && menuItem) {
        menuItem = menuItem.concat(logoutMenu);
      }
      return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItem} />
      );
    } else {
      if (loginMenu && menuItem) {
        menuItem = menuItem.concat(loginMenu);
      }
      return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItem} />
      );
    }
  }

  return (
    <>
      {ListMenu()}
    </>
  )

}

export default MenuLayout;
