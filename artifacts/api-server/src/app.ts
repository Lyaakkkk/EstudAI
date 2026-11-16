import express, { type Express, type ErrorRequestHandler } from "express";
import pinoHttp from "pino-http";
import router from "./routes";
import { configureDeployment, mountWeb } from "./deployment";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
configureDeployment(app);
app.use(express.json({ limit: "3mb" }));
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);
mountWeb(app);
const safeErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  if (res.headersSent) { next(error); return; }
  const status = error?.type === 'entity.too.large' ? 413 : error?.type === 'entity.parse.failed' ? 400 : 500;
  if (status === 500) req.log.error({ errorName: error instanceof Error ? error.name : 'unknown' }, 'Unhandled request error');
  res.status(status).json({ code: status === 413 ? 'PAYLOAD_TOO_LARGE' : status === 400 ? 'INVALID_JSON' : 'INTERNAL_ERROR',
    message: status === 413 ? 'O envio excedeu o limite permitido.' : status === 400 ? 'O formato do pedido é inválido.' : 'Não foi possível concluir a solicitação.' });
};
app.use(safeErrorHandler);

export default app;
