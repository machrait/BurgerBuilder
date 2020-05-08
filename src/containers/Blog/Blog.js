import React, { Component } from 'react';
import { Route, NavLink, Switch, Redirect } from 'react-router-dom';
import Posts from './Posts/Posts';
import asyncComponent from '../../hoc/asyncComponent';
import './Blog.css';

const AsyncNewPost = asyncComponent (() =>
{
	return import('./NewPost/NewPost');
});
class Blog extends Component 
{
    render () {
        return (
            <div className="Blog">
				<header>
					<nav>
						<ul>
							<li><NavLink 
									to="/posts/" 
									exact
									activeClassName="my-active"
									activeStyle={{
										color: '#fa923f',
										textDecoration: 'underline'
									}}>Posts</NavLink></li>
							<li><NavLink to={{
								pathname: "/new-post",
								hash: "#submit",
								search: "?quick-submit=true"
							}}>New Post</NavLink></li>
						</ul>
					</nav>
				</header>
				<Switch>
					<Route path="/new-post" component={AsyncNewPost}/>
					<Route path="/posts" component={Posts}/>
					{/*<Redirect from="/" to="/posts"/>*/}
					<Route render={() => <h1>Not Found</h1>}/>
				</Switch>
            </div>
        );
    }
}

export default Blog;
