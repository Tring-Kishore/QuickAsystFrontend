const awsConfig = {
    aws_project_region: 'ap-south-1',
    aws_cognito_region: 'ap-south-1',
    aws_user_pools_id: process.env.REACT_APP_COGNITO_USER_POOL_ID,
    aws_user_pools_web_client_id: process.env.REACT_APP_COGNITO_CLIENT_ID,
    oauth: {
      domain: process.env.REACT_APP_COGNITO_DOMAIN,
      scope: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
      redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN,
      redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT,
      responseType: 'code'
    },
    federationTarget: 'COGNITO_USER_POOLS'
  };
  
  export default awsConfig;