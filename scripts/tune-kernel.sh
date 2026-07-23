#!/bin/sh
# TORBAA Enterprise Linux Kernel Tuning Script for High-Concurrency 20M+ Users
# Run as root: sudo sh scripts/tune-kernel.sh

echo "⚡ Applying TORBAA High-Performance Kernel & Network Socket Parameters..."

# 1. Socket Listen Queue (Max Backlog)
sysctl -w net.core.somaxconn=65535
sysctl -w net.ipv4.tcp_max_syn_backlog=65535

# 2. File Descriptors Limit
sysctl -w fs.file-max=2097152

# 3. Ephemeral Port Range Expansion
sysctl -w net.ipv4.ip_local_port_range="1024 65535"

# 4. TCP TIME_WAIT Reuse
sysctl -w net.ipv4.tcp_tw_reuse=1

# 5. Read/Write Memory Buffers
sysctl -w net.core.rmem_max=16777216
sysctl -w net.core.wmem_max=16777216

echo "✅ Kernel Network Tuning Applied Successfully!"
