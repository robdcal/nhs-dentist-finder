# NHS Dentist Finder

Finding a nearby dentist that's accepting new adult NHS patients isn't easy; both the lack of availability and the poor UX of the relevant section of the NHS website.

This project is designed to improve upon that experience, making it easier to find one.

## Desired Features:

- Scrape NHS website for data
- Use browser geolocation and manual user input to get user's location
- Use Google's Distance API to calculate distance from each dentist and order list by nearest
- Filter list by options (available/unavailable, etc)
- Show Google Map version of list with dentists plotted

## Todo

- ~~Bring serverless function into the main project~~
- ~~Make postcode in URL dynamic (pull from input field)~~
- ~~get & display distance~~
- ~~improve 'active' animation (animate when dentist list displayed)~~
- ~~Show count of unavailable / available~~
- ~~Filter to display available / unavailable~~
- ~~Debounce postcode input & lat/lng API calls~~
- ~~Clear lat/lng when postcode input changes (i.e. user types)~~
- ~~Handle errors~~
- ~~Scrape & display more info (link, address, phone number)~~
- Allow for scraping more (i.e. "scrape 50 more")
- Show locations on Google Maps
- Refactor data scraping functions to use one function and feed in target element
- Scrape & display the remaining 4 types of "accepting patients"
- Scrape remaining info (parking availability, hearing loop availability, NHS.UK users rating)
