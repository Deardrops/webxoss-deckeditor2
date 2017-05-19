# DeckEditor for WEBXOSS

Before running/developing, you should download copyrighted images into path/to/project/images:

```
# Download compressed images
curl http://webxoss.com/images.tar | tar xv

# Download raw images
cd images
curl http://webxoss.com/raw.tar | tar xv
```

Note:

* The card images are copyrighted by Takara Tomy. *NO BUSINESS USE*.
* If slow, you can replace `webxoss.com` with `cloudflare.webxoss.com` or `hongkong.webxoss.com:8080` to use proxy.

## Install

```bash
$ npm install
```

## Dev

```bash
$ npm run dev
```

## Build

```bash
$ npm run build
```

PS: Run `npm run serve` to serve the built files.
