import React from 'react';

function LoggedInName()
{
	
    var _ud = localStorage.getItem('user');
    var ud = JSON.parse(_ud);
    //var userId = ud.id;
    var firstName = ud.firstName;
    var lastName = ud.lastName;

    const doLogout = event => 
    {
	    event.preventDefault();

        localStorage.removeItem("user")
        window.location.href = '/';

    };    

  return(
   <div id="loggedInDiv">
   <span id="userName">Logged In As {firstName} {lastName}</span><br />
   <button type="button" id="logoutButton" 
     onClick={doLogout}> Log Out </button>
   </div>
  );

};

export default LoggedInName;
