# itbl-websdk-app
Iterable websdk demo app

# Install
`npm install`
<!-- # Build Project  -->
<!-- npx webpack -->

<!-- # Serve files -->
<!-- npx http-server ./dist -->


# Build & Run with NPM
npm run clean && npm run build`  (Clean and Build)
`npm start`` (run app)
Open your browser and navigate to http://localhost:9000 to see your fitness app in action.


# Update token/api
Add `jwtToken` and `apikey` in main.ts

# Add your own placementId and appPackageName
update `placementId` with your own, take single value or array of values
update `appPackageName` with your own website package name 

# Add email in query param to reflect elgible users
`http://localhost:9000/?email=test@example.com`


# Current implementation
Code work for Out of Box view (Banner) with carousel effect done throuhg css/js. 
https://support.iterable.com/hc/en-us/articles/27537816889108-Embedded-Messages-with-Iterable-s-Web-SDK#out-of-the-box-views
