const errorHandler = (err, req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ message: 'Request blocked by CORS policy.' });
  }

  if (err.name === 'MulterError') {
    const reason =
      err.code === 'LIMIT_FILE_SIZE'
        ? 'File is too large. Maximum upload size is 10 MB.'
        : 'File upload failed. Please try again.';
    return res.status(400).json({ message: reason });
  }

  console.error('Unhandled error:', err);

  if (err.status && err.status >= 400 && err.status < 500) {
    return res.status(err.status).json({ message: err.message || 'Bad request.' });
  }

  if (err.code === '23505') {
    return res.status(409).json({ message: 'A record with this value already exists.' });
  }

  if (err.code === '22P02') {
    return res.status(400).json({ message: 'Invalid input format.' });
  }

  res.status(500).json({ message: 'An unexpected error occurred. Please try again later.' });
};

export default errorHandler;
