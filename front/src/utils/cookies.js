// cookies.js

// Function to set a cookie
const setCookie = (name, value, days) => {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };
  
  // Function to save an object to a cookie
  const saveObjectToCookie = (cookieName, object, days) => {
    const jsonString = JSON.stringify(object);
    setCookie(cookieName, jsonString, days);
  };
  
  // Function to get a cookie
  const getCookie = (name) => {
    const nameEQ = `${name}=`;
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === " ") c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  };
  
  // Function to read an object from a cookie
  const readObjectFromCookie = (cookieName) => {
    const jsonString = getCookie(cookieName);
    return jsonString ? JSON.parse(jsonString) : null;
  };
  
  // Function to delete a cookie
  const deleteCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  };
  
  export { saveObjectToCookie, readObjectFromCookie, deleteCookie };
  