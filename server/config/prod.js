import path from 'path';

export default {
  staticDirs: [
    path.join(__dirname, '/../../client')
  ],
  nunjucksConfig: {
    autoescape: true,
    noCache: false,
    watch: false
  }
};
