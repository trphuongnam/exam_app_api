"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getUserService } from "../common/services/userService";
import { Tabs, Spin, Upload } from 'antd';
import type { UploadProps } from 'antd';
import { UserOutlined, LineChartOutlined, UploadOutlined } from '@ant-design/icons';
import ButtonCustom from "../components/button";
import CategoryForm from "./categoryForm";
import QuestionForm from "./questionForm";


const Top = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const userData = useSelector((state: any) => state.user.userData);
  const loading = useSelector((state: any) => state.user.isLoading);
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [questionDialogVisible, setQuestionDialogVisible] = useState(false);
  
  const tabs = [
    'Info',
    'Chart'
  ]
  
  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/login');
    } else {
      dispatch(getUserService());
    }
  }, [])

  const tabContent = (index: number) => {
    switch (index) {
      case 0:
        if (userData.length > 0 ) {
          return (
            <>
              <div className="mb-8">
                <p><span className="font-semibold min-w-12 w-12 inline-block">Name: </span>{userData[0].name}</p>
                <p><span className="font-semibold min-w-12 w-12 inline-block">Email: </span>{userData[0].email}</p>
                <p><span className="font-semibold min-w-12 w-12 inline-block">Role: </span>{userData[0].role ? 'Admin' : 'Member'}</p>
              </div>
              {buttonAction()}
            </>
          )
        }
      default:
        break;
    }
  }

  const buttonAction = () => {
    return (
      <>
        <ButtonCustom
          text="Add Category"
          className="mr-3"
          evClick={() => {setCategoryDialogVisible(true)}}
        />
        {/* <Upload {...props}>
          <ButtonCustom
            text="Import Category"
            icon={<UploadOutlined/>}
          />
        </Upload> */}

        <ButtonCustom
          text="Add Question"
          className="mr-3"
          evClick={() => {setQuestionDialogVisible(true)}}
        />
        {/* <Upload {...props}>
          <ButtonCustom
            text="Import Question"
            icon={<UploadOutlined/>}
          />
        </Upload> */}
      </>
    )
  }

  const tabWrapper = () => {
    if (loading) {
      return (<Spin/>);
    }
    return (
      <Tabs
        defaultActiveKey="1"
        items={[UserOutlined, LineChartOutlined].map((Icon, i) => {
          const id = String(i + 1);
          return {
            key: id,
            label: tabs[i],
            children: tabContent(i),
            icon: <Icon />,
          };
        })}
      />
    )
  }

  const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
    },
  };

  const onImportCSV = () => {
    console.log('import question csv')
  }

  const onCancel = (type: string) => {
    if (type == 'category') {
      setCategoryDialogVisible(false);
    } else {
      setQuestionDialogVisible(false);
    }
  }

  return (
    <>
      {tabWrapper()}
      <CategoryForm
        visible={categoryDialogVisible}
        evCancel={() => {onCancel('category')}}
      />
      <QuestionForm
        visible={questionDialogVisible}
        evCancel={() => {onCancel('question')}}
      />
    </>
  )
}

export default Top;
