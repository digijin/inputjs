
[![Build Status](https://travis-ci.org/digijin/inputjs.svg?branch=master)](https://travis-ci.org/digijin/inputjs)

this class is heavily inspired by Unity editor's Input class.

This is intended to be used for gaming. If you're trying to use it for standard web stuff, this might not be the package for you.

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
