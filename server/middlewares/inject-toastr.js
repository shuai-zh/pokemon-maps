export default function (req, res, next) {
  res.locals.toasts = req.toastr.render();
  next();
}
