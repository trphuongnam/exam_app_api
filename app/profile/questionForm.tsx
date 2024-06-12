import { Modal, Button, Select, Form, Input } from "antd";
import type { FormProps } from 'antd';
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
  
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    let dataPost: postData = {
      name: values.name,
      description: values.description,
      category_id: values.categoryId,
      multiple: values.multiple
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}

export default QuestionForm;
