require 'rubygems'
require 'bundler/setup'

Bundler.require(:default)

class MCWebby
	attr_accessor :mcdir, :mcwrapper

	def initialize()
		@mcdir = '/Users/monkemojo/minecraft_server/'
		@mcwrapper = '/usr/bin/mcwrapper'
	end

	def execute_command(command)
		return self.execute_mcwrapper("cmd #{command}")
	end

	def execute_mcwrapper(command)
		return `cd #{@mcdir}; #{@mcwrapper} #{command}`
	end

	def send_mc_message(msg)
		return self.execute_mcwrapper("cmd say #{msg}")
	end

	def last_n_line_of_log(n)
		return `tail -n #{n} #{mcdir}server.log`
	end
end

set :public_folder, 'public'

get "/" do
  redirect '/index.html' 
end

get '/online.json' do
	mcwebby = MCWebby.new
	mcwebby.execute_command '/list' # have mcwrapper query the users

	sleep 1 # sleep for a second while we wait on the mc server
	lines = mcwebby.last_n_line_of_log 2

	data = lines.split '[INFO] '
	tmp = data[1].split('/') # i need to brush up on my regexs
	online = tmp[0][-1, 1]
	maxusers = tmp[1][0, 1]
	users = data[2].split(',')

	status = mcwebby.execute_mcwrapper 'status'
	backup = mcwebby.execute_mcwrapper 'config latestbackup'

	content_type :json
	{ :onlineCount => online, 
		:maxOnline => maxusers, 
		:userList => users,
		:status => status,
		:lastBackup => backup }.to_json
end

