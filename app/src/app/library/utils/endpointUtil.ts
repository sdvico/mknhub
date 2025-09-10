export const formatString = function (value: string, variables: { [key: string]: string }) {
  if (!value) {
    return '';
  }
  return value.replace(/(\{\w+\})|(:\w+)/g, function (match) {
    return variables[match.replace(/\{|\}|:/g, '')] || '';
  });
};
