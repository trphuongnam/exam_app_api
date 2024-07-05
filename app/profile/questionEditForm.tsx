"use client"
import { Button, Select, Form, Input, Checkbox, Spin } from "antd";
import type { FormProps, CheckboxProps } from 'antd';
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { getCategorySelectService } from "../common/services/categoryService";
import { updateQuestion, getDetailQuestion } from "../common/services/questionService";
import { answerApi, postData } from "../common/interfaces/questionInterface";
import { questionApi } from "@/app/common/interfaces/questionInterface"

type FieldType = {
  name: string;
  description?: string;
  categoryId: number;
  multiple: boolean;
  answer_a: string;
  answer_b: string;
  answer_c: string;
  answer_d: string;
  correct: string;
};

const QuestionEditForm = ({
  questionId,
  reloadPage
}: Readonly<{
  className?: string;
  questionId: number;
  reloadPage: any;
}>) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [selected, setSelected] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [answerCorrect, setAnswerCorrect] = useState([] as string[]);
  const [initData, setInitData] = useState({} as any);
  const [loading, setLoading] = useState(false as boolean);
  const [answer, setAnswer] = useState([] as answerApi[]);
  const categories = useSelector((state: any) => state.category.categorySelect);
  const types = [
    { value: false, label: 'Single' },
    { value: true, label: 'Multiple' },
  ]

  useEffect(() => {
    setLoading(true);
    form.resetFields();
    if (questionId) {
      if (categories.length == 0) {
        dispatch(getCategorySelectService());
      }

      getQuestion();
    }
    setLoading(false);
  }, [questionId])

  useEffect(() => {
    if (initData) {
      form.setFieldsValue(initData);
      initData.categoryId ? setIsDisable(false) : setIsDisable(true);
    }
  }, [initData])

  useEffect(() => {
    selected ? setIsDisable(false) : setIsDisable(true);
  }, [selected])

  const getQuestion = async () => {
    const question: questionApi = await getDetailQuestion(questionId);
    setInitData(
      {
        categoryId: question.category_id,
        multiple: question.multiple == 1 ? "single" : "multiple",
        name: question.name,
        description: question.description,
        answer_a: question.answer[0].name,
        answer_b: question.answer[1].name,
        answer_c: question.answer[2].name,
        answer_d: question.answer[3].name,
      }
    )

    setAnswer(question.answer);

    let answerCorrect: string[] = [];
    question.answer.forEach((ans: answerApi) => {
      if (ans.correct == 1) {
        answerCorrect.push(ans.key);
      }
    })
    setAnswerCorrect(answerCorrect);
  }

  const answerItem = (label: string, name: any) => {
    return (
      <div className="answer-group">
        <Form.Item<FieldType>
          label={label}
          name={name}
          className="answer-group__input"
        >
          <Input disabled={isDisable}/>
        </Form.Item>
        <Checkbox.Group className={`${name}`} value={answerCorrect}>
          <Checkbox value={name} onChange={onChange}></Checkbox>
        </Checkbox.Group>
      </div>
    )
  }
  
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const listAnswer = [
      {id: answer[0].id, key: 'answer_a', name: values.answer_a, correct: answerCorrect.includes('answer_a') ? 1 : 2},
      {id: answer[1].id, key: 'answer_b', name: values.answer_b, correct: answerCorrect.includes('answer_b') ? 1 : 2},
      {id: answer[2].id, key: 'answer_c', name: values.answer_c, correct: answerCorrect.includes('answer_c') ? 1 : 2},
      {id: answer[3].id, key: 'answer_d', name: values.answer_d, correct: answerCorrect.includes('answer_d') ? 1 : 2},
    ];

    let dataPost: postData = {
      name: values.name,
      description: values.description,
      category_id: values.categoryId,
      multiple: values.multiple,
      answers: listAnswer,
      correct: JSON.stringify(answerCorrect)
    };

    updateQuestion(dataPost, questionId);
    reloadPage()
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const handleChange = (value: string) => {
    setSelected(value);
  }

  const onChange: CheckboxProps['onChange'] = (e) => {
    let correct = answerCorrect;
    if (e.target.checked) {
      if (correct.length > 0) {
        const exist = correct.find((item) => item == e.target.value);
        if (!exist) {
          correct.push(e.target.value);
        }
      } else {
        correct.push(e.target.value);
      }
    } else {
      correct = correct.filter((item) => item !== e.target.value);
    }

    setAnswerCorrect(correct);
  }

  const formEdit = () => {
    if (loading) {
      return (<Spin/>);
    } else {
      return (
        <Form
          form={form}
          name="question"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          labelAlign="left"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={initData}
        >
          <Form.Item<FieldType>
            label="Category"
            name="categoryId"
            rules={[{ required: true, message: 'Please input select category!' }]}
          >
            <Select
              onChange={handleChange}
              options={categories}
              allowClear
            />
          </Form.Item>

          <Form.Item<FieldType>
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please input answer name!' }]}
          >
            <Input disabled={isDisable}/>
          </Form.Item>

          <Form.Item<FieldType>
            label="Description"
            name="description"
          >
            <Input disabled={isDisable}/>
          </Form.Item>

          <Form.Item<FieldType>
            label="Type Answer"
            name="multiple"
          >
            <Select
              options={types}
              allowClear
            />
          </Form.Item>
          
          {answerItem('Answer A', 'answer_a')}
          {answerItem('Answer B', 'answer_b')}
          {answerItem('Answer C', 'answer_c')}
          {answerItem('Answer D', 'answer_d')}

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      )
    }
  }

  return (
    <>
      {formEdit()}
    </>
  );
}

export default QuestionEditForm;
