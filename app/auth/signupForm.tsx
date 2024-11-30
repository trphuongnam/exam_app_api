"use client";
import { Form, InputNumber, Col, Row } from "antd";
import ButtonCustom from "@/app/components/button";
import InputComponent from "../components/input";
import InputPassword from "../components/inputPassword";
import { SignupData } from "@/app/common/interfaces/authInterface";
import { useState, useRef } from "react";
import { signupService } from "@/app/common/services/authService";
import { useRouter } from "next/navigation";
import { formType } from "../common/util/constant";

const SignupForm = ({
  onChangeForm
}: Readonly<{
  onChangeForm: Function
}>) => {
  const router = useRouter();
  const [email, setEmail] = useState('' as string);
  const [name, setName] = useState('' as string);
  const [password, setPassword] = useState('' as string);
  const [age, setAge] = useState(0 as number);

  const inputNameRef = useRef(null as any);
  const inputEmailRef = useRef(null as any);
  const inputPasswordRef = useRef(null as any);
  const inputAgeRef = useRef(null as any);
  const [isDisabled, setIsDisabled] = useState(false);


  const onFinish = () => {
    setIsDisabled(false);
  }

  const onFinishFailed = () => {
    setIsDisabled(false);
  }

  const handleSubmit = async () => {
    setIsDisabled(true);
    const inputName = inputNameRef.current ? inputNameRef.current.input.value : '';
    const inputAge = inputAgeRef.current ? parseInt(inputAgeRef.current.ariaValueNow) : 0;
    const inputEmail = inputEmailRef.current ? inputEmailRef.current.input.value : '';
    const inputPassword = inputPasswordRef.current ? inputPasswordRef.current.input.value : '';

    setEmail(inputEmail);
    setPassword(inputPassword);

    const data: SignupData = {
      'name': inputName,
      'email': inputEmail,
      'password': inputPassword,
      'age': inputAge,
    }
    const result = await signupService(data);
    if (result) {
      router.push('/top');
    }
    setIsDisabled(false);
  }

  return (
    <>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 24 }}
        style={{ fontSize: 17 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout={'vertical'}
        className="login-form"
      >
        <Row>
          <Col sm={24} xs={24} md={12} className="pr-2">
            <Form.Item<SignupData>
              label="Name"
              name="name"
              rules={[{ required: true, message: 'Please input your name!' }]}
            >
              <InputComponent
                value={name}
                refs={inputNameRef}
              />
            </Form.Item>
          </Col>
          <Col sm={24} xs={24} md={12} className="pl-2">
            <Form.Item<SignupData>
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
            >
              <InputComponent
                value={email}
                refs={inputEmailRef}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} xs={24} md={12} className="pr-2">
            <Form.Item<SignupData>
              label="Age"
              name="age"
              rules={[{ required: true, message: 'Please input your age!' }]}
            >
              <InputNumber
                value={age}
                ref={inputAgeRef}
                size={"large"}
              />
            </Form.Item>
          </Col>
          <Col sm={24} xs={24} md={12} className="pl-2">
            <Form.Item<SignupData>
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
            >
              <InputPassword value={password} refs={inputPasswordRef}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col sm={24} xs={24} md={24}>
            <Form.Item wrapperCol={{ offset: 0}}>
              <ButtonCustom
                text={'Signup'}
                className='mr-8 w-full text-center bold'
                evClick={handleSubmit}
                isLoading={isDisabled}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <ButtonCustom
        text={'Login now'}
        type="link"
        evClick={() => {onChangeForm(formType.SIGNUP) }}
      />
    </>
  )
}

export default SignupForm;
