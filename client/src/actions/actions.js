// Entries Actions
export const FETCH_ENTRIES = 'FETCH_ENTRIES';
export const RECEIVE_ENTRIES = 'RECEIVE_ENTRIES';
export const REQUEST_ENTRIES = 'REQUEST_ENTRIES';

// User Actions
export const USER_SUBMIT_EMAIL = 'USER_SUBMIT_EMAIL';
export const RECEIVE_USER_INFO = 'RECEIVE_USER_INFO';

// SignUp Actions
export const CREATING_USER = 'CREATING_USER';
export const SIGN_UP_ERROR = 'SIGN_UP_ERROR';
export const USER_CREATED = 'USER_CREATED';
export const ACCOUNT_PAGE_SUBMIT = 'ACCOUNT_PAGE_SUBMIT';
export const PHONE_VERIFY_SUBMIT = 'PHONE_VERIFY_SUBMIT';
export const PHONE_PREFERENCES_SUBMIT = 'PHONE_PREFERENCES_SUBMIT';
export const VERIFYING_CODE = 'VERIFYING_CODE';
export const CODE_VERIFIED = 'CODE_VERIFIED';
export const CODE_ERROR = 'CODE_ERROR';

export function fetchEntries() {
  return dispatch => {
    dispatch(requestEntries());
    return fetch('/api/entries')
    // assuming that response is JSON
      .then(response => dispatch(receiveEntries(response)))
      .catch(error => console.error(error));
  }
}

function receiveEntries(entries) {
  return {
    type: RECEIVE_ENTRIES,
    entries: JSON.parse(entries),
    receivedAt: Date.now(),
    isFetching: false
  }
}

function requestEntries() {
  return {
    type: REQUEST_ENTRIES,
    isFetching: true
  }
}

export function userSubmitEmail(email) {
  return {
    type: USER_SUBMIT_EMAIL,
    email: email
  }
}

export function accountPageSubmit() {
  return {
    type: ACCOUNT_PAGE_SUBMIT
  }
}

export function phoneVerifySubmit() {
  return {
    type: PHONE_VERIFY_SUBMIT
  }
}

function creatingUser() {
  return {
    type: CREATING_USER
  }
}

function receiveUserInfo(userInfo) {
  return {
    type: RECEIVE_USER_INFO,
    id: userInfo.user_id,
    firstName: userInfo.firstName,
    lastName: userInfo.lastName,
    phone: userInfo.phone,
    password: userInfo.password
  }
}

function signUpError(error) {
  return {
    type: SIGN_UP_ERROR,
    errorMessage: error
  }
}

function userCreated() {
  return {
    type: USER_CREATED
  }
}

export function createUser(user) {
  let config = {
    method: 'POST',
    headers: {
      'Content-Type':'application/json'
    },
    body: JSON.stringify({
      firstName: user.firstName, 
      lastName: user.lastName, 
      phone: user.phone, 
      email: user.email, 
      password: user.password
    })
  }

  return (dispatch) => {
    dispatch(creatingUser());
    return fetch('/api/auth/signup', config)
      .then(response => {
        return response.json();
      })
      .then(responseJSON => {
        localStorage.setItem('id_token', responseJSON.token);
        dispatch(receiveUserInfo(responseJSON.user));
        dispatch(userCreated())
        dispatch(accountPageSubmit());
      })
      .catch(error => dispatch(signUpError(error)))
  }
}

function verifyingCode() {
  return {
    type: VERIFYING_CODE
  }
}

function codeVerified() {
  return {
    type: CODE_VERIFIED
  }
}

function codeError(error) {
  return {
    type: CODE_ERROR,
    error
  }
}

export function verifyPhoneCode(code) {
  let config = {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      authorization: 'Bearer ' + localStorage.getItem('id_token')
    },
    body: JSON.stringify({verificationCode: code})
  };

  return dispatch => {
    dispatch(verifyingCode());
    return fetch('/api/auth/verify', config)
      .then(response => {
        if (response.ok) {
          dispatch(codeVerified());
          dispatch(phoneVerifySubmit());
        } else {
          throw new Error('bad response from server at /api/auth/verify');
        }
      })
      .catch( error => { dispatch(codeError(error)) })
  }
}



