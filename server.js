// 在其他路由之后添加这个新的路由
app.post('/log-error', express.json(), (req, res) => {
  console.error('客户端错误:', req.body);
  res.status(200).send('错误已记录');
});