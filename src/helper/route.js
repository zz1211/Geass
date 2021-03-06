const PREFIX = '$$route';
const methods = ['get', 'post', 'put', 'patch', 'delete'];

const routeMethod = {};

function destruct(args) {
  const hasUrl = typeof args[0] === 'string';
  const url = hasUrl ? args[0] : '';
  const middleware = hasUrl ? args.slice(1) : args;
  if (middleware.filter(m => typeof m !== 'function').length) {
    throw new Error('Middleware must be function');
  }
  return {
    url,
    middleware
  };
}

function route(method, ...args) {
  if (methods.indexOf(method) === -1) {
    throw new Error('Invalid HTTP method');
  }
  const { url, middleware } = destruct(args);
  return (target, name) => {
    const key = `${PREFIX}-${method}`;
    if (!target[key]) {
      target[key] = [];
    }
    target[key].push({
      method,
      name,
      url,
      middleware
    });
  };
}

function controller(...args) {
  const { url: baseUrl, middleware: baseMiddleware } = destruct(args);
  return target => {
    const proto = target.prototype;
    proto.$$routes = Object.getOwnPropertyNames(proto)
      .filter(property => property.indexOf(PREFIX) === 0)
      .map(property => proto[property])
      .reduce((prev, next) => prev.concat(next), [])
      .map(item => {
        return ({
          ...item,
          url: baseUrl + item.url,
          middleware: baseMiddleware.concat(item.middleware)
        });
      });
  };
}

methods.forEach(method => {
  routeMethod[method] = route.bind(null, method);
});

routeMethod.route = route;
routeMethod.controller = controller;

export default routeMethod;
