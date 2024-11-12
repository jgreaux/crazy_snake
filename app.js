const canvas = document.getElementById('myCanvas')
const ctx = canvas.getContext('2d')

const restart = document.getElementById('reset')

const timer = document.getElementById('time')

//quadrillage 20 * 20
const squareSize = 20

let current_loop = -1

let fruit_pos = 200
let snake_pos = [170]

let direction = 'right'
let speed = 400

let total_time = 120
let time_start = Date.now()

loop()

function move_pos(new_pos){
	snake_pos.push(new_pos)
}

function reset(){
	clearTimeout(current_loop)
	
	fruit_pos = 200
	snake_pos = [170]

	direction = 'right'
	speed = 400

	total_time = 120
	time_start = Date.now()
	
	loop()
}

restart.addEventListener("click", reset)


function display(){
	ctx.clearRect(0, 0, canvas.width, canvas.height)
	snake_pos.forEach(el =>{
		draw_snake_part(el)
	})
	draw_fruit()
	timer.innerText = total_time - parseInt((Date.now() - time_start)/1000)
}

function draw_snake_part(pos){
	let {x,y} = pos_to_coordinate(pos)
	ctx.fillStyle = 'blue'
	ctx.fillRect(x, y, squareSize, squareSize)
}

function draw_fruit(){
	let {x,y} = pos_to_coordinate(fruit_pos)
	ctx.fillStyle = 'red'
	ctx.fillRect(x, y, squareSize, squareSize)
}

function add_fruit(){
	let count = 0
	let new_fruit_pos = fruit_pos
	while((fruit_pos == new_fruit_pos || snake_pos.includes(new_fruit_pos)) && count < 20 ){
		count += 1
		new_fruit_pos = Math.floor(Math.random() * 400)
	}
	fruit_pos = new_fruit_pos
}

function check_fruit(){
	if(fruit_pos == snake_pos.at(-1)){
		add_fruit()
		speed = speed * 0.95 < 20 ? 20 : speed * 0.95
		total_time += 1
	}else{snake_pos.shift()}
}

function pos_to_coordinate(val){
	const x_val = val % squareSize
	const y_val = val - (x_val)
	
	return {x: x_val * squareSize, y: y_val}
}

const move = {
	up: (pos)=>{
		const x_val = parseInt(pos / 20)
		if(x_val == 0){
			const new_pos = (pos + 380)%400
			move_pos(new_pos)
		}else{
			move_pos(pos - 20)
		}
	},
	down: (pos)=>{
		const x_val = parseInt(pos / 20)
		if(x_val > 18){
			const new_pos = (pos - 380)%400
			move_pos(new_pos)
		}else{
			move_pos(pos + 20)
		}
	},
	left: (pos)=>{
		const y_val = pos - (parseInt(pos / 20)*20)
		if(y_val == 0){
			const new_pos = (pos + 19)
			move_pos(new_pos)
		}else{
			move_pos(pos - 1)
		}
	},
	right: (pos)=>{
		const y_val = pos - (parseInt(pos / 20)*20)
		if(y_val == 19){
			const new_pos = (pos - 19)
			move_pos(new_pos)
		}else{
			move_pos(pos + 1)
		}
	}
}

function loop(){
	if ((Date.now() - time_start) > total_time * 1000){
		alert(`Score: ${snake_pos.length}`)
		return
	}
	current_loop = setTimeout(()=>{
		move[direction](snake_pos.at(-1))
		check_fruit()
		display()
		loop()
	},
	speed)
	
}

document.addEventListener('keydown', (e)=> {
	if(e.key == 'ArrowDown' && direction != 'up'){direction = 'down'}
	else if (e.key == 'ArrowUp' && direction != 'down'){direction = 'up'}
	else if (e.key == 'ArrowRight' && direction != 'left'){direction = 'right'}
	else if (e.key == 'ArrowLeft' && direction != 'right'){direction = 'left'}
})