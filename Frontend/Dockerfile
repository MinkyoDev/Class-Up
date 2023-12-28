# Node 컨테이너 환경에서 실행한다.
FROM node:latest

# /usr/app/frontend 디렉터리를 생성한다.
RUN mkdir -p /usr/app/frontend

# 생성한 디렉터리를 Default 디렉터리로 설정한다.
WORKDIR /workspace

# WORKDIR에 package.json 파일을 복사한다.
COPY package.json .

# package.json의 패키지들을 설치한다.
RUN npm install

# 나머지 파일들을 WORKDIR에 복사해온다.
COPY . .	

# 서버를 실행한다.
ENTRYPOINT [ "npm", "start" ]	

# 3000번 포트를 호스트와 공유한다.
EXPOSE 3000	