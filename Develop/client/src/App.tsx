// client/src/App.tsx
import React from 'react';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

// Placeholder components
const Home = () => <div>Home Page</div>;
const Login = () => <div>Login Page</div>;
const Signup = () => <div>Signup Page</div>;
const Profile = () => <div>Profile Page</div>;
const Navbar = () => <div>Navbar</div>;

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: '/graphql',
});

// Set up middleware to include the authorization token in requests
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('id_token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Configure Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" element={<React.Fragment><Home /></React.Fragment>} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
        </Switch>
      </Router>
    </ApolloProvider>
  );
};

export default App;
