"use client"
import styled from "styled-components";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useSelector } from "react-redux";
import { Image } from "antd";
import ButtonCustom from "./components/button"
import { CaretDownOutlined } from "@ant-design/icons";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";

const Home = () => {
  const router = useRouter();
  const cookies = useCookies();

  const isLogin = useSelector((state: any) => state.login.isLogin);

  const handleClick = () => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/login')
    } else {
      router.push('/top')
    }
  }

  return (
    <WrapContent>
      <ContentLeft>
        <p className="title-1 leading-tight mb-7">Learn <br/>new concepts<br/>for each question</p>
        <SlogantText className="leading-tight mb-7 text-1">We help you prepare for exams and quizes </SlogantText>
        <ButtonsAction>
          <ButtonCustom
            text={'Start solving'}
            evClick={handleClick}
          />
          <ButtonCustom
            icon={<CaretDownOutlined />}
            type={'link'}
            text={'know more'}
          />
        </ButtonsAction>
      </ContentLeft>
      <BannerRight>
        <Image
          width={'100%'}
          src={`/asset/images/banner.png`}
          preview={false}
        />
      </BannerRight>
    </WrapContent>
  )
}

export default Home;

const WrapContent = styled.div`
  width: 100%;
  height: calc(100vh - 150px);
  display: flex;
`;

const ContentLeft = styled.div`
  width: 50%;
  height: 100%;
  padding-left: 150px;
  padding-top: 100px;
`;

const BannerRight = styled.div`
  width: 50%;
  height: 100%;
  padding-top: 25px;
`;

const SlogantText = styled.div`
  width: 100%;
  height: 30px;
  border-left: 1px solid #333333;
  padding-left: 20px;
  display: flex;
  align-items: center;
`;

const ButtonsAction = styled.div`
  width: 100%;
  height: 30px;
  padding-left: 20px;
  display: flex;
  align-items: center;
`;
