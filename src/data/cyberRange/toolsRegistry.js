/**
 * Tools Registry - Central database of all available tools
 * Each tool has a realistic command simulator
 */

export const TOOL_CATEGORIES = {
    RECON: 'recon',
    ANALYSIS: 'analysis',
    EXPLOITATION: 'exploitation',
    DEFENSE: 'defense',
    FORENSICS: 'forensics'
};

export const TOOLS = {
    // ==================== RECONNAISSANCE ====================
    ping: {
        id: 'ping',
        name: 'ping',
        category: TOOL_CATEGORIES.RECON,
        roles: ['attacker', 'defender'],
        description: {
            ar: 'فحص إمكانية الوصول إلى جهاز عبر الشبكة',
            en: 'Test connectivity to a network host'
        },
        syntax: 'ping <target>',
        examples: ['ping 192.168.1.55', 'ping gateway-tu-01'],
        manPage: {
            ar: 'يرسل حزم ICMP Echo للتحقق من حالة الاتصال ووقت الاستجابة.',
            en: 'Sends ICMP Echo packets to test connectivity and response time.'
        },
        simulator: (args, context) => {
            const target = args.split(' ')[0];

            if (target === '192.168.1.55' || target.includes('192.168.1')) {
                return {
                    success: true,
                    output: `PING ${target} (${target}): 56 data bytes
64 bytes from ${target}: icmp_seq=0 ttl=64 time=2.347 ms
64 bytes from ${target}: icmp_seq=1 ttl=64 time=1.892 ms
64 bytes from ${target}: icmp_seq=2 ttl=64 time=2.014 ms

--- ${target} ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 1.892/2.084/2.347/0.191 ms`,
                    entities: {
                        ips: [target],
                        status: 'alive'
                    },
                    hints: {
                        ar: '✓ الجهاز نشط ويستجيب. وقت الاستجابة طبيعي (2ms).',
                        en: '✓ Host is alive and responding. Response time is normal (2ms).'
                    }
                };
            }

            return {
                success: false,
                output: `PING ${target}: No route to host`,
                entities: {},
                hints: {
                    ar: '✗ الهدف غير متاح أو غير موجود.',
                    en: '✗ Target unreachable or does not exist.'
                }
            };
        }
    },

    nmap: {
        id: 'nmap',
        name: 'nmap',
        category: TOOL_CATEGORIES.RECON,
        roles: ['attacker', 'defender'],
        description: {
            ar: 'مسح الشبكة لاكتشاف الأجهزة والمنافذ المفتوحة',
            en: 'Network scanner for discovering hosts and open ports'
        },
        syntax: 'nmap [options] <target>',
        examples: [
            'nmap 192.168.1.55',
            'nmap -sV 192.168.1.55',
            'nmap -p 1-1000 192.168.1.0/24'
        ],
        manPage: {
            ar: 'أداة احترافية لفحص الشبكات. -sV للكشف عن إصدارات الخدمات، -p لتحديد المنافذ.',
            en: 'Professional network scanning tool. -sV detects service versions, -p specifies ports.'
        },
        simulator: (args, context) => {
            const isServiceScan = args.includes('-sV');
            const target = args.match(/\d+\.\d+\.\d+\.\d+/)?.[0];

            if (target === '192.168.1.55') {
                const output = isServiceScan ? `
Starting Nmap 7.92 ( https://nmap.org ) at ${new Date().toISOString()}
Nmap scan report for smartgrid-ctrl-01 (192.168.1.55)
Host is up (0.0024s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE    VERSION
22/tcp  open  ssh        OpenSSH 7.4
80/tcp  open  http       Apache httpd 2.4.41
502/tcp open  modbus     Schneider Electric Modicon
MAC Address: 00:0C:29:4F:8E:35 (VMware)

Service detection performed. Please report any incorrect results.
Nmap done: 1 IP address (1 host up) scanned in 12.45 seconds` : `
Starting Nmap 7.92 ( https://nmap.org )
Nmap scan report for 192.168.1.55
Host is up (0.0024s latency).
Not shown: 997 closed ports
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
502/tcp open  modbus

Nmap done: 1 IP address (1 host up) scanned in 4.32 seconds`;

                return {
                    success: true,
                    output,
                    entities: {
                        ips: ['192.168.1.55'],
                        openPorts: [22, 80, 502],
                        services: isServiceScan ? ['ssh', 'http', 'modbus'] : [],
                        versions: isServiceScan ? {
                            22: 'OpenSSH 7.4',
                            80: 'Apache 2.4.41',
                            502: 'Schneider Electric Modicon'
                        } : {}
                    },
                    hints: {
                        ar: isServiceScan
                            ? '⚠️ اكتُشف منفذ Modbus (502) - نظام SCADA! خطر مرتفع.'
                            : '💡 استخدم -sV للكشف عن إصدارات الخدمات.',
                        en: isServiceScan
                            ? '⚠️ Modbus port (502) detected - SCADA system! High risk.'
                            : '💡 Use -sV to detect service versions.'
                    },
                    triggerEvent: context.role === 'attacker' ? {
                        type: 'DEFENSIVE_ALERT',
                        message: {
                            ar: '🚨 النظام اكتشف مسحًا نشطًا من IP خارجي',
                            en: '🚨 Active scan detected from external IP'
                        }
                    } : null
                };
            }

            return {
                success: false,
                output: `Failed to resolve "${target}".`,
                entities: {},
                hints: {
                    ar: '✗ الهدف غير صالح. تحقق من عنوان IP.',
                    en: '✗ Invalid target. Check IP address.'
                }
            };
        }
    },

    whois: {
        id: 'whois',
        name: 'whois',
        category: TOOL_CATEGORIES.RECON,
        roles: ['attacker', 'defender'],
        description: {
            ar: 'الاستعلام عن معلومات تسجيل عنوان IP',
            en: 'Query IP address registration information'
        },
        syntax: 'whois <ip>',
        examples: ['whois 45.33.22.11'],
        manPage: {
            ar: 'يستعلم عن قواعد بيانات WHOIS للحصول على معلومات عن مالك IP أو النطاق.',
            en: 'Queries WHOIS databases for IP or domain ownership information.'
        },
        simulator: (args, context) => {
            const ip = args.trim();

            if (ip === '45.33.22.11') {
                return {
                    success: true,
                    output: `
NetRange:       45.0.0.0 - 45.255.255.255
CIDR:           45.0.0.0/8
NetName:        LINODE-US
NetHandle:      NET-45-0-0-0-1
Parent:         NET45 (NET-45-0-0-0-0)
NetType:        Direct Allocation
Organization:   Unknown Proxy Service (UPS-123)
RegDate:        2015-04-17
Updated:        2024-11-20
Comment:        Geofeed https://example.com/feed
Ref:            https://rdap.arin.net/registry/ip/45.0.0.0

OrgName:        Unknown Proxy Service
OrgId:          UPS-123
Address:        REDACTED
City:           REDACTED
StateProv:      
PostalCode:     
Country:        XK
RegDate:        2015-04-17
Updated:        2024-11-20
Ref:            https://rdap.arin.net/registry/entity/UPS-123

⚠️  STATUS: BLACKLISTED in multiple threat intelligence feeds
⚠️  REPUTATION SCORE: 15/100 (High Risk)`,
                    entities: {
                        ips: [ip],
                        country: 'XK',
                        org: 'Unknown Proxy Service',
                        reputation: 'blacklisted'
                    },
                    hints: {
                        ar: '🚩 عنوان IP مشبوه! مُدرَج في القوائم السوداء. اتخذ إجراءً فوريًا.',
                        en: '🚩 Suspicious IP! Blacklisted. Take immediate action.'
                    }
                };
            }

            return {
                success: false,
                output: `No match for "${ip}".`,
                entities: {},
                hints: {
                    ar: '✗ لا توجد معلومات عن هذا العنوان.',
                    en: '✗ No information found for this address.'
                }
            };
        }
    },

    // ==================== ANALYSIS ====================
    grep: {
        id: 'grep',
        name: 'grep',
        category: TOOL_CATEGORIES.ANALYSIS,
        roles: ['defender'],
        description: {
            ar: 'البحث عن نمط معين داخل ملف',
            en: 'Search for patterns within files'
        },
        syntax: 'grep <pattern> <file>',
        examples: [
            'grep error /var/log/syslog',
            'grep "failed" /var/log/auth.log',
            'grep -i "unauthorized" /var/log/syslog'
        ],
        manPage: {
            ar: 'أداة بحث قوية. استخدم -i للبحث دون حساسية للأحرف الكبيرة/الصغيرة.',
            en: 'Powerful search tool. Use -i for case-insensitive search.'
        },
        simulator: (args, context) => {
            const pattern = args.match(/["']?(\w+)["']?/)?.[1];
            const file = args.match(/\/[\w\/\.]+/)?.[0];

            if ((pattern === 'error' || pattern === 'ERROR') && file?.includes('syslog')) {
                return {
                    success: true,
                    output: `
[2026-02-02 03:42:15] ERROR: Connection refused on port 8080 from 45.33.22.11
[2026-02-02 03:42:47] ERROR: modbus authentication failed
[2026-02-02 03:43:02] CRITICAL: Unauthorized root access attempt from 45.33.22.11
[2026-02-02 03:43:15] ERROR: Firewall rule violation detected`,
                    entities: {
                        ips: ['45.33.22.11'],
                        ports: [8080],
                        threats: ['unauthorized access', 'connection refused']
                    },
                    hints: {
                        ar: '⚠️ تم اكتشاف محاولة وصول غير مصرح! IP: 45.33.22.11. التحقيق مطلوب.',
                        en: '⚠️ Unauthorized access attempt detected! IP: 45.33.22.11. Investigation required.'
                    }
                };
            }

            if (pattern === 'failed' && file?.includes('auth.log')) {
                return {
                    success: true,
                    output: `
Feb  2 03:40:12 smartgrid sshd[2847]: Failed password for root from 45.33.22.11 port 52341 ssh2
Feb  2 03:40:18 smartgrid sshd[2847]: Failed password for root from 45.33.22.11 port 52341 ssh2
Feb  2 03:40:24 smartgrid sshd[2847]: Failed password for root from 45.33.22.11 port 52341 ssh2`,
                    entities: {
                        ips: ['45.33.22.11'],
                        threats: ['brute force attempt', 'failed authentication']
                    },
                    hints: {
                        ar: '🚨 محاولة تخمين كلمة مرور! 3 محاولات فاشلة من نفس IP.',
                        en: '🚨 Brute force attempt! 3 failed attempts from same IP.'
                    }
                };
            }

            return {
                success: true,
                output: `(no matches found)`,
                entities: {},
                hints: {
                    ar: 'لم يتم العثور على نتائج. جرب نمطًا آخر.',
                    en: 'No results found. Try a different pattern.'
                }
            };
        }
    },

    tail: {
        id: 'tail',
        name: 'tail',
        category: TOOL_CATEGORIES.ANALYSIS,
        roles: ['defender'],
        description: {
            ar: 'عرض آخر سطور من ملف (مراقبة السجلات الحية)',
            en: 'Display last lines of a file (live log monitoring)'
        },
        syntax: 'tail [-f] [-n <lines>] <file>',
        examples: [
            'tail /var/log/syslog',
            'tail -n 20 /var/log/auth.log',
            'tail -f /var/log/syslog'
        ],
        simulator: (args, context) => {
            const file = args.match(/\/[\w\/\.]+/)?.[0];
            const isFollow = args.includes('-f');

            if (file?.includes('syslog')) {
                return {
                    success: true,
                    output: isFollow ? `
==> /var/log/syslog <==
[2026-02-02 03:47:32] INFO: System monitoring active
[2026-02-02 03:47:45] WARNING: High network latency detected on eth0
[2026-02-02 03:47:58] ERROR: SCADA controller not responding
[2026-02-02 03:48:12] CRITICAL: Connection from 45.33.22.11 on port 502

[Following log in real-time... Press Ctrl+C to stop]` : `
[2026-02-02 03:45:10] INFO: Routine backup completed
[2026-02-02 03:46:23] INFO: User admin logged in
[2026-02-02 03:47:45] WARNING: High network latency detected on eth0
[2026-02-02 03:47:58] ERROR: SCADA controller not responding`,
                    entities: {
                        ips: isFollow ? ['45.33.22.11'] : [],
                        ports: isFollow ? [502] : [],
                        threats: isFollow ? ['suspicious connection'] : ['high latency']
                    },
                    hints: {
                        ar: isFollow
                            ? '⚠️ تحديث مباشر: اتصال مشبوه على منفذ Modbus!'
                            : '💡 استخدم -f للمراقبة المباشرة.',
                        en: isFollow
                            ? '⚠️ Live update: Suspicious connection on Modbus port!'
                            : '💡 Use -f for live monitoring.'
                    }
                };
            }

            return {
                success: false,
                output: `tail: cannot open '${file}' for reading: No such file`,
                entities: {}
            };
        }
    },

    // ==================== DEFENSE ====================
    iptables: {
        id: 'iptables',
        name: 'iptables',
        category: TOOL_CATEGORIES.DEFENSE,
        roles: ['defender'],
        description: {
            ar: 'إدارة جدار الحماية وحظر عناوين IP',
            en: 'Manage firewall and block IP addresses'
        },
        syntax: 'iptables -A <chain> -s <source> -j <action>',
        examples: [
            'iptables -A INPUT -s 45.33.22.11 -j DROP',
            'iptables -A INPUT -p tcp --dport 502 -j DROP',
            'iptables -L'
        ],
        manPage: {
            ar: 'إدارة قواعد الجدار الناري. -A لإضافة قاعدة، -s لتحديد المصدر، -j للإجراء (DROP/ACCEPT).',
            en: 'Firewall rules management. -A to append rule, -s for source, -j for action (DROP/ACCEPT).'
        },
        simulator: (args, context) => {
            const ip = args.match(/\d+\.\d+\.\d+\.\d+/)?.[0];
            const action = args.includes('DROP') ? 'DROP' : args.includes('ACCEPT') ? 'ACCEPT' : null;

            if (args.includes('-L')) {
                return {
                    success: true,
                    output: `
Chain INPUT (policy ACCEPT)
target     prot opt source               destination
DROP       all  --  45.33.22.11          anywhere
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:ssh
ACCEPT     tcp  --  anywhere             anywhere             tcp dpt:http

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination`,
                    entities: {
                        blockedIPs: ['45.33.22.11']
                    },
                    hints: {
                        ar: '✓ عرض القواعد الحالية. IP 45.33.22.11 محظور.',
                        en: '✓ Showing current rules. IP 45.33.22.11 is blocked.'
                    }
                };
            }

            if (ip && action === 'DROP') {
                return {
                    success: true,
                    output: `
Chain INPUT (policy ACCEPT)
target     prot opt source               destination
DROP       all  --  ${ip}          0.0.0.0/0

✓ Rule applied successfully. IP ${ip} is now BLOCKED.`,
                    entities: {
                        blockedIPs: [ip]
                    },
                    hints: {
                        ar: `✓ القاعدة مُطبَّقة. تم حظر ${ip} بنجاح.`,
                        en: `✓ Rule applied. ${ip} successfully blocked.`
                    },
                    triggerEvent: {
                        type: 'IP_BLOCKED',
                        data: { ip }
                    }
                };
            }

            return {
                success: false,
                output: `iptables: Bad argument. Try 'iptables -h' for help.`,
                entities: {}
            };
        }
    }
};

/**
 * Get tools available for a specific role in a chapter
 */
export function getAvailableTools(role, chapter) {
    const toolsList = Object.values(TOOLS);

    // Chapter 1: Basic recon and analysis
    if (chapter === 1) {
        if (role === 'defender') {
            return toolsList.filter(t =>
                ['ping', 'grep', 'tail', 'whois', 'iptables'].includes(t.id)
            );
        } else {
            return toolsList.filter(t =>
                ['ping', 'nmap', 'whois'].includes(t.id)
            );
        }
    }

    // More chapters will unlock more tools
    return toolsList.filter(t => t.roles.includes(role));
}

/**
 * Get tool by ID
 */
export function getTool(toolId) {
    return TOOLS[toolId] || null;
}
