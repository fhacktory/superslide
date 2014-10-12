superslide-nodejs
=================

-- How to launch the database for the presentation's content
	`mongod --dbpath data`
	
-- How to launch the application after that
	`Run `nodejs app.js`` which is on the root directory


------ 
Parts :
	- data (Save the presentation's content, because of the size)
	- node_modules
	- public 
		- bootstrap
		- fonts
		- images
		- scripts (All the js files)
		- style (All the css files)
	- routes (Router, in order to dispatch the request)
	- views ((All the views with Mustache (In order to make templates))
	
	
	- app.js (The Back End)