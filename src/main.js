//@flow

import underscore from "underscore";

import Input from "Input";
let input = new Input();
// window.UnityInput = input; //yuk
export default input;

let tpl = underscore.template(`

RAW: interval <%= interval %>ms per tick
<pre>
mouse position: 
<%= JSON.stringify(input.mouse.position) %>

mouse down: 
<%= JSON.stringify(input.mouse.down) %>

mouse activity: 
<%= JSON.stringify(input.mouse.activity, null, 2) %>

keys down: 
<%= JSON.stringify(input.keyboard.down) %>

key activity: 
<%= JSON.stringify(input.keyboard.activity, null, 2) %>

gamepads:<% 
	input.gamepad.gamepads[0].buttons.forEach(b => {
		%>
		<%= b.pressed?"on":"off" %><%	
	}) 
	%>
	
</pre>
`);

let interval = 200;
let content;
let update = () => {
	content.innerHTML = tpl({ input, interval });
	input.endTick();
	if (interval == 0) {
		requestAnimationFrame(update);
	}
};
window.onload = () => {
	content = document.getElementById("content");
	content.innerHTML = "starting";
	if (interval == 0) {
		update();
	} else {
		setInterval(update, interval);
	}
};
