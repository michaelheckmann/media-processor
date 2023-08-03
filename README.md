If you encounter this error when starting the app using `yarn start`:

```
...
const stringWidth = require('string-width');
...
```

then you just have to delete the `node_modules` folder and install the dependencies again.

```bash
yarn nuke
```
