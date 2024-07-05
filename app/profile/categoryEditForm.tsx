import { Button, DatePicker, Form, Input } from "antd";
import type { FormProps, GetProps } from 'antd';
import { updateCategory, getDetailCategory } from '@/app/common/services/categoryService'
import dayjs from 'dayjs';
import { useEffect, useState } from "react";
import { categoryForm, categoryApi } from "../common/interfaces/categoryInterface";
import { dateFormat } from "../common/util/constant";
import { useDispatch } from "react-redux";

type FieldType = {
  name: string;
  description?: string;
  startTime?: any;
  endTime?: any;
};

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const CategoryEditForm = ({
  categoryId,

  // Event
  reloadPage
}: Readonly<{
  className?: string;
  categoryId: number;
  reloadPage: any;
}>) => {
  const dispatch = useDispatch();
  const [form] = Form.useForm()
  const [category, setCategory] = useState({} as categoryForm)

  useEffect(() => {
    form.resetFields();
    if (categoryId) {
      getCategory();
    }
  }, [categoryId])

  useEffect(() => {
    if (category) {
      form.setFieldsValue({
        name: category.name,
        description: category.description,
        startTime: category.startTime ? dayjs(category.startTime, dateFormat.DATE) : '',
        endTime: category.startTime ? dayjs(category.endTime, dateFormat.DATE) : ''
      });
    }
  }, [category])

  const getCategory = async () => {
    const category: categoryApi = await getDetailCategory(categoryId);
    setCategory(
      {
        name: category.name,
        description: category.description,
        startTime: category.start_time,
        endTime: category.end_time,
      }
    )
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };
  
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    let dataPost = {
      name: values.name,
      description: values.description,
      start_time: values.startTime ? values.startTime.format('YYYY-MM-DD HH:mm:ss') : '',
      end_time: values.endTime ? values.endTime.format('YYYY-MM-DD HH:mm:ss') : ''
    };
  
    updateCategory(dataPost, categoryId);
    reloadPage();
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <>
      <Form
        form={form}
        name="category"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        labelAlign="left"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item<FieldType>
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please input category name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Description"
          name="description"
        >
          <Input />
        </Form.Item>

        <Form.Item<FieldType>
          label="Start Date"
          name="startTime"
        >
          <DatePicker disabledDate={disabledDate}/>
        </Form.Item>

        <Form.Item<FieldType>
          label="End Date"
          name="endTime"
        >
          <DatePicker disabledDate={disabledDate}/>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}

export default CategoryEditForm;
