## Wetterluchs

https://wetterluchs.benjaminsinger.de

Angular based Web App which gets current & historical weather data for your current position

### Prerequisites & Installation

You need to get access to the 3 used APIs first. Get the credentials accordingly, the free tiers are enough for casual usage.  
We use the following services to gather our data:

- **LocationIQ** (Reverse Geo Lookup)
- **Darksky** (Weather Data for a given location)
- **Unsplash** (According background images for the current weather)

After checking out the repository, install the dependencies:

```sh
npm install
```

You should install [Browserify](https://github.com/browserify/browserify) as a global dependency to use the CLI:

```sh
npm install -g browserify
```

Then, create a local file where you store your own API Credentials. Take the `app/API_KEYS_sample.js` as an orientation.

Name it `API_KEYS.js` and save it in the same directory as the sample file.

Build the app:

```sh
npm run build
```

Now you should be able to run it locally in your browser. Make sure to allow Geo Location access in your browser settings.
