"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Spin, Steps, Modal, Result, StepProps } from "antd";
import ButtonCustom from "../../components/button";
import { setStartTest } from "@/app/stores/action/question";
import { SmileOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { answerSelect } from "@/app/common/interfaces/questionInterface";
import { getQuestionCategoryService } from "@/app/common/services/questionService";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { finishTestService } from "@/app/common/services/testService"
import { testFinish } from "@/app/common/interfaces/testInterface";
import { questionApi } from "@/app/common/interfaces/questionInterface";
import Loading from "@/app/components/loading";

const Exam = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch();
  const dispatchThunk = useDispatch() as ThunkDispatch<any, any, any>;
  const params = useParams();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const question:questionApi[] = useSelector((state: any) => state.question.questions);
  const loading: boolean = useSelector((state: any) => state.question.loading);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [point, setPoint] = useState(0);
  const [isModalEndTimeOpen, setIsModalEndTimeOpen] = useState(false);
  const [isModalResultOpen, setIsModalResultOpen] = useState(false);
  const [isModalStartOpen, setIsModalStartOpen] = useState(false);
  const [selecting, setSelecting] = useState([] as number[]);
  const [timeTest, setTimeTest] = useState('00:00' as string);
  const [timeLimit, setTimeLimit] = useState(0);
  const [isStart, setIsStart] = useState(false);
  const [steps, setSteps] = useState([] as StepProps[]);
  const startText = 'Start the test?';
  const [answerSelected] = useState([] as answerSelect[]);

  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/auth');
    } else {
      setSteps([]);
      setSelecting([]);
      getQuestionByCategory(String(params.id))
      setIsModalStartOpen(true)
    }
  }, [])

  useEffect(() => {
    let step: StepProps[] = []
    if (question && question.length > 0) {
      question.forEach((item, index) => {
        step.push({
          className: String(item.id),
          status: index < 1 ? 'process' : 'wait',
        })
      });
      setSteps(step);
    }
  }, [question])

  const getQuestionByCategory = (ctgId: string) => {
    dispatchThunk(getQuestionCategoryService(ctgId))
  }

  const onSelectAnswer = (answerId: number, questionId: number, isMulti: number) => {
    if (isMulti == 2) {
      handleSelectMultiAnswer(answerId, questionId)
    } else {
      handleSelectSingleAnswer(answerId, questionId)   
    }
  }

  const handleSelectMultiAnswer = (answerId: number, questionId: number) => {    
    let answerIndex = getAnswerIndex(questionId);
    if (answerIndex < 0) {
      let idAnswers: number[] = [];
      idAnswers.push(answerId);
      setSelecting(idAnswers);
      let objAnswerSelect: answerSelect = {
        qId: questionId,
        answerId: idAnswers,
        isMulti: true
      }
      answerSelected.push(objAnswerSelect);
    } else {
      const isExitKey = answerSelected[answerIndex].answerId.find((item: number) => item == answerId)
      if (!isExitKey) {
        answerSelected[answerIndex].answerId.push(answerId);
      } else {
        const index = answerSelected[answerIndex].answerId.findIndex((item: number) => item == answerId);
        answerSelected[answerIndex].answerId = answerSelected[answerIndex].answerId.slice(index, 1);
      }
    }
  
  }

  const handleSelectSingleAnswer = (answerId: number, questionId: number) => {
    let idAnswers: number[] = [];
    idAnswers = [answerId];
    setSelecting(idAnswers);
    let objAnswerSelect: answerSelect = {
      qId: questionId,
      answerId: idAnswers,
      isMulti: false
    }

    let answerIndex = getAnswerIndex(questionId);
    if (answerIndex < 0) {
      answerSelected.push(objAnswerSelect);
    } else {
      answerSelected[answerIndex] = objAnswerSelect;
    }
  }

  const onChangeQuestion = (type: string) => {
    let a = currentQuestion;
    if (type == 'next') {
      a = a+1;
    } else {
      a = a-1;
    }
    setStepStatus(currentQuestion, a);
    setCurrentQuestion(a);
    setQuestionSelecting(a);
  }

  const onClickChangeQuestion = (value: number) => {
    setStepStatus(currentQuestion, value);
    setCurrentQuestion(value);
    setQuestionSelecting(value);
  }

  const setStepStatus = (currentStepIndex: number, targetStepIndex: number) => {
    // Set status for target question
    let step = [...steps];
    step[targetStepIndex].status = 'process';
    setSteps(step);

    // Set status for old question
    const oldQuestionId = parseInt(step[currentStepIndex].className!);
    const answerIndex = getAnswerIndex(oldQuestionId);
    if (answerIndex >= 0) {
      step[currentStepIndex].status = 'finish';
    } else {
      step[currentStepIndex].status = 'wait';
    }
  }

  var timeOut = setInterval(() => {
    if (timeLimit > 0) {
      var now = new Date().getTime();
      var distance = timeLimit - now;
        
      var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
      const strTime = (minutes < 10 ? '0' + minutes : minutes) + ":" + (seconds < 10 ? '0' + seconds : seconds);
      setTimeTest(strTime);
        
      if (distance < 0) {
        clearInterval(timeOut);
        handleFinishTest();
      }
    } else {
      clearInterval(timeOut);
    }
  }, 1000)

  const handleOk = (type: string) => {
    switch (type) {
      case 'status':
        setCurrentQuestion(currentQuestion + 1);
        break;
      case 'time':
        setIsModalEndTimeOpen(false);
        handleFinishTest();
        setIsModalResultOpen(true)
        break;
      case 'result':
        setIsModalResultOpen(false);
        router.push('/top')
        break;
      case 'start':
        setIsModalStartOpen(false);
        if (question.length > 0) {
          setIsStart(true);
          dispatch(setStartTest(true));
          setTimeLimit(new Date().getTime() + 600000);
          timeOut;
        } else {
          router.push('/top');
        }
        break;
    }
  }

  const handleCancel = () => {
    router.push('/top');
  }

  const handleFinishTest = async () => {
    clearInterval(timeOut);
    const categoryId = parseInt(String(params.id));
    const result: testFinish | null = await finishTestService(answerSelected, categoryId);
    if (result) {
      setPoint(result['score']);
    }

    setIsModalResultOpen(true);
  }

  const setQuestionSelecting = (index: number) => {
    let answerIndex = getAnswerIndex(question[index].id);
    if (answerIndex >= 0) {
      setSelecting(answerSelected[answerIndex].answerId);
    } else {
      setSelecting([]);
    }
  }

  const getAnswerIndex = (questionId: number) => {
    return answerSelected.findIndex((answer: answerSelect) => answer.qId == questionId)
  }

  const showAnswers = () => {
    if (question[currentQuestion]) {
      return Object.keys(question[currentQuestion].answer).map((index) => {
        const i = parseInt(index);
        if (question[currentQuestion]?.answer[i]) {
          return (
            <ButtonCustom
              key={`question_${i}`}
              btnKey={`question_${i}`}
              text={`${i + 1}. ${question[currentQuestion]?.answer[i].name}`}
              className={selecting.includes(question[currentQuestion]?.answer[i].id) ? "question_answer text-left mb-2.5 selected" : "question_answer text-left mb-2.5"}
              evClick={() => onSelectAnswer(question[currentQuestion]?.answer[i].id, question[currentQuestion].id, question[currentQuestion].multiple)}
            />
          )
        }
      })
    } else {
      return <></>
    }
  }

  const questionProgress = () => {
    return (
      <Steps
        size="default"
        current={currentQuestion}
        items={steps}
        onChange={onClickChangeQuestion}
      />
    )
  }

  const multiAnswer = (question: any) => {
    return question.multiple == 'true' ? '(Multiple answer)' : '';
  }

  const questionShow = () => {
    if (isStart) {
      return (
        <div>
          <div
            className="title_box"
          >
            <span className="question_title">{!loading ? `Q${currentQuestion + 1}: ${question[currentQuestion]?.name} ${multiAnswer(question[currentQuestion])}` : ''}</span>
          </div>
          <div
            key={'question_' + currentQuestion}
            className={"flex flex-col " + 'question_' + currentQuestion}
          >
            {showAnswers()}
          </div>
        </div>
      )
    }
  }
  
  const questionArea = () => {
    return (
      <div
        id="scrollableDiv"
        style={{
          overflow: 'auto',
          padding: '0 16px',
        }}
      >
        {questionProgress()}
        {questionShow()}
        <Modal open={isModalEndTimeOpen} onOk={() => handleOk('time')}>
          <Result
            icon={<ClockCircleOutlined />}
            status="warning"
            title="You have end time"
          />
        </Modal>
        <Modal open={isModalResultOpen} onOk={() => handleOk('result')}>
          <Result
            icon={<SmileOutlined />}
            status="warning"
            title={`Your point is: ${point} / 20`}
          />
        </Modal>
        <Modal
          open={isModalStartOpen}
          onOk={() => handleOk('start')}
          onCancel={() => handleCancel()}
          maskClosable={false}
          okButtonProps={{ disabled: loading, loading: loading }}
        >
          <Result
            title={startText}
          />
        </Modal>
      </div>
    )
  }

  return (
    <>
      <h1 className="text-xl text-center p-2">Choose the question</h1>
      <Loading isLoading={loading} content={questionArea()} />
      <div className="action_button flex justify-between item-center mt-5">
        <ButtonCustom
          btnKey={`prev`}
          text={`Previous`}
          className="btn_prev"
          isDisabled={currentQuestion <= 0}
          evClick={() => onChangeQuestion('prev')}
        />
        <div className="clock_time">
          <span className="time_number">{timeTest}</span>
        </div>
        <ButtonCustom
          btnKey={`next`}
          text={`Next`}
          className="btn_next"
          isDisabled={currentQuestion == (Object.keys(question).length - 1)}
          evClick={() => onChangeQuestion('next')}
        />
        <ButtonCustom
          btnKey={`finish`}
          text={`Finish`}
          className="btn_finish"
          evClick={() => handleFinishTest()}
        />
      </div>
    </>
  )
}

export default Exam;
