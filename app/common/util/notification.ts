import { notification } from 'antd';

export const openNotification = (title: string, content: string, errCode: number) => {
  switch (errCode) {
    case 200:
      notification.success({
        message: title,
        description: content,
      });
      break;
    case 500:
      notification.error({
        message: title,
        description: content,
      });
      break;
    default:
      notification.open({
        message: title,
        description: content,
      });
      break;
  }
};
