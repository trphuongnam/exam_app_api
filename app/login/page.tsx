"use client"
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from 'react-redux'

import { Image, Checkbox, Form, Input} from "antd";
import type { FormProps } from 'antd';
import ButtonCustom from "@/app/components/button"
import { LoginData } from "@/app/common/interfaces/loginInterface";
import { loginAction, tokenAction } from "../stores/action/login";
import { loginService } from "@/app/common/services/authService"

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const token = useSelector((state: any) => state.login.token);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const inputEmailRef = useRef(null as any);
  const inputPasswordRef = useRef(null as any);

  useEffect(() => {
    if (token && isLogin) {
      router.push('/top');
    } else {
      router.push('/login');
    }
  }, [token, isLogin])

  const onFinish: FormProps<LoginData>['onFinish'] = (values) => {
    setIsDisabled(false);
  };
  
  const onFinishFailed: FormProps<LoginData>['onFinishFailed'] = (errorInfo) => {
    setIsDisabled(false);
  };

  const handleSubmit = async () => {
    setIsDisabled(true);
    const inputEmail = inputEmailRef.current ? inputEmailRef.current.input.value : '';
    const inputPassword = inputPasswordRef.current ? inputPasswordRef.current.input.value : '';

    setEmail(inputEmail);
    setPassword(inputPassword);

    const data: LoginData = {
      'email': inputEmail,
      'password': inputPassword,
      'remember': remember
    }
    const result = await loginService(data);
    if (result) {
      dispatch(loginAction(result['success']));
      dispatch(tokenAction(result['token']));
      document.cookie = `token=${result['token']}`;
      router.push('/top');
    }
    setIsDisabled(false);
  }

  const LoginForm = () => {
    return (
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ maxWidth: 600, fontSize: 17 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout={'vertical'}
        className="login-form"
      >
        <Form.Item<LoginData>
          label="Email"
          name="email"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            value={email}
            ref={inputEmailRef}
          />
        </Form.Item>

        <Form.Item<LoginData>
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password value={password} ref={inputPasswordRef}/>
        </Form.Item>

        <Form.Item<LoginData>
          name="remember"
          valuePropName="checked"
          wrapperCol={{ offset: 0, span: 24 }}
        >
          <div>
            <Checkbox checked={remember} onChange={(ev: any) => {
              setRemember(ev.target.value)
              }}>Remember me</Checkbox>
            <ButtonCustom
              text={'Forgot Password?'}
              type="link"
            />
          </div>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 0, span: 16 }}>
          <ButtonCustom
            text={'Login'}
            className='mr-8'
            evClick={handleSubmit}
            isLoading={isDisabled}
          />
          <ButtonCustom
            text={'Signup'}
            isDisabled={isDisabled}
          />
        </Form.Item>
      </Form>
    )
  }
  return (
    <div className="grid grid-cols-2 gap-2 login-wrap">
      <div className="grid grid-rows gap-4">
        <Image
          preview={false}
          src={`/asset/images/logo.png`}
          className="login-logo"
        />
        <div>
          <p className="text-center text-1">Welcome  back! <br/> Please login/Signup to your account.</p>
        </div>
        <LoginForm/>
      </div>
      <div className="grid grid-rows-1">
        <Image
          preview={false}
          src={`/asset/images/banner_login.png`}
        />
      </div>
    </div>
  )
}

export default Login;
