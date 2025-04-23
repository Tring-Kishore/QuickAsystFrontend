import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';


const getAccessToken = ()=> {
  const keys = Object.keys(localStorage);
  const tokenKey = keys.find((key) => key.endsWith(".idToken"));
  
  if (tokenKey) {
    return localStorage.getItem(tokenKey);
  }
  
  
  return null;
};

const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken();
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: from([authLink,httpLink]),
  cache: new InMemoryCache()
});

export default client;
