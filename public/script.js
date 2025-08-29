function selectImage(img){ 
	var selectedPhoto = document.getElementById("selectedImage")
	selectedPhoto.src = img.src
	console.log(img.width)
	console.log(img.height)
	selectedPhoto.width = img.width
	selectedPhoto.height = img.height
	selectedPhoto.style.transform = "scale(2,2)"
	document.getElementById("popup").style.transform = "translateY(0%)"
}

function hideImage(){
	popup = document.getElementById("popup")
	popup.style.transform = "translateY(-100%)"
	popup.style.transform = "scale(0,0)"
}


function debounce(func, timeout = 700){
	let timer;
	return(...args) => {
		clearTimeout(timer) //clearTimeout is part of JS
		timer = setTimeout(() => func(...args), timeout); //setTimeout is part of JS
	}
}

function _updateTitle(title){
	const url = "/update/" + title.parentNode.dataset.id
	const data = {
		title: title.innerText
	}
	console.log("changing title...")
	console.log(data)
	fetch(url,{
		method: "PATCH",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data)
	})	
}


function _updateLocation(loc){
	const url = "/update/" + loc.parentNode.dataset.id
	const data = {
		location: loc.innerText
	}
	console.log("changing location...")
	console.log(data)
	fetch(url,{
		method: "PATCH",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data)
	})	
}


function _updateDescription(desc){
	const url = "/update/" + desc.parentNode.dataset.id
	const data = {
		description: desc.innerText
	}
	console.log("changing description...")
	console.log(data)
	fetch(url,{
		method: "PATCH",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data)
	})	
}


function showSizeForm(item){
	const url = "/update/" + item.parentNode.dataset.id
	const form = item.parentNode.querySelector(".collapsible")
	if (form.style.display == "none" || form.style.display == ""){
		form.style.display = "block"
		form.style.height = "100%"	
	} else{
		form.style.display = "none"
		form.style.height = "0px"
	}

}

function updatesize(size){
	const width = size.parentNode.querySelector(".width")
	const height = size.parentNode.querySelector(".height")
	const url = "/update/" + size.parentNode.parentNode.dataset.id
	const data = {
		width: width.value,
		length: height.value
	}
	console.log("updating size..")
	console.log(data)
	fetch(url,{
		method: "PATCH",
		headers: {
			"content-type": "application/json"
		},
		body: JSON.stringify(data)
	})

	location.reload()
	
}

const updateTitle = debounce(_updateTitle)
const updateLocation = debounce(_updateLocation)
const updateDescription = debounce(_updateDescription)