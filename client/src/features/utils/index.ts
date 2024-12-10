import dayjs from "dayjs";

export const formatDateTime = (
  datetime: string,
  format = "MM-DD-YYYY h:mm A"
) => dayjs(datetime).format(format);
