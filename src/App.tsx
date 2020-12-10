import React from "react";
import "./App.css";
import "./i18n";
import { Switch, Route } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import NotFound from "./pages/404";
import ForgotPassword from "./pages/ForgotPassword";

// import toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import SecuredRoute from "./components/SecuredRoute";
import AppAccount from "./pages/app-account/index";
import Verify from "./pages/Verify";
import NewPassword from './pages/NewPassword';

function App() {
    document.body.className = "app";
    return (
        <>
            <Switch>
                <Route exact path="/" component={Login} />
                <Route path="/create-account" component={CreateAccount} />
                <Route path="/forgot-password" component={ForgotPassword} />
                <SecuredRoute path="/app" component={AppAccount} />
                <Route path="/account/verify" component={Verify} />
                <Route path="/rest/new-password" component={NewPassword} />
                <Route component={NotFound} />
            </Switch>
            <ToastContainer position="top-center" />
        </>
    );
}

export default App;
