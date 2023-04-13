#!/usr/bin/python3

import subprocess
import getpass
import os
import argparse
import re

desc = '''Deployment helper script to deploy kookary sources to a webserver.
Requires sshpass, ssh, scp, make, php composer and node to be installed on the host system.
Locally builds the client and server sources using the respective make scripts and replaces the code on the server.

The server is configured by setting the "KOOKARY_SERVER_HOME", "KOOKARY_SERVER_USER_NAME" and "KOOKARY_SERVER_ADDR" as env variables'''

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
        if not self.simulate:
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

required_env_vars = [ "KOOKARY_SERVER_HOME", "KOOKARY_SERVER_USER_NAME", "KOOKARY_SERVER_ADDR" ]
for var in required_env_vars:
    if var not in os.environ:
        print(var + " env var needs to be set")
        exit(-1)

server_home = os.environ['KOOKARY_SERVER_HOME']
server_user = os.environ['KOOKARY_SERVER_USER_NAME']
server_addr = os.environ['KOOKARY_SERVER_ADDR']

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
    
    # build and upload client
    cmd.chdir(os.path.join(invocation_dir, "server"))
    cmd.exec("make build")
    
    print(">>> Uploading server files..")
    
    server_uploads = [ "config", "src", "templates", "public/bundles", "public/index.php", "public/.htaccess", "composer.json" ]
    if args.clean:
        server_uploads.append("vendor")
    
    print(">>> Removing php cache on server..")
    cmd.ssh_exec("rm -rf " + server_home + "/server/var/cache")
    
    print(">>> Removing php files on server..")
    for upload in server_uploads:
        cmd.ssh_exec("rm -rf " + server_home + "/server/" + upload)
    
    print(">>> Upload php files to server..");
    for upload in server_uploads:
        cmd.ssh_cp(upload, server_home + "/server/" + upload)

print(">>> Done")