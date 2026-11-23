app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidUnknownValues: true,
  }),
);