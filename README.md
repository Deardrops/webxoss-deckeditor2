# DeckEditor for WEBXOSS

Before running/developing, you should download copyrighted images into path/to/project/images:

```
curl http://webxoss.com/images.tar | tar xv
```

Note:

* The card images are copyrighted by Takara Tomy. *NO BUSINESS USE*.
* If slow, you can replace `webxoss.com` with `cloudflare.webxoss.com`, `incapsula.webxoss.com` or `hongkong.webxoss.com:8080` to use proxy.
* These images are compressed. Use [webxoss-fetch](https://github.com/webxoss/wixoss-fetch) to get raw ones.

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
