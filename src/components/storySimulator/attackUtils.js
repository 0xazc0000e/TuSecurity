// Simulates command execution for the Attack Simulator/Cyber Range
// Returns string output or null if handled elsewhere

export const executeAttackCommand = (cmdStr, role) => {
    const args = cmdStr.trim().split(/\s+/);
    const cmd = args[0].toLowerCase();
    const target = args[1];

    switch (cmd) {
        case 'help':
            return `Available commands:
  ping <target>       Check host connectivity
  nmap <options> <target>   Network exploration and port scanning
  whois <ip>          Query IP registration info
  clear               Clear terminal screen
  help                Show this help message`;

        case 'ping':
            if (!target) return 'usage: ping <destination>';
            if (target === '192.168.1.55') {
                return `PING 192.168.1.55 (192.168.1.55): 56 data bytes
64 bytes from 192.168.1.55: icmp_seq=0 ttl=64 time=0.042 ms
64 bytes from 192.168.1.55: icmp_seq=1 ttl=64 time=0.038 ms
64 bytes from 192.168.1.55: icmp_seq=2 ttl=64 time=0.051 ms
64 bytes from 192.168.1.55: icmp_seq=3 ttl=64 time=0.045 ms

--- 192.168.1.55 ping statistics ---
4 packets transmitted, 4 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 0.038/0.044/0.051/0.005 ms`;
            } else {
                return `PING ${target} (192.168.1.1): 56 data bytes
Request timeout for icmp_seq 0
Request timeout for icmp_seq 1
Request timeout for icmp_seq 2
Request timeout for icmp_seq 3

--- ${target} ping statistics ---
4 packets transmitted, 0 packets received, 100.0% packet loss`;
            }

        case 'nmap':
            if (!target && args.length < 2) return 'usage: nmap [Scan Type(s)] [Options] {target specification}';

            // Basic simulation of nmap output
            return `Starting Nmap 7.94 ( https://nmap.org ) at 2024-02-14 03:45 UTC
Nmap scan report for smartgrid-ctrl-01 (192.168.1.55)
Host is up (0.00042s latency).
Not shown: 997 closed tcp ports (reset)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
502/tcp open  mbap
MAC Address: 00:0C:29:1A:2B:3C (VMware)

Nmap done: 1 IP address (1 host up) scanned in 1.24 seconds`;

        case 'whois':
            // Simulation for the "Bad IP" in defender scenario
            if (args.includes('45.33.22.11')) {
                return `% This is the RIPE Database query service.
% The objects are in RPSL format.

inetnum:        45.33.0.0 - 45.33.255.255
netname:        UNKNOWN-ISP
country:        XK
admin-c:        AB1234-RIPE
tech-c:         CD5678-RIPE
status:         ASSIGNED PA
mnt-by:         MNT-UNKNOWN
created:        2023-05-10T10:00:00Z
last-modified:  2023-05-10T10:00:00Z
source:         RIPE

% Information related to '45.33.22.11'

route:          45.33.0.0/16
descr:          Suspicious subnet detected by multiple feeds
origin:         AS65535
mnt-by:         MNT-UNKNOWN
created:        2023-05-10T10:00:00Z
last-modified:  2023-05-10T10:00:00Z
source:         RIPE`;
            }
            return `whois: ${target || args[1]}: No match for "${target || args[1]}".`;

        case 'grep':
            return `Feb 14 03:35:12 smartgrid-ctrl-01 sshd[1234]: Failed password for invalid user admin from 45.33.22.11 port 54321 ssh2
Feb 14 03:35:15 smartgrid-ctrl-01 sshd[1234]: Failed password for invalid user root from 45.33.22.11 port 54322 ssh2`;

        case 'tail':
            return `Feb 14 03:45:01 smartgrid-ctrl-01 CRON[2020]: (root) CMD (command -v debian-sa1 > /dev/null && debian-sa1 1 1)
Feb 14 03:46:22 smartgrid-ctrl-01 kernel: [ 1234.567890] iptables: IN=eth0 OUT= MAC=00:0c:29:1a:2b:3c... SRC=45.33.22.11 DST=192.168.1.55 LEN=60 ... PROTO=TCP SPT=443 DPT=502 ...`;

        default:
            return `bash: ${cmd}: command not found`;
    }
};
