"use client";
import { Layout, Image } from "antd";
import MenuLayout from "./menu";
import styled from "styled-components";
import { useRouter } from "next/navigation";
import Link from 'next/link'

const HeaderLayout = () => {
  const { Header } = Layout;
  const router = useRouter();

  return (
    <>
      <Header className="layout-header">
        <Link href="/">
          <Image
            width={200}
            src={`/asset/images/QuizGrad.png`}
            preview={false}
          />  
        </Link>
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
