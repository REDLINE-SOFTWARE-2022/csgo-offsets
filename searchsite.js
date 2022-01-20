function CreateSearchResult(lineNum, funcName, funcSig, dllName) {
	var searchResultDiv = document.createElement("div");
	searchResultDiv.classList.add("searchResult");
	
	searchResultDiv.innerHTML = funcName + "\n<br>\n";
	searchResultDiv.innerHTML += "<div class=\"result_BytePattern\">" + funcSig + "</div>";
	searchResultDiv.innerHTML += "<div class=\"result_DllName\"> in " + dllName + ".dll </div>";
	
	console.log("Created " + searchResultDiv.innerHTML + ", appending...")
	g_SearchUL.appendChild(searchResultDiv);
}

function HandleSigsText(text, dllName) {
	console.log(" -> HandleSigsText (length: " + text.length + ")");
	lines = text.split("\n");
	console.log(" -> Line (signature) count: " + lines.length);
	
	for (var i = 0; i < lines.length; i++) {
		if (lines[i].length == 0) {
			continue;
		}
		
		var lineParts = lines[i].split("=");
		if (lineParts.length != 2) {
			console.warn(" -> INVALID LINE: " +  lines[i]);
			continue;
		}
		
		var funcName = lineParts[0];
		var funcSig = lineParts[1];
		CreateSearchResult(i, funcName, funcSig, dllName);
	}
}

function LoadHandleSigsFile(file, dllName) {
	console.log("LoadHandleSigsFile: " + file);
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status === 200 || rawFile.status == 0) {
            HandleSigsText(rawFile.responseText, dllName);
        } else {
			console.error("Failed to load raw sigs file: " + file + ", status: " + rawFile.status);
		}
    }
	rawFile.send(null);
}

// https://www.w3schools.com/howto/howto_js_filter_lists.asp
// note: i have no idea what the fuck im doing im not a web dev
function UpdateSeach() {
	var input = document.getElementById('searchInput');
	var filter = input.value.toUpperCase();
	var ul = document.getElementById("searchUL");
	var seachResults = ul.getElementsByClassName("searchResult");
	console.log("Updating search for " + (seachResults.length) + " result(s)");
	
	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < seachResults.length; i++) {
		var elem = seachResults[i]
		var txtValue = elem.textContent || elem.innerText;
		if (txtValue.toUpperCase().indexOf(filter) > -1) {
			seachResults[i].style.display = "";
		} else {
			seachResults[i].style.display = "none";
		}
	}
}

///////////////////////////////

function Init() {
	console.log("Init() searchsite.js!");
	
	// lol
	g_SearchUL = document.getElementById("searchUL");
	g_SearchResults = document.getElementById("searchUL").getElementsByClassName("searchResult");
	
	LoadHandleSigsFile("https://raw.githubusercontent.com/KittenPopo/csgo-offsets/site/data/rawsigs_client.txt", "client");
}