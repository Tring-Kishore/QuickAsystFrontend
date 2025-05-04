import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';


const getAccessToken = () => {
  const keys = Object.keys(localStorage);
  const tokenKey = keys.find((key) => key.endsWith(".idToken"));
  if (tokenKey) {
    return localStorage.getItem(tokenKey);
  }
  return null;
};

const errorLink = onError(({ graphQLErrors }) => {
  let shouldLogout = false;

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.message.includes('JWTExpired')) {
        shouldLogout = true;
        break;
      }
    }
  }
  if (shouldLogout) {
    localStorage.clear();
    setTimeout(() => {
      window.location.href = '/signin';
    }, 2000);
  }
});
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
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
});

export default client;
