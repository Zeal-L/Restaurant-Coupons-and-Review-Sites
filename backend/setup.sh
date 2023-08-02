#!/bin/bash

echo -e "\033[32m\n 项目后端部署开始 ... \n\033[0m"

echo -e "\033[34m\n 安装pipenv（如果还没有安装）... \n\033[0m"
pip3 install pipenv

echo -e "\033[34m\n 安装所有依赖项 ... \n\033[0m"
pipenv run pipenv install --dev

echo -e "\033[34m\n 显示项目目录 ... \n\033[0m"
pipenv run pipenv --where

echo -e "\033[34m\n 显示虚拟环境目录 ... \n\033[0m"
pipenv run pipenv --venv

echo -e "\033[32m\n 项目后端部署完成！启动中... \n\033[0m"
pipenv run python run.py


