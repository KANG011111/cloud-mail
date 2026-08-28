import app from '../hono/hono';
import draftService from '../service/draft-service';
import result from '../model/result';
import userContext from '../security/user-context';

app.get('/draft/list', async (c) => {
  const data = await draftService.list(c, c.req.query(), userContext.getUserId(c));
  return c.json(result.ok(data));
});

app.post('/draft/save', async (c) => {
  const data = await draftService.save(c, await c.req.json(), userContext.getUserId(c));
  return c.json(result.ok(data));
});

app.delete('/draft/delete', async (c) => {
  await draftService.delete(c, c.req.query(), userContext.getUserId(c));
  return c.json(result.ok());
});
