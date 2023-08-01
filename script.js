const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNum]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copyMSG]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector('#lowercase');
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indecator=document.querySelector("[data-indecator]");
const generateBtn=document.querySelector(".generateButton");
const allcheckBox=document.querySelectorAll("input[type=checkbox]");

let password="";
let passwordlen=10;
let checkCount=0;
let symbols='!@#$%^&*(){}[]_=+*/`~<>-":;|';
handleSlider();
//set strength circle color to grey
steIndecator("#ccc")


//set password length
function handleSlider(){
    inputSlider.value= passwordlen;
    lengthDisplay.innerText=passwordlen;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordlen-min)*100/(max-min))+"% 100%";
    //if the slider moves the passwordlength is also increasing or decresing

}

function steIndecator(color){
    indecator.style.backgroundColor=color;
    //shadow
    indecator.style.boxShadow = `0px 0px 12px 1px ${color}`;

}

function getRAndomInteger(min, max){
     return Math.floor(Math.random()*(max-min)) + min;

}

function generateRandomNumber(){
    return getRAndomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRAndomInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRAndomInteger(65,91));
}

function generateSymbol(){
    const randNum= getRAndomInteger(0,symbols.length);
    return symbols.charAt(randNum);
     
}

function calcStrength(){
    let hasUpper=false;
    let hasLower=false;
    let hasNum=false;
    let hasSym= false;
    if (uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) hasLower=true;
    if(symbolsCheck.checked) hasSym=true;
    if(numbersCheck.checked) hasNum=true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordlen>=8){
        steIndecator("#0f0");
    }else if(
        (hasLower||hasUpper) && (hasNum || hasSym) && passwordlen >=6
    ){
        steIndecator("#0ff0");
    }else{
        steIndecator("#f00");
    }
     
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="Failed";

    }
    copyMsg.classList.add("active"); 

    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },3000);
    


}


function shufflePassword(array){
    //Fisher Yates Method

    for(let i = array.length -1; i>0; i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp= array[i];
        array[i]= array[j];
        array[j]=temp;
    }
    let str ="";
    array.forEach((el => (str+=el)));
    return str;

}

 inputSlider.addEventListener('input',(e)=>{
    passwordlen=e.target.value;
    handleSlider();
 });

 copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
    copyContent();
 })


 function handleCheckBoxChange(){
    checkCount=0;
    allcheckBox.forEach((checkbox)=>{
    if(checkbox.checked)
    checkCount++;
    });

    //condition
    if(passwordlen<checkCount)
    passwordlen=checkCount;
    handleSlider();

 }
 allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
 })

 generateBtn.addEventListener('click',()=>{
    //None of the check box selected
    if(checkCount==0)
     return;
     console.log("Not checked any check box")

    if(passwordlen<checkCount){
        passwordlen=checkCount;
        handleSlider();
    }
   

    //Find new password

    console.log("Starting the journey");

     //remove old password
     password="";

     //lets put the stuff mentioned in the check boxes

    //  if(uppercaseCheck.checked){
    //     password+= generateUpperCase();
    //  }
    //  if(lowercaseCheck.checked){
    //     password+= generateLowerCase();
    //  }
    //  if(numbersCheck.checked){
    //     password+= getRAndomInteger();
    //  }
    //  if(symbolsCheck.checked){
    //     password+= generateSymbol();
    //  }


    let funArr=[];

    if(uppercaseCheck.checked)
      funArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
      funArr.push(generateLowerCase);

    if(numbersCheck.checked)
      funArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
      funArr.push(generateSymbol);


 //compulsory addition

   for(let i=0; i<funArr.length;i++){
    password+=funArr[i]();
   }

   console.log("Compulsory addition done");

   //remaining addition

   for(let i=0;i<passwordlen - funArr.length; i++){
    let randIndex=getRAndomInteger(0 , funArr.length);
    console.log("Random index" + randIndex);
    password+= funArr[randIndex]();
   }
   console.log("remaining addition done");


   //shuffle the password

   password=shufflePassword(Array.from(password));
   console.log("shuffling addition done");

   //showing the password
   passwordDisplay.value= password;
   console.log("UI addition done");
   //calculate strength
   calcStrength();

 });