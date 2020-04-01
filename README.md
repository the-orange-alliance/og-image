# Open Graph Image Generator

Serverless service that generates dynamic Open Graph images for Discord Embed.
For each keystroke, headless chromium is used to render an HTML page and take a screenshot of the result which gets cached.

## Getting Started

### Running locally
1. Clone the repo
2. Run ``npm install``
3. Run ``npm install -g now``
4. Fill out ``.env.sample`` and save it as ``.env``.
5. Run ``now dev`` and visit [localhost:3000](http://localhost:3000)

### Deploy
Simply run ``now``.