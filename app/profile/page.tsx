"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getUserService } from "../common/services/userService";
import { Tabs, Spin, Upload } from 'antd';
import { UserOutlined, LineChartOutlined, UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ButtonCustom from "../components/button";
import CategoryForm from "./categoryForm";
import QuestionForm from "./questionForm";
import ListQuestion from "./question";
import { importQuestion } from "../common/services/questionService";
import { openNotification } from "../common/util/notification";
import { tabIndex } from "../common/util/constant";

const Top = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const userData = useSelector((state: any) => state.user.userData);
  const loading = useSelector((state: any) => state.user.isLoading);
  const [categoryDialogVisible, setCategoryDialogVisible] = useState(false);
  const [questionDialogVisible, setQuestionDialogVisible] = useState(false);
  const [fileUpload, setFileUpload] = useState([] as any);
  
  const tabs = [
    'Info',
    'Questions',
    'History'
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
      case tabIndex.info:
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
      case tabIndex.question:
        return (<ListQuestion tabId={tabIndex.question}/>)
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
        <Upload
          accept=".xlsx"
          maxCount={1}
          onChange={onImportQuestion}
          listType="picture"
          className="upload-list-inline"
          defaultFileList={[...fileUpload]}
          onRemove={removeFile}
        >
          <ButtonCustom
            text="Import Question"
            icon={<UploadOutlined/>}
            evClick={() => {}}
            className="mr-3"
          />
        </Upload>
        <ButtonCustom
          text="Push"
          icon={<UploadOutlined/>}
          evClick={() => {startImportQuestion()}}
          className={fileUpload.length == 0 ? 'hidden' : 'block mt-3'}
        />
      </>
    )
  }

  const tabWrapper = () => {
    if (loading) {
      return (<Spin/>);
    }
    return (
      <Tabs
        defaultActiveKey={String(tabIndex.info)}
        items={[UserOutlined, QuestionCircleOutlined, LineChartOutlined].map((Icon, i) => {
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

  const onImportQuestion = (fileInfo: any) => {
    const fileName = fileInfo.file.name;
    let extention = fileName.split('.')[1];
    if (extention != 'xlsx') {
      openNotification('Import', 'File extention invalid', 500);
      return;
    }
    const fileData = {
      uid: 'question_xlsx',
      name: fileName,
      status: 'done',
      file: fileInfo.file.originFileObj,
    }
    setFileUpload([fileData]);
  }

  const startImportQuestion = () => {
    let formData = new FormData();
    console.log(fileUpload, 'fileupload')
    formData.append("file", fileUpload[0].file);
    importQuestion(formData);
    setFileUpload([]);
  }

  const removeFile = () => {
    setFileUpload([]);
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
