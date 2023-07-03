# Instructions
## Themekit
1. Clone this repo.
2. Copy config_sample.yml into config.yml.  
Input needed `password`, `theme_id`, and `store`.
````
development:
  password: <themekit store password>
  theme_id: "<theme id>"
  store: <store.myshopify.com>
  directory: theme
````
3. Run command `theme get` to get the latest changes.
4. Run command `theme watch` to automatically push your changes in shopify.

## Development
1. Run command `npm install` to install development tools.
2. Run command `npm run watch` to compile changes of scss and js.
3. Required for live, run command `npm run production` if changes goes to live. This will minify everything.

## Don't forget to push changes to github once everything is passed by QA.