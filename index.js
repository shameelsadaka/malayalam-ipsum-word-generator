/*
  Title : Malayalam dummy word generate.
  Description : This program will generate a set of meaningless ( not 100% ) words which have a similar malayalam words look
  Developer : Shameel Kadannamanna ( shameelsadaka.github.io )
  GitHub : https://github.com/shameelsadaka/malayalam-ipsum-word-generator
*/

/* Importing and setting required modules */
const express = require('express')
const app = express()
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))


/* Function to replace a character at a position of string */
String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

// Core Datas
vyanjaSwarams = [3381,3376,3375,8205];

function splitToMalayalamLetters(w){
  var wa = []; // Array of splitted letters

  var w,wl,j,l,lcode,k,wa = [],fullLetter = '',next2Lets;

  j = 0;

  // // Splitting the sentance into words and words into letters with signs

  while(j  <  w.length) {
    l = w[j];

    next2Lets = w.slice(j+1, j+3) || false;

    lcode = l.charCodeAt(0);

    // console.log(l + " - " + next2Lets + " - "+lcode);

    if(next2Lets && next2Lets.charCodeAt(0) == 3405 && vyanjaSwarams.indexOf(next2Lets.charCodeAt(1)) > 0 ){
      // Considering swarams made with vyanjans
      // console.log(l +" a");
      j= j+3;
      wa.push(fullLetter);
      fullLetter = l+next2Lets;
      continue;
    }
    else if(next2Lets && next2Lets.charCodeAt(0) == 3405 && next2Lets.charCodeAt(1) == lcode ){
      // Considering Kootaksharam made using same letter
      wa.push(fullLetter);
      fullLetter = '';
      fullLetter = l+next2Lets;
      j= j+3;
      continue;
    }
    else if(!((lcode >= 3329 && lcode <= 3331) || (lcode >= 3390 && lcode <= 3405)))
    {
      // Considering all others exept real swarams
      if(fullLetter != ''){wa.push(fullLetter);}
      fullLetter = '';
    }
    fullLetter += l;
    j++;
  }

  if(fullLetter != ''){wa.push(fullLetter);}

  return wa;

}


/* Real program starts here */
app.post('/generate',function(req,res,next){
  var pureText = req.body.puretext; // Accepting the real malayalam words from user
  var pureArray = pureText.split(" "); // Splitting sentaces to words
  var resultArray = []; // Final words will be stored inside this array

  /* Algorithm starts here */

  var tl=pureArray.length,i=0,w,wl;
  var splittedArray = []; // Array of words with splitted characters

  //  Making special array with words containing splitted characters
  while(i < tl) {
      w = pureArray[i]; // Takes each word from paragram
      splittedArray.push(splitToMalayalamLetters(w)); // Split the characters in the word and store the array
      i++;
  }
  i = 0;


  /* Swapping of letters Takes place here */
  var swapVar,swapVarL; // Words taken for swapping letters
  console.log(splittedArray);

  while ( i < tl ) {
    w = splittedArray[i]; // Takes a word from the array of words of splitted characters
    wl = w.length;

    j = 0;

    while( j <= parseInt(wl/2)){ // Swapping takes place with letters of wl/2 words
        swapVar = splittedArray[parseInt(Math.random() * Math.floor(splittedArray.length))]; // Taking random word
        swapVarL = swapVar.length;
        k=0;
        if(swapVar >  wl){ // This part should be replaced with a better code
          continue;
        }
        /* Interchanging letters */
        while (k++ <= parseInt(Math.random()*Math.random() *2 )+ 1) {
          randomPosition = parseInt(Math.random() * Math.floor(swapVarL));
          w[randomPosition] = swapVar[randomPosition];
          k++;
        }
        j++;
    }
    resultArray.push(w.join(""));
    i++;
  }

  /* Now result array will contain set of random words */

  result = resultArray.join(" ");
  res.send(result)
});
app.listen(3000, () => console.log('Project ( kalanipsum ) listening on port 3000! - Developed by Shameel Kadannamanna ( shameelsadaka.github.io )'))
