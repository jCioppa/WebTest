let validationRoute = "/api/validate";

// send an async post request with the given success and complete callback
function ProcessCardAsync(cardNumber, onSuccess, onComplete)
{   
    $.post(validationRoute, { cardNumber: cardNumber }) 
    .done(onSuccess)
    .always(onComplete); 
}

// generate a random string of numDigits digits in [0..9]
function RandomString(numDigits)
{
    let result = '';
    
    for(let i = 0; i < numDigits; i++)
    {
        result += Math.floor(Math.random() * 10);
    }
    return result;
}

 // simple string comparison
 function StringEquals(a, b)
 {   
     let strcmp = (a < b) ? -1 :(a > b ? 1 : 0);  
     return strcmp == 0;
 }

// tw: trim whitespace from a string
function tw(val)
{
    return val.replace(/ /g, "");
}