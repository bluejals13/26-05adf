#!/bin/bash

if command -v k6 >/dev/null 2>&1; then
    echo "k6 이미 설치됨 해당버전은 아래"
    k6 version
    
    read -p " k6 업데이트 여부 (y/n): " answer

    if [[ "$answer" =~ ^[Yy]$ ]]; then
        echo "업데이트 k6..."

        sudo apt update
        sudo apt install --only-upgrade -y k6

        echo "업데이트 버전:"
        k6 version
    else
        echo "업데이트 스킵."
    fi
    
else
    echo "k6 미설치. 설치 중..."

    sudo apt update
    sudo apt install -y gnupg software-properties-common curl

    curl -fsSL https://dl.k6.io/key.gpg | sudo gpg --dearmor -o /usr/share/keyrings/k6-archive-keyring.gpg

    echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
    | sudo tee /etc/apt/sources.list.d/k6.list > /dev/null

    sudo apt update
    sudo apt install -y k6

    echo "설치 완료 버전"
    k6 version
fi

echo "================================="

