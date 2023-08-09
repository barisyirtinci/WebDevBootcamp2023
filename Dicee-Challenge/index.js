var randomNumber1 = Math.floor(Math.random()*6+1);
var randomNumber2 = Math.floor(Math.random()*6+1);
var img1Src = "images/dice" + randomNumber1 + ".png" ;
var img2Src = "images/dice" + randomNumber2 + ".png" ;
document.querySelector(".img1").setAttribute("src",img1Src)
document.querySelector(".img2").setAttribute("src",img2Src)


const result = randomNumber1<randomNumber2 ? "Player2 Wins! 🚩": randomNumber1>randomNumber2 ? "🚩 Player1 Wins!": "Draw!";
document.querySelector("h1").textContent = result;