import koa from 'koa';

const app = new koa();
const PORT = process.env.port ?? 50000;

app.use(async (ctx, next) => {
    const { response, request } = ctx;

    response.body = JSON.stringify(ctx);
    response.status = 404;
    response.message = 'OK';

    console.log(request);
})

app.listen(PORT, () => console.log(`Listening on port: ${PORT}`));