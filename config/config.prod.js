
module.exports = () => {
  const userConfig = {
    // web 登陆用户
    auth: {
      userName: 'test',
      userPassword: 'test',
    },
    // 因为家里有两台打印机，所以是一个数组
    printers: [ 'http://192.168.100.1:631/ipp/printer' ],
  };

  return {
    ...userConfig,
  };
};
