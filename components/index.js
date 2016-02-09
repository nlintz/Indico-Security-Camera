'use strict';
var $ = require('jquery');
var React = require('react');
var ReactDOM = require('react-dom');


function present_last_update(data) {
    var last_update = new Date(data.updatedAt);
    var diff = new Date().getTime() - last_update.getTime();
    var seconds = Math.floor((diff/1000));
    return seconds;
}

function sort_users(users) {
    return users.sort(function(a, b){
        if (a.p_at_door > b.p_at_door) {
            return -1;
        } else if (a.p_at_door < b.p_at_door) {
            return 1;
        } else {
            return 0;
        }
    });

}

function present_users(data) {
    var users = [];
    data.forEach(function(user){
        users.push({name:user.name, 
                       p_at_door:parseFloat(user.p_at_door)})
    })
    users = sort_users(users)
    return users;
}

var UserAPI = {
    getUsers: function(cb){
        $.get('/user', function(data){
            cb(present_users(data))
        })
    },

    getLastUpdate: function(cb){
        $.get('/last_update', function(data){
            cb(present_last_update(data))
        })
    }
}

var UserCard = React.createClass({
    render: function() {
        var img_url = "/img/"+this.props.user.name+".png";
        var card_class;
        var formatted_name;

        if (this.props.large) {
            card_class = "card";
        } else {
            card_class = "card medium";
        }

        if (this.props.user.name == "background") {
            formatted_name = "no one";
        } else {
            formatted_name = this.props.user.name;
        }

        var formatted_p_exists = this.props.user.p_at_door.toFixed(3);

        return (
            <div className={card_class}>
                <div className="card-image">
                    <img src={img_url} />
                </div>
                <div className="card-content card-content">
                    <span className="card-title activator grey-text text-darken-4">{formatted_name}</span>
                    <p>P({formatted_name}) = {formatted_p_exists}</p>
                </div>
            </div>
        )
    }
})
var UserProbas = React.createClass({
    render: function() {
        var userAtDoor = this.props.users[0];
        var otherUsers = this.props.users.slice(1)

        var otherUserCards = otherUsers.map(function(user){
            return (
                <div key={user.name} className="col s12 l3">
                    <UserCard user={user}/>
                </div>
            )
        });

        return (
            <div className="main-section">
                <div className="row">
                    <div className="col s12 l4 offset-l4">
                        <h3>Who is at the door?</h3>
                        <UserCard user={userAtDoor} large={true}/>
                    </div>
                </div>
                <div className="row">
                    <h3>Other Users</h3>
                    { otherUserCards }
                </div>
            </div>
        )
    }
});

var LastUpdate = React.createClass({
    render: function() {
        var formated_last_update = this.props.last_update;
        if (formated_last_update == "1") {
            formated_last_update += " second ago";
        } else {
            formated_last_update += " seconds ago";
        }
        return (
            <div className="row last-update-container">
                <div className="col s12 center">
                    <h4>Last Updated: {formated_last_update}</h4>
                </div>
            </div>
        )
    }
})

var SecurityCam = React.createClass({
    loadUsersFromServer: function() {
        UserAPI.getUsers(function(data){
            this.setState({
                users: data
            })
        }.bind(this))
    },
    loadLastUpdateFromServer: function() {
        UserAPI.getLastUpdate(function(data){
            this.setState({
                last_update: data
            })
        }.bind(this))
    },
    getInitialState: function() {
        return {users: [
                    {name: "luke", p_at_door: 0.0},
                    {name: "nathan", p_at_door: 0.0},
                    {name: "diana", p_at_door: 0.0},
                    {name: "slater", p_at_door: 0.0},
                    {name: "background", p_at_door: 0.0}
                    ],
                last_update: ""
                }
    },
    componentWillMount: function() {
        var socket = io();
        socket.on('user_update', function (data) {
            var user = JSON.parse(data);
            console.log(user)
            for (var i=0; i<this.state.users.length; i++) {
                if (this.state.users[i].name == user.name) {
                    console.log(user.p_at_door)
                    this.state.users[i].p_at_door = user.p_at_door;
                }
            }
            this.setState({users: sort_users(this.state.users)})
        }.bind(this));
        socket.on('last_update', function (data) {
            var seconds = present_last_update(JSON.parse(data))
            this.setState({last_update: seconds})
        }.bind(this));

        this.loadUsersFromServer();
        this.loadLastUpdateFromServer();

        setInterval(function(){
            this.setState({last_update: this.state.last_update + 1});
        }.bind(this), 1000)
    },

    render: function() {
        var users = this.state.users.map(function(obj){
            return (<li key={obj.name}>{obj.name}, {obj.p_at_door}</li>)
        })
        return (
            <div>
                <nav className="navigation blue darken-2">
                  <div className="nav-wrapper container">
                    <a href="#" className="brand-logo">Indico Security</a>
                  </div>
                </nav>

                <div className="container">
                    <UserProbas users={this.state.users} />
                    <LastUpdate last_update={this.state.last_update} />
                </div>
            </div>

        )
    }
})


ReactDOM.render(
    <SecurityCam />,
    document.getElementById('content')
);
