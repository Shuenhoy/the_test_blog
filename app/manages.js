<<<<<<< HEAD
this.github = {
	needUpdateTest: function(config,database) {

		var info = JSON.parse(getSync('https://api.github.com/repos/' + config.manage.user + '/' + config.manage.repo + '/branches'));

		if(database.version !== info[0].commit.sha) {
			return info[0].commit.sha;
		} else {
			return false;
		}
	},
	getlist: function(config) {
		var list=JSON.parse(getSync('https://api.github.com/repos/'+config.manage.user+'/'+config.manage.repo+'/contents/post'));
		
		var tlist=[];
		for (var i = list.length - 1; i >= 0; i--) {
			
			tlist[i]=list[i].name.replace(/^([0-9]*-[0-9]*-[0-9]*-)/,'').replace(/\.md$/,'');
		};
		console.log(tlist)
		return tlist
	}
}
this.manul = {
	needUpdateTest: function(config, database) {
		if (database.version !== config.manage.version || config.manage.always) {
			return config.version || config.manage.always;
		} else{
			return false;
		};
	},
	getlist: function() {
		return jsyaml.load(getSync("list.yml"));
	}
}
=======
this.github = {
	needUpdateTest: function(config,database) {

		var info = JSON.parse(getSync('https://api.github.com/repos/' + config.manage.user + '/' + config.manage.repo + '/branches'));

		if(database.version !== info[0].commit.sha) {
			return info[0].commit.sha;
		} else {
			return false;
		}
	},
	getlist: function(config) {
		var list=JSON.parse(getSync('https://api.github.com/repos/'+config.manage.user+'/'+config.manage.repo+'/contents/post'));
		
		var tlist=[];
		for (var i = list.length - 1; i >= 0; i--) {
			
			tlist[i]=list[i].name.replace(/^([0-9]*-[0-9]*-[0-9]*-)/,'').replace(/\.md$/,'');
		};
		console.log(tlist)
		return tlist
	}
}
this.manul = {
	needUpdateTest: function(config, database) {
		if (database.version !== config.manage.version || config.manage.always) {
			return config.version || config.manage.always;
		} else{
			return false;
		};
	},
	getlist: function() {
		return jsyaml.load(getSync("list.yml"));
	}
}
>>>>>>> 2e6ecbd97bf602521fdb4b9848a9524c635aabad
