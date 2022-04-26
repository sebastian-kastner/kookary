import subprocess
import getpass
import sys
import os
from inspect import getsourcefile

class DeploymentArgs():
    def __init__(self, args):
        self.opts = []
        self.cmd = None
        for x in range(1, len(args)):
            arg = args[x]
            if(arg.startswith("--")):
                self.opts.append(arg)
            elif self.cmd is not None:
                print("Can only process a single command!")
                print(args)
                print("given")
                exit(-1)
            else:
                self.cmd = arg

def os_exec(cmd: str):
    print("Executing: " + cmd)
    res = subprocess.call(cmd, shell = True)
    if res == -1:
        print("Failed to execute: " + cmd)
        exit(-1)
    
args = DeploymentArgs(sys.argv)

required_env_vars = [ "KOOKARY_SERVER_HOME", "KOOKARY_SERVER_USER_NAME", "KOOKARY_SERVER_ADDR" ]
for var in required_env_vars:
    if var not in os.environ:
        print(var + " env var needs to be set")
        exit(-1)

server_home = os.environ['KOOKARY_SERVER_HOME']
server_user = os.environ['KOOKARY_SERVER_USER_NAME']
server_addr = os.environ['KOOKARY_SERVER_ADDR']

invocation_dir = os.getcwd()

try:
    password = getpass.getpass()
except Exception as error:
    print('Prompting for password failed', error)

if args.cmd is None or args.cmd == "client":
    # build and upload client
    
    print(">>> Building client")
    os.chdir(os.path.join(invocation_dir, "client"))
    os_exec("npm run build")
    
    print(">>> Removing old client..")
    
    os_exec("sshpass -p {} ssh {}@{} 'rm -rf {}/css/'".format(password, server_user, server_addr, server_home))
    os_exec("sshpass -p {} ssh {}@{} 'rm -rf {}/js/'".format(password, server_user, server_addr, server_home))
    os_exec("sshpass -p {} ssh {}@{} 'rm -r {}/index.html'".format(password, server_user, server_addr, server_home))
    
    print(">>> Uploading new client..")
    os_exec("sshpass -p {} scp -r dist/* {}@{}:{}".format(password, server_user, server_addr, server_home))

# build and upload server
if args.cmd is None or args.cmd == "server":
    # build and upload client
    os.chdir(os.path.join(invocation_dir, "server"))
    os_exec("composer dump-autoload --optimize --no-dev --classmap-authoritative")
    
    print(">>> Uploading server files..")
    
    server_uploads = [ "config", "src", "templates", "public", "composer.json" ]
    if '--clean' in args.opts:
        server_uploads.append("vendor")
    
    os_exec("sshpass -p {} ssh {}@{} 'rm -rf {}/server/var/cache'".format(password, server_user, server_addr, server_home))
    
    for upload in server_uploads:
        is_dir = "-r" if (upload.find(".") < 0) else ""
        os_exec("sshpass -p {} ssh {}@{} 'rm {} {}/server/{}'".format(password, server_user, server_addr, is_dir, server_home, upload))
    
    for upload in server_uploads:
        is_dir = "-r" if (upload.find(".") < 0) else ""
        os_exec("sshpass -p {} scp {} {} {}@{}:{}/server/".format(password, is_dir, upload, server_user, server_addr, server_home))

print(">>> Done")