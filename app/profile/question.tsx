"use client"
import React, { useEffect, useState } from 'react';
import { Tree, Col, Row } from 'antd';
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { getCategoryTreeService, getQuestionTreeService } from "../common/services/categoryService";
import { tabIndex } from '../common/util/constant';
import { categoryTree } from '../common/interfaces/categoryInterface';
import QuestionEditForm from './questionEditForm';
import CategoryEditForm from './categoryEditForm';
import Loading from '../components/loading';

const ListQuestion = ({
  tabId
}: Readonly<{
  tabId: number
}>) => {
  const cookies = useCookies();
  const router = useRouter();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const [ treeCategory, setTreeCategory ] = useState([] as categoryTree[]);
  const [ nodeSelected, setNodeSelected ] = useState({} as any);
  const [ loading, setLoading ] = useState(false as boolean);

  useEffect(() => {
    if (tabId == tabIndex.question) {
      setNodeSelected({});
      if (!authenticationRouter(cookies) && isLogin) {
        router.push('/login');
      } else {
        setLoading(true);
        getCategories();
      }
    }
  }, [tabId])

  const getCategories = async () => {
    const categoriesData = await getCategoryTreeService();
    setTreeCategory(categoriesData);
    setLoading(false);
  }

  const getQuestions = async (cateId: number) => {
    return await getQuestionTreeService(cateId);
  }

  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(async (resolve) => {
      if (children && children.length > 0) {
        resolve();
        return;
      }
      let question = await getQuestions(key);
      const categoryIndex = treeCategory.findIndex((category) => category.id == key);
      if (categoryIndex >= 0) {
        treeCategory[categoryIndex].children = question;
      }
      resolve();
    }
  );

  const onSelectItem = (selectedKeys: any, e:{selected: boolean, selectedNodes: any, node: any, event: any}) => {
    setNodeSelected(e.node);
  }

  const categoryTree = () => {
    return (
      <Tree loadData={onLoadData} treeData={treeCategory} onSelect={onSelectItem}/>
    )
  };

  const editForm = () => {
    if (nodeSelected && nodeSelected.id) {
      if (nodeSelected.children) {
        return (<CategoryEditForm categoryId={nodeSelected.id} reloadPage={() => handleReloadPage()}/>);
      } else {
        return (<QuestionEditForm questionId={nodeSelected.id} reloadPage={() => handleReloadPage()}/>);
      }
    } else {
      return (<></>);
    }
  }

  const handleReloadPage = () => {
    getCategories();
  }

  return (
    <>
      <Row>
        <Col md={12} sm={24} xs={24} className='border-solid border-2 category-tree'>
          <Loading isLoading={loading} content={categoryTree()}></Loading>
        </Col>
        <Col md={12} sm={24} xs={24} className='border-solid border-2 category-tree'>{editForm()}</Col>
      </Row>
    </>
  )
}

export default ListQuestion;
