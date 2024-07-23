"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from 'react-redux'
import { Image,Row, Col} from "antd";
import SignupForm from "./signupForm";
import SigninForm from "./siginForm";
import ButtonCustom from "@/app/components/button"
import { formType } from "@/app/common/util/constant";

const Login = () => {
  const router = useRouter();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const token = useSelector((state: any) => state.login.token);
  const [ visibleForm, setVisibleForm ] = useState(formType.SIGNIN as string);

  useEffect(() => {
    if (token && isLogin) {
      router.push('/top');
    } else {
      router.push('/login');
    }
  }, [token, isLogin])

  const AuthForm = () => {
    switch (visibleForm) {
      case formType.SIGNUP:
        return (
          <SignupForm/>
        );
      default:
        return (
          <SigninForm/>
        );
    }
  }
  return (
    <Row>
      <Col xs={24} sm={24} md={12}>
        <Image
          preview={false}
          src={`/asset/images/logo.png`}
          className="login-logo"
        />
        <div>
          <p className="text-center text-1">Welcome  back! <br/> Please login/Signup to your account.</p>
        </div>
        <AuthForm/>
        
        <ButtonCustom
          text={visibleForm == formType.SIGNIN ? 'Register now' : 'Login now'}
          type="link"
          evClick={() => {setVisibleForm(visibleForm == formType.SIGNIN ? formType.SIGNUP : formType.SIGNIN) }}
        />
      </Col>
      <Col xs={24} sm={24} md={12}>
        <Image
          preview={false}
          src={`/asset/images/banner_login.png`}
        />
      </Col>
    </Row>
  )
}

export default Login;
