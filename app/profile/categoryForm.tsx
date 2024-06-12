import { Modal, Button, DatePicker, Form, Input } from "antd";
import type { FormProps, GetProps } from 'antd';
import { addCategory } from '@/app/common/services/categoryService'
import dayjs from 'dayjs';

type FieldType = {
  name: string;
  description?: string;
  startTime?: any;
  endTime?: any;
};

type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

const CategoryForm = ({
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
  const [form] = Form.useForm()

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
  
    addCategory(dataPost);
    onCloseForm();
  };
  
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const onCloseForm = () => {
    form.resetFields();
    evCancel()
  }

  return (
    <>
      <Modal
        title={'Add Category'}
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
      </Modal>
    </>
  );
}

export default CategoryForm;
