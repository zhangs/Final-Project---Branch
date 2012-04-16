/*
Billy Mills
CSCI 344
project2.js
Feb 20, 2012
*/

/*
Slightly edited by Shuo Zhang for final project, erased some stuff not needed for this project
*/

//function initiated on page load, waits for click or enter
function getSearchTerm () {
	//run main on click
//----------------------
	// picks up value from drop-down list ~~~~~~~~~~~~~
	$("#search_button").click(function() {
		main($("#term").val(), $("#brewlist").val());
	}); //end click function
//----------------------

	// picks up value from drop-down list ~~~~~~~~~~~~~	
	//run main if 'enter' is pressed
	$("#term").keypress(function(e) {
    	if(e.keyCode == 13) {
        	//alert('You pressed enter!');
   		    main($("#term").val(), $("#brewlist").val());
   		 } //end if
	}); //end function	
} //end getSearchTerm

//function called from getSearchTerm
//-----------------------------
//accepts value from drop-down list as droplist_term ~~~~~~~~~~~~~	
function main(test_term, droplist_term) {
//-----------------------------

	changeHeader(); //call function to insert header in tweet box
	resultsBox();  //call function to fadeIn results and new search button
		//following lines will remove contents of tweet box on click
	var tweet_div = document.getElementById("tweets");
	while( tweet_div.hasChildNodes() ){
    	tweet_div.removeChild(tweet_div.lastChild);
	}
	
	var count = 0;  //used for alternating colors
	var paragraphs = [];  //declare new array alt var object_array = new Array();
	var search_term = test_term;
//---------------------------------------------
	// spotter searches for brew selected from drop-down list
	var s = new Spotter("twitter.search",
			{q:droplist_term, period:120},
			{buffer:true, bufferTimeout:1000}
		);
//---------------------------------------------
		
	//function will get one new tweet	
	s.register(function(tweet) {
		count = count+1;  //increment count
		var color;  //variable to alternate color
		var profile_image = "<img class='pic_class' src='"+tweet.profile_image_url+"' />"; //profile image into var
		if(count%2 === 0) {  //alternate colors based on count
				color= "gray";  //alt "'gray'" then single quotes not necessary below
			} else {
				color = "dkGray";
			} //end else
			
		var new_paragraph = $("<p class ='"+color+"'>"+profile_image+tweet.text+"</p>");  //single quote stays within doubles bc class needs quotes
//----------------------			
		// my code here (Shuo Zhang): ~~~~~~~~~~~~~	
		// Spotter picks up tweets that match the droplist_term value and then checks to see
		// if tweet has the search term in the textbox
		if(tweet.text.match(test_term)) {
			$("#searching").replaceWith("<div id='searching'>" + profile_image + tweet.text + "</div>");
		}		
//----------------------		
		if (paragraphs.length >= 4) {  //if count is 10 or larger remove element from array
			var p = paragraphs.shift(); //fifo first in first out
			p.fadeOut(1000, function() { // callback function applies funtion to last item
				p.remove();	
			}); //end fadeOut
		}; //end if

		paragraphs.push(new_paragraph); //add paragraph to array
		new_paragraph.hide();
		$("#tweets").prepend(new_paragraph);  //newest tweets first
		new_paragraph.slideDown();		
	}); //end register
	
	s.start();
	
} //end main

//function will change interior of search box to keep counts
//----------------------
	// changed content (div id), erased a little ~~~~~~~~~~~~~	
function resultsBox (){
	var new_contents = $("<div id='search_contents'><div id = 'searching'>Searching</div><br><button class='btn' value='Reload Page' onClick='window.location.reload()'>New Search</button></div>") ;
	new_contents.hide();
	$("#search_contents").fadeOut(1000, function() {
    	$("#search_contents").replaceWith(new_contents);
    	$(new_contents).fadeIn(1000);
	});	
}
//---------------------

//function to change header in tweet box
function changeHeader() {
	var new_contents = $("<div id='tweet_header'><h4>some recent tweets...</h4></div>");
	new_contents.hide();
	$("#tweet_header").replaceWith(new_contents);
	$(new_contents).fadeIn(1000);
}

//ready function
$(document).ready(function() {
	getSearchTerm();	
});