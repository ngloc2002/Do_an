export const requestIGAuthorizationCodeUrl = shopId =>
    `https://www.instagram.com/oauth/authorize?client_id=164983153185304&redirect_uri=https://localhost:5000/auth-social/handle&scope=user_profile,user_media&response_type=code`;
