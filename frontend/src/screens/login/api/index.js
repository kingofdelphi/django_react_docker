export const login = (data, success_callback, failure_callback) => ({
  url: '/login/',
  method: "POST",
  data,
  success_callback,
  failure_callback,
});

