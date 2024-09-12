#!/bin/sh

echo "+ entrypoint.sh"

if [ ! -d ./minecraft ]; then
    mkdir ./minecraft
fi

if [ ! -d ./minecraft/plugins ]; then
    mkdir ./minecraft/plugins
fi

if [ ! -f ./minecraft/start.sh ]; then

    echo "[entrypoint.sh] start.sh not found, creating..."
    cat << 'EOF' > ./minecraft/start.sh
#!/bin/bash
java -Xmx4096M -Xms4096M -XX:+AlwaysPreTouch -XX:+DisableExplicitGC -XX:+ParallelRefProcEnabled -XX:+PerfDisableSharedMem -XX:+UnlockExperimentalVMOptions -XX:+UseG1GC -XX:G1HeapRegionSize=8M -XX:G1HeapWastePercent=5 -XX:G1MaxNewSizePercent=40 -XX:G1MixedGCCountTarget=4 -XX:G1MixedGCLiveThresholdPercent=90 -XX:G1NewSizePercent=30 -XX:G1RSetUpdatingPauseTimePercent=5 -XX:G1ReservePercent=20 -XX:InitiatingHeapOccupancyPercent=15 -XX:MaxGCPauseMillis=200 -XX:MaxTenuringThreshold=1 -XX:SurvivorRatio=32 -Dusing.aikars.flags=https://mcflags.emc.gs -Daikars.new.flags=true -jar server.jar --nogui
EOF

    chmod +x ./minecraft/start.sh

    if [ $? -ne 0 ]; then
        echo "[entrypoint.sh] Failed to create start.sh"
        exit 1
    fi

    echo "[entrypoint.sh] Created start.sh"
fi

if [ ! -f ./minecraft/server.jar ]; then
    echo "[entrypoint.sh] server.jar not found, downloading..."
    
    curl -o ./minecraft/server.jar https://api.papermc.io/v2/projects/paper/versions/1.21.1/builds/77/downloads/paper-1.21.1-77.jar 
    if [ $? -ne 0 ]; then
        echo "[entrypoint.sh] Failed to download server.jar"
        exit 1
    fi

    echo "[entrypoint.sh] Downloaded server.jar"
fi

exec "$@"
