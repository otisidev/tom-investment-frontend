import React from "react";
import { Redirect, Route } from "react-router-dom";
import { authService } from "../services/Authentication.Service";

interface IProp {
    component: any;
    path: string;
}

const SecuredRoute: React.FC<IProp> = ({ component: Component, ...rest }) => (
    <Route
        {...rest}
        render={(props) =>
            authService.IsAuthenticated() ? (
                <Component {...props} />
            ) : (
                <Redirect
                    to={{
                        pathname: "/",
                        state: { from: props.location },
                        search: `?redirect=${props.location.pathname}`,
                    }}
                />
            )
        }
    />
);

export default SecuredRoute;
