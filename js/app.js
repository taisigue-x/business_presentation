// observe scroll intersection
const observeScroll = ()=> {

	// scroll handler function
	const scrollHandler = ()=>{
		
		//get buttons and sections
		const sections = $(".animated-section");
		const buttons = $(".pc-nav-btn");

		// remove checked class to all btns
		buttons.removeClass("checked-btn");

		// target button
		let tar_btn = null;

		// for each section
		sections.each(function (){

			// get section position and item
			const position = this.getBoundingClientRect();
			const item = $(this);
			const entrance = item.attr("data-entrance");

			// check if scroll is over section
			if (position.top < window.innerHeight && position.bottom >= 0) {
				tar_btn = (tar_btn===null)?$(`#${item.attr("data-target-btn")}`):tar_btn;
				item.addClass(entrance);
			} else {
				item.removeClass(entrance)
			}
		});

		//check button
		if(tar_btn!==null) {
			tar_btn.addClass("checked-btn");
		}

	};

	// add scroll event listener
	$(window).on("scroll", scrollHandler);

	//initial trigger
	scrollHandler();

};




// relate nodes
const relateNodes = (nodes, previous_trace)=> {

	nodes.each((i, node_val)=> {

		//get <li> node
		let node = $(node_val);
		//get <span> tag
		let tag = node.find("> span");
		let tag_trace = `${previous_trace}_${i}`;

		//set id
		tag.attr("data-self-trace", tag_trace);
		tag.attr("data-previous-trace", previous_trace);

		let sub_categories = node.find("> ul > li");

		// relate sub-nodes
		if(sub_categories.length > 0 ) {

			relateNodes(sub_categories, tag_trace);
		}

	});

};




// resize canvas
const resizeSkillTreeCanvas = ()=> {

	//get canvas
	let canvas = $("#skill_tree_canvas").get(0);

	//get canvas rect
	let canvas_rect = canvas.getBoundingClientRect();

	//resize canvas
	canvas.setAttribute("width", `${canvas_rect.width}px`);
	canvas.setAttribute("height", `${canvas_rect.height}px`);

};




// draw tag node relations
const drawTagNodeRelations = () => {

	// get canvas objects
	const canvas = $("#skill_tree_canvas").get(0);
	const canvas_rect = canvas.getBoundingClientRect();
	const drawer = canvas.getContext("2d");

	// cuadratic line data
	const cuadratic_x_mod = 30;
	const line_width = 2;

	//get all skill-tree tag nodes
	const tag_nodes = $(".skill-tree span[data-self-trace][data-previous-trace]");

	//for each tag node draw cuadratic line
	tag_nodes.each((i, val) => {

		// get self and  previous node reference
		let self_tag_node = $(val);
		let previous_tag_node = $(`.skill-tree span[data-self-trace='${self_tag_node.attr("data-previous-trace")}']`);

		// get parent container
		let parent_container = self_tag_node.parent().parent();

		// if self node has previous node
		if((previous_tag_node.length > 0) && (!parent_container.hasClass("d-none")) ) {
 
			//get self and previous node coordinates
			let self_tag_rect = self_tag_node.get(0).getBoundingClientRect();
			let previous_tag_rect = previous_tag_node.get(0).getBoundingClientRect();

			// calc cuadractic line geom
			let start_x = (previous_tag_rect.x-canvas_rect.x) + previous_tag_rect.width;
			let start_y = (previous_tag_rect.y - canvas_rect.y) + (previous_tag_rect.height/2);
			let end_x = self_tag_rect.x-canvas_rect.x;
			let end_y = (self_tag_rect.y - canvas_rect.y) + (self_tag_rect.height/2);

			// draw cuadratic line
			drawer.beginPath();
			drawer.lineWidth = line_width;
			drawer.moveTo(start_x, start_y);
			drawer.quadraticCurveTo((start_x-cuadratic_x_mod), start_y, end_x, end_y);
			drawer.strokeStyle = "#0cd597";
			drawer.stroke();

		}

	})

};




// prepare skill tree
const skillTree = ()=> {

	//get skill tree
	let skill_tree  = $("#skill_tree");
	let display_btn = $("#skill_tree_state");

	// get root items
	let root_nodes = skill_tree.find("> li");

	// relate the tag nodes
	relateNodes(root_nodes, 0);

	// resize skill tree canvas
	resizeSkillTreeCanvas();

	// draw tag node relations
	drawTagNodeRelations();

	// when windows resize then re-draw canvas
	$(window).on("resize", function() {
		resizeSkillTreeCanvas();
		drawTagNodeRelations();
	});


	//add click event listener
	skill_tree.on("click", (event)=>{

		if(event.target.tagName==="SPAN")  {

			// get trigger <span>
			let trigger = $(event.target);

			// get trigger parent <li>
			let trigger_parent = trigger.parent();

			let related_nodes = trigger_parent.find("> ul");

			if(related_nodes.length > 0) {
				related_nodes.toggleClass("d-none");
				resizeSkillTreeCanvas();
				drawTagNodeRelations();
			}

		}

	});


	//display event
	display_btn.change(function() {

		//remove to all
		skill_tree.find("ul").removeClass("d-none");

		if(!this.checked) {
			skill_tree.find(".toggle-controled").addClass("d-none");
		}
		resizeSkillTreeCanvas()
		drawTagNodeRelations();

	});


};




// add background-partices using particlesJS lib
const overallBackgroundParticles = ()=> {

	particlesJS('particles_container',
		{
			"particles": {
				"number": {
					"value": 1,
					"density": {
						"enable": true,
						"value_area": 150
					}
				},
				"color": {
					"value": "#0d6efd"
				},
				"shape": {
					"type": "circle",
					"stroke": {
						"width": 0,
						"color": "#000000"
					},
					"polygon": {
						"nb_sides": 4
					},
				},
				"opacity": {
					"value": 0.2,
					"random": false,
					"anim": {
						"enable": false,
						"speed": 1,
						"opacity_min": 0.1,
						"sync": false
					}
				},
				"size": {
					"value": 70,
					"random": true,
					"anim": {
						"enable": false,
						"speed": 40,
						"size_min": 0.1,
						"sync": false
					}
				},
				"line_linked": {
					"enable": false,
					"distance": 150,
					"color": "#ffffff",
					"opacity": 0.4,
					"width": 1
				},
				"move": {
					"enable": true,
					"speed": 1,
					"direction": "none",
					"random": false,
					"straight": false,
					"out_mode": "out",
					"attract": {
						"enable": false,
						"rotateX": 600,
						"rotateY": 1200
					}
				}
			},
			"interactivity": {
				"detect_on": "canvas",
				"events": {
					"onhover": {
						"enable": false,
						"mode": "repulse"
					},
					"onclick": {
						"enable": false,
						"mode": "push"
					},
					"resize": false
				},
				"modes": {
					"grab": {
						"distance": 400,
						"line_linked": {
							"opacity": 1
						}
					},
					"bubble": {
						"distance": 400,
						"size": 40,
						"duration": 2,
						"opacity": 8,
						"speed": 3
					},
					"repulse": {
						"distance": 200
					},
					"push": {
						"particles_nb": 4
					},
					"remove": {
						"particles_nb": 2
					}
				}
			},
			"retina_detect": false,
			"config_demo": {
			}
		}
	);
};



// prepare all
const prepareAll = ()=> {

	observeScroll();
	skillTree();
	//overallBackgroundParticles();

};




// wait until the DOM is ready
$(document).ready(function(){

	// call prepare all
	prepareAll();

});