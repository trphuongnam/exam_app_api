import { Modal, Button, Select, Form, Input, Checkbox } from "antd";
import type { FormProps, CheckboxProps } from 'antd';
import { useEffect, useState } from "react";
import { ThunkDispatch } from "@reduxjs/toolkit";
import { useSelector, useDispatch } from "react-redux";
import { getCategorySelectService } from "../common/services/categoryService";
import { addQuestion } from "../common/services/questionService";
import { postData } from "../common/interfaces/questionInterface";

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

const QuestionForm = ({
  visible,
  className,
  maskClosable = false,
  //Event
  evOk,
  evCancel
}: Readonly<{
  visible: boolean;
  className?: string;
  maskClosable?: boolean;
  evOk?: any;
  evCancel?: any;
}>) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
  const [selected, setSelected] = useState('');
  const [isDisable, setIsDisable] = useState(true);
  const [answerCorrect, setAnswerCorrect] = useState([] as string[]);
  const categories = useSelector((state: any) => state.category.categorySelect);
  const types = [
    { value: false, label: 'Single' },
    { value: true, label: 'Multiple' },
  ]

  useEffect(() => {
    if (visible) {
      dispatch(getCategorySelectService());
    }
  }, [visible])

  useEffect(() => {
    selected ? setIsDisable(false) : setIsDisable(true);
  }, [selected])

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
        <Checkbox.Group className={`${name}`}>
          <Checkbox value={name} onChange={onChange}></Checkbox>
        </Checkbox.Group>
      </div>
    )
  }
  
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    const listAnswer = [
      {key: 'answer_a', name: values.answer_a, correct: answerCorrect.includes('answer_a') ? 1 : 0},
      {key: 'answer_b', name: values.answer_b, correct: answerCorrect.includes('answer_b') ? 1 : 0},
      {key: 'answer_c', name: values.answer_c, correct: answerCorrect.includes('answer_c') ? 1 : 0},
      {key: 'answer_d', name: values.answer_d, correct: answerCorrect.includes('answer_d') ? 1 : 0},
    ];

    let dataPost: postData = {
      name: values.name,
      description: values.description,
      category_id: values.categoryId,
      multiple: values.multiple,
      answers: listAnswer,
      correct: JSON.stringify(answerCorrect)
    };

    addQuestion(dataPost);
    onCloseForm();
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onCloseForm = () => {
    form.resetFields();
    setSelected('');
    evCancel();
  }

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

  return (
    <>
      <Modal
        title={'Add Question'}
        open={visible}
        onOk={evOk}
        onCancel={() => {onCloseForm()}}
        className={className}
        maskClosable={maskClosable}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Form
          form={form}
          name="category"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 19 }}
          labelAlign="left"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          initialValues={{
            ["categoryId"]: selected,
            ["multiple"]: "single"
          }}
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
              Create
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default QuestionForm;
