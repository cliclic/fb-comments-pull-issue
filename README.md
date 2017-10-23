# FB new comments pull issue

Here is a basic app to reproduce our issue with comment pulling. The goal of this script is to get the new comments as they are published on Facebook.

I implemented two methods:

1 - asking to the Graph API for the x last comments every x seconds
2 - asking to the Graph API for the last comments since the last minute every x seconds

The two methods have the same result : the API doesn't send all the new comments.

We are using the method 2 since one year and we never noticed this kind of issue until last week.

Feel free to contact us : vivien@cliclic.tv or arsene@cliclic.tv

You can test with our appId : 552530084952430

we are using basic access tokens without particular permission

## start the project

You need nodejs LTS installed on your machine

in the project root directory : 
```
npm install
npm run start
```

To change the appId edit the line 43 on `/public/index.html`

Thanks ;)