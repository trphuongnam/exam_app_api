export const getTokenFromCookie = () => {
  if (typeof document !== 'undefined') {
    let cookies = document.cookie.split(';');
    let token = cookies && cookies[0].split('=')[1] ? 'Bearer ' + cookies[0].split('=')[1] : '';
    return token;
  } else {
    // Handle case when `document` is not defined, for example, in a Node.js environment
    return '';
  }
}