this.github = {
	needUpdateTest: function(config,database) {

		var info = JSON.parse(getSync('https://api.github.com/repos/' + config.manage.config.user + '/' + config.manage.config.repo + '/branches'));
		if(database.version !== info[0].commit.sha) {
			return info[0].commit.sha;
		} else {
			return false;
		}
	},
	update: function(updateDB,info) {
		var list=getSync('https://api.github.com/repos/'+config.manage.username+'/'+config.manage.reponame+'/contents/');
		var tlist=[]
		for (var i = list.length - 1; i >= 0; i--) {
			tlist[0]=list[i].name;
		};
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
