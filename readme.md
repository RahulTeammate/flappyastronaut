## Link to Game  
https://flappyastronaut.herokuapp.com/  

## How to Play  
1. When another player loads up the website after you do, the game will begin.  
2. For demonstration purposes, you can open up the game in two different browser windows, placed side-by-side.  
3. However, the game doesn't work properly if the game is open on 2 tabs of the same browser window. This is a fundemental limitation of Phaser, and cannot be fixed until Phaser implements support.  

## Future Improvements  
1. **Matchmaking** - If there is 1 player in Room 1 and 1 player in Room 2, I want to merge the players into 1 room. This will lower the amount of wait time.    
2. **Interpolation** - Interpolate or predict opponent movement to decrease lag on the client.  

## Information  
1. index.js is the node express server.  
2. client.js is the client that connects to the server, and controls server-game communication.  
3. game.js is the Phaser game.  
4. This game took 2 weeks to develop.  

## Template Credits  
https://github.com/gamecook/phaser-project-template  
https://developer.amazon.com/blogs/post/Tx3AT4I2ENBOI6R/intro-to-phaser-part-3-obstacles-collision-score-sound-and-publishing  

## Server Tutorial Credits  
http://shawnhymel.com/1148/getting-started-with-phaser-part-1-web-server/  
https://code.tutsplus.com/tutorials/real-time-chat-with-nodejs-socketio-and-expressjs--net-31708  

