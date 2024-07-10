import { useEffect, useState } from 'react';
import { Card, Pagination, Row, Col } from 'antd';
import ButtonCustom from "../components/button";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useRouter } from "next/navigation";
import { useCookies } from "next-client-cookies";
import { useSelector, useDispatch } from "react-redux";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { getTestHistoryService } from '../common/services/userService';
import { historyApi } from '../common/interfaces/userInterface';
import { tabIndex } from '../common/util/constant';
import { queryParams, numQuestion, dateFormat } from '../common/util/constant';
import { convertDate } from '../common/util/functions';

const HistoryTest = ({
  tabId
}: Readonly<{
  tabId: number
}>) => {
  const router = useRouter();
  const cookies = useCookies();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const dispatch = useDispatch() as ThunkDispatch<any, any, any>;
  const histories: historyApi[] = useSelector((state: any) => state.user.historyData);
  const paginate = useSelector((state: any) => state.user.paginate);
  const page: number = 1;
  
  useEffect(() => {
    if (tabId == tabIndex.history) {
      if (!authenticationRouter(cookies) && isLogin) {
        router.push('/login');
      } else {
        getHistories(page);
      }
    }
  }, [tabId])

  const getHistories = (page: number) => {
    queryParams.page = page;
    dispatch(getTestHistoryService(queryParams));
  }

  const changePaginate = (page: any) => {
    getHistories(page);
  }

  const historyItem = () => {
    const item = histories.map((history) => {
      return (
        <Card
          className='history-item'
          key={history.id}
        >
          <Row>
            <Col className="gutter-row" span={6}>
              <div>
                <p className='uppercase font-bold'>{history.ctg_name}</p>
                <p>{history.ctg_desc}</p>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div>
                <p>{history.ctg_start_time}</p>
                <p>{history.ctg_end_time}</p>
              </div>
            </Col>
            <Col className="gutter-row" span={2}>
              <div>
                <p>Score:</p>
                <p>{history.score}/{numQuestion}</p>
              </div>
            </Col>
            <Col className="gutter-row" span={4}>
              <div>
                <p>Time Test:</p>
                <p>{history.test_time}</p>
              </div>
            </Col>
            <Col className="gutter-row" span={6}>
              <div className='flex justify-end'><ButtonCustom text={'Retest'} evClick={() => {}}/></div>
            </Col>
          </Row>
        </Card>
      )
    })
    return (<>{item}</>)
  }

  return (
    <>
      <div className='history-wrapper'>
        {historyItem()}
      </div>
      <Pagination
        defaultCurrent={page}
        total={paginate.total}
        pageSize={5}
        onChange={changePaginate}
      />
    </>
  )
}
export default HistoryTest;
