Tech stack: 

1. node.js
    - express for routing
    - ejs for view templating
    - vanilla js and jquery
    - all custom css, with bootstrap used for the error page

TODO:

    1. proper date and CVV error reporting: currently we only ensure the date and CVV are filled out, but the front end should
             properly validate these fields before submitting the validation request to the backend. 

    2. custom dropdowns for the date and year fields: customizing selection fields in html requires writing custom solutions rather than
            using the built in select/option tags. 

    3. custom styling for the card input text: the specifications indicated when entering a credit card, we should show something like 

            123# #### #### ####

       where the hashes are lighter grey. HTML input fields don't allow for different fonts with the same input string, so this would require a custom input field be built. 