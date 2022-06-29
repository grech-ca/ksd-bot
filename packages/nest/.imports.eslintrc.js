const { readdirSync } = require('fs');
const { join } = require('path');

const externalModules = readdirSync(join(process.cwd(), 'node_modules'), { withFileTypes: true }).filter(dir => dir.isDirectory()).map(directory => `(${directory.name}/*)`).join('|')

module.exports = {
  rules: {
    "import-helpers/order-imports": ["error", {
      newlinesBetween: "always",
      groups: [
        '/^(assert|async_hooks|buffer|child_process|cluster|console|constants|crypto|dgram|dns|domain|events|fs|http|http2|https|inspector|module|net|os|path|perf_hooks|process|punycode|querystring|readline|repl|stream|string_decoder|timers|tls|trace_events|tty|url|util|v8|vm|zli)$/',
        '/^@nestjs/*/',
        `/^(${externalModules})/`,
        `/^@app/*/`,
      ]
    }],
  }
}

