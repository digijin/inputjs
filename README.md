# UnityInput 
[![npm version](https://badge.fury.io/js/unityinput.svg)](http://badge.fury.io/js/unityinput) [![Build Status](https://travis-ci.org/digijin/inputjs.svg?branch=master)](https://travis-ci.org/digijin/inputjs)
## intro
this class is heavily inspired by [Unity editor's Input class](https://docs.unity3d.com/ScriptReference/Input.html). methods in this class can be used the same way but with a more traditional js nomenclature starting with a lowercase character for function names.

This is intended to be used for gaming. If you're trying to use it for standard web stuff, this might not be the package for you.

usage of the getKey and getButton functions can be used with no additional setup, but to use the activity functions like getButtonDown and getButtonUp one must invoke the endTick function at the end of each frame loop to flush the internal caches and begin taking in new events.

## usage

```javascript
import Input from 'unityinput';

let input = new Input();

let gameloop  = () => {
    if(input.getButton('fire')){
        console.log('pew pew pew')
    }
    input.endTick();
}

setInterval(gameloop, 100);

```
