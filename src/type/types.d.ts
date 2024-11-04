type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

/**
 * kaisa-fo API 서버의 Json 응답 타입
 */
interface JsonResponseType {
  success: boolean;
  message: string;
  code: number;
  list: any[];
  data: Record<string, DataType>;
}

interface OptionType {
  [key: string]: string;
}

interface SelectBoxesPropsType {
  className?: string;
  emptyValue?: { label: string; value: string };
  value: number | '';
  setValue: (value: number | '') => void;
}
