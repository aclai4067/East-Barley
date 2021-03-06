import React from 'react';
import firebase from 'firebase/app';
import 'firebase/auth';
import PropTypes from 'prop-types';
import {
  Button,
  Modal,
  Form,
  Input,
} from 'semantic-ui-react';
import './AgeVerificationModal.scss';

class AgeVerificationModal extends React.Component {
  state = {
    dateOfBirth: '',
  }

  static propTypes = {
    authed: PropTypes.bool,
    dobModalIsOpen: PropTypes.bool,
    verified: PropTypes.bool,
    setOver21: PropTypes.func,
    setDobModalIsOpen: PropTypes.func,
  }

  closeConfigShow = (closeOnEscape, closeOnDimmerClick) => () => {
    const { setDobModalIsOpen } = this.props;
    this.setState({ closeOnEscape: false, closeOnDimmerClick: false });
    setDobModalIsOpen(true);
  }

  changeDOB = (e) => {
    e.preventDefault();
    if (e.target.value.length < 8) {
      this.setState({ dateOfBirth: '' });
    }
    if (e.target.value.length >= 8) {
      this.setState({ dateOfBirth: e.target.value });
    }
  }

  calculateAge = () => {
    const today = new Date();
    const birthDate = new Date(this.state.dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age;
  };

  checkAge = (e) => {
    e.preventDefault();
    const { dateOfBirth } = this.state;
    const { setDobModalIsOpen, setOver21 } = this.props;
    if (dateOfBirth) {
      const age = this.calculateAge();
      if (age >= 21) {
        setOver21(true);
      } else {
        setOver21(false);
      }
      setDobModalIsOpen(false);
    }
  }

  loginClickEvent = (e) => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { setDobModalIsOpen } = this.props;
    firebase.auth().signInWithPopup(provider);
    setDobModalIsOpen(false);
  }

  render() {
    const {
      closeOnEscape,
      closeOnDimmerClick,
      dateOfBirth,
    } = this.state;
    const { dobModalIsOpen, authed } = this.props;

    return (
      <div>
        <Modal
          open={dobModalIsOpen}
          closeOnEscape={closeOnEscape}
          closeOnDimmerClick={closeOnDimmerClick}
        >
          <Modal.Header>You must be 21 to view our beverage selection</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>First Name</label>
                <Input type='date' id='dateOfBirth' value={dateOfBirth} onChange={this.changeDOB} required />
              </Form.Field>
              { (authed) ? [<Modal.Actions>
                <Button
                  onClick={this.checkAge}
                  type='submit'
                  labelPosition='right'
                  icon='calendar check outline'
                  content='Submit'
                  basic color='green'
                /></Modal.Actions>] : [<Modal.Actions>
                <Button
                  onClick={this.checkAge}
                  type='submit'
                  labelPosition='right'
                  icon='calendar check outline'
                  content='Submit'
                  basic color='green'
                />
                <Button
                  onClick={this.loginClickEvent}
                  type='submit'
                  labelPosition='right'
                  icon='hand point right outline'
                  content='Login'
                  basic color='blue'
                /></Modal.Actions>]
              }
             </Form>
          </Modal.Content>
        </Modal>
      </div>
    );
  }
}

export default AgeVerificationModal;
