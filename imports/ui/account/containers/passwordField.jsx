import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';

// Components
import TextField from 'material-ui/TextField';
import { slow, inputStyles, regexes } from '../helpers';

// Actions
import { updateAccountPassword, updateAccountPasswordInvalid } from '../../actions/account';

@autobind
class accountPassword extends Component {
  constructor() {
    super();

    this.state = {
      text: '',
      isValid: true,
      error: '',
    };
  }
  handleChangedPassword(event) {
    event.preventDefault();
    const { dispatch } = this.props;

    const minLength = 12;
    const maxLength = 32;
    const text = event.target.value;

    let isValid = true;
    let error = '';

    const passwordLength = text.length >= minLength && text.length <= maxLength;

    if(passwordLength) {
      const regex = regexes.password;
      isValid = regex.test(text);

      if(isValid) {
        // SUCCESS
        //
        dispatch(updateAccountPassword(text));

        error = '';
      } else {
        // FAIL
        dispatch(updateAccountPasswordInvalid(text));

        error = regexes.passwordError;
      }
    } else if(text.length === 0) {
      // FAIL
      isValid = false;
      dispatch(updateAccountPasswordInvalid(text));

      error = '';
    } else if(text.length < minLength) {
      // FAIL
      isValid = false;
      dispatch(updateAccountPasswordInvalid(text));

      error = `At least ${minLength} characters`;
    } else {
      // FAIL
      isValid = false;
      dispatch(updateAccountPasswordInvalid(text));

      const overMaxLength = text.length - maxLength;
      error = `${overMaxLength} over ${maxLength} characters`;
    }

    this.setState({ text, isValid, error });
  }
  render() {
    const styles = inputStyles.textField;
    const { error } = this.state;

    const title = 'Password';

    return (
      <TextField
        value={this.props.password}
        type="password"
        style={styles.field}
        hintText={title}
        floatingLabelText={title}
        errorText={error}
        floatingLabelStyle={styles.floatingLabel}
        floatingLabelFocusStyle={styles.floatingLabelFocus}
        underlineFocusStyle={styles.underlineStyle}
        errorStyle={styles.errorLabel}
        onChange={this.handleChangedPassword}
      />
    );
  }
}

accountPassword.propTypes = {
  dispatch: PropTypes.func,
};

function mapStoreToProps(store) {
  const { Account } = store;

  const { password } = Account || { password: '' };

  return { password };
}

export default connect(mapStoreToProps)(accountPassword);
