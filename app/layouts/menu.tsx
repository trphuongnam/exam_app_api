"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, Avatar, Modal } from "antd";
import { UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { menus, loginMenu, logoutMenu } from '@/app/common/util/menu';
import { useCookies } from "next-client-cookies";
import { useDispatch, useSelector } from 'react-redux'
import { loginAction } from "../stores/action/login";

const MenuLayout = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch();
  const [current, setCurrent] = useState('mail');
  const isLogin = useSelector((state: any) => state.login.isLogin)
  const isTestStarted = useSelector((state: any) => state.question.isStartTest)
  const [modalConfirmDisabled, setModalConfirmDisabled] = useState(false);
  const [eventMenu, setEventMenu] = useState({} as any);

  const onClick: MenuProps['onClick'] = (e) => {
    setEventMenu(e);
    if (isTestStarted) {
      setModalConfirmDisabled(true);
    } else {
      handleAction(e);
    }
  };

  const handleAction = (e: any) => {
    if (e.key !== 'logout') {
      router.push(e.key);
      setCurrent(e.key);
    } else {
      handleLogout();
    }
    setModalConfirmDisabled(false);
  }

  const handleLogout = () => {
    cookies.remove('token');
    dispatch(loginAction(false));
    router.push('/login');
  }

  const onClickProfile = () => {
    if (isTestStarted) {
      setModalConfirmDisabled(true);
    } else {
      router.push('/profile')
    }
  }

  const ListMenu = () => {
    let menuItem: MenuProps['items'] = menus;
    if (isLogin) {
      if (logoutMenu && menuItem) {
        menuItem = menuItem.concat(logoutMenu);
      }
      return (
        <div className="flex items-center justify-end">
          <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItem} style={{ flex: 1, minWidth: 0 }}/>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} className="cursor-pointer" onClick={onClickProfile}/>
        </div>
      );
    } else {
      if (loginMenu && menuItem) {
        menuItem = menuItem.concat(loginMenu);
      }
      return (
        <Menu onClick={onClick} selectedKeys={[current]} mode="horizontal" items={menuItem} style={{ flex: 1, minWidth: 0 }}/>
      );
    }
  }

  return (
    <>
      {ListMenu()}

      <Modal
        open={modalConfirmDisabled}
        onOk={() => handleAction(eventMenu)}
        onCancel={() => setModalConfirmDisabled(false)}
        maskClosable={false}
      >
        You want to exit the test
      </Modal>
    </>
  )

}

export default MenuLayout;
