# `.well-known` — universal / app links

These files let `https://sevil.app/s/<listingId>` deep-link straight into the
Sevil app (bundle/package `uz.tedy.teddyMobile`) instead of opening the web
fallback. They are served verbatim from the site root by Vite (files in
`public/` are copied as-is to the build output).

## Before deploy — replace the placeholders

### `apple-app-site-association` (iOS Universal Links)
- Served at `https://sevil.app/.well-known/apple-app-site-association`.
- **No file extension.** Must be served as `application/json` (no redirects).
- `appID` is written as **`TEAMID.uz.tedy.teddyMobile`**. Replace **`TEAMID`**
  with the real Apple Developer **Team ID** (10-char, e.g. `A1B2C3D4E5`), so
  the final value is `A1B2C3D4E5.uz.tedy.teddyMobile`.

### `assetlinks.json` (Android App Links)
- Served at `https://sevil.app/.well-known/assetlinks.json`.
- Replace **`REPLACE_WITH_SHA256_CERT_FINGERPRINT`** with the SHA-256
  fingerprint of the app's signing certificate (upper-case, colon-separated,
  e.g. `AB:CD:...`). Get it with:
  ```
  keytool -list -v -keystore <release.keystore> -alias <alias>
  ```
  or from the Play Console → App integrity → App signing.

The custom-scheme deep link used by the web fallback buttons is
`sevil://s/<listingId>`.
