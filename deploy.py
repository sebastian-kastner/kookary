#!/usr/bin/python3

import subprocess
import getpass
import os
import argparse
import re

desc = '''Deployment helper script to deploy kookary sources to a webserver.
Requires sshpass, ssh, scp, make, php composer and node to be installed on the host system.
Locally builds the client and server sources using the respective make scripts and replaces the code on the server.

The server is configured by setting the "KOOKARY_SERVER_HOME", "KOOKARY_SERVER_USER_NAME" and "KOOKARY_SERVER_ADDR" as env variables

For the -clean flag, composer and php will be invoked on the server. To set the paths to the executables, set the env variables 
"KOOKARY_PHP_CMD" and "KOOKARY_COMPOSER_CMD" (either absolute or relative from the [server_home]/server directory). If not set,
the default invocation commands will be used.
'''

parser = argparse.ArgumentParser(prog='kookary deployment', description=desc)
parser.add_argument('target', choices=['server', 'client', 'all'], help="Target to replace. 'server' (i.e. php code), 'client' (i.e. html, css, js) code or 'all' for both.")
parser.add_argument('-clean', action='store_true', help='If set, all vendor specific php files will be replaced on the server as well. Required if php libraries were added or updated')
parser.add_argument('-simulate', action='store_true', help='If set, command line calls will only be printed and not executed')

class CmdExecutor():
    def __init__(self, user: str, addr: str, simulate: bool):
        self.user = user
        self.pw = ""
        self.addr = addr
        self.cwd = os.getcwd()
        self.simulate = simulate
        
    def exec(self, cmd: str):
        self.__print_cmd(cmd)
        if not self.simulate:
            subprocess.run(cmd, cwd=self.cwd, capture_output=False, check=True, shell=True)
            
    def exec_and_get(self, cmd: str) -> str:
        result = subprocess.run(cmd, cwd=self.cwd, stdout=subprocess.PIPE, check=True, shell=True)
        return result.stdout.decode("utf-8").strip()
        
    def ssh_exec(self, cmd: str):
        self.exec("sshpass -p {} ssh {}@{} '{}'".format(self.pw, self.user, self.addr, cmd))
        
    def ssh_cp(self, localFrm: str, serverTo: str):
        self.exec("sshpass -p {} scp -r {} {}@{}:{}".format(self.pw, localFrm, self.user, self.addr, serverTo))
        
    def prompt_pw(self):
        # no need to prompt for password when simulating
        if self.simulate:
            return
        password = getpass.getpass()
        self.pw = password
        
    def chdir(self, dir: str):
        self.cwd = dir
    
    def __print_cmd(self, cmd: str):
        # replace password of sshpass in output
        # prints all groups, except for the password
        print(re.sub(r"(sshpass\s+-p\s+)(.+)\s+((?:\bssh\b)|(?:\bscp\b))(.+)", r"\1 *** \3\4", cmd))
        
def get_env_var(var_name: str, default: str = None):
    if var_name in os.environ:
        return os.environ[var_name]
    if default is not None:
        return default
    print("Env var " + var_name + " needs to be set! Exiting.")
    exit(-1)

server_home = get_env_var('KOOKARY_SERVER_HOME')
server_user = get_env_var('KOOKARY_SERVER_USER_NAME')
server_addr = get_env_var('KOOKARY_SERVER_ADDR')

args = parser.parse_args()

invocation_dir = os.getcwd()

cmd = CmdExecutor(addr=server_addr, user=server_user, simulate=args.simulate)

# get current git revision
revision = cmd.exec_and_get("git rev-parse HEAD")

# prompt for password
cmd.prompt_pw()

if args.target == "all" or args.target == "client":
    print(">>> Write current git revision to .client_version file..")
    cmd.ssh_exec("echo " + revision + " > " + server_home + "/.client_version")
    
    # build and upload client
    print(">>> Building client")
    cmd.chdir(os.path.join(invocation_dir, "client"))
    cmd.exec("make build")
    
    print(">>> Removing old client..")
    cmd.ssh_exec("rm -rf " + server_home + "/css/")
    cmd.ssh_exec("rm -rf " + server_home + "/js/")
    # this only removes the index.html file. if there are others files, they might need cleanup from time to time
    cmd.ssh_exec("rm -rf " + server_home + "/index.html")

    print(">>> Uploading new client..")
    cmd.ssh_cp("dist/*", server_home)

# build and upload server
if args.target == "all" or args.target == "server":
    print(">>> Write current git revision to .server_version file..")
    cmd.ssh_exec("echo " + revision + " > " + server_home + "/server/.server_version")
    
    cmd.chdir(os.path.join(invocation_dir, "server"))
    # TODO: check if "public/bundles" needs to be included here (might be created when running composer install)
    server_uploads = [ "config", "src", "templates", "public/bundles", "public/index.php", "public/.htaccess", "composer.json" ]
    
    print(">>> Removing php files on server..")
    for upload in server_uploads:
        cmd.ssh_exec("rm -rf " + server_home + "/server/" + upload)
    
    print(">>> Uploading php files to server..");
    for upload in server_uploads:
        cmd.ssh_cp(upload, server_home + "/server/" + upload)
        
    php_cmd = get_env_var("KOOKARY_PHP_CMD", "php")
    composer_cmd = get_env_var("KOOKARY_COMPOSER_CMD", "composer")
    
    if args.clean:
        print(">>> Optimizing php sources on server..")
        cmd.ssh_exec("cd " + server_home + "/server/ && " + composer_cmd + " dump-autoload --optimize --no-dev --classmap-authoritative")
        print(">>> Installing php dependencies...")
        cmd.ssh_exec("cd " + server_home + "/server/ && " + composer_cmd + " install")
        print(">>> Cleaning php cache on server")
        cmd.ssh_exec("cd " + server_home + "/server/ && APP_ENV=prod APP_DEBUG=0 " + php_cmd + " bin/console cache:clear")

print(">>> Done")