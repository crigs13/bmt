import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { messageUser, getMessages, getNotifications, clearNotification, eraseNotification } from '../../actions/messageActions.js';
import MessageForm from './MessageForm.jsx';
import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Visibility,
} from 'semantic-ui-react';

export const nameFromId = (id, users) => {
  for (var i = 0; i < users.length; i++) {
  	if (users[i].id === id) { return users[i].preferred_name; }
  }
}

const timeFromDate = date => {
  //const now = new Date();
  let hours = parseInt(date.slice(16, 18));
  let period = 'am'
  if (hours >= 12) {
  	period = 'pm';
  }
  if (hours > 12) {
  	hours = hours % 12;
  }
  if (hours === 0) {
  	hours = 12;
  }
  let minutes = date.slice(18, 21);
  return (hours + minutes + period);
};

class Messages extends Component {
  constructor(props) {
  	super(props);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.messageUserId !== this.props.messageUserId) {
      this.props.getMessages(this.props.userId, nextProps.messageUserId, this.props.company_id);
    }
    // check if notifications props different? 
    // if (nextProps.userId !== this.props.userId) {
    //   this.props.getNotifications(this.props.userId, this.props.company_id);
    // }
  }

  componentWillMount() {
  	//this.props.getMessages(this.props.userId, this.props.messageUserId);
    //this.props.getNotifications(this.props.userId, this.props.company_id);
  }

  render() {
    if (this.props.messageUserId) {
      return (<Container style={{ padding: '8em 0em' }}>
        <Grid container stackable divided>
          <Grid.Row>
            <Grid.Column width={6}>
              <Header as='h2'>Employees</Header>
              <List as='ul'>
                {this.props.users.map((user) => {
                  var notifications = this.props.notifications[user.id] ? ' MESSAGES!!' : '';
                  if (user.id !== this.props.userId) {
                    return (<List.Item as='li' key={user.id}><Button
                      value={user.id.toString()}
                      onClick={(e) => {
                        let userToMessage = parseInt(e.target.value, 10);
                        this.props.eraseNotification(this.props.userId, userToMessage, this.props.company_id);
                        this.props.messageUser(userToMessage);
                      }}
                      >{user.first_name + ' ' + user.last_name + notifications}</Button></List.Item>)
                }
                })}
              </List>
            </Grid.Column>
            <Grid.Column width={8}>
              <Header as='h2'>{nameFromId(this.props.userId, this.props.users)}'s messages with {nameFromId(this.props.messageUserId, this.props.users)}</Header>
              <List as='ul'>
                {this.props.messages.map((message, index) => {
                  if (message.name) {
                    return (<List.Item as='li' key={index}>{message.name + ', ' + timeFromDate(message.time)}<br />{message.message}</List.Item>)
                  } else {
                    return (<List.Item as='li' key={index}>{message}</List.Item>)
                  }
                })}
              </List>
              <Grid.Row>{/*trying to set in row below*/}
                <MessageForm />
              </Grid.Row>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>)
    } else {
      return (<Container style={{ padding: '8em 0em' }}>
        <Grid container stackable>
          <Grid.Row>
            <Grid.Column width={6}>
              <Header as='h2'>Employees</Header>
              <List as='ul'>
                {this.props.users.map((user) => {
                  var notifications = this.props.notifications[user.id] ? ' MESSAGES!!' : '';
                  if (user.id !== this.props.userId) {
                    return (<List.Item as='li' key={user.id}><Button 
                      value={user.id.toString()}
                      onClick={(e) => {
                        let userToMessage = parseInt(e.target.value, 10)
                        this.props.eraseNotification(this.props.userId, userToMessage, this.props.company_id);
                        this.props.messageUser(userToMessage);
                      }}
                      >{user.first_name + ' ' + user.last_name + notifications}</Button></List.Item>)
                }
                })}
              </List>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Container>) 
    }
  }
}


const mapStateToProps = state => ({
  users: state.users.users,
  username: state.users.user.username,
  userId: state.users.user.id,
  messages: state.messages.messages,
  messageUserId: state.messages.messageUserId,
  company_id: state.users.user.company_id,
  notifications: state.messages.notifications
});

export default withRouter(connect(mapStateToProps, { messageUser, getMessages, getNotifications, clearNotification, eraseNotification })(Messages));
