"use client";
import { Layout, Image } from "antd";
import MenuLayout from "./menu";
import styled from "styled-components";

const HeaderLayout = () => {
  const { Header } = Layout;

  return (
    <>
      <Header className="layout-header">
        <Image
          width={200}
          src={`/asset/images/QuizGrad.png`}
          preview={false}
        />
        <HeaderMenu>
          <MenuLayout></MenuLayout>
        </HeaderMenu>
      </Header>
    </>
  )
}

export default HeaderLayout;

const HeaderMenu = styled.div`
  width: 80%;
`;
