export const getTokenFromCookie = () => {
  if (typeof document !== 'undefined') {
    let cookies = document.cookie.split(';');
    const tokenIndex = cookies.length - 1;
    let token = cookies && cookies[tokenIndex].split('=')[1] ? 'Bearer ' + cookies[tokenIndex].split('=')[1] : '';
    return token;
  } else {
    // Handle case when `document` is not defined, for example, in a Node.js environment
    return '';
  }
}