import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authService } from "../services/Authentication.Service";

interface IProp {
    component: any;
    path: string;
}

const AdminRoute: React.FC<IProp> = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            authService.IsAuthenticated() && authService.GetUser().admin ? (
                <Component {...props} />
            ) : (
                authService.Logout() && (
                    <Redirect
                        to={{
                            pathname: "/",
                            state: { from: props.location },
                            search: `?redirect=${props.location.pathname}`,
                        }}
                    />
                )
            )
        }
    />
);

export default AdminRoute;
