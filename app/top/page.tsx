"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getCategoryService } from "../common/services/categoryService";
import { category } from "@/app/common/interfaces/categoryInterface";
import { Spin, Avatar, List, Skeleton } from "antd";
import ButtonCustom from "../components/button";
import InfiniteScroll from 'react-infinite-scroll-component';
import { CaretRightOutlined } from "@ant-design/icons";

const Top = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch() as ThunkDispatch<any, any, any>;
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const categories:category[] = useSelector((state: any) => state.category.categories);
  const paginate = useSelector((state: any) => state.category.paginate);
  const loading = useSelector((state: any) => state.category.isLoading);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/login');
    } else {
      getCategories();
    }
  }, [])

  const getCategories = (page: number = 1) => {
    dispatch(getCategoryService({page: page, numRow: 10}));
  }

  const startTest = (idTest: string) => {
    setIsDisabled(true)
    router.push('/exam/'+idTest)
  }

  const handleLoadMore = () => {
    if (paginate.currentPage < paginate.totalPage) {
      const page = parseInt(paginate.currentPage) + 1;
      getCategories(page);
    }
  }

  const testButton = (idTest: string) => {
    return (
      <ButtonCustom
        text="Test"
        btnKey={idTest}
        icon={<CaretRightOutlined />}
        evClick={() => startTest(idTest)}
        isLoading={isDisabled}
        isDisabled={isDisabled}
      />
    )
  }

  return (
    <>
      <h1 className="text-xl text-center p-2">Choose the category</h1>
      <div
        id="scrollableDiv"
        style={{
          height: 'calc(100vh - 200px)',
          maxHeight: 'calc(100vh - 200px)',
          overflow: 'auto',
          padding: '0 16px',
        }}
      >
        <InfiniteScroll
          dataLength={categories.length}
          next={()=>{handleLoadMore()}}
          hasMore={categories.length < paginate.total}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={categories}
            loading={loading}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`/asset/images/banner_login.png`} />}
                  title={item.name}
                  description={item.name}
                />
                <div>{testButton(item.id)}</div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  )
}

export default Top;
