## fs.stat

1. 可以判断文件的存在性
2. 文件的信息，statObj.isDirectory()/statObj.isFile()

## fs.access()

是否存在，能否访问

## 缓存

1. 强制缓存

```js
res.setHeader('Expires', new Date(Date.now() + 10 * 1000).toGMTString())
res.setHeader('Cache-Control', 'max-age=10')
```

```js
res.setHeader('Cache-Control', 'no-cache') //每次都访问服务器
res.setHeader('Cache-Control', 'no-store') //客户端不缓存
```

- 不向服务端发请求，但是状态码还是 200

2. 对比缓存

- 首页默认不缓存

(1) 时间对比

```js
res.setHeader('Cache-Control', 'no-cache')

if (req.url.match(/css/)) {
  let ctime = statObj.ctime.toGMTString()
  res.setHeader('Last-Modified', ctime)
  let ifModifiedSince = req.headers['if-modified-since']
  if (ifModifiedSince === ctime) {
    res.statusCode = 304
    return res.end()
  }
}
```

(2) 文件对比
crypto 专门用来提供 node 中 一些常用的 摘要算法 和 加密算法

md5

加盐算法
