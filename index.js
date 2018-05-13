const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

// Core Datas
vyanjaSwarams = [3381,3376,3375,8205];

app.post('/generate',function(req,res,next){
  var pureText = req.body.puretext;
  var result = pureText;
  var pureArray = pureText.split(" ");
  var resultArray = [];

  /* Algorithm */

  // Declare the variables
  var tl=pureArray.length,i=0,w,wl,j,l,lcode,k,wa = [],fullLetter = '',next2Lets;
  var splittedArray = [];

  while(i < tl) {
      w = pureArray[i]; // Takes each word from paragram
      wa = []; // Array of words



      /* This is only for malayalam like languages wich join the vowel with consonents
       This for is loop to include 'chihanm (swaram)' and zwdj with letters */
      j = 0;

      // Splitting the sentance into words and words into letters with signs

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
          fullLetter = '';
          wa.push(l+next2Lets);
          continue;
        }
        else if(next2Lets && next2Lets.charCodeAt(0) == 3405 && next2Lets.charCodeAt(1) == lcode ){
          // Considering Kootaksharam
          wa.push(fullLetter);
          fullLetter = '';
          // console.log(l +" b");
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
        // console.log(l +" d");
        j++;
      }

      if(fullLetter != ''){wa.push(fullLetter);}
      fullLetter = '';

      splittedArray.push(wa);

      i++;
  }
  i = 0;
  var swapVar,swapVarL;
  while ( i < tl ) {
    w = splittedArray[i];

    wl = w.length;
    j = 0;
    while( j <= parseInt(wl/2)){
        ti = parseInt(Math.random() * Math.floor(splittedArray.length));
        swapVar = splittedArray[ti];
        swapVarL = swapVar.length;
        k=0;
        if(swapVar >  wl){
          continue;
        }
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


  result = resultArray.join(" ");
  res.send(result)
});
app.listen(3000, () => console.log('Project ( kalanipsum ) listening on port 3000!'))
