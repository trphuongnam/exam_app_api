"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getUserService } from "../common/services/userService";
import { Tabs, Upload } from 'antd';
import { UserOutlined, LineChartOutlined, UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import ButtonCustom from "../components/button";
import CategoryForm from "./categoryForm";
import QuestionForm from "./questionForm";
import ListQuestion from "./question";
import HistoryTest from "./historyTest";
import Loading from "../components/loading";
import { importQuestion } from "../common/services/questionService";
import { openNotification } from "../common/util/notification";
import { tabKeys, memberRole } from "../common/util/constant";

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
    {
      name: 'Info',
      key: tabKeys.info,
      role: memberRole.user
    },
    {
      name: 'Questions',
      key: tabKeys.question,
      role: memberRole.admin
    },
    {
      name: 'History',
      key: tabKeys.history,
      role: memberRole.user
    },
  ]
  
  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/auth');
    } else {
      dispatch(getUserService());
    }
  }, [])

  const tabContent = (key: string) => {
    switch (key) {
      case tabKeys.info:
        if (userData.length > 0 ) {
          return (
            <>
              <div className="mb-8">
                <p><span className="font-semibold min-w-12 w-12 inline-block">Name: </span>{userData[0].name}</p>
                <p><span className="font-semibold min-w-12 w-12 inline-block">Email: </span>{userData[0].email}</p>
                <p><span className="font-semibold min-w-12 w-12 inline-block">Role: </span>{userData[0].role == memberRole.admin ? 'Admin' : 'Member'}</p>
              </div>
              {buttonAction()}
            </>
          )
        }
      case tabKeys.question:
        return (<ListQuestion tabKey={tabKeys.question}/>)
      case tabKeys.history:
        return (<HistoryTest tabKey={tabKeys.history}/>)
      default:
        break;
    }
  }

  const buttonAction = () => {
    if (userData.length > 0 && userData[0].role == memberRole.admin) {
      return (
        <div className="profile-buttons">
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
        </div>
      )
    }
  }

  const tabWrapper = () => {
    if (userData.length > 0) {
      let tabMenu = tabs;
      if (userData[0].role != memberRole.admin) {
        tabMenu = tabMenu.filter((tab: {name: string, role: number}) => tab.role == memberRole.user)
      }
      return (
        <>
          <Tabs
            defaultActiveKey={String(tabKeys.info)}
            items={[...tabMenu].map((Icon, i) => {
              const id = String(i + 1);
              return {
                key: id,
                label: tabMenu[i].name,
                children: tabContent(tabMenu[i].key),
              };
            })}
          />
        </>
      )
    }
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
      <Loading isLoading={loading} content={tabWrapper()}></Loading>
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
