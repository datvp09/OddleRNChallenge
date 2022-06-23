export const formatNumber = (n, separate = ',') => {
  if (!n) {
    return '0';
  }
  let s = n.toString();
  const regex = /\B(?=(\d{3})+(?!\d))/g;
  let ret = s.replace(regex, separate);

  return ret;
};

export const welcomeText = () => {
  const today = new Date();
  const curHr = today.getHours();
  let time = 'evening';

  if (curHr < 12) {
    time = 'morning';
  } else if (curHr < 15) {
    time = 'afternoon';
  }
  return `Good ${time}!`;
};
