import dayjs from 'dayjs';

export const convertDate = (date: any, format: string) => {
  return dayjs(date, format);
}