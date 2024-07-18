import { Spin } from "antd";

const Loading = ({
  isLoading,
  content
}: Readonly<{
  isLoading: boolean;
  content: any;
}>) => {
  return (
    <Spin
      spinning={isLoading}
    >
      {content}
    </Spin>
  );
}

export default Loading;
