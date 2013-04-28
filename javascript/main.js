function load(url, that) {

	if(url == null || typeof(url) != 'string') return;

	var xmlHttp = getHttpRequest();
	xmlHttp.open('GET', url, false);
	xmlHttp.send(null);
	if(xmlHttp.readyState == 4) {
		if(xmlHttp.status == 200 || xmlHttp.status == 304) {
			/*var js = document.createElement('script');
			js.type = 'text/javascript';
			js.charset = 'utf-8';
			js.text = xmlHttp.responseText;
			document.getElementsByTagName('head')[0].appendChild(js);*/

			if(!that) {
				return eval(xmlHttp.responseText);
			} else {

				return eval('(function(){' + xmlHttp.responseText + '})').bind(that)();
			}

		} else {
			alert('XML request error: ' + xmlHttp.statusText + ' (' + xmlHttp.status + ')');
		}
	}
}

function loadASync(url) {

	if(url == null || typeof(url) != 'string') return;


	var js = document.createElement('script');
	js.type = 'text/javascript';
	js.charset = 'utf-8';
	js.src = url;
	document.getElementsByTagName('head')[0].appendChild(js);

}


//javascript / google - code - prettify / prettify.js

function getHttpRequest() {
	if(window.XMLHttpRequest) {
		return new XMLHttpRequest();
	} else if(window.ActiveXObject) {
		return new ActiveXObject('Microsoft.XMLHTTP');
	}
}


load('javascript/jquery-1.9.1.min.js');
load('javascript/sammy-latest.min.js');
load('javascript/template.min.js');
load('javascript/template-syntax.js');
load('javascript/jsyaml.mini.js');
load('javascript/showdown.js');
load('javascript/showdown-ext/github.js');
load('javascript/showdown-ext/table.js');
load('javascript/showdown-ext/prettify.js');


function getSync(url) {
	return $.ajax({
		url: url,
		async: false
	}).responseText;
}

// initialize the application
var app = Sammy(function() {
	var that = this;


	/*window.onhashchange = function() {
		that.runRoute('get',that.lookupRoute('get',location.hash),"a");
		//that.setLocation();
	}*/


	var config = jsyaml.load(getSync('config.yml'));
	var database = localStorage.database ? JSON.parse(localStorage.database) : {
		posts: []
	};
	var main_content = $("#content"); //['github','table','prettify']
	var converter = new Showdown.converter({
		extensions: ['github', 'table', 'prettify']
	});
	var manages = {};

	load('app/manages.js', manages);
	template.helper('post_url', function(v) {
		return '#!/post/' + v.name;
	});
	template.helper('more', function(text) {
		return text.split(/<!--more-->/)[0];
	});
	template.helper('database', database);
	template.helper('config', config);

	function readPostInfo(text, name) {
		var ret = text.match(/([\s\S]*?)----*([\s\S]*)/);
		var head = jsyaml.load(ret[1]);
		var body = converter.makeHtml(ret[2]);
		head.name = name;
		head.body = body;
		return head;
	}

	function getPost(postList, index, callback) {
		if(!postList[index]) return callback();

		$.get('post/' + postList[index][1] , function(data) {

			database.posts[index] = readPostInfo(data, postList[index][0]);
			getPost(postList, index + 1, callback);
		}); 
	}


	function update(callback) {

		var newVersion = manages[config.manage.type].needUpdateTest(config, database);
		if( !! newVersion) {
			database.version = newVersion;
			var postList = manages[config.manage.type].getlist(config);
			for(var i in postList){
				postList[i] = [postList[i].replace(/^([0-9]*-[0-9]*-[0-9]*-)/,'').replace(/\.md$/,''),postList[i].replace(/\.md/g,'.md')];
			}
			getPost(postList, 0, function() {
				localStorage.database = JSON.stringify(database);
				callback();
			});

		}
		callback();
	}


	this.get('#!/', function() {
		var html = template.render('loading-tmpl', config);
		main_content.html(html);
		update(function() {
			var html = template.render('index-tmpl', database);
			$("title").text("Home | "+config.title);
			main_content.html(html);
		});
	});
	this.notFound = function(){
		var html = template.render('404-tmpl', database);
		main_content.html(html);
		
		return false;
  	}
  	
	this.get(config.routes.post, function() {
		//this.params['year']
		//this.params['month']
		//this.params['day']
		var post;
		var name = this.params['name'];
		var html = template.render('loading-tmpl', config);
		main_content.html(html);
		for(var i in database.posts) {
			if(database.posts[i].name == name) {
				post = database.posts[i];
				var html = template.render('post-tmpl', post);
				main_content.html(html);
				$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
				$("title").text(post.title+" | "+config.title);
				return true;
			}
		}
		this.notFound();

		
	});
	this.get(config.routes.page, function() {
		var post;
		var name = this.params['name'];
		var html = template.render('loading-tmpl', config);
		main_content.html(html);
		$.get('page/' + name + '.md', function(data) {
			var page = readPostInfo(data, name);
			var html = template.render('page-tmpl', page);
			main_content.html(html);
			$("title").text(page.title+" | "+config.title);
			$('pre code').each(function(i, e) {hljs.highlightBlock(e)});
			
		}).fail(function(){ 
  			this.notFound();
		});



		//this.params['year']
		//this.params['month']
		//this.params['day']
		//this.params['name']
	});
});



// start the application
app.run('#!/');

