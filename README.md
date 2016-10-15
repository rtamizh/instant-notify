# Instant Notify #
A simple push notification server for delivering instant (real-time) notification.

# Installation #
  1. clone this repository to your server or local
  2. Create a mysql database for this notification server (say instant-notify)
  3. change the database name, credentials and port number (default - 8000)
  4. install nodejs, npm
  5. run ``` npm install ```
  6. run ``` node_modules/db-migrate/bin/db-migrate up ```
  7. run ``` npm start ```

# Functioning #
  It's made in such a way that, one can create multiple app and users for those apps. So this notification has the ability to handle multiple applications notification.

  1. Initially you have to create app in this server.
  ``` curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: e16b5d64-4897-aa99-8d4f-bba3089fc745" -d 'name=testing' "http://localhost:8000/api/app/create" ```
  it will return a json response like
  ``` {
         "app_secret": "33122a7de9d0769465df4ea78ebf8b43",
         "message": "success"
      } ``` save the app_secret it somewhere to create user list for this app.

  2. Add users to the app in the notification server.
  ``` curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: 666c492d-afd5-fa57-ce41-1c4f3a2b8b5c" -d 'name=tamizh&password=password&app_secret=33122a7de9d0769465df4ea78ebf8b43' "http://localhost:8000/api/app/user/create" ```
  it will return a json response like 
  ``` {
         "user_secret": "11d4968c7da34f7220874368267a49c0",
         "message": "success"
      } ``` save the user_secret to send notification to a specific user

  3. If you want see the demo how it works, just open the file in example folder simple_notification.html. you will see ``` var notification = new Notification('dcec32f52d2ea188540de06f5042220e', 'http://localhost:8000'); ```. change the secret code by your created user_secret. and open the file in your browser. Make sure there is no error in the console. There are possibilities you might need to change the url in the line above mentioned (check port and url or ip address)

 4. Now the magic going to begin. create notification by
 ``` curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -H "Cache-Control: no-cache" -H "Postman-Token: 2e79a9b0-3d1c-f5b2-4928-d5e780f068df" -d 'app_secret=f5124f6871ba211cd75f56598258dbf6&user_secret=93ee843da719fa54b5a809b52a830a08&text=success&image=https://s-media-cache-ak0.pinimg.com/originals/0a/f4/2a/0af42ab3b37342b693626f86ac6ece96.jpg' "http://localhost:8000/api/app/notification/create" ```
  it will return a success response. and you will see the image and text you were added through curl is displayed in the browser. 

  5. It can handle multiple sessions of a user. So open the html file in different tabs. and run notification create curl request, that's it you will get the notification in all your tabs. 

  6. I know it's hard to work with curl request. so i have added the postman collection file (instant-notify.json) in example folder. import the file in postman, and you will get all three request in the postman.

  7. When you are developing in laravel, you can find my laravel package in the following link. 