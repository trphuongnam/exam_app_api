"use client";
import { Layout } from "antd";
import HeaderLayout from "./header"

const BaseLayout = ({
  childComponent,
}: Readonly<{
  childComponent: React.ReactNode;
}>) => {
  const { Content } = Layout;
  return (
    <>
      <HeaderLayout></HeaderLayout>
      <Content>
        {childComponent}
      </Content>
    </>
  )
}

export default BaseLayout;