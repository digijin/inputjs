# UnityInput

[![npm version](https://badge.fury.io/js/unityinput.svg)](http://badge.fury.io/js/unityinput) [![Build Status](https://travis-ci.org/digijin/inputjs.svg?branch=master)](https://travis-ci.org/digijin/inputjs)

## intro

This class is heavily inspired by [Unity editor's Input class](https://docs.unity3d.com/ScriptReference/Input.html). methods in this class can be used the same way but with a more traditional js nomenclature starting with a lowercase character for function names.

This is intended to be used for gaming. If you're trying to use it for standard web stuff, this might not be the package for you.

Usage of the getKey and getButton functions can be used with no additional setup, but to use the activity functions like getButtonDown and getButtonUp one must invoke the endTick function at the end of each frame loop to flush the internal caches and begin taking in new events.

mouse attaches itself to document, for testing make calls to document

## installation

```
yarn add unityinput
```

## usage

```javascript
import Input from "unityinput";

let input = new Input({
	keyboardMapping: {
		ctrl: 17
	},
	buttons: {
		fire: {
			type: "keyboard",
			key: "ctrl"
		}
	}
});

let gameloop = () => {
	if (input.getButton("fire")) {
		console.log("pew pew pew");
	}
	input.endTick();
};

setInterval(gameloop, 100);
```

## checking if a button is currently down

```javascript
let input = new Input({
	keyboardMapping: {
		ctrl: 17
	},
	buttons: {
		fire: {
			type: "keyboard",
			key: "ctrl"
		}
	}
});

let gameloop = () => {
	if (input.getButton("fire")) {
		console.log("pew pew pew");
	}
	input.endTick();
};
```

## checking if a key is pressed in the last frame

```javascript
let input = new Input({
	keyboardMapping: {
		ctrl: 17
	}
});

let gameloop = () => {
	if (input.getKeyDown("ctrl")) {
		console.log("pew pew pew");
	}
	input.endTick();
};
```

## notes

getButtonDown is not implemented yet. to get a purely cross input solution you now need to check each input in your app

## dev

test frameworks are both jest and karma/jasmine/webpack

### one-off tests

```
yarn test
yarn karma
```

### watchers

```
yarn test:watch
yarn karma:watch
```

### webpack dev server

```
yarn dev
```

and then hit up `http://localhost:8080/demo/` in your browser

## docs

docs can be generated by cloning the repo and running

```
npm install
npm run docs
```
