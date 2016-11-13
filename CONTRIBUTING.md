# Contributing

Hey there, glad you are reading this, all contributions are welcome here!

If you are looking for ideas on what to help on check the [issues tab](https://github.com/obartra/ssim/issues).

## Setup

Fork, then clone the repo:

```bash
$ git clone git@github.com:your-username/ssim.git
```

Set up your machine:

```bash
$ npm install && npm run build
```

Make sure the tests pass:

```bash
$ npm test
```

Now it's time to set up your editor.

This project requires following the linting style, full documentation and full unit test coverage. In order to make that easier, the following tasks that will let you know if anything is missing:

### Linting

```bash
$ npm run lint
```

This task will run the linter ([eslint](http://eslint.org/)). It's more convenient if you set up your editor to automatically highlight the rules for you. If you are using [VSC](https://code.visualstudio.com/) you may want to use [this](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) extension. For [Sublime](https://www.sublimetext.com/), check out [this](https://github.com/roadhump/SublimeLinter-eslint) one instead. Most editors will have an eslint plugin you can use.

### Documentation

```bash
$ npm run docs:check
```

This task will validate the documentation and give you pointers if any methods require more information. You can look at the rest of the code base for examples.

### Testing

For any changes that add, modify or remove a feature you should add unit tests. In addition to that, if you are modifying the public API you should add end-to-end (e2e) tests. These are in the `spec/unit` and `spec/e2e` folders, respectively.

You can run unit tests with:

```bash
$ npm test
```

And integration ones with:

```bash
$ npm run e2e
```

## Asking for help

If you are struggling to get CI to pass, just make a pull request and I'll help you sort out any issues.

## Making a PR

1. On your fork, create a new branch (`git checkout -b awesome-ssim-feature`)
2. Make your changes
3. Add them (`git add -A`)
4. Commit them (`npm run commit`)
5. Follow the [commitizen](https://github.com/commitizen/cz-cli) instructions
6. Make a PR
