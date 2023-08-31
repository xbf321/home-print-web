module.exports = () => {
  const userConfig = {
    // web 登陆用户
    auth: {
      userName: 'test',
      userPassword: 'test',
    },
    cloudConvertAccessToken: 'token',
  };

  return {
    ...userConfig,
  };
};
