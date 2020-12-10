// regexs for matching and validating card numbers
const cardPatterns = 
{
     visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
     mastercard: /^5[1-5][0-9]{14}$|^2(?:2(?:2[1-9]|[3-9][0-9])|[3-6][0-9][0-9]|7(?:[01][0-9]|20))[0-9]{12}$/,
     amex: /^3[47][0-9]{13}$/,
     discover: /^65[4-9][0-9]{13}|64[4-9][0-9]{13}|6011[0-9]{12}|(622(?:12[6-9]|1[3-9][0-9]|[2-8][0-9][0-9]|9[01][0-9]|92[0-5])[0-9]{10})$/
};

// Luhn algorithm: given a string of digits:
//        sum up all digits, replacing every even digit p with (2 * p) % 10
//        if the result is a multiple of 10, the string is valid
//        inspired by : https://en.wikipedia.org/wiki/Luhn_algorithm and https://gist.github.com/DiegoSalazar/4075533
const validateLuhn = (card) => 
{
     let sum = 0;
     let even = false;
	card = card.replace(/\D/g, "");

     for (let n = card.length - 1; n >= 0; n--) 
     {     
          let digit = parseInt(card.charAt(n), 10);

          if (even && (digit *= 2) > 9) 
          {
               digit -= 9;
          }

		sum += digit;
		even = !even;
	}

	return (sum % 10) == 0;
 }

 
module.exports.Validate = (validationData) =>
{
     let cardNumber = validationData.cardNumber;
     let isValid = false;
     let code = 400;
            
     for (let cardType in cardPatterns)
     {
          if (!isValid)
          {
               let matcher = cardPatterns[cardType];                   
               if (matcher.test(cardNumber)) 
               {
                    card = cardType;
                    if (validateLuhn(cardNumber))
                    {
                         code = 200;
                         isValid = true;                            
                    }
               }
          }
     }          


     let results = { status : isValid, code : code };

     return results;
};