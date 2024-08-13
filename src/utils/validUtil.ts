/**
 * 문자열의 min max 체크
 */
const minmax = {
  validate(value: any, { min, max }: any) {
    return value.length >= min && value.length <= max;
  },
  params: ["min", "max"],
};

/**
 * 해당 값이 '사업자 번호' 형식에 맞는 문자열인지 여부를 반환한다.
 */
const bizno = {
  validate(value: any) {
    if (!value) return true;
    // 넘어온 값의 정수만 추츨하여 문자열의 배열로 만들고 10자리 숫자인지 확인합니다.
    if (value && value.match(/\d{1}/g).length != 10) {
      return false;
    }
    // 합 / 체크키
    var sum = 0,
      key = [1, 3, 7, 1, 3, 7, 1, 3, 5];
    // 0 ~ 8 까지 9개의 숫자를 체크키와 곱하여 합에 더합니다.
    for (var i = 0; i < 9; i++) {
      sum += key[i] * Number(value[i]);
    }
    // 각 8번배열의 값을 곱한 후 10으로 나누고 내림하여 기존 합에 더합니다.
    // 다시 10의 나머지를 구한후 그 값을 10에서 빼면 이것이 검증번호 이며 기존 검증번호와 비교하면됩니다.
    /*return 10 - ((sum + Math.floor((key[8] * Number(value[8])) / 10)) % 10) == Number(value[9]);*/
    return (
      (10 - ((sum + Math.floor((key[8] * Number(value[8])) / 10)) % 10)) % 10 ==
      Number(value[9])
    );
  },
};

/**
 * 해당 값이 '법인번호' 형식에 맞는 문자열인지 여부를 반환한다.
 */
const corno = {
  validate(value: any) {
    value = value.replace("-", "");
    if (value.length != 13) {
      return false;
    }
    var arr_regno = value.split("");
    var arr_wt = new Array(1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2);
    var iSum_regno = 0;
    var iCheck_digit = 0;
    for (var i = 0; i < 12; i++) {
      iSum_regno += eval(arr_regno[i]) * arr_wt[i];
    }
    iCheck_digit = 10 - (iSum_regno % 10);
    iCheck_digit = iCheck_digit % 10;
    if (iCheck_digit != arr_regno[12]) {
      return false;
    }
    return true;
  },
};

/**
 * 해당 값이 '주민등록번호' 형식에 맞는지 여부를 반환한다.
 * 주민등록번호 체크 (전자정부프레임워크 : http://www.egovframe.go.kr/wiki/doku.php?id=egovframework:rte:ptl:validation:add_rules_in_commons_validator)
 * Resident registration number
 */
const rrno = {
  validate(value: any) {
    if (!value) return true;
    var fmt = /^\d{6}[1234]\d{6}$/;
    if (!fmt.test(value)) {
      return false;
    }
    var birthYear = value.charAt(7) <= "2" ? "19" : "20";
    birthYear += value.substr(0, 2);
    var birthMonth = value.substr(2, 2) - 1;
    var birthDate = value.substr(4, 2);
    var birth = new Date(birthYear as any, birthMonth, birthDate);
    if (
      birth.getFullYear() % 100 != value.substr(0, 2) ||
      birth.getMonth() != birthMonth ||
      birth.getDate() != birthDate
    ) {
      return false;
    }
    var arrDivide = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
    var checkdigit = 0;
    for (var i = 0; i < value.length - 1; i++) {
      checkdigit += parseInt(value.charAt(i)) * arrDivide[i];
    }
    checkdigit = (11 - (checkdigit % 11)) % 10;
    if (checkdigit != value.charAt(12)) {
      return false;
    } else {
      return true;
    }
  },
};
/**
 * 해당 값이 '휴대폰번호' 형식에 맞는 문자열인지 여부를 반환한다.
 */
const phone = {
  validate(value: any) {
    if (!value) return true;
    var regExp = /^(?:(010-\d{4})|(01[1|6|7|8|9]-\d{3,4}))-(\d{4})$/;
    if (!regExp.test(value)) {
      return false;
    }
    return true;
  },
};
export default {
  minmax,
  bizno,
  corno,
  rrno,
  phone,
};
