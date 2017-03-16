import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {
    App,
    Login,
    Home,
    Article,
    SignUp,
    Editor,
    Category,
    CategoryConf,
    Search,
    NotFound
} from './containers';

export default (
    <Route path="/" component={App}>
        <IndexRoute component={Home}/>
        <Route path="/" component={Home}/>
        <Route path="article" component={Article}>
            <Route path=":id" component={Article}/>
        </Route>
        <Route path="category_conf" component={CategoryConf}/>
        <Route path="category" component={Category}>
            <Route path=":id" component={Category}/>
        </Route>
        <Route path="search" component={Search}>
            <Route path=":search" component={Search}/>
        </Route>
        <Route path="login" component={Login}/>
        <Route path="signup" component={SignUp}/>
        <Route path="editor" component={Editor}/>
        <Route path="*" component={NotFound} />
    </Route>
);