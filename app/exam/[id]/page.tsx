"use client"
import { useEffect, useState } from "react";
import { useCookies } from "next-client-cookies";
import { authenticationRouter } from "@/app/common/util/functions/authenticationRouter";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { axiosRequest } from "@/app/connection";
import { Spin, Steps, Modal, Result } from "antd";
import ButtonCustom from "../../components/button";
import { getQuestionAction, setStartTest } from "@/app/stores/action/question";
import { SmileOutlined, ClockCircleOutlined } from "@ant-design/icons";
import { answerSelect } from "@/app/common/interfaces/questionInterface";
import { randomInt } from "crypto";

const Exam = () => {
  const router = useRouter();
  const cookies = useCookies();
  const dispatch = useDispatch();
  const params = useParams();
  const isLogin = useSelector((state: any) => state.login.isLogin);
  const question:any = useSelector((state: any) => state.question.questions);
  const [loading, setLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [point, setPoint] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEndTimeOpen, setIsModalEndTimeOpen] = useState(false);
  const [isModalResultOpen, setIsModalResultOpen] = useState(false);
  const [isModalStartOpen, setIsModalStartOpen] = useState(false);
  const [isModalAnswerSystemOpen, setIsModalAnswerSystemOpen] = useState(false);
  const [answerSelected, setAnswerSelected] = useState([] as answerSelect[]);
  const [selecting, setSelecting] = useState([] as string[]);
  const [timeTest, setTimeTest] = useState(10000);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/login');
    } else {
      getQuestionByCategory(params.id)
      setIsModalStartOpen(true)
    }
  }, [])

  useEffect(() => {
    if (!authenticationRouter(cookies) && isLogin) {
      router.push('/login');
    } else {
      if (isStart) {
        if (timeTest > 0) {
          timeOut
        } else {
          setIsModalEndTimeOpen(true)
        }
      }
    }
  }, [timeTest, isStart])

  const getQuestionByCategory = async (ctgName: any) => {
    setLoading(true);
    await axiosRequest.get('/questions?category='+ctgName).then((result) => {
      dispatch(getQuestionAction(Object.values(result.data)));
      setLoading(false);
    }).catch(() => {
      setLoading(false);
      return null;
    })
  }

  const onSelectAnswer = (answerKey: string, questionId: number, isMulti: string) => {
    if (isMulti == 'true') {
      handleSelectMultiAnswer(answerKey, questionId)
    } else {
      handleSelectSingleAnswer(answerKey, questionId)   
    }
  }

  const handleSelectMultiAnswer = (answerKey: string, questionId: number) => {    
    let answerIndex = getAnswerIndex(questionId);
    if (answerIndex < 0) {
      let keyAnswers: string[] = [];
      keyAnswers.push(answerKey);
      setSelecting(keyAnswers);
      let objAnswerSelect: answerSelect = {
        qId: questionId,
        aKey: keyAnswers,
        isCorrect: false,
        isMulti: true
      }
      answerSelected.push(objAnswerSelect);
    } else {
      debugger
      const isExitKey = answerSelected[answerIndex].aKey.find((item: string) => item == answerKey)
      if (!isExitKey) {
        answerSelected[answerIndex].aKey.push(answerKey);
      } else {
        const index = answerSelected[answerIndex].aKey.findIndex((item: string) => item == answerKey);
        answerSelected[answerIndex].aKey = answerSelected[answerIndex].aKey.slice(index, 1);
      }
    }
  
  }

  const handleSelectSingleAnswer = (answerKey: string, questionId: number) => {
    let keyAnswers: string[] = [];
    keyAnswers = [answerKey];
    setSelecting(keyAnswers);
    let objAnswerSelect: answerSelect = {
      qId: questionId,
      aKey: keyAnswers,
      isCorrect: false,
      isMulti: false
    }

    let answerCorrectKey = `${answerKey}_correct`;
    if (question[currentQuestion].correct_answers[answerCorrectKey] == "true") {
      objAnswerSelect.isCorrect = true;
    } else {
      objAnswerSelect.isCorrect = false;
    }
    let answerIndex = getAnswerIndex(questionId);
    if (answerIndex < 0) {
      answerSelected.push(objAnswerSelect);
    } else {
      answerSelected[answerIndex] = objAnswerSelect;
    }
  }

  const onChangeQuestion = (type: string) => {
    let a = currentQuestion
    if (type == 'next') {
      a = a+1;
      setCurrentQuestion(a)
    } else {
      a = a-1;
      setCurrentQuestion(a)
    }
    let answerIndex = getAnswerIndex(question[a].id);
    if (answerIndex >= 0) {
      setSelecting(answerSelected[answerIndex].aKey);
    } else {
      setSelecting([]);
    }
  }

  const onClickChangeQuestion = (value: number) => {
    setCurrentQuestion(value);
  }

  var timeOut = setTimeout(() => {if (timeTest > 0) setTimeTest(timeTest - 1)}, 1000)

  const handleOk = (type: string) => {
    switch (type) {
      case 'status':
        setIsModalOpen(false);
        setCurrentQuestion(currentQuestion + 1);
        break;
      case 'time':
        setIsModalEndTimeOpen(false);
        calcPoint();
        setIsModalResultOpen(true)
        break;
      case 'result':
        setIsModalResultOpen(false);
        router.push('/top')
        break;
      case 'start':
        setIsModalStartOpen(false);
        setIsStart(true)
        dispatch(setStartTest(true))
        timeOut
        break;
      case 'answer':
        setIsModalAnswerSystemOpen(false);
        break;
    }
  }

  const handleCancel = () => {
    router.push('/top');
  }

  const handleFinishTest = () => {
    clearTimeout(timeOut);
    calcPoint();
    setIsModalResultOpen(true);
  }

  const calcPoint = () => {
    const arrAnswerCorrect = answerSelected.filter((answer: answerSelect) => answer.isCorrect);
    setPoint(arrAnswerCorrect.length);
  }

  const getAnswerIndex = (questionId: number) => {
    return answerSelected.findIndex((answer: answerSelect) => answer.qId == questionId)
  }

  const showAnswers = () => {
    if (question[currentQuestion]) {
      return Object.keys(question[currentQuestion].answers).map((keyName, i) => {
        if (question[currentQuestion]?.answers[keyName]) {
          return (
            <ButtonCustom
              key={`question_${i}`}
              btnKey={`question_${i}`}
              text={`${i+1}. ${question[currentQuestion]?.answers[keyName]}`}
              className={selecting.includes(keyName) ? "question_answer text-left mb-2.5 selected" : "question_answer text-left mb-2.5"}
              evClick={() => onSelectAnswer(keyName, question[currentQuestion].id, question[currentQuestion].multiple_correct_answers)}
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
        items={question}
        onChange={onClickChangeQuestion}
      />
    )
  }

  const showAnswerSystem = () => {
    setIsModalAnswerSystemOpen(true);
  }

  const answerLink = () => {
    return (
      <>
        <ButtonCustom
          btnKey={`see_answer`}
          text={`See answer`}
          evClick={() => showAnswerSystem()}
        />
      </>
    )
  }

  const multiAnswer = (question: any) => {
    return question.multiple_correct_answers == 'true' ? '(Multiple answer)' : '';
  }

  const listAnswer = () => {
    return Object.keys(question).map((key, index) => {
      return (
        <div key={question[key].id}>
          <p className="qt_name" key={question[key].id}>{`Q${index + 1}: ${question[key].question} ${multiAnswer(question[key])}`}</p>
          <div className="flex direction-row">
            <div>
              {Object.keys(question[key].answers).map((aKey, i) => {
                if (question[key].answers[aKey]) {
                  return (
                    <p key={i} className={question[key].correct_answers[`${aKey}_correct`] == 'true' ? "ml-10 bg-green-500" : "ml-10"}>{`${i + 1}) ${question[key].answers[aKey]}`}</p>
                  )
                }
              })}
            </div>
            <div>
              {Object.keys(question[key].answers).map((aKey, i) => {
                if (question[key].answers[aKey]) {
                  return (
                    <p
                      key={i}
                      className={
                        answerSelected.find((answer: answerSelect) => answer.qId == question[key].id && answer.aKey.includes(aKey)) ? "ml-10 selected" : "ml-10"
                      }
                    >
                      {`${i + 1}) ${question[key].answers[aKey]}`}
                    </p>
                  )
                }
              })}
            </div>
          </div>
        </div>
      )
    })
  }

  const questionShow = () => {
    if (isStart) {
      return (
        <div>
          <div
            className="title_box"
          >
            <span className="text-3xl">{!loading ? `Q${currentQuestion + 1}: ${question[currentQuestion]?.question} ${multiAnswer(question[currentQuestion])}` : ''}</span>
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

  return (
    <>
      <h1 className="text-xl text-center p-2">Choose the question</h1>
      <Spin spinning={loading} fullscreen />
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
            subTitle={answerLink()}
          />
        </Modal>
        <Modal
          open={isModalStartOpen}
          onOk={() => handleOk('start')}
          onCancel={() => handleCancel()}
          maskClosable={false}
        >
          <Result
            title="Start the test?"
          />
        </Modal>
        <Modal title={'Result: '} open={isModalAnswerSystemOpen} onOk={() => handleOk('answer')} width={1000}>
          {listAnswer()}
        </Modal>
      </div>
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
