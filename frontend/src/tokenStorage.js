 const storeToken = function (token) {
  localStorage.setItem('token_data', token.JWT.accessToken);
  localStorage.setItem('user', JSON.stringify({
    id: token.id,
    firstName: token.firstName,
    lastName: token.lastName,
    username: token.username,
    email: token.email
  }));
}

 const retrieveToken = function () {
  var ud;
  try {
    ud = localStorage.getItem('token_data');
  }
  catch (e) {
    console.log(e.message);
  }
  return ud;
}

 const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch (error) {
    return null;
  }
}

export default {
  storeToken,
  retrieveToken,
  getUser
}