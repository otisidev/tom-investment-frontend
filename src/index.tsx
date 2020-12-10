import React, { Suspense } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";
// apollo client
import { ApolloProvider } from "@apollo/react-hooks";
import ApolloClient from "apollo-boost";

import { AppUrl } from "./context/App";
import { authService } from "./services/Authentication.Service";

// new instance of apollo client
const client = new ApolloClient({
    uri: AppUrl(),
    request: (operation) => {
        const token = authService.GetToken();
        operation.setContext({
            headers: {
                authorization: token ? `Bearer ${token}` : "",
            },
        });
    },
    onError: ({ networkError }) => {
        if (networkError) {
            networkError.message = "An error occurred! Check your internet connection and try again.";
        }
    },
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <Suspense fallback={null}>
            <Router>
                    <App />
            </Router>
        </Suspense>
    </ApolloProvider>,
    document.getElementById("app")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
