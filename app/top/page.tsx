"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { getCategoryAction } from "../stores/action/category";
import { axiosRequest } from "@/app/connection";
import { category } from "@/app/common/interfaces/categoryInterface";
import { Spin, Avatar, Divider, List, Skeleton } from "antd";
import ButtonCustom from "../components/button";
import InfiniteScroll from 'react-infinite-scroll-component';
import { CaretRightOutlined } from "@ant-design/icons";

const Top = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const categories:category[] = useSelector((state: any) => state.category.categories);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/login');
    } else {
      getCategories();
    }
  }, [])

  const getCategories = async () => {
    setLoading(true);
    await axiosRequest.get('/categories').then((result) => {
      dispatch(getCategoryAction(Object.values(result.data)));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      return null;
    })
  }

  const startTest = (idTest: string) => {
    setIsDisabled(true)
    router.push('/exam/'+idTest)
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
      <Spin spinning={loading} fullscreen />
      <div
        id="scrollableDiv"
        style={{
          height: 'auto',
          maxHeight: 'calc(100vh - 100px)',
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={categories.length}
          next={()=>{}}
          hasMore={categories.length < 8}
          loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={categories}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={`/asset/images/banner_login.png`} />}
                  title={item.name}
                  description={item.name}
                />
                <div>{testButton(item.name)}</div>
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
    </>
  )
}

export default Top;
