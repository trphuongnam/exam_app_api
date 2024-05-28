"use client";
import { Menu } from "antd";
import type { MenuProps } from 'antd';
import leftBarMenu from "../common/util/leftbar";

const LeftBar = () => {
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
  };

  return (
    <Menu
      onClick={onClick}
      style={{ width: 256 }}
      defaultSelectedKeys={['1']}
      defaultOpenKeys={['sub1']}
      mode="inline"
      className="leftbar"
      items={leftBarMenu}
    />
  )
}

export default LeftBar;
