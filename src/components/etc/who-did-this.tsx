import axiosInstance from '@/config/axios-global-setting';
import {SERVER_URL} from '@/etc/constant';
import {useEffect, useState} from 'react';

interface WhoDidThisProps {
  identifierNo: number | null;
  batchNameReplacement?: string;
}

export default function WhoDidThis({identifierNo, batchNameReplacement}: WhoDidThisProps) {
  const [author, setAuthor] = useState<string>('');
  useEffect(() => {
    if (!identifierNo) {
      setAuthor('-');
      return;
    }
    axiosInstance
      .get(SERVER_URL.API + 'adm/etc/author', {
        params: {identifierNo}
      })
      .then(({data: response}: { data: JsonResponseType }) => {
        if (!response.success) {
          alert(response.message);
          return;
        }
        let author =
          batchNameReplacement && (response.data.author === 'batch (batch@a-na.me)' || response.data.author === 'batch')
            ? batchNameReplacement
            : response.data.author;
        setAuthor(author);
      })
      .catch(console.error);
  }, [identifierNo]);

  return author;
}
