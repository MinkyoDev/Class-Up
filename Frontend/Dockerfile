# Node.js 이미지를 기반으로 설정
FROM node:latest

# 작업 디렉토리 설정
WORKDIR /app

# package.json 및 package-lock.json 파일 복사
COPY package*.json ./

# 필요한 npm 패키지 설치
RUN npm install --legacy-peer-deps

# 애플리케이션 소스 코드 복사
COPY . .

# 애플리케이션을 실행할 포트 노출
EXPOSE 3000

# 애플리케이션 실행
CMD ["npm", "start"]