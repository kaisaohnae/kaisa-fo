import dayjs from 'dayjs';

/**
 * <p>min-max 사이의 정수인 난수 생성</p>
 * <p>https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random</p>
 *
 * @param min 최솟값
 * @param max 최댓값
 * @returns {number} integer 최솟값에서 최댓값 사이의 난수 반환. 최댓값은 범위에서 제외하고 최솟값은 포함.
 */
export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

/**
 * 엑셀 다운로드용 블롭 데이터 옵션 타입
 */
interface DownloadFromBlobOptionsType {
  data: any;
  appendDateString?: boolean;
  fileName?: string;
  contentType?: string;
  extension?: string;
}

/**
 * 블롭 데이터를 파일로 다운로드
 *
 * @param data
 * @param appendDateString
 * @param fileName
 * @param contentType
 * @param extension
 */
export function downloadFromBlob({
                                   data = null,
                                   appendDateString = true,
                                   fileName = 'export',
                                   contentType = 'application/csv;charset=utf-8;',
                                   extension = '.xlsx'
                                 }: DownloadFromBlobOptionsType) {
  if (!data) {
    throw new Error('data is required');
  }
  let objectUrl = URL.createObjectURL(
    new Blob([data], {
      type: contentType
    })
  );
  let $a = window.document.createElement('a');
  $a.href = objectUrl;
  $a.setAttribute(
    'download',
    appendDateString ? `${fileName}_${dayjs().format('YYYY-MM-DD')}${extension}` : fileName
  );
  document.body.appendChild($a);
  $a.click();

  document.body.removeChild($a);
  window.URL.revokeObjectURL(objectUrl);
}

/**
 * 그리드 컬럼 설정에서 특정 컬럼의 헤더 이름을 교체
 *
 * @param gridColumns 그리드 컬럼 설정
 * @param field 교체할 필드 이름
 * @param replacement 이 이름으로 교체함
 */
export function replaceGridHeaderName(gridColumns: any[], field: string, replacement: string) {
  return gridColumns.map(column => {
    if (column.field === field) {
      return {
        ...column,
        headerName: replacement
      };
    }
    return column;
  });
}

/**
 * 그리드 컬럼 설정에서 특정 컬럼을 삭제
 *
 * @param gridColumns 그리드 컬럼 설정
 * @param field 삭제할 필드 이름
 */
export function deleteGridColumn(gridColumns: any[], field: string) {
  let idx = 0;
  gridColumns.find(column => {
    ++idx;
    return column.field === field;
  });
  return gridColumns.toSpliced(idx - 1, 1);
}

/**
 * 단체별 추가 정보 설정에 따라 그리드 컬럼 데이터를 수정
 *
 * @param gridColumns 그리드 컬럼 설정
 * @param addValueConfig 단체별 추가 정보 설정값
 * @param insertBeforeThisColumnName 새 컬럼을 이 컬럼 앞에 끼워넣음
 */
export function generateDynamicColumn(
  gridColumns: any[],
  addValueConfig: any[],
  insertBeforeThisColumnName: string
): any[] {
  const dynamicColumns = [...gridColumns];

  addValueConfig
    .filter(item => {
      return item.listDisplay;
    })
    .forEach((item, index) => {
      const dynamicColumn = {
        field: item.columnName,
        headerName: item.itemLabel,
        headerAlign: 'center',
        align: 'center',
        valueFormatter: null
      };

      if (item.itemType === 'checkbox' || item.itemType === 'radio') {
        dynamicColumn.valueFormatter = (value: any) => {
          if (value == null) {
            return;
          }
          const options = JSON.parse(item.options);
          const option = options.find((option: any) => option[value.toString()]);
          return option ? option[value.toString()] : value;
        };
      }

      const insertBeforeThisColumnIndex = dynamicColumns.findIndex(
        col => col.field === insertBeforeThisColumnName
      );
      dynamicColumns.splice(insertBeforeThisColumnIndex, 0, dynamicColumn);
    });

  return dynamicColumns;
}

/**
 * 문자열을 Base64로 인코딩하는 함수
 */
export function encodeStringToBase64(str: string) {
  // 문자열을 UTF-8로 인코딩하고, Base64로 인코딩
  return btoa(encodeURIComponent(str));
}

/**
 * File 객체를 읽어서 base64 값으로 반환
 *
 * @param file base64로 변환된 파일 내용
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        // Remove the data URL scheme prefix
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('FileReader result is not a string'));
      }
    };
    reader.onerror = error => reject(error);
  });
};

/**
 * 객체 얕은 복제
 *
 * @param targetObject 대상 객체
 * @param ignoreNull 이 값이 true일 때, 프로퍼티의 값이 null이면 복제본에 포함하지 않음
 */
export const shallowClone = (
  {
    targetObject,
    ignoreNull = false
  }: {
    targetObject: object;
    ignoreNull?: boolean;
  }
): object => {
  return Object.entries(targetObject).reduce((prev, cur) => {
    if (ignoreNull) {
      if (cur[1] === null) {
        return prev;
      }
    }
    prev[cur[0]] = cur[1];
    return prev;
  }, {});
};
