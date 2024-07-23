"use client";
import { useState, useRef } from "react";
import { useDispatch } from 'react-redux'
import { useRouter } from "next/navigation";
import { Form, Input, Checkbox } from "antd";
import type { FormProps } from 'antd';
import ButtonCustom from "@/app/components/button"
import { LoginData } from "@/app/common/interfaces/authInterface";
import { loginAction, tokenAction } from "../stores/action/login";
import { loginService } from "@/app/common/services/authService";

const SigninForm = ({}: Readonly<{}>) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const inputEmailRef = useRef(null as any);
  const inputPasswordRef = useRef(null as any);


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
            evClick={() => {}}
          />
        </div>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 0}}>
        <ButtonCustom
          text={'Login'}
          className='mr-8 w-full text-center'
          evClick={handleSubmit}
          isLoading={isDisabled}
        />
      </Form.Item>
    </Form>
  )
}

export default SigninForm;
