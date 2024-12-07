# google-drive-wrapper-app

# Setup Sign in With Google

This is a short guide on how to setup Sign in With Google for OAuth 2.0 for local dev environment.

## Get your Google API client ID

To enable Sign In With Google for website, you first need to setup your Google API client ID.
Setup guide can be found [here](https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid).

Once the Client ID is retrived from Google Developer Console, use it as a value in env variable for `GOOGLE_CLIENT_ID`.

## Enable Google Drive API in Google Console

After successfully getting the Google Client ID and configuring it in the app. Next, step is to enable the Google Drive APi in Google Developer Console using below guide:

- Go to https://console.cloud.google.com/
- Select your desired project from the dropdown at the top left corner of the dashboard, next to the Google Cloud logo.
- From the left sidebar click on `Library` menu item.
- In the main search bar in the Library screen, search for `Google Drive API`.
- Click ont eh `Google Drive API` from the search result and click `ENABLE` on the next screen.
