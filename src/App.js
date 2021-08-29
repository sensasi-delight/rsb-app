import React, { useState } from "react";

import MainAppBar from "./component/MainAppBar";
import Detail from "./pages/project/Detail";
import List from "./pages/project/List";

import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import ProjectHelper from "./classes/ProjectHelper";

export default function App() {   
    const lsValue = localStorage.getItem(ProjectHelper.LsKey) || '[]';
    const [ projects, setProject ] = useState(() => JSON.parse(lsValue));
    const projectHelper = new ProjectHelper(projects, setProject)

    return (
        <div className="">
            <Router basename='rsb-app'>
                <MainAppBar/>
                <Switch>
                    <Route exact path="/">
                        <List projectHelper={projectHelper} />
                    </Route>
                    <Route exact path="/project/:projectName/">
                        <Detail projectHelper={projectHelper} />
                    </Route>

					<Route render={() => <Redirect to="/" />} />
                </Switch>
            </Router>
        </div>
    );
}
