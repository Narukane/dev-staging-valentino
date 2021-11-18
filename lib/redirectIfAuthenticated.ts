const redirectIfAuthenticated = (res: any, cookies: any, page: string, lng: string) => {
  const auth = cookies.AUTH_KEY;
  const location = lng ? `/${lng}/${page}` : `/id/${page}`;

  if (auth) {
    res.writeHead(301, {
      Location: location
    });
    res.end();
  }
  
}

export default redirectIfAuthenticated;