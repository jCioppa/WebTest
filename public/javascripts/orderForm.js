// redirect back to start page
function OnBackClicked()
{
    location.href = '/'
}

// fill in the expiration year dropdown from the given year range
function PopulateYearDropdown(minYear, maxYear) 
{  
    for (let curr = minYear; curr <= maxYear; curr++)
    {
        var option = document.createElement("option");
        option.value = String(curr);
        option.text = String(curr);
        $("#expiryYear").append(option);
    }
}

function MarkValid(tag)
{
    $(tag).removeClass("invalid");
    $(tag).addClass("valid");
}

function MarkInvalid(id)
{
    $(id).removeClass("valid");
    $(id).addClass("invalid");
}

// validates and marks input fields as invalid if they're empty
function PreValidate(submissionData)
{
    let valid = true;

    $("#cardNumberSection .warning span").html("Card number is required.");

    MarkValid("#cardNumberSection");
    MarkValid("#cardholderNameSection");
    MarkValid("#cvvSection");
    MarkValid("#expirySection");

    if (submissionData.cardNumber.length == 0)
    {
        MarkInvalid("#cardNumberSection");
        valid = false;
    }

    if (submissionData.cardholderName.length == 0)
    {
        MarkInvalid("#cardholderNameSection");
        valid = false;  
    }

    if (submissionData.cvv.length == 0)
    {
        MarkInvalid("#cvvSection");
        valid = false;  
    }
    
    if (StringEquals(submissionData.expMonth, "MM") || StringEquals(submissionData.expYear, "YYYY"))
    {
        MarkInvalid("#expirySection");

        if (StringEquals(submissionData.expMonth, "MM"))
        {
            MarkInvalid("#expirySection #expiryMonth")
        }

        if (StringEquals(submissionData.expYear, "YYYY"))
        {
            MarkInvalid("#expirySection #expiryYear")
        }

        valid = false;  
    }
    else
    {
        let month = submissionData.expMonth;
        let year = submissionData.expYear;
    }    

    return valid; 
}

// handle the Luhn check failing
function OnValidationFailed() 
{ 
    MarkInvalid("#cardNumberSection");
    $("#cardNumberSection .warning span").html("Card number is invalid");
}

// the callback for the async card validation request
function OnComplete(result) 
{
    let status = String(result.status);      

    // validation passed, redirect to the complete page
    if (StringEquals(status, "true"))
    {
        location.href = '/complete';
    }        
    else
    {
        OnValidationFailed();
    }
}

// this handles inserting spaces in between every 4 characters in the card string
// this was taken from https://stackoverflow.com/questions/36833366/format-credit-card-number
$("input#cardNumberInput").on("keydown", function(e) {
    
    var cursor = this.selectionStart;
    
    if (this.selectionEnd != cursor) 
    {
        return; 
    }  
    if (e.which == 46) 
    {
        if (this.value[cursor] == " ") 
        {
            this.selectionStart++;
        }
    } else if (e.which == 8) 
    {
        if (cursor && this.value[cursor - 1] == " ") 
        {
            this.selectionEnd--;
        }
    }
}).on("input", function() 
{ 
    var value = this.value;
    var cursor = this.selectionStart;
    var matches = value.substring(0, cursor).match(/[^0-9]/g);
    
    if (matches) 
    {
        cursor -= matches.length;
    }
    value = value.replace(/[^0-9]/g, "").substring(0, 16);
    var formatted = "";

    for (var i=0, n=value.length; i<n; i++) 
    {
        if (i && i % 4 == 0) 
        {
            if (formatted.length <= cursor) 
            {
                cursor++;
            }
            formatted += " ";
        }
        formatted += value[i];
    }
    if (formatted == this.value) 
    {
        return;
    }
    this.value = formatted;
    this.selectionEnd = cursor;
});

// Gets the card type from the given card number
function ParseCardType(cardNumber) 
{ 
    let cardPatterns = 
    {
        visa: /^4/,
        mastercard: /^5/,
        amex: /^3/,
        discover: /^6/
    };

    for (let key in cardPatterns)
    {
        if (cardPatterns[key].test(cardNumber))
        {
            return String(key);
        }
    }  
    return 'INVALID';
}

let lastCardType = "";

// clear date errors when you set the date value
$("#expirySection select").on('change', function(e){
    MarkValid("#expirySection");
    MarkValid("#expirySection #expiryMonth")
    MarkValid("#expirySection #expiryYear")
});

// this will clear any visible errors as soon as you continue editing the input field
$("input#cardHolderNameInput").on("input", function() 
{
    MarkValid("#cardholderNameSection");
});

// this will clear any visible errors as soon as you continue editing the input field
$("input#ccvInput").on("input", function() 
{
    MarkValid("#cvvSection");
});

// changes an image to disabled based on the card type
function SetImageDisabled(card)
{
    if (card.length > 0)
    {
        let id = "div#cardImages #" + card + " img";
        $(id).attr('src', '/images/' + card + 'Disabled.png');
    }
}

// changes an image to active based on the card type
function SetImageActive(card)
{
    if (card.length > 0)
    {
        let id = "div#cardImages #" + card + " img";
        $(id).attr('src', '/images/' + card + 'Active.png');
    }
}

$("input#cardNumberInput").on("input", function() 
{
    // this will clear any visible errors as soon as you continue editing the input field
    MarkValid("#cardNumberSection");
    
    // this section changes the card image from greyed out to colored based on the parsed card type from the input string
    let cardNumber = tw(String($("input#cardNumberInput").val()));
    
    if ( cardNumber.length > 0)
    { 
        let cardType = ParseCardType(cardNumber);
            
        if (!StringEquals(cardType, "INVALID"))
        {
            if (!StringEquals(cardType, lastCardType))
            {
                SetImageDisabled(lastCardType);    
                lastCardType = String(cardType);
                SetImageActive(cardType);
            }
        }
        else
        {
            SetImageDisabled(lastCardType); 
            lastCardType = String("");
        }
    }
    else
    {
        SetImageDisabled(lastCardType); 
        lastCardType = String("");
    }
});

// called by the sumbit button: gathers card info, does validation, and if validation succeeds, sends further validation to the backend
function TrySubmit() 
{  
    let cardNumber =  tw($("#cardNumberInput").val());
    let cardHolderName = String(tw($("#cardHolderNameInput").val()));
    let cvv = tw($("#ccvInput").val());
    let expYear = $("#expiryYear :selected").val();
    let expMonth = $("#expiryMonth :selected").val();  

    let submissionData = 
    {
        cardNumber : cardNumber,
        cardholderName : cardHolderName,
        cvv: cvv,
        expYear : expYear,
        expMonth: expMonth
    };

    // validate with the backend to see if the card is a proper type
    if (PreValidate(submissionData))
    {
        $.post("/api/validate", submissionData).fail(
            function(jqXHR, textStatus, errorThrown) 
            {
                 OnValidationFailed();
            }).done(OnComplete);
    }
}

// randomly generate the order number
$("div#orderNumber span#amount").html(String(RandomString(7)));

PopulateYearDropdown(2010, 2030);