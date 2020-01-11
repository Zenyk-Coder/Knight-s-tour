let chess = {
	board : [], //  наша шахматна дошка в масиві
	course : [], // математичний курс коня масив з номерів кліинок на які стає кітинок
	step : 1,	// який порахунку хід
	index : null, 
	trueInterval : false,
	interval : 2,
	consolka : document.getElementById('console'), // .div псевдо консоль куда виводим ходи
	section : document.getElementsByClassName('section'), // HTML колекція секцій 
	init : function () 
	{
		const mainBlock = document.getElementById('mainBlock');
		const chessboard = document.createElement('div');
		const masivOfLetters = ['a','b','c','d','e','f','g','h'];

		mainBlock.appendChild(chessboard);
		chessboard.classList.add('chessboard');

		for ( let i = 1; i < 65; i++ ) {
			this.board.splice(i, 0, i); // заповнюєм масив числами від 0-63

			let section = document.createElement('div');
		    chessboard.appendChild(section);
		    section.classList.add('section');
		    section.id = i;
		}  // генеруєм масив з 64 цифр

		let x=1, y=8;
		let letter = masivOfLetters[0];
		for ( let i = 0; i < this.board.length; i++ ) {
		    if (x>8) {        // кожній клітинці присвоюєм правильнікоординати
		        x=1;
		        letter = masivOfLetters[0];
		        y--;
		    }
		    this.board[i] = { posX : x,  //кожну цифру перетворюєм в обєкт присвоюєм значення x,y також 
							  posY : y,	 //чи стоїть кінь і також чи на клітинку вже ставали
							  horse : false,
							  pos : true,
							  letters : letter 
							};
		    x++;
		    letter = masivOfLetters[x-1];

		    if ((i % 2 == 0 && y % 2 == 0) || (i % 2 != 0 && y % 2 != 0)) {  // замальовуєм шахматну дошку 
		        this.section[i].style.backgroundColor = '#FBF9F7'; // якщо і та У діляться без остачі на 2 або якщо і,У діляться з остачею то білий
		    } 
		    else {
		        this.section[i].style.backgroundColor = '#211E1D'; // якщо і ділиться з остачею а У без остачі або навпаки то чорний
		    }
		}; // 
	
		// ЗАПУСКАЄМ ВСІ ІНШІ ФУНКЦІЇ //	
		this.randomPosOfHorse();
		this.clearBoard();
		this.plusOnePos();
		this.prevStep();
		this.clickChecker();
	},
	nextStep : function() 
	{
		let current; // номер клітинки на якій стоїть кінь
		const that = this;
		for ( let i = 0; i < this.board.length; i++ ) {  // з допомогою циклу шукаєм номер клітинки на якій стоїть кінь
			if (this.board[i].horse == true ) {
			    current = i;
			    this.section[i].innerHTML = this.step;
			    this.section[i].classList.add('current');
			}
		}
		
		//РОБИМ МАСИВ ВСІХ МОЖЛИВИХ ХОДІВ КОНЯ
		var vars = makeMasiOfNextPos(current);
		let trueCell = [];

		//ПРОВЕРКА  КЛЕТОК НА КОТОРИЕ МОЖНО ВСТАТЬ
		proverkaNextPos(vars, trueCell);

		let nextArr = [];
		let nextTrueCell = [];

		//МАСИВ З КІЛЬКОСТІ ХОДІВ ЯКІ МОЖНА ЗРОБИТИ З КЛТИНОК НА ЯКІ МОЖНА ВСТАТИ
		//НАПРИКЛАД КІНЬ НА: 7c стає на: 8e, з 8е можна зробити 3 ходи 7g,6f,6d
		nextArr = whatToDoNext();

		let k = nextArr.length;
		let min = nextArr[0];
		let index = 0;
		while (k--) {    /// сортуєм елементи по мірі зростання і та клітинка з якої найменше ходів = її індексу
		    if (nextArr[k] < min) {
		        min = nextArr[k];
		        index = k;
		    }
		} 

		// ЗАБИРАЄМ КОНЯ З ПОТОЧНОЇ КЛІТИНКИ //
		this.section[current].classList.remove('current');
		this.board[current].horse = false;
		this.board[current].pos = false;
		
		// СТАВИМ КОНЯ НА НАСТУПНУ КЛІТИНКУ //
		this.board [ trueCell[index] ].horse = true;  
		this.section[ trueCell[index] ].classList.add('current');
		this.course.push(trueCell[index]);

		// ЗАКИДУЄМ В .div ЗВІДКИ І КУДА ХОДИВ КІНЬ
		this.consolka.innerHTML += this.board[current].posY + this.board[current].letters + ' ==> ' + this.board [ trueCell[index] ].posY + this.board [ trueCell[index] ].letters + '<Br/>';
	
		this.step++;
		if (this.step == 64) { // якщо всі клітинки заповнились онуляєм інтервал
	        clearInterval(this.interval);
	    }


	    function makeMasiOfNextPos(index) {
			x = that.board[index].posX; // получаєм кординати X клітинки на якій стоїть кінь
			y = that.board[index].posY; // аналогічно тільки Y
			let masivVars = [  
								[x + 1,  y + 2],    // робим масив з можливих ходів коня (двух-факторний Х, У)
								[x + 2,  y + 1],
								[x + 2,  y - 1],	
								[x + 1,  y - 2],
								[x - 1,  y - 2],
								[x - 2,  y - 1],
								[x - 2,  y + 1],
								[x - 1,  y + 2]
							];
			return masivVars;
		}
	    function proverkaNextPos(masivNextPos, masivIndex) {
			for ( let k = 0; k < that.board.length; k++ ) {
			 	for ( let i = masivNextPos.length - 1; i >= 0; i-- ) { // через два цикла проганяєм два масива
			 		if (masivNextPos[i][0] == that.board[k].posX && masivNextPos[i][1] == that.board[k].posY && that.board[k].pos == true && that.board[k].horse == false) {  
			 			masivIndex.push(k); //індекс клітинки на яку можна встати заносим в масив
			 		}
		    	}
			}
		}
		function whatToDoNext() {  // провіряєм клітинку на те скільки з неї можна зробити ходів
		 	for ( let i = 0; i < trueCell.length; i++ ) {

		 		nextTrueCell.length = 0; /// Обнуляєм тимчасовий масив

		 		var nextVars = makeMasiOfNextPos(trueCell[i]); // робим масив з наступних ходів - наступних ходів коня

		 		//ПРОВЕРКА  КЛЕТОК НА КОТОРИЕ МОЖНО ВСТАТЬ
				proverkaNextPos(nextVars, nextTrueCell);
				//console.log(nextTrueCell);
				nextArr.push(nextTrueCell.length);  // берем довжину масиву різних варіантів ходів і заносим довжини в інший масив
		 	}
		 	return nextArr;  // повертаєм цей масив
		}
	},
	/// СТАЄМ НА МИНУЛУ КЛІТИНКУ
	prevStep : function()
	{
		const that = this;
		const prevButton = document.getElementById('prevPos');
		prevButton.addEventListener('click', function(){
			let proverka = 1; // змінна зроблена для того щоб через неї провіряти два цикла і щоб один виконувався тільки після другого 
			let letter;  // будем записувати сюда де стоїть кінь 
			if (that.index == null || that.step == 1 || that.trueInterval == true) { // провірка на те чи не стоїмо ми на першій клітинці
				console.log('error preStep'); // провірка на те чи не запущений інтервал
			}
			else {
				for ( let i = 0; i < that.board.length; i++ ) { //ЗРОБЛЕНО ДВА ЦИКЛИ ТОМУ ЩО ДВІ ПРОВІРКИ МАЮТЬ ВИКОНУВАТИСЬ ПОСЛІДОВНО, 
					if (that.board[i].horse == true) {     //І ЯКЩО ОДИН ЦИКЛ, МОЖЕ ВИЙТИ ТАК ЩО СПОЧАТКУ ВИКОНАЄТЬСЯ ДРУГА А ПОТІМ ПЕРША, А ТРЕБА ПОСЛІДОВНО
						proverka = null;
				    	that.section[i].innerHTML = ""; // забираєм коня з клітинки на якій він стоїть
				    	that.section[i].classList.remove('current');
				    	that.board[i].horse = false;
				    	that.board[i].pos = true;

				    	console.log('del current');
				    	letter = that.board[i].posY + that.board[i].letters; // присвоюєм де стоїть кінь в буквеному форматі 2F, 4h.... 
					}
				}
				for ( let i = 0; i < that.board.length; i++ ) {  
					if (that.section[i].textContent == that.step-1 && proverka == null) { // шукаєм попередню клітинку
						that.step--;
						proverka = 1;
						that.board[i].pos = true;	///ставим коня на попередню клітинку
						that.board[i].horse = true;
						that.section[i].classList.add('current');

						console.log('set next');
						that.consolka.innerHTML += that.board[i].posY + that.board[i].letters + ' <== ' + letter + '<Br/>';
					}
				}
			}
		});
	},
	start : function() 
	{
		this.interval =  setInterval(() => {
			this.nextStep();	
			this.trueInterval = true; // потрібно для того щоб деактивовувати інші кнопки коли запущений інтервал
		},200);
		setTimeout(() => {
			this.trueInterval = false;
		}, 200*64+10); //інтервал між ходами 200 і всього 64 ходи тому множим на 64 і додаєм 10 щоб навєрніка
	},
	randomPosOfHorse : function() 
	{	
		const that = this;
		const randomButton = document.getElementById('button'); 
		randomButton.addEventListener('click', function(){
			if (that.index == null) {
				that.index = Math.round(Math.random()*63);  // генеруєм рандомну позицію на яку стане кінь
				if (that.index == 24) {  // з клітинки 24 прохід не можливий тому якщо вона згенерувалась, генеруєм іншу
					that.index = Math.round(Math.random()*63); 
				}
				that.board[that.index].horse = true;
				that.start();
			}
		});
	},
	clearBoard : function() 
	{
		const that = this;
		const clearDesk = document.getElementById('clear');
		clearDesk.addEventListener('click', function(){
			if (that.trueInterval == false) { /// проверка на те щоб дошка була заповнена якщо дошка не заповнена не онуляэм її
				that.index = null;
				that.step = 1;
				that.course = [];
				that.consolka.innerHTML = '';
				for ( let i = 0; i < that.board.length; i++ ) { //обнуляєм  шахматну дошку
					that.section[i].innerHTML = "";
					that.section[i].classList.remove('current');
					that.board[i].horse = false;
					that.board[i].pos = true;
				}
			}
		}); 
	},
	plusOnePos : function() 
	{
		const that = this;
		const nextButton = document.getElementById('nextPos');
		nextButton.addEventListener('click', function(){			
			if (that.trueInterval == false) { // провіряєм чи не запущений інтервал
				if (that.index == null) { // провіряєм чи не на 1 клітинці стоїть
					that.board[0].horse = true; // ставим на 1 клітинку
					that.index = 0;
					that.nextStep();	
				}
				else if(that.step == 64) {
					console.log('error');
				}
				else {
					that.nextStep();	
				}
			}
		});
	},
	clickChecker : function() 
	{
		const that = this;
		Array.from(that.section, el => el.addEventListener('click', e => { //перетворюєм колекію HTML в масив
			console.log(el.id);  // слухаєм кожну клітинку чи її не клікнули там де клікнули ставим коня
			if (that.index == null) {
				if (el.id-1 == 24) {
					alert("З цієї клітинки прохід неможливий");
				} 
				else {
					that.index =  el.id-1;
					that.board[that.index].horse = true;
					that.start();
				}	
			}	 
		}));
	},

}
chess.init();


