import json
import math
import os
import re
import socket
import subprocess
import time
import traceback

def exec_cmd(cmd):
    try:
        popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        returncode = popen.wait()
        if returncode == 0:
            stdout_data = popen.communicate()[0]
            result = (returncode, stdout_data.decode('utf-8'))
        else:
            stderr_data = popen.communicate()[1]
            result = (returncode, stderr_data.decode('utf-8'))
    except KeyboardInterrupt:
        raise
    except:
        result = (1, traceback.format_exc())

    return result

def exec_cmd_with_timeout(cmd, timeout=10):
    try:
        is_timeout = False
        popen = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=True)
        begin_time = time.time()
        while True:
            returncode = popen.poll()
            if returncode is not None:
                break
            elapsed_time = time.time() - begin_time
            if elapsed_time > timeout:
                is_timeout = True
                popen.terminate()
                result = (1, 'command timed out after %d secs' % timeout)
        if is_timeout is False:
            if returncode == 0:
                stdout_data = popen.communicate()[0]
                result = (returncode, stdout_data.decode('utf-8'))
            else:
                stderr_data = popen.communicate()[1]
                result = (returncode, stderr_data.decode('utf-8'))
    except KeyboardInterrupt:
        raise
    except:
        result = (1, traceback.format_exc())

    return result

def get_hostname():
    hostname = socket.gethostname()
    return hostname

def get_ips():
    # cmd = 'ip -family inet address'
    # cmd = 'ip -family inet address show up'
    # cmd = 'ip -family inet -brief address show up'
    cmd = 'ip -family inet address show up'
    result = exec_cmd_with_timeout(cmd)

    if result[0] != 0:
        print("cmd: %s" % cmd)
        print("cmd result: %s" % result)
        raise Exception(result)

    regexp = re.compile(r'inet\s*(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})')
    ips = regexp.findall(result[1])
    if '127.0.0.1' in ips:
        ips.remove('127.0.0.1')
    ips = ','.join(ips)

    return ips

def get_os():
    os2 = ''

    if os.path.isfile('/etc/centos-release'):
        file = open('/etc/centos-release')
        try:
            os2 = file.readline().strip()
        finally:
            file.close()
    elif os.path.isfile('/etc/redhat-release'):
        file = open('/etc/redhat-release')
        try:
            os2 = file.readline().strip()
        finally:
            file.close()
    elif os.path.isfile('/etc/os-release'):
        file = open('/etc/os-release')
        try:
            for line in file.readlines():
                if line.startswith('PRETTY_NAME='):
                    line = line.strip()
                    os2 = line.split('=')[1]
                    os2 = os2.replace('"', '')
                    break
        finally:
            file.close()
    elif os.path.isfile('/etc/issue'):
        file = open('/etc/issue')
        try:
            os2 = file.readline().strip()
        finally:
            file.close()
    else:
        pass

    return os2

def get_arch():
    cmd = 'uname -m'
    result = exec_cmd_with_timeout(cmd)

    if result[0] != 0:
        print("cmd: %s" % cmd)
        print("cmd result: %s" % result)
        raise Exception(result)

    arch = result[1].strip()

    return arch

def get_kernel():
    cmd = 'uname -r'
    result = exec_cmd_with_timeout(cmd)

    if result[0] != 0:
        print("cmd: %s" % cmd)
        print("cmd result: %s" % result)
        raise Exception(result)

    kernel = result[1].strip()

    return kernel

def get_cpu():
    cpu = 0

    file = open('/proc/cpuinfo')
    try:
        for line in file.readlines():
            if line.startswith('processor'):
                cpu += 1
    finally:
        file.close()

    return cpu

def get_memory():
    memory = 0

    file = open('/proc/meminfo')
    try:
        for line in file.readlines():
            if line.startswith('MemTotal:'):
                memory = int(line.split()[1])
                break
    finally:
        file.close()

    # memory = int(round(float(memory) / (1024 * 1024)))
    memory = int(math.ceil(float(memory) / (1024 * 1024)))

    return memory

def get_swap():
    swap = 0

    file = open('/proc/meminfo')
    try:
        for line in file.readlines():
            if line.startswith('SwapTotal:'):
                swap = int(line.split()[1])
                break
    finally:
        file.close()

    # swap = int(round(float(swap) / (1024 * 1024)))
    swap = int(math.ceil(float(swap) / (1024 * 1024)))

    return swap

def get_disk():
    disk = 0

    file = open('/proc/mounts')
    try:
        for line in file.readlines():
            # /dev/loop0
            if (line.startswith('/dev') and
                '/dev/loop' not in line and
                'chroot' not in line and
                'docker' not in line):
                mount_point = line.split()[1]
                stat = os.statvfs(mount_point)
                disk += stat.f_frsize * stat.f_blocks
    finally:
        file.close()

    # alibaba cloud ecs, round() returns 39g, math.ceil() returns 40g
    disk = int(math.ceil(float(disk) / (1024 * 1024 * 1024)))

    return disk

def get_host():
    host = {
        'hostname': get_hostname(),
        'ips':      get_ips(),
        'os':       get_os(),
        'arch':     get_arch(),
        'kernel':   get_kernel(),
        'cpu':      get_cpu(),
        'memory':   get_memory(),
        'swap':     get_swap(),
        'disk':     get_disk(),
    }

    host = json.dumps(host)

    return host

if __name__ == '__main__':
    print(get_host())
